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
  name: string;
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

export const columns: ColumnDef<any>[] = [
  ...HT_Yard_Array.flatMap((field) => {
    if (field.child) {
      return field.child.map((child) => ({
        accessorKey: child.name.toLowerCase().replace(/ /g, "_"),
        header: child.name,
        cell: ({ row }) => (
          <div>
            {row.getValue(child.name.toLowerCase().replace(/ /g, "_"))}
          </div>
        ),
      }));
    } else {
      return [
        {
          accessorKey: field.name.toLowerCase().replace(/ /g, "_"),
          header: field.name,
          cell: ({ row }) => (
            <div>
              {row.getValue(field.name.toLowerCase().replace(/ /g, "_"))}
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

export function View() {
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
    <div className="w-full h-screen overflow-auto">
      <div className="w-full h-full grid grid-cols-10">
        {/* First Column (70%) */}
        <div className="col-span-7 h-full flex flex-col bg-yellow-100">
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter fields..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("name")
                    ?.setFilterValue(event.target.value)
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
                <DropdownMenuContent
                  align="end"
                  className="bg-gray-400 text-white"
                >
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuItem
                        key={column.id}
                        className="capitalize bg-gray-400 text-white"
                        onClick={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="min-w-full max-h-60 overflow-auto bg-indigo-950">
                <div className="gap-2">
                  <Table>
                    <TableHeader className="bg-yellow-400 text-black">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                          key={headerGroup.id}
                          className="bg-yellow-400"
                        >
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
                          <TableRow key={row.id}>
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
              <br />
              <label className="font-semibold mt-2">Add a Comment</label>{" "}
              
              <div className="border-t pt-2">
                
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter your remarks here..."
                  className="w-full h-28 p-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end w-full mt-2">
                <Button
                  variant="outline"
                  className="bg-green-600 text-white border-green-400 hover:bg-green-400"
                  onClick={handleApprove}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Second Column (30%) */}
        <div className="col-span-3 h-full flex flex-col">
          <div className="bg-yellow-100 w-full h-full">
            <div className="w-full">
              <Card className="bg-indigo-950 text-white mr-5 ml-5 h-full overflow-auto">
                <CardHeader className="bg-yellow-400 text-black">
                  <CardTitle className="flex justify-center">
                    ACTIVITY LOG
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <label>Transaction ID</label>
                  <Input />
                  <label>Transaction ID</label>
                  <Input />
                  <label>Created By</label>
                  <Input />
                  <label>Created On</label>
                  <Input />
                  <label>Revised On</label>
                  <Input />
                  <label>Revised By</label>
                  <Input />
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <label className="flex justify-start">Comment</label>
                  <textarea
                    value={logComment}
                    onChange={(e) => setLogComment(e.target.value)}
                    placeholder="Enter your comment here..."
                    className="w-full h-20 p-2 border rounded-md"
                  />

                  <div className="flex justify-end w-full">
                    <Button
                      variant="outline"
                      className="bg-green-600 text-white border-green-400 hover:bg-green-400"
                      onClick={handleLogSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default View;
