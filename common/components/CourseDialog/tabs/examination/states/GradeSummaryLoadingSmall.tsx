import LoadingDots from "@/common/components/loading/LoadingDots";
import { useCommonTranslate } from "@/common/components/translate/hooks/useCommonTranslate";

const GradeSummaryLoadingSmall = () => {
  const translate = useCommonTranslate();
  return (
    <span aria-label={translate("loading")}>
      <LoadingDots />
    </span>
  );
};

export default GradeSummaryLoadingSmall;
