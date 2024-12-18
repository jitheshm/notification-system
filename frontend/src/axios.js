import axios from "axios";

const APIURL = import.meta.env.VITE_APIURL;

export const axiosInstance = axios.create({
    baseURL: `${APIURL}/api`,
    withCredentials: true,
});
