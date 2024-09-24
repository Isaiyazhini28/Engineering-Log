export type ArrayType = {
  name: string;
  type: string;
  childFields?: ArrayType[];
};
export const HT_Yard_Array: ArrayType[] = [
  {
    name: "Date",
    
    type: "int",
  },
  {
    name: "M3-1",
    
    type: "date",
  },
  {
    name: "M3-2",
    
    type: "float",
  },
  {
    name: "M3-3",
    
    type: "float",
  },
  {
    name: "M3-4",
    
    type: "float",
  },
  {
    name: "M3-5",
    
    type: "float",
  },
  {
    name: "M3-6",
    
    type: "float",
  },
  {
    name: "M5-1",
    
    type: "float",
  },
  {
    name: "M5-2",
    
    type: "float",
  },
  {
    name: "M5-3",
    
    type: "float",
  },
  {
    name: "M5-4",
    
    type: "float",
  },
  {
    name: "M5-5",
    
    type: "float",
  },
  {
    name: "M5-6",
    
    type: "float",
  },
  
  {
    name: "Near 3KL filling",
    childFields: [
      {
        name: "UV AMPS",
        
        type: "float",
      },
      {
        name: "UV HOUR",
        
        type: "float",
      },
    ],
    
    type: "",
  },
  {
    name: "Near 10KL filling",
    childFields: [
      {
        name: "UV AMPS",
        
        type: "float",
      },
      {
        name: "UV HOUR",
        
        type: "float",
      },
    ],
    
    type: "",
  },
];