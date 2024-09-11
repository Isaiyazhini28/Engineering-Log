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
