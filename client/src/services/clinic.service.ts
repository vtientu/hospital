import mainRequest from "@/api/mainRequest";

export const getClinics = async () => {
  const response = await mainRequest.get("/clinics");
  return response.data;
};
