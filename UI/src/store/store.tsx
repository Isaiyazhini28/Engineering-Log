import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export interface HtYardInterface {
    status: string;
    id: number;
    name: string;
    sequenceId:number;
  }
  type HtYardtype = {
    HtYard: HtYardInterface[];
    setHtYard: (data: HtYardInterface[]) => void;
    HtYardMonthly: HtYardInterface[];
    setHtYardMonthly: (data: HtYardInterface[]) => void;
    ViewDash: HtYardInterface[];
    setViewDash: (data: HtYardInterface[]) => void;
  };
  
  export const useHtYardStore = create<HtYardtype>()(
    persist(
      (set) => ({
        HtYard: [],
        setHtYard: (data: HtYardInterface[]) => {
          set(() => ({ HtYard: data }));
        },
        HtYardMonthly: [],
        setHtYardMonthly: (data: HtYardInterface[]) => {
          set(() => ({ HtYardMonthly: data }));
        },
        ViewDash: [],
        setViewDash: (data: HtYardInterface[]) => {
          set(() => ({ ViewDash: data }));
        },
      }),
      {
        name: "HtYard",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );
  type GetloginUserApiType={
    id:string,
    setid: (data: string) => void; 
  }
  export const GetloginUserApiStore = create<GetloginUserApiType>()(
    persist(
      (set) => ({
        id: "", 
        setid: (data: string) => { 
          set(() => ({ id: data }));
        },
      }),
      {
        name: "Selected Employee Id", 
        storage: createJSONStorage(() => sessionStorage), 
      }
    )
  );
//  getfieldbylocationid

  type selectedLocationAndTransactionIDType={
    LocationId:number,
    setLocationId:(data:number)=>void;
    transactionId:number,
    setTransactionId:(data:number)=>void;
  }
  export const useSelectedLocationAndTransactionIDStore = create<selectedLocationAndTransactionIDType>()(
    persist(
      (set) => ({
        LocationId: 0,
        transactionId:0,
        setLocationId: (data: number) => {
          set(() => ({ LocationId: data }));
        },
        setTransactionId: (data: number) => {
          set(() => ({ transactionId: data }));
        },
      }),
      {
        name: "Selected Location Id",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );
// fieldstore
  export interface FieldsInterface{
    id:number,
    name:string,
    sequenceId:number,
    frequency:number,
    type:string,
    previousReading:string,
    mtdAvg:number,
    previousMonthAvg:number,
    hasChild:boolean,
    childFields:FieldsInterface[]
  }

  type FieldsStoreType = {
    Fields: FieldsInterface[];
    setFields: (data: FieldsInterface[]) => void;
  };
  
  export const useFieldsStore = create<FieldsStoreType>()(
    persist(
      (set) => ({
        Fields: [],
        setFields: (data: FieldsInterface[]) => {
          set(() => ({ Fields: data }));
        },
      }),
      {
        name: "Selected Fields",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );
interface DynamicFormInsertInterface {
  value:number,
  transactionValueId:number,
  employeeId:string,
  difference:number,
  reset:boolean,
}

  type selectedDynamicFormInsertType={
    Fields: DynamicFormInsertInterface[];
    setFields: (data: DynamicFormInsertInterface[]) => void;
  }


  export const useDynamicFormInsertStore = create<selectedDynamicFormInsertType>()(
    persist(
      (set) => ({
        Fields: [],
        setFields: (data: DynamicFormInsertInterface[]) => {
          set((state) => ({ Fields: data }));
        },
      }),
      {
        name: "Insert data",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );
  
  export interface ApprovalInterface { 
    locationId:number,
    locationName:string,
    sequenceId:number,
    pendingCount:string,
  }

type Approvaltype = {
  Approval: ApprovalInterface[];
  setApproval: (data: ApprovalInterface[]) => void;
  
};

export const useApprovalStore = create<Approvaltype>()(
  persist(
    (set) => ({
      Approval: [],
      setApproval: (data: ApprovalInterface[]) => {
        set(() => ({ Approval: data }));
      },
      
    }),
    {
      name: "Approval",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// table pagination

type TableFiltertype = {
 
  pageSize: number;
  page: number;
  locationId: number;
  totalPage: number;
  
  setPageSize: (pageSize: number) => void;
  setPage: (page: number) => void;
  setlocationId: (itsme: number) => void;
  setTotalPage: (totalPage: number) => void;
  
};
 
export const useTableFilterStore = create<TableFiltertype>()(
  persist(
    (set) => ({
     
    
      pageSize: 10,
      page: 1,
      locationId: 0,
      totalPage: 0,
      
      
      setPageSize: (pageSize) => set({ pageSize }),
      setPage: (page) => set({ page }),
      setlocationId: (locationId) => set({ locationId }),
      setTotalPage: (totalPage) => set({ totalPage }),
      
    })
    ,
    {
      name: "Table Filter Data",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// viewpagedetailed

type viewpagedetailedType={
  
  transactionId:number,
  setTransactionId:(data:number)=>void;
}
export const useViewpageDetailedStore = create<viewpagedetailedType>()(
  persist(
    (set) => ({
     
      transactionId:0,
      setTransactionId: (data: number) => {
        set(() => ({ transactionId: data }));
      },
    }),
    {
      name: "view page detailed",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);