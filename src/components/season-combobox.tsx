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
import Link from "next/link";
import { useRouter } from "next/router";

type SeasonComboBoxProps = {
  seasons: {
    value: string;
    label: `${number}-${number}`;
  }[];
};

export function SeasonComboBox({ seasons }: SeasonComboBoxProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const value = router.query.season;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto max-w-[400px] justify-between text-base  font-semibold sm:text-xl"
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
            {seasons.map((season) => {
              const prev = router.query.leagueId as string;
              return (
                <Link href={`/${prev}/${season.value}`} key={season.value}>
                  <CommandItem
                    className="text-base font-medium text-foreground"
                    id={season.value}
                    key={season.value}
                    value={season.value}
                    onSelect={() => {
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
                </Link>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
