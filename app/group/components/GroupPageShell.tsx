import { FC, ReactNode } from "react";

interface GroupPageShellProps {
  children: ReactNode;
  maxWidthClassName?: string;
}

const GroupPageShell: FC<GroupPageShellProps> = ({
  children,
  maxWidthClassName = "max-w-6xl",
}) => (
  <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,theme(colors.muted.DEFAULT),transparent_65%)] opacity-60" />
    <main
      className={`mx-auto flex min-h-screen w-full ${maxWidthClassName} items-center px-6 py-12 md:py-20`}
    >
      {children}
    </main>
  </div>
);

export default GroupPageShell;
