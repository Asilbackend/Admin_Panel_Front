import api from "../axios";

const useFaq = {
  getAllFaq: async () => {
    const token = localStorage.getItem("authToken");
    return api.get("/api/home/faq-getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  createFaq: async (data) => {
    const token = localStorage.getItem("authToken");
    return api.post("/api/admin/save-faq", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  editFaq: async (id, data) => {
    const token = localStorage.getItem("authToken");
    return api.put(`/api/admin/edit-faq?id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteFaq: async (id) => {
    const token = localStorage.getItem("authToken");
    return api.delete(`/api/admin/delete-faq/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default useFaq;
