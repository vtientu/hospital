import mainRequest from "@/api/mainRequest";

export const getQueueClinic = async (clinicId: string) => {
  const response = await mainRequest.get(`/queues/${clinicId}`);
  return response.data;
};
