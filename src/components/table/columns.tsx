import { type Column, type ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { STATIC_PROPS_ID } from "next/dist/shared/lib/constants";

export type StandingRow = {
  club: string;
  GP: number;
  L: number;
  GD: number;
  P: number;
  A: number;
  F: number;
  D: number;
  W: number;
};

const createSortableHeader = (
  column: Column<StandingRow, unknown>,
  nameToDisplay: string | number,
  customName?: string,
) => {
  const props = customName ? { title: customName } : {};
  return (
    <Button
      className="p-0"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      {...props}
    >
      {nameToDisplay}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<StandingRow, unknown>[] = [
  {
    accessorKey: "R",
    header: ({ column }) => createSortableHeader(column, "Rank"),
  },
  {
    accessorKey: "club",
    header: ({ column }) => createSortableHeader(column, "Club"),
  },
  {
    accessorKey: "W",
    header: ({ column }) => createSortableHeader(column, "Wins"),
  },
  {
    accessorKey: "D",
    header: ({ column }) => createSortableHeader(column, "Draws"),
  },
  {
    accessorKey: "L",
    header: ({ column }) => createSortableHeader(column, "Losses", "Losses"),
  },
  {
    accessorKey: "F",
    header: ({ column }) => createSortableHeader(column, "F", "Goals For"),
  },
  {
    accessorKey: "A",
    header: ({ column }) => createSortableHeader(column, "A", "Goals Against"),
  },
  {
    accessorKey: "GD",
    header: ({ column }) =>
      createSortableHeader(column, "GD", "Goal Difference"),
  },
  {
    accessorKey: "P",
    header: ({ column }) => createSortableHeader(column, "Points"),
  },
  {
    accessorKey: "GP",
    header: ({ column }) => createSortableHeader(column, "GP", "Games Played"),
  },
];
