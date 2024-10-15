
import {  useTableFilterStore } from "@/store/store";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 
type TablePaginationType={
  count:number
}
export default function ViewGridPagination({count}:TablePaginationType) {
  const pageSize = useTableFilterStore((state) => state.pageSize);
  const page = useTableFilterStore((state) => state.page);
  const totalPage = useTableFilterStore((state) => state.totalPage);
  const setPage = useTableFilterStore((state) => state.setPage);
  const setPageSize = useTableFilterStore((state) => state.setPageSize);

 
  return (
    <div className="h-14 md:h-14 flex items-center justify-center ml-1">
      <div className="flex-1 text-sm text-muted-foreground md:block hidden">
        {/* 10 of 11 row(s) */}
        {/* <div className={`flex justify-center border-2 p-1 rounded-sm text-center gap-2`} style={{ width: `${95 * (statuses?.length) + "px"}` }}>
          {statuses?.length > 0 &&
            statuses?.map((status, index) => (
              <div
                key={index + "ActionStatus"}
                className="flex gap-2 items-center"
              >
                <div
                  className="rounded-full h-3 w-3 text-white p-[1px] shadow shadow-gray-700"
                  style={{
                    backgroundColor: status?.colourCode,
                  }}
                />{" "}
                {status.statusType}
              </div>
            ))}
        </div> */}
      </div>
 
      <div className="grid grid-cols-2 gap-2 md:grid-cols-2 md:justify-center md:gap-0 md:space-x-2 items-center space-x-0 lg:space-x-8">
        <div className=" flex items-center space-x-2 justify-start md:justify-start ">
          <p className="text-sm font-medium hidden md:flex">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={10} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-start items-center">
             
          <div className="flex md:gap-2">
            <div className="flex  items-center justify-center text-sm font-medium">
              Page
              {" " + page} of {totalPage}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setPage(page + 1)}
                disabled={page == totalPage}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setPage(totalPage)}
                disabled={totalPage === page}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm font-bold ml-2">Total : {count}</div>
        </div>
      </div>
    </div>
  );
}
 