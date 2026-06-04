import { api } from "@/lib/api";

type ExportKind = "xlsx" | "pdf";

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const download = async (url: string, filename: string) => {
  const response = await api.get<Blob>(url, {
    responseType: "blob",
  });

  downloadBlob(response.data, filename);
};

const extensionFor = (kind: ExportKind) => kind;

export const exportService = {
  monthlyCollection: async (month: string, kind: ExportKind) => {
    const prefix = kind === "xlsx" ? "/exports" : "/pdf-exports";
    await download(
      `${prefix}/monthly-collection?month=${month}`,
      `monthly-collection-${month}.${extensionFor(kind)}`
    );
  },

  expenses: async (kind: ExportKind) => {
    const prefix = kind === "xlsx" ? "/exports" : "/pdf-exports";
    await download(`${prefix}/expenses`, `expenses.${extensionFor(kind)}`);
  },

  unpaidMembers: async (month: string, kind: ExportKind) => {
    const prefix = kind === "xlsx" ? "/exports" : "/pdf-exports";
    await download(
      `${prefix}/unpaid-members?month=${month}`,
      `unpaid-members-${month}.${extensionFor(kind)}`
    );
  },

  financialSummaryPdf: async () => {
    await download(
      "/pdf-exports/financial-summary",
      "club-financial-summary.pdf"
    );
  },
};
