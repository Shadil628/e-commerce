
import api from "./api";

// Get all users
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

// Save or update user's address
export const saveUserAddress = async (userId, address) => {
  const response = await api.patch(`/users/${userId}`, {
    address: address,
  });

  return response.data;
};
