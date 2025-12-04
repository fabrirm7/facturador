import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api", // tu backend corre en el puerto 5000
});