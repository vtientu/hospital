import { useQueueStore } from "@/store/queueStore";
import { useEffect, useState } from "react";
import { getClinics } from "@/services/clinic.service";
import { toast } from "react-toastify";
import useQueue from "@/hooks/useQueue";
import mainRequest from "@/api/mainRequest";

const QueueTable = () => {
  const { queues, pagination, totalElements, setPagination, totalPages } =
    useQueueStore();
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState("");
  const { fetchQueue } = useQueue();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [assignClinicId, setAssignClinicId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await getClinics();
        setClinics(res.metadata || []);
        if (res.metadata && res.metadata.length > 0) {
          setSelectedClinic(res.metadata[0].id.toString());
        }
      } catch (error: any) {
        console.log(error);
        toast.error(
          error?.response?.data?.message || "Lỗi khi lấy danh sách phòng khám"
        );
      }
    };
    fetchClinics();
  }, []);

  useEffect(() => {
    if (selectedClinic) {
      fetchQueue(selectedClinic);
    }
  }, [selectedClinic, fetchQueue]);

  useEffect(() => {
    const tableEl = document.getElementById("table-container");
    const heightWindow = window.innerHeight;
    const paginationHeight = document
      .getElementById("pagination")
      ?.getBoundingClientRect().height;
    const tableTop = tableEl?.getBoundingClientRect().top;
    if (tableEl && paginationHeight && tableTop) {
      tableEl.style.height = `${
        heightWindow - tableTop - paginationHeight - 2
      }px`;
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Dropdown chọn phòng khám */}
      <div className="flex items-center gap-2 mb-2">
        <label htmlFor="clinic-select" className="font-semibold">
          Phòng khám:
        </label>
        <select
          id="clinic-select"
          value={selectedClinic}
          onChange={(e) => setSelectedClinic(e.target.value)}
          className="border border-gray-300 rounded-md p-2 min-w-[200px]"
        >
          <option value="">Chọn phòng khám</option>
          {clinics.map((clinic: any) => (
            <option key={clinic.id} value={clinic.id}>
              {clinic.name}
            </option>
          ))}
        </select>
      </div>
      {/* Search */}
      <div className="flex flex-col flex-1 mx-2 border border-gray-300 h-full overflow-visible">
        <div id="table-container" className="overflow-auto">
          <table id="table" className="w-full table-auto border-separate z-10">
            <thead className="bg-gray-100 sticky top-0 z-20">
              <tr>
                <th className="border border-gray-300 p-2">STT</th>
                <th className="border border-gray-300 p-2">Bệnh nhân</th>
                <th className="border border-gray-300 p-2">Trạng thái</th>
                <th className="border border-gray-300 p-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {queues.map((queue, index) => (
                <tr key={queue.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 text-center p-2">
                    {index +
                      1 +
                      (pagination?.pageNumber - 1) * pagination?.pageSize}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {queue.patient_name}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {queue.status}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <div className="relative dropdown-container flex items-center justify-center gap-2">
                      <button
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                        onClick={() => {
                          setSelectedPatient(queue);
                          setShowAssignModal(true);
                        }}
                      >
                        Chỉ định khám thêm
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div
          id="pagination"
          className="flex justify-between items-center gap-2 p-2 bg-white border-t border-gray-300"
        >
          <p className="text-sm text-gray-500">
            Hiển thị {(pagination?.pageNumber - 1) * pagination?.pageSize + 1}{" "}
            đến {pagination?.pageNumber * pagination?.pageSize} trên{" "}
            {totalElements} kết quả
          </p>
          <div className="flex items-center gap-2">
            <button
              className="border border-gray-300 bg-white px-2 py-1 rounded-md hover:bg-gray-100"
              onClick={() =>
                setPagination({
                  ...pagination,
                  pageNumber: pagination.pageNumber - 1,
                })
              }
              disabled={pagination.pageNumber === 1}
            >
              Trước
            </button>
            <button
              className="border border-gray-300 bg-white px-2 py-1 rounded-md hover:bg-gray-100"
              onClick={() =>
                setPagination({
                  ...pagination,
                  pageNumber: pagination.pageNumber + 1,
                })
              }
              disabled={pagination.pageNumber === totalPages}
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
      {/* Modal chỉ định khám thêm */}
      {showAssignModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 min-w-[320px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Chỉ định khám thêm cho bệnh nhân
            </h2>
            <div className="mb-4">
              <div className="mb-2">
                Bệnh nhân: <b>{selectedPatient.patient_name}</b>
              </div>
              <label htmlFor="assign-clinic" className="block mb-1">
                Chọn phòng khám:
              </label>
              <select
                id="assign-clinic"
                value={assignClinicId}
                onChange={(e) => setAssignClinicId(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">-- Chọn phòng --</option>
                {clinics
                  .filter((c: any) => c.id !== selectedClinic)
                  .map((clinic: any) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setShowAssignModal(false);
                  setAssignClinicId("");
                  setSelectedPatient(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                disabled={!assignClinicId || assignLoading}
                onClick={async () => {
                  setAssignLoading(true);
                  try {
                    await mainRequest.post("/queues/queue-clinic/assign", {
                      patient_id: selectedPatient.patient_id,
                      to_clinic_id: Number(assignClinicId),
                      record_id: selectedPatient.record_id,
                      priority: 0,
                    });
                    alert("Chỉ định thành công!");
                    setShowAssignModal(false);
                    setAssignClinicId("");
                    setSelectedPatient(null);
                  } catch (err: any) {
                    alert(err?.response?.data?.message || "Có lỗi xảy ra!");
                  } finally {
                    setAssignLoading(false);
                  }
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueTable;
