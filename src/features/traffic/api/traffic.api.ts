import { apiClient } from '@/lib/axios';
import { paginatedTrafficResponseSchema } from '../schemas/traffic.schema';
import type { TrafficFilter, PaginatedTrafficResponse } from '../schemas/traffic.schema';
import { mockTrafficRecords } from '@/test/mocks/fixtures/traffic.fixture';

export const fetchTrafficRecords = async (
  filter: TrafficFilter,
  isMock = false
): Promise<PaginatedTrafficResponse> => {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    let filtered = [...mockTrafficRecords];

    // Apply search filter (IP, port, payload)
    if (filter.search && filter.search.trim().length > 0) {
      const q = filter.search.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.sourceIp.toLowerCase().includes(q) ||
          r.destinationIp.toLowerCase().includes(q) ||
          String(r.sourcePort).includes(q) ||
          String(r.destinationPort).includes(q) ||
          r.payloadSummary.toLowerCase().includes(q)
      );
    }

    // Apply protocol filter
    if (filter.protocol && filter.protocol !== 'ALL') {
      filtered = filtered.filter((r) => r.protocol.toUpperCase() === filter.protocol.toUpperCase());
    }

    // Apply classification filter
    if (filter.classification && filter.classification !== 'ALL') {
      filtered = filtered.filter(
        (r) => r.classification.toUpperCase() === filter.classification.toUpperCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (filter.sortBy === 'timestamp') {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return filter.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }
      if (filter.sortBy === 'packetLength') {
        return filter.sortOrder === 'asc'
          ? a.packetLength - b.packetLength
          : b.packetLength - a.packetLength;
      }
      return 0;
    });

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / filter.pageSize));
    const startIdx = (filter.page - 1) * filter.pageSize;
    const paginated = filtered.slice(startIdx, startIdx + filter.pageSize);

    return {
      results: paginated,
      totalCount,
      page: filter.page,
      pageSize: filter.pageSize,
      totalPages,
      isDemoData: true,
    };
  }

  // Real backend API call: GET /api/traffic/
  const response = await apiClient.get<unknown>('/traffic/', {
    params: {
      search: filter.search || undefined,
      protocol: filter.protocol !== 'ALL' ? filter.protocol : undefined,
      classification: filter.classification !== 'ALL' ? filter.classification : undefined,
      page: filter.page,
      page_size: filter.pageSize,
      sort_by: filter.sortBy,
      sort_order: filter.sortOrder,
    },
  });

  return paginatedTrafficResponseSchema.parse(response.data);
};
