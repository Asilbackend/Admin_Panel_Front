import api from "../axios";

const useContactApi = {
  createContact: async (data) => {
    const token = localStorage.getItem("authToken");
    const response = await api.post("/api/admin/save-contactUs", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  getAllContact: async () => {
    const token = localStorage.getItem("authToken");
    const response = await api.get("/api/home/contactUs-byAnyLanguage", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  editContact: async (data, id) => {
    const token = localStorage.getItem("authToken");
    const response = await api.put(`/api/admin/edit-contactUs?id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default useContactApi;
