export type ArrayType = {
  SequenceId: any;
  value: any;
  fieldId: any;
  child: any;
  hasChild:boolean; 
  name: string;
  type: string;
  mtdavg:number;
  PreviousReading:number;
  childFields?: ArrayType[];
};
export const HT_Yard_Array: ArrayType[] = [
  {
    name: "Date",
    type: "int",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M3-1",
    type: "date",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M3-2",

    type: "float",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M3-3",
    type: "float",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M3-4",
    type: "float",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M3-5",

    type: "float",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M3-6",

    type: "float",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M5-1",

    type: "float",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M5-2",

    type: "float",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M5-3",

    type: "float",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M5-4",

    type: "float",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M5-5",

    type: "float",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "M5-6",

    type: "float",
    hasChild: false,
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  
  {
    name: "Near 3KL filling",
    hasChild: true,
    childFields: [
      {
        name: "UV AMPS",

        type: "float",
        hasChild: false,
        SequenceId: undefined,
        value: undefined,
        fieldId: undefined,
        child: undefined,
        mtdavg: 0,
        PreviousReading: 0
      },
      {
        name: "UV HOUR",

        type: "float",
        hasChild: false,
        SequenceId: undefined,
        value: undefined,
        fieldId: undefined,
        child: undefined,
        mtdavg: 0,
        PreviousReading: 0
      },
    ],

    type: "",
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
  {
    name: "Near 10KL filling",
    hasChild: true,
    childFields: [
      {
        name: "UV AMPS",

        type: "float",
        hasChild: false,
        SequenceId: undefined,
        value: undefined,
        fieldId: undefined,
        child: undefined,
        mtdavg: 0,
        PreviousReading: 0
      },
      {
        name: "UV HOUR",

        type: "float",
        hasChild: false,
        SequenceId: undefined,
        value: undefined,
        fieldId: undefined,
        child: undefined,
        mtdavg: 0,
        PreviousReading: 0
      },
    ],

    type: "",
    SequenceId: undefined,
    value: undefined,
    fieldId: undefined,
    child: undefined,
    mtdavg: 0,
    PreviousReading: 0
  },
];