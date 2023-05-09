import axios from "axios";

export const ktsRequest = axios.create({
  baseURL: "https://api.ktscorp.vn/api",
  // baseURL: "http://localhost:5000/api",
});

export const ktsSocket = "";
