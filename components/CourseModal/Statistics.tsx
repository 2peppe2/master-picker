"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

type Grade = {
  grade: string;
  gradeOrder: number;
  quantity: number;
};

type Module = {
  moduleCode: string;
  date: string;
  grades: Grade[];
};

type CourseData = {
  courseCode: string;
  courseNameSwe: string;
  courseNameEng: string;
  lastUpdatedTimestamp: string;
  modules: Module[];
};

type StatisticsProps = {
  courseCode: string;
};

const chartConfig = {
  quantity: {
    label: "Students",
  },
} satisfies ChartConfig;

const Statistics = ({ courseCode }: StatisticsProps) => {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `https://liutentor.lukasabbe.com/api/courses/${courseCode}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }
        
        const data = await response.json();
        setCourseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseCode]);

  const getChartData = () => {
    if (!courseData || !courseData.modules || courseData.modules.length === 0) {
      return [];
    }

    const getGradientColor = (gradeOrder: number, maxOrder: number): string => {
      if (maxOrder === 1) {
        return "hsl(142, 76%, 36%)"; // Default to green if only one grade
      }
      const ratio = (gradeOrder - 1) / (maxOrder - 1);
      
      const hue = 142 - (ratio * 142); // From 142 (green) to 0 (red)
      const saturation = 76 + (ratio * 8); // From 76% to 84%
      const lightness = 36 + (ratio * 24); // From 36% to 60%
      
      return `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`;
    };

    if (selectedModule === "all") {
      // Aggregate all grades from all modules
      const gradeMap = new Map<string, { quantity: number; gradeOrder: number }>();

      courseData.modules.forEach((module) => {
        module.grades.forEach((grade) => {
          const current = gradeMap.get(grade.grade);
          if (current) {
            gradeMap.set(grade.grade, {
              quantity: current.quantity + grade.quantity,
              gradeOrder: grade.gradeOrder,
            });
          } else {
            gradeMap.set(grade.grade, {
              quantity: grade.quantity,
              gradeOrder: grade.gradeOrder,
            });
          }
        });
      });

      const entries = Array.from(gradeMap.entries());
      const maxOrder = Math.max(...entries.map(([, data]) => data.gradeOrder));

      return entries
        .map(([grade, data]) => ({
          grade,
          quantity: data.quantity,
          gradeOrder: data.gradeOrder,
          fill: getGradientColor(data.gradeOrder, maxOrder),
        }))
        .sort((a, b) => a.gradeOrder - b.gradeOrder);
    } else {
      // Show specific module grades by matching moduleCode-date combination
      const selectedModuleData = courseData.modules.find(
        (module) => `${module.moduleCode}-${module.date}` === selectedModule
      );
      
      if (!selectedModuleData) return [];
      
      const maxOrder = Math.max(...selectedModuleData.grades.map((g) => g.gradeOrder));
      
      return selectedModuleData.grades
        .map((grade) => ({
          grade: grade.grade,
          quantity: grade.quantity,
          gradeOrder: grade.gradeOrder,
          fill: getGradientColor(grade.gradeOrder, maxOrder),
        }))
        .sort((a, b) => a.gradeOrder - b.gradeOrder);
    }
  };

  const chartData = getChartData();

  if(isLoading || error || (!courseData || !courseData.modules || courseData.modules.length === 0)) {
    return (
      <div className="flex items-center justify-center py-8">
        {isLoading && <p className="text-muted-foreground">Loading statistics...</p>}
        {error && <p className="text-destructive">Error: {error}</p>}
        {!isLoading && !error && <p className="text-muted-foreground">No statistics available</p>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 py-4">
      <div className="flex flex-col gap-4">
        <div>
          <Label>Select Examination</Label>
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select an examination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Examinations (Aggregate)</SelectItem>
              {courseData.modules.map((module) => (
                <SelectItem key={`${module.moduleCode}-${module.date}`} value={`${module.moduleCode}-${module.date}`}>
                  {module.moduleCode} ({new Date(module.date).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4">
          <Label>Grade Distribution</Label>
          <div className="mt-2 space-y-2">
            {chartData.map((item) => (
              <div key={item.grade} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm">Grade {item.grade}</span>
                </div>
                <span className="text-sm font-medium">{item.quantity} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="quantity"
                nameKey="grade"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={chartData.length > 1 ? 5 : 0}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <p className="text-muted-foreground">No data available</p>
        )}
      </div>
    </div>
  );
};

export default Statistics;
