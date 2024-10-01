// import { useQuery } from '@tanstack/react-query';

// // Custom hook with additional options
// export function useFetchData(url: string) {
//   return useQuery({
//     queryKey: ['fetchData', url],
//     queryFn: async () => {
//       const response = await fetch('\https://api.example.com/resources');
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     },
//     retry: 3, // Number of retries on failure
//     staleTime: 5000, // Time before data is considered stale
//   });
// }


import { useQuery } from "@tanstack/react-query";
import { fetchModuleDataApi } from "./api";

export function useModuleDataQuery() {
    return useQuery({
      queryKey: ["dashboard"],
      queryFn: fetchModuleDataApi, // API call to fetch module data
      staleTime: 60000, // Cache the data for 1 minute
    });
  }