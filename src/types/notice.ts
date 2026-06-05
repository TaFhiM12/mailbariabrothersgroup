export type Notice = {
  id: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoticeInput = {
  title: string;
  body: string;
  imageUrl?: string;
};

export type UpdateNoticeInput = {
  title?: string;
  body?: string;
  imageUrl?: string;
};

export type NoticeResponse = {
  success: boolean;
  message: string;
  data: Notice;
};

export type NoticesResponse = {
  success: boolean;
  message: string;
  data: Notice[];
};
