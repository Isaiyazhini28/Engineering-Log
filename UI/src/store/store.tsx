import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export interface HtYardInterface {
    id: number;
    statusType: string;
    
  }
  type HtYardtype = {
    HtYard: HtYardInterface[];
    setHtYard: (data: []) => void;
  };
  
  export const useHtYardStore = create<HtYardtype>()(
    persist(
      (set) => ({
        HtYard: [],
        finding: {},
        setHtYard: (data: []) => {
          set(() => ({ HtYard: data }));
        },
      }),
      {
        name: "HtYard",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );