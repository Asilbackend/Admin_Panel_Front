import api from "../axios";

const potentialClAPI = {
  getPotentialCl: async () => {
    const token = localStorage.getItem("authToken");
    return api.get(`api/admin/potential-clients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  deletePotentialCl: async (id) => {
    const token = localStorage.getItem("authToken");
    return api.delete(`/api/admin/delete-potential-clients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default potentialClAPI;
