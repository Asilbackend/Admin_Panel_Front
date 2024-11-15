import api from "../axios";

const materialAPI = {
  getMaterials: () => api.get("/api/home/resources"),
  createMaterial: (data) => {
    const token = localStorage.getItem("authToken");
    "m-data", data;
    return api.post("/api/admin/save-resource", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteMaterial: (id) => {
    const token = localStorage.getItem("authToken");
    return api.delete(`/api/admin/delete-resource/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default materialAPI;
