import api from "../axios";

const teacherAPI = {
  getTeachers: async () => {
    const token = localStorage.getItem("authToken");
    return api.get(`api/home/teachers-getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getOneItem: async (id) => {
    const token = localStorage.getItem("authToken");
    return api.get(`api/home/teachers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  createTeacher: async (data) => {
    const token = localStorage.getItem("authToken");

    return api.post("/api/admin/save-teacher", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  editTeacher: async (id, data) => {
    const token = localStorage.getItem("authToken");
    "data:", data;
    return api.put(`/api/admin/edit-teacher?id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deleteTeacher: async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Token not found");
    }
    return api.delete(`/api/admin/delete-teacher/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default teacherAPI;
