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
import ViewGridPagination from "./view-grid-pagination";
import { useTableFilterStore, useViewpageDetailedStore } from "@/store/store";

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
  const TableFilter=useTableFilterStore((state)=>state)
  const {data:GridData}=useGetViewPageGridQuery({
    locationId:TableFilter.locationId,
    PageSize:TableFilter.pageSize,
    PageNo:TableFilter.page
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
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });
 const viewpagedetailed=useViewpageDetailedStore((state)=>state)
 


  React.useEffect(() => {
    if (GridData) {
      const totalPage = Math.ceil(GridData.count / TableFilter.pageSize);
      TableFilter.setTotalPage(totalPage);
    }
  }, [GridData]);

  const onrowclick=(rowdata:any)=>{
    alert(rowdata.transactionId)
    viewpagedetailed.setTransactionId(rowdata.transactionId)
    navigate("/view");
  }

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
                       
                          <TableRow>
                          <TableHead className="w-[100px] ">transactionId</TableHead>
                          <TableHead>refId</TableHead>
                          <TableHead>createdDate</TableHead>
                          <TableHead>approvalStatus</TableHead>
                          <TableHead className="text-right">remarks</TableHead>
                        </TableRow>
                       
                      </TableHeader>
                      <TableBody className="pb-48">
                      {GridData?.data?.map((rows:any,index:number) => (
          <TableRow onClick={()=>onrowclick(rows)} key={index}>
          
            <TableCell className="font-medium text-white">{rows.transactionId}</TableCell>
            <TableCell className="text-white">{rows.refId}</TableCell>
            <TableCell className="text-white">{rows.createdDate}</TableCell>
            <TableCell className="text-white">{rows.approvalStatus}</TableCell>
            <TableCell className="text-right text-white">{rows.remarks}</TableCell>
          </TableRow>
        ))}
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
     <ViewGridPagination count={GridData?.count}/>
    </div>
  );
}
export default ViewGrid;
