import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

export const getProtected = () =>
  API.get("/protected", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });