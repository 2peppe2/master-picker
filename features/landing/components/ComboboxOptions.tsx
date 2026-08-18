import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { ComboboxOption } from "./GenericComboBox";
import { FC, RefObject } from "react";

interface ComboboxOptionsProps {
  empty: string;
  anchor?: RefObject<HTMLElement | null>;
}

const ComboboxOptions: FC<ComboboxOptionsProps> = ({ empty, anchor }) => (
  <ComboboxContent anchor={anchor}>
    <ComboboxEmpty>{empty}</ComboboxEmpty>
    <ComboboxList>
      {(item: ComboboxOption) => (
        <ComboboxItem key={item.value} value={item}>
          {item.label}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
);

export default ComboboxOptions;
