import BackButton from "@/common/components/BackButton";
import { FC } from "react";

interface DashboardHeaderWordmarkProps {
  dense: boolean;
}

const DashboardHeaderWordmark: FC<DashboardHeaderWordmarkProps> = ({
  dense,
}) => (
  <BackButton
    title="Master Picker"
    subtitle="dashboard_header_subtitle"
    returnText="_dashboard_return_to_landing"
    compact={dense}
  />
);

export default DashboardHeaderWordmark;
