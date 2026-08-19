import CourseResultGridView from "./CourseResultGridView";
import { CourseResultGridProps } from "./CourseResultGrid.types";
import { FC } from "react";

const CourseResultGridStandard: FC<CourseResultGridProps> = (props) => (
  <CourseResultGridView {...props} minTileSize={130} tileGap={12} />
);

export default CourseResultGridStandard;
