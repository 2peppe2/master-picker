import { useFilterStore } from "@/app/atoms/filter/filterStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FC, Fragment, useMemo } from "react";
import { useAtomValue } from "jotai";
import { range } from "lodash";

const BlockFilter: FC = () => {
  const {
    atoms: { blocksAtom },
    mutators: { selectBlocks },
  } = useFilterStore();
  const blocks = useAtomValue(blocksAtom);

  const options = useMemo(
    () =>
      range(1, 5).map((block) => ({
        label: block,
        value: block,
      })),
    [],
  );

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Label className="text-sm">Include blocks:</Label>
      {options.map((o) => (
        <Fragment key={o.value}>
          <Checkbox
            checked={blocks.includes(o.value)}
            onCheckedChange={(checked) => {
              if (checked) {
                selectBlocks([...blocks, o.value]);
              } else {
                selectBlocks(blocks.filter((b) => b !== o.value));
              }
            }}
          />
          <Label className="text-sm">{o.label}</Label>
        </Fragment>
      ))}
    </div>
  );
};

export default BlockFilter;
