import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export interface DashboardInterface {
  id: number;
  name: string;
  sequenceId:number;
}
type FetchType = {
  Dashboard: DashboardInterface[];
  setDashboard: (data: DashboardInterface[]) => void;
};

export const useDashboardTypeStore = create<FetchType>()(
  persist(
    (set) => ({
      Dashboard: [],
      setDashboard: (data: DashboardInterface[]) => {
        set(() => ({ Dashboard: data }));
      },
    }),
    {
      name: "Dashboard",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);