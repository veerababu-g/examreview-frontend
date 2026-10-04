import axios from "axios";

// Same backend as the exam portal
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("review_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

export function saveLogin(token, profile) {
  localStorage.setItem("review_token", token);
  localStorage.setItem("review_profile", JSON.stringify(profile || {}));
}

export function logout() {
  localStorage.removeItem("review_token");
  localStorage.removeItem("review_profile");
}

export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem("review_profile") || "{}");
  } catch {
    return {};
  }
}

export function isLoggedIn() {
  return !!localStorage.getItem("review_token");
}
