import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FC } from "react";

interface ContinueButtonProps {
  disabled?: boolean;
}

const ContinueButton: FC<ContinueButtonProps> = ({disabled = false}) => {
    return (
        <Button className="mt-4" disabled={disabled}>
        Continue
        <ArrowRight className="ml-2 h-4 w-4"/>
      </Button>
    )
}

export default ContinueButton;
