import type {
  MultiSelectGroup,
  MultiSelectSection,
} from "@/components/ui/MultiSelect/types";
import { CourseFilterCategory } from "./Category";
import { CourseFilterOptions } from "./Group";
import type { FC } from "react";

interface CourseFilterPanelContentProps {
  groups: MultiSelectGroup[];
  activeGroup: MultiSelectGroup | null;
  activeSection: MultiSelectSection | null;
  selectedValues: string[];
  onToggle: (value: string) => void;
  onSelectGroup: (group: MultiSelectGroup) => void;
  onSelectSection: (
    group: MultiSelectGroup,
    section: MultiSelectSection,
  ) => void;
}

const CourseFilterPanelContent: FC<CourseFilterPanelContentProps> = ({
  groups,
  activeGroup,
  activeSection,
  selectedValues,
  onToggle,
  onSelectGroup,
  onSelectSection,
}) => {
  const countSelected = (group: MultiSelectGroup) =>
    group.options.filter((option) => selectedValues.includes(option.value))
      .length;

  if (activeSection) {
    return (
      <CourseFilterOptions
        options={activeSection.options}
        selectedValues={selectedValues}
        onToggle={onToggle}
      />
    );
  }

  if (activeGroup?.sections) {
    return (
      <div className="flex flex-col">
        {activeGroup.sections.map((section) => (
          <CourseFilterCategory
            key={section.key}
            label={section.label}
            icon={section.icon}
            selectedCount={
              section.options.filter((option) =>
                selectedValues.includes(option.value),
              ).length
            }
            onSelect={() => onSelectSection(activeGroup, section)}
          />
        ))}
      </div>
    );
  }

  if (activeGroup) {
    return (
      <CourseFilterOptions
        options={activeGroup.options}
        selectedValues={selectedValues}
        onToggle={onToggle}
      />
    );
  }

  return (
    <div className="flex flex-col">
      {groups.map((group) => (
        <CourseFilterCategory
          key={group.heading}
          label={group.heading}
          icon={group.icon}
          selectedCount={countSelected(group)}
          onSelect={() => onSelectGroup(group)}
        />
      ))}
    </div>
  );
};

export default CourseFilterPanelContent;
