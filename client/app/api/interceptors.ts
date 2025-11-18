import axios from "axios";

const HttpService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default HttpService;
