import api from "../axios";

const userAPI = {
  getAllUser: async () => {
    const token = localStorage.getItem("authToken");
    return api.get("/api/admin/geAllUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteUser: async (id) => {
    const token = localStorage.getItem("authToken");
    return api.delete(`/api/admin/delete-user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createUser: async (data) => {
    const token = localStorage.getItem("authToken");
    return api.post("/api/admin/register", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  changePassword: async (data) => {
    const token = localStorage.getItem("authToken");
    return api.put("/api/admin/change-password", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default userAPI;
