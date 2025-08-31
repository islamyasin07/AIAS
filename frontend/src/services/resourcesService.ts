import { api } from "./api";

export type Resource = {
  id: string;
  title: string;
  type: "video" | "document" | "course" | "link" | string;
  category: string;
  url?: string;
  created_at?: string | number;
};

export type ResourcesQuery = {
  search?: string;
  type?: string;      
  category?: string;  
  page?: number;
  limit?: number;
};

export async function listResources(q: ResourcesQuery = {}) {
  const params: any = {};
  if (q.search) params.search = q.search;
  if (q.type && q.type !== "all") params.type = q.type;
  if (q.category && q.category !== "All") params.category = q.category;
  params.page = q.page ?? 1;
  params.limit = q.limit ?? 12;

  const resp = await api.get("/resources", { params });
  const d = resp.data;


  const arr: Resource[] = Array.isArray(d) ? d : d?.items ?? d?.data ?? [];
  const total =
    (typeof d?.total === "number" ? d.total : undefined) ?? arr.length;

  return { items: arr, total, page: d?.page ?? params.page, limit: d?.limit ?? params.limit };
}
