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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useGetViewPageGridQuery } from "@/services/query";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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
    return field.child.map(
      (child: {
        fieldId: any;
        name: any;
        value: any;
        type: any;
        SequenceId: any;
      }) => ({
        id: child.fieldId,
        name: child.name,
        value: child.value,
        type: child.type,
        sequence: child.SequenceId,
      })
    );
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
      return field.child.map((child: { name: string }) => ({
        accessorKey: child.name.toLowerCase().replace(/ /g, "_"),
        header: child.name,
        cell: ({ row }) => (
          <div>{row.getValue(child.name.toLowerCase().replace(/ /g, "_"))}</div>
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
];

export function ViewGrid() {
    const navigate = useNavigate(); // Initialize useNavigate
  const [dailyFieldsArray, setDailyFieldsArray] = React.useState([]);
  const [monthlyFieldsArray, setMonthlyFieldsArray] = React.useState([]);

  const {data:GridData}=useGetViewPageGridQuery({
    locationId:1,
    PageSize:10,
    PageNo:1
  })
console.log(GridData,"GridData")
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

  return (
    <div className="h-full w-full p-2 flex flex-col overflow-auto gap-3 bg-yellow-100">
      <div className="w-full h-20 ">
      <Button onClick={() => navigate("/viewdashboard")}>Back</Button>
        <label className="text-indigo-950 font-bold flex justify-center  ">
          WB MIXER RH2
        </label>
        <div className="flex justify-start font-bold">Updated fields :</div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid black' }} />

      <div className="flex-1 flex-row h-full ">
        <div className="h-full flex flex-row gap-1">
          <div className="flex-1">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto relative h-full">
                <div className="absolute w-full h-full border-none rounded-sm md:border-2">
                  <ScrollArea className="h-[100%] relative w-full rounded-sm border-none bg-indigo-950">
                    <Table>
                      <TableHeader className="bg-yellow-400 text-black ">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow
                            key={headerGroup.id}
                            className="bg-yellow-400 hover:bg-yellow-400"
                          >
                            {headerGroup.headers.map((header) => (
                              <TableHead
                                key={header.id}
                                className="bg-yellow-400 hover:bg-yellow-400 text-black"
                              >
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
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination className="flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
    </div>
  );
}
export default ViewGrid;
