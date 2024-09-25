// import { useQuery } from "@tanstack/react-query";
// import { customerTypeMasterApi } from "./api";

import { useQuery } from "@tanstack/react-query";
import { GetDashboardAPI, GetDashboardMonthlyAPI, GetFieldsBasedOnLocationIdAPI  } from "./api";

// // queryClient.ts (or wherever you initialize your QueryClient)
export function useGetDashboardQuery() {
  return useQuery({
    queryKey: ["Get Dashboard"],
    queryFn: () => GetDashboardAPI(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useGetDashboardMonthlyQuery() {
  return useQuery({
    queryKey: ["Get DashboardMonthly"],
    queryFn: () => GetDashboardMonthlyAPI(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useGetFieldsBasedOnLocationIdQuery(data:any) {
  return useQuery({
    queryKey: ["Get Fields Based On Location Id",data.LocationId],
    queryFn: () => GetFieldsBasedOnLocationIdAPI(data),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled:(data.LocationId!==0)
  });
}



