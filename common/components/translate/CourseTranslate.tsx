"use client";

import Translate from "./Translate";
import { FC, memo } from "react";

interface TranslateProps {
  text: string;
  args?: Record<string, unknown>;
  isBold?: boolean;
}

const CourseTranslate: FC<TranslateProps> = memo(({ text, args, isBold }) => (
  <Translate text={text} args={args} isBold={isBold} namespace="courses" />
));

CourseTranslate.displayName = "CourseTranslate";

export default CourseTranslate;
