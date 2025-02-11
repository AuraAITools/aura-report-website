export function queryKeyFactory(resourceKeyName: string) {
  let resourceQueryKeys = {
    all: [resourceKeyName] as const,
    lists: () => [...resourceQueryKeys.all, "list"] as const,
    list: (filters: string) =>
      [...resourceQueryKeys.lists(), { filters }] as const,
    details: () => [...resourceQueryKeys.all, "detail"] as const,
    detail: (id: string) => [...resourceQueryKeys.details(), id] as const,
  };
  return resourceQueryKeys;
}
