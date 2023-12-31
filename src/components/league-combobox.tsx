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
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTheme } from "next-themes";

type LeagueComboBoxProps = {
  currentSeason: number | undefined;
  leagues: {
    value: string;
    label: string;
    id: `${string}.${number}`;
    img_url: {
      dark: string;
      light: string;
    };
  }[];
};

export function LeagueComboBox({
  leagues,
  currentSeason,
}: LeagueComboBoxProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const value = router.query.leagueId;
  const selectedLeague = leagues.find((league) => league.id === value);
  const leagueLabel = selectedLeague?.label;
  const { theme } = useTheme();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-[280px] justify-between font-semibold  sm:max-w-[400px] sm:text-xl"
        >
          {value ? <span>{leagueLabel}</span> : "Select league..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search league..." className="h-9" />
          <CommandEmpty>No league found.</CommandEmpty>
          <CommandGroup>
            {leagues.map((league) => {
              return (
                <Link
                  href={`/${league.id}/${currentSeason}`}
                  key={league.value}
                >
                  <CommandItem
                    className="space-x-2 font-medium"
                    key={league.value}
                    value={league.value}
                    onSelect={() => {
                      setOpen(false);
                    }}
                  >
                    {league.img_url ? (
                      <Image
                        width={30}
                        height={30}
                        alt="League logo"
                        src={
                          theme === "dark"
                            ? league?.img_url?.dark
                            : league?.img_url?.light
                        }
                      />
                    ) : null}
                    <span>{league.label}</span>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === league.value ? "opacity-100" : "opacity-0",
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
