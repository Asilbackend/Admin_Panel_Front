import api from "../axios";

const attachmentsAPI = {
  saveAttachment: async (data) => {
    const token = localStorage.getItem("authToken");
    data;
    return api.post("/api/admin/save-file", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAttachmentbyId: async (id) => {
    const token = localStorage.getItem("authToken");
    return api.get(`/api/home/attachment/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteAttachment: async (id) => {
    const token = localStorage.getItem("authToken");
    return api.delete(`/api/admin/attach-deleteByAttachmentId/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default attachmentsAPI;
