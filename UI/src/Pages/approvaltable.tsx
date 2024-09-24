"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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

// Define the type
export type ArrayType = {
  fieldId: number;
  name: string;
  value: number;
  type: string;
  transactiondataid?: string;
  transactionid?: string;
  child?: ArrayType[];
  SequenceId: number;
};

// Sample data with status included
const data = HT_Yard_Array.flatMap((field) => {
  // Flatten child fields if they exist
  if (field.child) {
    return field.child.map((child) => ({
      id: child.fieldId,
      name: child.name,
      value: child.value,
      type: child.type,
      sequence: child.SequenceId,
    }));
  } else {
    return [
      {
        id: field.fieldId,
        name: field.name,
        value: field.value,
        type: field.type,
        sequence: field.SequenceId,
      },
    ];
  }
});

// Dynamically create columns based on HT_Yard_Array
export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="text-white border-white"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  ...HT_Yard_Array.flatMap((field) => {
    // Flatten child fields if they exist
    if (field.child) {
      return field.child.map((child) => ({
        accessorKey: child.name.toLowerCase().replace(/ /g, "_"),
        header: child.name,
        cell: ({ row }) => (
          <div>
            {row.getValue(child?.name?.toLowerCase().replace(/ /g, "_"))}
          </div>
        ),
      }));
    } else {
      return [
        {
          accessorKey: field?.name.toLowerCase().replace(/ /g, "_"),
          header: field.name,
          cell: ({ row }) => (
            <div>
              {row.getValue(field?.name.toLowerCase().replace(/ /g, "_"))}
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

export function ApprovalTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [remark, setRemark] = React.useState<string>("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleApprove = () => {
    // Implement approval logic here
    console.log("Approved rows:", rowSelection);
  };

  const handleReject = () => {
    // Implement rejection logic here
    console.log("Rejected rows:", rowSelection);
  };

  const handleSubmitRemark = () => {
    // Implement remark submission logic here
    console.log("Submitted remark:", remark);
  };

  return (
    <div className="w-full h-full flex flex-col bg-yellow-100">
      <div className="w-full h-screen flex flex-col">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter fields..."
            value={
              (table.getColumn("name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-gray-400 placeholder-white"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto bg-gray-400 text-white"
              >
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-400 text-white">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize bg-gray-400 text-white"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="min-w-full max-h-60 overflow-auto bg-indigo-950">
            <Table>
              <TableHeader className="bg-yellow-400 text-black">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-yellow-400">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-black">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-between py-4 border-t">
          <div className="flex justify-end w-full gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleApprove}
              disabled={Object.keys(rowSelection).length === 0}
              className="bg-green-600 text-white border-green-400 hover:bg-green-400"
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              disabled={Object.keys(rowSelection).length === 0}
              className="bg-red-500 text-white border-red-400 hover:bg-red-400 "
            >
              Reject
            </Button>
          </div>
        </div>
        <label className="font-semibold">Add a Comment</label>
        <div className="py-4 border-t">
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter your remarks here..."
            className="w-full h-25 p-2 border rounded-md "
          />
          <div className="flex justify-end w-full">
            <Button
              variant="outline"
              className="mt-2 bg-green-600 text-white border-green-400 hover:bg-green-400"
              onClick={handleSubmitRemark}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ApprovalTable;
