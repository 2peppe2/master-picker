import { Card, CardTitle } from "@/components/ui/card"
import { MastersRequirements } from "../app/mastersRequirements"
import { MastersBadgeRequire } from "./MastersBadgeRequire"



export const RequirementsBar = () => {
    return (
        
        <Card className="p-4 mb-4">
            <CardTitle className="flex gap-4 text-lg">
                Master Requirements: 
                
                    {Object.keys(MastersRequirements).map((requirement) => (
                    <MastersBadgeRequire key={requirement} program={requirement} />
                ))}
                
                
            </CardTitle>
                   
        </Card>
    )
}