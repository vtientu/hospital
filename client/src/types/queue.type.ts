import type { IPatient } from "@/types/patient.type";

export interface IQueue {
  id: number;
  patient_id: number;
  clinic_id: number;
  record_id: number;
  status: string;
  priority: number;
  registered_online: boolean;
  qr_code: string;
  called_at: string;
  created_at: string;
  patient: IPatient;
}

export const getQueueStatus = (status: string) => {
  switch (status) {
    case "waiting":
      return "Chờ khám";
    case "in_progress":
      return "Đang khám";
    case "done":
      return "Đã khám";
    case "skipped":
      return "Bỏ qua";
    default:
      return "Không xác định";
  }
};
