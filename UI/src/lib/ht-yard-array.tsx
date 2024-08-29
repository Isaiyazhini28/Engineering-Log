export type ArrayType = {
  fieldId: number;
  Fieldname: string;
  value: number;
  type: string;
  transactiondataid: string;
  transactionid: string;
  child?: ArrayType[];
  SequenceId:number;
};
export const HT_Yard_Array: ArrayType[] = [
  
  {
    fieldId: 1,
    Fieldname: "M3-1",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId:5
  },
  {
    fieldId: 2,
    Fieldname: "M3-2",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId: 6
  },
  {
    fieldId: 3,
    Fieldname: "M3-3",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId: 7
  },
  {
    fieldId: 4,
    Fieldname: "M3-4",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId: 8
  },
  {
    fieldId: 5,
    Fieldname: "M3-5",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId: 9
  },
  {
    fieldId: 6,
    Fieldname: "M3-6",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId: 10
  },
  {
    fieldId: 7,
    Fieldname: "M5-1",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId: 11
  },
  {
    fieldId: 8,
    Fieldname: "M5-2",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId: 12
  },
  {
    fieldId: 9,
    Fieldname: "M5-3",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId: 13
  },
  {
    fieldId: 10,
    Fieldname: "M5-4",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId: 14
  },
  {
    fieldId: 11,
    Fieldname: "M5-5",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId: 15
  },
  {
    fieldId: 12,
    Fieldname: "M5-6",
    value: 0,
    type: "float",
    transactiondataid: "int",
    transactionid: "int",
    SequenceId: 16
  },
  
  {
    fieldId: 13,
    Fieldname: "Near 3KL filling",
    child: [
      {
        fieldId: 14,
        Fieldname: "UV AMPS",
        value: 0,
        type: "float",
        transactiondataid: "int",
        transactionid: "int",
        SequenceId: 5
      },
      {
        fieldId: 15,
        Fieldname: "UV HOUR",
        value: 0,
        type: "float",
        transactiondataid: "int",
        transactionid: "int",
        SequenceId: 6
      },
    ],
    value: 0,
    type: "",
    transactiondataid: "",
    transactionid: "",
    SequenceId: 4
  },
  {
    fieldId: 16,
    Fieldname: "Near 10KL filling",
    child: [
      {
        fieldId: 17,
        Fieldname: "UV AMPS",
        value: 0,
        type: "float",
        transactiondataid: "int",
        transactionid: "int",
        SequenceId: 2
      },
      {
        fieldId: 18,
        Fieldname: "UV HOUR",
        value: 0,
        type: "float",
        transactiondataid: "int",
        transactionid: "int",
        SequenceId: 3
      },
    ],
    value: 0,
    type: "",
    transactiondataid: "",
    transactionid: "",
    SequenceId: 1
  },
];