// import { useQuery } from "@tanstack/react-query";
// import { customerTypeMasterApi } from "./api";

import { useQuery } from "@tanstack/react-query";
import {
  CreateTransaByLocationIdAPI,
  GetApproverDashboardAPI,
  GetDashboardAPI,
  GetDashboardMonthlyAPI,
  GetFieldsBasedOnLocationIdAPI,
  GetViewPageDashboardAPI,
  GetViewPageDetailedAPI,
  GetViewPageGridAPI,
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


export function useGetApproverDashboardQuery() {
  return useQuery({
    queryKey: ["Get ApproverDashboard"],
    queryFn: () => GetApproverDashboardAPI(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function GetViewPageDashboardQuery() {
  return useQuery({
    queryKey: ["Get ViewPageDashboardAPI"],
    queryFn: () => GetViewPageDashboardAPI(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
export function useGetViewPageGridQuery(data:any) {
  let locationId=data.locationId
  let PageSize=data.PageSize
  let PageNo=data.PageNo
  return useQuery({
    queryKey: ["Get ViewPageGrid",locationId,PageSize,PageNo],
    queryFn: () => GetViewPageGridAPI(data),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useGetViewPageDetailedQuery() {
  return useQuery({
    queryKey: ["Get ViewPageDetailed"],
    queryFn: () => GetViewPageDetailedAPI(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
