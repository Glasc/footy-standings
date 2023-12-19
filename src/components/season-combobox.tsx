import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SeasonComboBoxProps = {
  seasons: {
    value: string;
    label: `${number}-${number}`;
  }[];
  leagueInput: string;
  setLeagueInput: React.Dispatch<React.SetStateAction<string>>;
};

export function SeasonComboBox({
  seasons,
  leagueInput: value,
  setLeagueInput: setValue,
}: SeasonComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? seasons.find((season) => season.value === value)?.label
            : "Select season..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search season..." className="h-9" />
          <CommandEmpty>No season found.</CommandEmpty>
          <CommandGroup>
            {seasons.map((season) => (
              <CommandItem
                id={season.value}
                key={season.value}
                value={season.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {season.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === season.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
