import api from "../axios";

const newsAPI = {
  getNewsAll: async () => {
    const token = localStorage.getItem("authToken");
    return api.get("/api/home/news-getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteNews: async (id) => {
    const token = localStorage.getItem("authToken");
    return api.delete(`/api/admin/delete-news/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  editNews: async (id, data) => {
    const token = localStorage.getItem("authToken");
    return api.put(`/api/admin/edit-news?id=${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  createNews: async (data) => {
    const token = localStorage.getItem("authToken");
    return api.post("/api/admin/save-news", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default newsAPI;
