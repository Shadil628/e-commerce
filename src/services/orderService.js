import api from "./api";

// Create a new order
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// Get orders of a user
export const getUserOrders = async (userId) => {
  const response = await api.get(`/orders?userId=${userId}`);
  return response.data;
};