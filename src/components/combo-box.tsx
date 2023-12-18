"use client";

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

type ComboboxProps = {
  leagues: {
    value: string;
    label: string;
    id: `${string}.${number}`;
  }[];
};

export function Combobox({ leagues }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
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
            ? leagues.find((league) => league.id === value)?.label
            : "Select league..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search league..." className="h-9" />
          <CommandEmpty>No league found.</CommandEmpty>
          <CommandGroup>
            {leagues.map((league) => (
              <CommandItem
                key={league.value}
                value={league.value}
                onSelect={() => {
                  setValue(league.id === value ? "" : league.id);
                  setOpen(false);
                }}
              >
                {league.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === league.value ? "opacity-100" : "opacity-0",
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
