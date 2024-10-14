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

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "react-toastify";
import { useViewpageDetailedStore } from "@/store/store";
import { useGetViewPageDetailedQuery } from "@/services/query";
import { createHierarchicalArray } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

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
  {
    id: "serial",
    header: "Header",
    cell: ({ row }) => {
      const cellLabels = [
        "Previous Reading",
        "Current Reading",
        "Difference",
        "MTD Avg",
      ];

      const cellLabel = cellLabels[row.index] || "";

      return <div className="text-white">{cellLabel}</div>;
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

export function ReadingView() {
  const navigate = useNavigate();

  const TransId = useViewpageDetailedStore((state) => state.transactionId);
  const { data: FieldsTransData, isLoading, error } = useGetViewPageDetailedQuery({
    transactionId: TransId,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [logComment, setLogComment] = React.useState<string>("");

  // Log FieldsTransData to verify it's being fetched correctly
  console.log(FieldsTransData, "FieldsTransData from API");

  // Check if FieldsTransData has a fields array and map it accordingly
  const tableData = React.useMemo(() => {
    if (FieldsTransData && FieldsTransData.fields) {
      // Map the fields array to extract the required data
      return FieldsTransData.fields.map((field: any) => ({
        fieldName: field.fieldName,
        value: field.value,
        previousReading: field.previousReading,
        difference: field.difference,
        mtdAvg: field.mtdAvg,
        previousMonthAvg: field.previousMonthAvg,
      }));
    }
    return [];
  }, [FieldsTransData]);

  const columns: ColumnDef<any>[] = React.useMemo(() => [
    {
      accessorKey: "fieldName", // Use exact keys from FieldsTransData.fields
      header: "Field Name",
      cell: ({ row }) => <div>{row.getValue("fieldName")}</div>,
    },
    {
      accessorKey: "value", // Accessor must match the key in data
      header: "Value",
      cell: ({ row }) => <div>{row.getValue("value")}</div>,
    },
    {
      accessorKey: "previousReading",
      header: "Previous Reading",
      cell: ({ row }) => <div>{row.getValue("previousReading")}</div>,
    },
    {
      accessorKey: "difference",
      header: "Difference",
      cell: ({ row }) => <div>{row.getValue("difference")}</div>,
    },
    {
      accessorKey: "mtdAvg",
      header: "MTD Avg",
      cell: ({ row }) => <div>{row.getValue("mtdAvg")}</div>,
    },
    {
      accessorKey: "previousMonthAvg",
      header: "Previous Month Avg",
      cell: ({ row }) => <div className="text-right">{row.getValue("previousMonthAvg")}</div>,
    },
  ], []);

  const table = useReactTable({
    data: tableData,  // Use the transformed data here
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

  const handleLogSubmit = () => {
    console.log("Log comment submitted:", logComment);
    setLogComment("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="h-full w-full p-2 flex flex-col overflow-auto">
      <div className="flex-1 flex-row h-full">
        <div className="h-full flex flex-row gap-1">
          <div className="flex-1">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto relative h-full">
                <div className="absolute w-full h-full border-none rounded-sm md:border-2">
                  <ScrollArea className="h-[100%] relative w-full rounded-sm border-none bg-indigo-950">
                    <Table>
                      <TableHeader className="bg-yellow-400 text-black">
                        <TableRow>
                          <TableHead>Field Name</TableHead>
                          <TableHead className="w-[100px]">Value</TableHead>
                          <TableHead>Previous Reading</TableHead>
                          <TableHead>Difference</TableHead>
                          <TableHead>MTD Avg</TableHead>
                          <TableHead className="text-right">Previous Month Avg</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="pb-48">
                        {tableData.map((row: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="text-white">{row.fieldName}</TableCell>
                            <TableCell className="font-medium text-white">{row.value}</TableCell>
                            <TableCell className="text-white">{row.previousReading}</TableCell>
                            <TableCell className="text-white">{row.difference}</TableCell>
                            <TableCell className="text-white">{row.mtdAvg}</TableCell>
                            <TableCell className="text-right text-white">{row.previousMonthAvg}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
              <div className="h-48 overflow-auto">
                <div className="flex flex-col">
                  <label className="font-semibold">Attachment</label>
                </div>
              </div>
            </div>
          </div>
          <div className="w-80">
            <div className="h-full w-full">
              <div className="flex h-full w-full flex-col">
                <div className="h-12 bg-yellow-400 text-black flex rounded-sm justify-center items-center">
                  ACTIVITY LOG
                </div>
                <div className="flex-1 mr-1 ml-1 p-4 overflow-auto">
                  {[ 
                    { label: "Transaction ID", value: "" },
                    { label: "Created By", value: "" },
                    { label: "Created On", value: "" },
                    { label: "Revised On", value: "" },
                    { label: "Revised By", value: "" },
                    { label: "Updated fields", value: "" },
                  ].map((field, index) => (
                    <div key={index} className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      <Input value={field.value} onChange={() => {}} />
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