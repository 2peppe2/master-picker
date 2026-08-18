import { describe, expect, it } from "vitest";
import ts from "typescript";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const COMPONENT_ROOTS = ["app", "features", "common"];

const collectComponentFiles = (root: string): string[] =>
  readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    return statSync(path).isDirectory()
      ? collectComponentFiles(path)
      : /\.(jsx|tsx)$/.test(path)
        ? [path]
        : [];
  });

const containsJsx = (node: ts.Node): boolean => {
  let found = false;
  const visit = (current: ts.Node) => {
    if (
      ts.isJsxElement(current) ||
      ts.isJsxFragment(current) ||
      ts.isJsxSelfClosingElement(current)
    ) {
      found = true;
      return;
    }
    ts.forEachChild(current, visit);
  };
  visit(node);
  return found;
};

const unwrapExpression = (expression: ts.Expression): ts.Expression => {
  if (
    ts.isParenthesizedExpression(expression) ||
    ts.isAsExpression(expression) ||
    ts.isSatisfiesExpression(expression) ||
    ts.isNonNullExpression(expression) ||
    ts.isTypeAssertionExpression(expression)
  ) {
    return unwrapExpression(expression.expression);
  }
  return expression;
};

const formatFinding = (
  source: ts.SourceFile,
  file: string,
  node: ts.Node,
  message: string,
) => {
  const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
  return `${relative(process.cwd(), file)}:${line + 1} ${message}`;
};

describe("component file structure", () => {
  const files = COMPONENT_ROOTS.flatMap((root) =>
    collectComponentFiles(join(process.cwd(), root)),
  );

  it("keeps one top-level component definition per application file", () => {
    const findings: string[] = [];

    for (const file of files) {
      const source = ts.createSourceFile(
        file,
        readFileSync(file, "utf8"),
        ts.ScriptTarget.Latest,
        true,
        file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.JSX,
      );
      const components: string[] = [];

      for (const statement of source.statements) {
        if (
          ts.isFunctionDeclaration(statement) &&
          statement.name &&
          /^[A-Z]/.test(statement.name.text) &&
          containsJsx(statement)
        ) {
          components.push(statement.name.text);
        }
        if (ts.isVariableStatement(statement)) {
          for (const declaration of statement.declarationList.declarations) {
            if (
              ts.isIdentifier(declaration.name) &&
              /^[A-Z]/.test(declaration.name.text) &&
              declaration.initializer &&
              containsJsx(declaration.initializer)
            ) {
              components.push(declaration.name.text);
            }
          }
        }
      }

      if (components.length > 1) {
        findings.push(
          `${relative(process.cwd(), file)} defines ${components.join(", ")}`,
        );
      }
    }

    expect(findings).toEqual([]);
  });

  it("does not declare components or JSX content variables inside functions", () => {
    const findings: string[] = [];

    for (const file of files) {
      const source = ts.createSourceFile(
        file,
        readFileSync(file, "utf8"),
        ts.ScriptTarget.Latest,
        true,
        file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.JSX,
      );
      let functionDepth = 0;

      const visit = (node: ts.Node) => {
        const insideFunction = functionDepth > 0;

        if (
          insideFunction &&
          ts.isFunctionDeclaration(node) &&
          node.name &&
          /^[A-Z]/.test(node.name.text)
        ) {
          findings.push(
            formatFinding(source, file, node, `declares ${node.name.text}`),
          );
        }

        if (
          insideFunction &&
          ts.isVariableDeclaration(node) &&
          node.initializer
        ) {
          const initializer = unwrapExpression(node.initializer);
          if (
            !ts.isArrowFunction(initializer) &&
            !ts.isFunctionExpression(initializer) &&
            (ts.isJsxElement(initializer) ||
              ts.isJsxFragment(initializer) ||
              ts.isJsxSelfClosingElement(initializer))
          ) {
            findings.push(
              formatFinding(
                source,
                file,
                node,
                `stores JSX in ${node.name.getText(source)}`,
              ),
            );
          }
        }

        const entersFunction = ts.isFunctionLike(node);
        if (entersFunction) functionDepth += 1;
        ts.forEachChild(node, visit);
        if (entersFunction) functionDepth -= 1;
      };

      visit(source);
    }

    expect(findings).toEqual([]);
  });

  it("does not render function-local component aliases", () => {
    const findings: string[] = [];

    for (const file of files) {
      const source = ts.createSourceFile(
        file,
        readFileSync(file, "utf8"),
        ts.ScriptTarget.Latest,
        true,
        file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.JSX,
      );

      const inspectFunction = (node: ts.Node) => {
        const localNames = new Map<string, ts.VariableDeclaration>();
        const renderedNames = new Set<string>();

        const visit = (current: ts.Node) => {
          if (current !== node && ts.isFunctionLike(current)) return;
          if (
            ts.isVariableDeclaration(current) &&
            ts.isIdentifier(current.name)
          ) {
            localNames.set(current.name.text, current);
          }
          if (
            (ts.isJsxOpeningElement(current) ||
              ts.isJsxSelfClosingElement(current)) &&
            ts.isIdentifier(current.tagName)
          ) {
            renderedNames.add(current.tagName.text);
          }
          ts.forEachChild(current, visit);
        };
        visit(node);

        for (const name of renderedNames) {
          const declaration = localNames.get(name);
          if (declaration) {
            findings.push(
              formatFinding(source, file, declaration, `renders local ${name}`),
            );
          }
        }
      };

      const visit = (node: ts.Node) => {
        if (ts.isFunctionLike(node)) inspectFunction(node);
        ts.forEachChild(node, visit);
      };
      visit(source);
    }

    expect(findings).toEqual([]);
  });
});
