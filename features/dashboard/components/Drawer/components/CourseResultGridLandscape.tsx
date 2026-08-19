import CourseResultGridView from "./CourseResultGridView";
import { CourseResultGridProps } from "./CourseResultGrid.types";
import { FC } from "react";

const CourseResultGridLandscape: FC<CourseResultGridProps> = (props) => (
  <CourseResultGridView {...props} minTileSize={92} tileGap={8} />
);

export default CourseResultGridLandscape;
