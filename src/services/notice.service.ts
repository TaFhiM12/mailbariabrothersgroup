import { api } from "@/lib/api";
import type {
  CreateNoticeInput,
  NoticeResponse,
  NoticesResponse,
  UpdateNoticeInput,
} from "@/types/notice";

export const noticeService = {
  create: async (payload: CreateNoticeInput) => {
    const response = await api.post<NoticeResponse>("/notices", payload);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<NoticesResponse>("/notices");
    return response.data;
  },

  update: async (id: string, payload: UpdateNoticeInput) => {
    const response = await api.patch<NoticeResponse>(
      `/notices/${id}`,
      payload
    );

    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/notices/${id}`);
    return response.data;
  },
};