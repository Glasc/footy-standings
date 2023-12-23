import { type Column, type ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { type Row } from "~/server/api/routers/standings";

const createSortableHeader = (
  column: Column<Row, unknown>,
  nameToDisplay: string | number,
  customName?: string,
) => {
  const props = customName ? { title: customName } : {};
  return (
    <Button
      className="p-0 text-lg font-semibold"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      {...props}
    >
      {nameToDisplay}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<Row, unknown>[] = [
  {
    accessorKey: "R",
    header: ({ column }) => createSortableHeader(column, "Rank"),
  },
  {
    accessorKey: "club",
    header: ({ column }) => createSortableHeader(column, "Club"),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Image
            width={30}
            height={30}
            alt="Club logo"
            src={row.original.club_img.href}
          />
          <div>{row.original.club}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "GP",
    header: ({ column }) => createSortableHeader(column, "GP", "Games Played"),
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
];
