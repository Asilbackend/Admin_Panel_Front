import api from "../axios";

const mailAPI = {
  sendEmail: async (data) => {
    // const token = localStorage.getItem("authToken");
    return api.get(`/api/home/send-code-email?email=${data}`);
  },
};

export default mailAPI;
