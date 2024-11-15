import api from "../axios";

const courseAPI = {
  getCourses: async () => {
    const token = localStorage.getItem("authToken");
    return api.get("/api/home/courses-getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteCourse: async (id) => {
    const token = localStorage.getItem("authToken");
    return api.delete(`/api/admin/delete-course/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  editCourse: async (id, data, token) => {
    return api.put(`/api/admin/edit-course?id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  createCourse: async (data, token) => {
    return api.post("/api/admin/save-course", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default courseAPI;
