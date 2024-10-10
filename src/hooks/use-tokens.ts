import { getAllTokens } from "@/lib/backend";
import { useQuery } from "@tanstack/react-query";

export function useTokens() {
  return useQuery({
    queryKey: ["tokens"],
    queryFn: () => getAllTokens(),
  });
}
