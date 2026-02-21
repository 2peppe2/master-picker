import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ContinueButton= ({}) => {
    return (
        <Button className="mt-4">
        Continue
        <ArrowRight className="ml-2 h-4 w-4"/>
      </Button>
    )
}

export default ContinueButton;
