// import { useQuery } from "@tanstack/react-query";
// import { customerTypeMasterApi } from "./api";

import { useQuery } from "@tanstack/react-query";
import {
  CreateTransaByLocationIdAPI,
  GetDashboardAPI,
  GetDashboardMonthlyAPI,
  GetFieldsBasedOnLocationIdAPI,
} from "./api";

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

export function useGetFieldsBasedOnLocationIdAPIQuery(data: any) {
  return useQuery({
    queryKey: ["FieldsBasedOnLocationId", data.locationId],
    queryFn: () => GetFieldsBasedOnLocationIdAPI(data),
    staleTime: Infinity,
    gcTime: Infinity,
    // enabled: data.locationId !== 0,
  });
}

// export function TransaByLocationIdAPIQuery(data:any) {
//   return useQuery({
//     queryKey: ["Transaction Id",data.TransactionId],
//     queryFn: () => GetTransaByLocationIdAPI(data),
//     staleTime: Infinity,
//     gcTime: Infinity,

//   });
// }
