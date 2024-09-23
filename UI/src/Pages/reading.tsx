"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HT_Yard_Array } from "@/lib/ht-yard-array";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ArrayType = {
  fieldId: number;
  Fieldname: string;
  value: number;
  type: string;
  transactiondataid?: string;
  transactionid?: string;
  child?: ArrayType[];
  SequenceId: number;
};

const data = HT_Yard_Array.flatMap((field) => {
  if (field.child) {
    return field.child.map((child) => ({
      id: child.fieldId,
      fieldname: child.Fieldname,
      value: child.value,
      type: child.type,
      sequence: child.SequenceId,
    }));
  } else {
    return [
      {
        id: field.fieldId,
        fieldname: field.Fieldname,
        value: field.value,
        type: field.type,
        sequence: field.SequenceId,
      },
    ];
  }
});

export const columns: ColumnDef<any>[] = [
  ...HT_Yard_Array.flatMap((field) => {
    if (field.child) {
      return field.child.map((child) => ({
        accessorKey: child.Fieldname.toLowerCase().replace(/ /g, "_"),
        header: child.Fieldname,
        cell: ({ row }) => (
          <div>
            {row.getValue(child.Fieldname.toLowerCase().replace(/ /g, "_"))}
          </div>
        ),
      }));
    } else {
      return [
        {
          accessorKey: field.Fieldname.toLowerCase().replace(/ /g, "_"),
          header: field.Fieldname,
          cell: ({ row }) => (
            <div>
              {row.getValue(field.Fieldname.toLowerCase().replace(/ /g, "_"))}
            </div>
          ),
        },
      ];
    }
  }),
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copy Field ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
export function ReadingView() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [remark, setRemark] = React.useState<string>("");
  const [logComment, setLogComment] = React.useState<string>("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  const handleApprove = () => {
    console.log("Approved rows");
  };

  const handleReject = () => {
    console.log("Rejected rows");
  };

  const handleLogSubmit = () => {
    console.log("Log comment submitted:", logComment);
    setLogComment(""); // Clear the comment after submitting
  };
  
  return (
    <div className="flex h-full w-full bg-gray-500">
      <div className="flex-1 bg-white">
        <div className="flex h-full w-full flex-col">
          <div className="flex-1">Table
          
          </div>
          <div className="h-40">Comment Box</div>
        </div>
      </div>
      <div className="w-80 bg-red-500">
        <div className="flex h-full w-full flex-col">
            <div className="h-16 bg-gray-600">
                Header
            </div>
            <div className="flex-1 bg-green-400">
                Main
            </div>
            <div className="h-16 bg-purple-400">
                Comment Box and Button
            </div>
        </div>
      </div>
    </div>
  );
}
