import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type TransactionItem = {
  transactionValueId: number;
  fieldId: number;
  fieldName: string;
  fieldSequenceId: number;
  subFieldId: number | null;
  subFieldName: string | null;
  subFieldSequenceId: number | null;
  value: string;
  difference: number;
  type: string;
  frequency: number;
  previousReading: string;
  mtdAvg: number;
  previousMonthAvg: number;
};

type HierarchicalField = {
  fieldId: number;
  fieldName: string;
  subFieldId: number | null;
  subFieldName: string | null;
  fieldSequenceId: number;
  type: string;
  frequency: number;
  value: string;
  mtdAvg: number;
  previousMonthAvg: number;
  previousReading: string;
  transactionValueId: number;
  difference: number;
  childFields: SubField[];
};

type SubField = {
  subFieldId: number;
  subFieldName: string;
  subFieldSequenceId: number;
  value: string;
  mtdAvg: number;
  previousMonthAvg: number;
  fieldId: number;
  fieldName: string;
  previousReading: string;
  transactionValueId: number;
  difference: number;
};

// Utility function to convert flat array to hierarchical structure
export const createHierarchicalArray = (data: TransactionItem[]): HierarchicalField[] => {
  const hierarchicalData: HierarchicalField[] = [];

  data?.forEach((item) => {
    let parent = hierarchicalData.find((field) => field.fieldId === item.fieldId);

    if (!parent) {
      // Create a new parent for fieldId
      parent = {
        fieldId: item.fieldId,
        fieldName: item.fieldName,
        subFieldId: item.subFieldId!,
        subFieldName: item.subFieldName,
        fieldSequenceId: item.fieldSequenceId,
        type: item.type,
        frequency: item.frequency,
        value: item.value,
        mtdAvg: item.mtdAvg,
        previousMonthAvg: item.previousMonthAvg,
        previousReading:item.previousReading,
        transactionValueId:item.transactionValueId,
        difference:item.difference,
        childFields: [],
      };
      hierarchicalData.push(parent);
    }

    // If item has subFieldId, add it to subFields array
    if (item.subFieldId) {
      parent.childFields.push({
        subFieldId: item.subFieldId,
        subFieldName: item.subFieldName!,
        subFieldSequenceId: item.subFieldSequenceId!,
        value: item.value,
        mtdAvg: item.mtdAvg,
        previousMonthAvg: item.previousMonthAvg,
        fieldId: item.fieldId,
        fieldName: item.fieldName,
        previousReading:item.previousReading,
        transactionValueId:item.transactionValueId,
        difference:item.difference,
      });
    }
  });

  return hierarchicalData;
};