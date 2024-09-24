import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export interface HtYardInterface {
    id: number;
    name: string;
    sequenceId:number;
  }
  type HtYardtype = {
    HtYard: HtYardInterface[];
    setHtYard: (data: HtYardInterface[]) => void;
  };
  
  export const useHtYardStore = create<HtYardtype>()(
    persist(
      (set) => ({
        HtYard: [],
        setHtYard: (data: HtYardInterface[]) => {
          set(() => ({ HtYard: data }));
        },
      }),
      {
        name: "HtYard",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );
