import api from "../axios";

const studentAPI = {
  getStudents: async () => api.get(`api/home/students-getAll`),

  getOneItem: async (id) => api.get(`api/home/students/${id}`),
  createStudent: async (data) => {
    "data:", data;
    const token = localStorage.getItem("authToken");
    return api.post("/api/admin/save-student", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  editStudent: async (id, data, token) => {
    try {
      const response = await api.put(`/api/admin/edit-student?id=${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      "response", response;
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteStudent: async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Token not found");
    }
    return api.delete(`/api/admin/delete-student/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default studentAPI;
