import { api } from "./api";

export type EventItem = {
  id: string;
  title: string;
  date: string | { _seconds: number; _nanoseconds: number };
  location: string;
  capacity?: number;
  status?: "draft" | "published" | "full" | "completed" | string;
  url?: string;
  description?: string;
  created_at?: string | number;
};

export type EventsQuery = {
  search?: string;
  status?: "published" | "full" | "completed" | "all";
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};


export async function listEvents(q: EventsQuery = {}) {
  const params: any = {};
  if (q.search) params.search = q.search;
  if (q.status && q.status !== "all") params.status = q.status;
  if (q.from) params.from = q.from;
  if (q.to) params.to = q.to;
  params.page = q.page ?? 1;
  params.limit = q.limit ?? 12;

  const resp = await api.get("/events", { params });
  const d = resp.data;

  const arr: EventItem[] = Array.isArray(d) ? d : d?.items ?? d?.data ?? [];
  const total =
    (typeof d?.total === "number" ? d.total : undefined) ?? arr.length;

  return {
    items: arr,
    total,
    page: d?.page ?? params.page,
    limit: d?.limit ?? params.limit,
  };
}


export async function registerToEvent(id: string) {
  const { data } = await api.post(`/events/${id}/register`);
  return data as { ok: boolean; waitlisted?: boolean };
}
