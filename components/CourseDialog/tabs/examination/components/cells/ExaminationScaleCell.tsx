"use client";

import Translate from "@/common/components/translate/Translate";
import { Scale } from "@/prisma/generated/client/enums";
import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface ExaminationScaleCellProps {
  scale: Scale;
}

const ExaminationScaleCell: FC<ExaminationScaleCellProps> = ({ scale }) => (
  <TableCell>
    <Translate text={scale === Scale.G_OR_U ? "scale_gu" : "scale_345"} />
  </TableCell>
);

export default ExaminationScaleCell;
