import { getAllDexes } from "@/lib/backend";
import { useQuery } from "@tanstack/react-query";

export function useDexes() {
  return useQuery({
    queryKey: ["dexes"],
    queryFn: () => getAllDexes(),
  });
}
