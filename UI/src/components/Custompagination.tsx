// components/CustomPagination.tsx
import * as React from "react";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <button
        className="px-2 py-1 border bg-gray-200"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        Previous
      </button>
      {[...Array(pageCount)].map((_, index) => (
        <button
          key={index}
          className={`px-2 py-1 border ${
            currentPage === index ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => onPageChange(index)}
        >
          {index + 1}
        </button>
      ))}
      <button
        className="px-2 py-1 border bg-gray-200"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount - 1}
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;
