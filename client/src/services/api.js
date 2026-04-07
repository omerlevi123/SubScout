import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
});

export const getSubscriptions = (userId) =>
  api.get(`/subscriptions?user_id=${userId}`);

export const createSubscription = (data) => api.post("/subscriptions", data);

export const addRating = (id, rating) =>
  api.post(`/subscriptions/${id}/rating`, { rating });

export const deleteSubscription = (id) => api.delete(`/subscriptions/${id}`);
