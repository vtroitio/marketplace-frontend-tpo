function normalizeIds(ids = []) {
  return [...ids].map(String).sort((a, b) => a.localeCompare(b));
}

function buildExploreParams(explore) {
  return {
    page: explore.page,
    size: explore.size,
    search: explore.filters.search?.trim() || "",
    categoryIds: normalizeIds(explore.filters.categoryIds),
    sizeIds: normalizeIds(explore.filters.sizeIds),
    colorIds: normalizeIds(explore.filters.colorIds),
    minPrice: explore.filters.minPrice || "",
    maxPrice: explore.filters.maxPrice || "",
  };
}

export function buildExploreQueryKey(explore) {
  return JSON.stringify(buildExploreParams(explore));
}
