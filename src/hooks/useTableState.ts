import { useQueryState, parseAsString } from "nuqs";

export function useTableState() {
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault(""));
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );

  return {
    tab,
    setTab,
    search,
    setSearch,
  };
}
