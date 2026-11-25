import api from "./api";

export const getCart = async (userId) => {
    const response = await api.get(`/carts?userId=${userId}`);
    return response.data;
};

export const createCart = async (cartData) => {
    const response = await api.post("/carts", cartData);
    return response.data;
};

export const updateCart = async (id, cartData) => {
    const response = await api.patch(`/carts/${id}`, cartData);
    return response.data;
};