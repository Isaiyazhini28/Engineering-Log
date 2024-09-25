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
      }),
      {
        name: "HtYard",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );

  type selectedLocationIdType={
    LocationId:number,
    setLocationId:(data:number)=>void;
  }
  export const useSelectedLocationIdStore = create<selectedLocationIdType>()(
    persist(
      (set) => ({
        LocationId: 0,
        setLocationId: (data: number) => {
          set(() => ({ LocationId: data }));
        },
      }),
      {
        name: "Selected Location Id",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );

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
  fieldId:number,
  subFieldId:number
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
  // export interface FieldsInterface{
  //   id:number,
  //   name:string,
  //   sequenceId:number,
  //   frequency:number,
  //   type:string,
  //   hasChild:boolean,
  //   childFields:FieldsInterface[]
  // }

  // type FieldsStoreType = {
  //   Fields: FieldsInterface[];
  //   setFields: (data: FieldsInterface[]) => void;
  // };
  
  // export const useFieldsStore = create<FieldsStoreType>()(
  //   persist(
  //     (set) => ({
  //       Fields: [],
  //       setFields: (data: FieldsInterface[]) => {
  //         set(() => ({ Fields: data }));
  //       },
  //     }),
  //     {
  //       name: "Selected Fields",
  //       storage: createJSONStorage(() => sessionStorage),
  //     }
  //   )
  // );

  
 