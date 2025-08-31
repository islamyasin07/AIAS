import { api } from "./api";

export type Member = {
  id: string;
  full_name: string;
  year_of_study: string;
  is_member: boolean;
  email?: string;
  created_at?: string | number;
};

export type MembersQuery = {
  search?: string;
  status?: "approved" | "pending" | "all";
  year?: string;
  page?: number;
  limit?: number;
};

export async function listMembers(q: MembersQuery = {}) {
  const params: any = {};
  if (q.search) params.search = q.search;
  if (q.year && q.year !== "All") params.year = q.year;
  if (q.status && q.status !== "all") params.status = q.status;
  params.page = q.page ?? 1;
  params.limit = q.limit ?? 12;

  const resp = await api.get("/members", { params });
  const d = resp.data;

  const arr: Member[] = Array.isArray(d)
    ? d
    : d?.items ?? d?.data ?? d?.results ?? [];

  const total =
    (typeof d?.total === "number" ? d.total : undefined) ?? arr.length;

  return { items: arr, total, page: d?.page ?? params.page, limit: d?.limit ?? params.limit };
}
