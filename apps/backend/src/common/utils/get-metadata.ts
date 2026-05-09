type QueryType = {
  page: number;
  limit: number;
};
export default function getMetadata(query: QueryType, total: number) {
  const { page, limit } = query;
  const totalPages = Math.ceil(total / limit);
  return {
    totalPages,
    currentPage: page,
    limit,
    totalCount: total,
  };
}
