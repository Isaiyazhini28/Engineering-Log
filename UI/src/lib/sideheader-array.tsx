export type ArrayType = {
    status: string;
    
    fieldId: number;
    Fieldname: string;
    value: number;
    type: string;
    transactiondataid: string;
    transactionid: string;
    child?: ArrayType[];
    SequenceId:number;
  };
  export const Sideheader_Array: ArrayType[] = [
    
    {
      fieldId: 1,
      Fieldname: "Last Reading",
      value: 0,
      type: "int",
      transactiondataid: "int",
      transactionid: "int",
      SequenceId: 1,
      status: ""
    },
    {
      fieldId: 2,
      Fieldname: "Current",
      value: 0,
      type: "float",
      transactiondataid: "int",
      transactionid: "int",
      SequenceId: 2,
      status: ""
    },
    {
      fieldId: 3,
      Fieldname: "Mtd",
      value: 0,
      type: "float",
      transactiondataid: "int",
      transactionid: "int",
      SequenceId: 3,
      status: ""
    },
]