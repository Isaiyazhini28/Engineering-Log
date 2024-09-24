// import { useQuery } from "@tanstack/react-query";
// import { customerTypeMasterApi } from "./api";

import { useQuery } from "@tanstack/react-query";
import { GetDashboardAPI } from "./api";

// // queryClient.ts (or wherever you initialize your QueryClient)
export function useGetDashboardQuery() {
  return useQuery({
    queryKey: ["Get Dashboard"],
    queryFn: () => GetDashboardAPI(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

