import axios from "./axios";

export const registerUser = async (data) => {
  try {
    const response = await axios.post("/api/auth/register", data);
    return response.data;
  } catch (error) {
    // Re-throw backend error so UI can handle it
    throw error;
  }
};

export const loginUser = async (data) => {
  const response = await axios.post("/api/auth/login", data);
  return response.data;   // ✅ returns DATA, not full response
};

