import axios from "../axios";

const useAuth = {
  signIn: async function (data) {
    const response = await axios.post("/api/auth/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
};

export default useAuth;
