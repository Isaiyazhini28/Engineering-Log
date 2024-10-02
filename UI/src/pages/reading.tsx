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

import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    return field.child.map((child: { fieldId: any; name: any; value: any; type: any; SequenceId: any; }) => ({
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
  {
    id: 'serial',
    header: 'Header',
    cell: ({ row }) => {

      const cellLabels = ['Previous Reading', 'Current Reading', 'Difference', 'MTD Avg'];


      const cellLabel = cellLabels[row.index] || '';

      return <div>{cellLabel}</div>;
    },
    enableSorting: false,
    enableHiding: false,
    width: 150,
  },

  ...HT_Yard_Array.flatMap((field) => {
    if (field.child) {
      return field.child.map((child: { name: string }) => ({
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
    header: 'Actions',
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
  const [dailyFieldsArray, setDailyFieldsArray] = React.useState([]);
  const [monthlyFieldsArray, setMonthlyFieldsArray] = React.useState([]);

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
    setLogComment("");
  };

  return (
    <div className="h-full w-full p-2 flex flex-col overflow-auto">
      <div className="flex-1 flex-row h-full">
        <div className="h-full flex flex-row gap-1">
          <div className="flex-1">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto relative h-full">
                <div className="absolute w-full h-full border-none rounded-sm md:border-2">
                  <ScrollArea className="h-[100%] relative w-full rounded-sm border-none bg-red-400" >
                    <Table>
                      <TableHeader className="bg-yellow-400 text-black ">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow
                            key={headerGroup.id}
                            className="bg-yellow-400 hover:bg-yellow-400"
                          >
                            {headerGroup.headers.map((header) => (
                              <TableHead key={header.id} className="bg-yellow-400 hover:bg-yellow-400">
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
                      <TableBody className="pb-48">
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
                              className="h-24 text-center text-black"
                            >
                              No results.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </div>
              <div className="h-48 overflow-auto">
                <div className="flex flex-col">
                  <label className="font-semibold">Add a Comment</label>
                  <div className="relative flex-grow">
                    <textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="Enter your remarks here..."
                      className="w-full h-24 p-2 border rounded-md resize-none"
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
          </div>
          <div className="w-80">
            <div className="h-full w-full">
              <div className="flex h-full w-full flex-col">
                <div className="h-12 bg-yellow-400 text-black flex rounded-sm justify-center items-center">ACTIVITY LOG</div>
                <div className="flex-1 mr-1 ml-1 p-4 overflow-auto">
                  {[
                    { label: "Transaction ID", value: "" },
                    { label: "Created By", value: "" },
                    { label: "Created On", value: "" },
                    { label: "Revised On", value: "" },
                    { label: "Revised By", value: "" },
                    { label: "Updated fields", value: "" },
                    { label: "Revised On", value: "" },
                    { label: "Revised By", value: "" },
                    { label: "Updated fields", value: "" },
                  ].map((field, index) => (
                    <div key={index} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                      <Input value={field.value} onChange={() => { }} />
                    </div>
                  ))}
                </div>

                <div className="mr-2 ml-2 mb-4">
                  <div className="relative flex items-center">
                    <textarea
                      value={logComment}
                      onChange={(e) => setLogComment(e.target.value)}
                      placeholder="Enter your comment here..."
                      className="w-full h-12 p-2 border rounded-md resize-none pr-14"
                    />
                    <Button
                      variant="outline"
                      className="absolute right-0 bg-green-600 text-white border-green-400 hover:bg-green-400 h-8 p-2 mr-2"
                      onClick={handleLogSubmit}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
