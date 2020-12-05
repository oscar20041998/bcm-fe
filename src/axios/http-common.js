import axios from "axios";

export default axios.create({
    baseURL: "https://coffee-management-0498.herokuapp.com",
    headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "https://coffee-management-fe-0498.herokuapp.com",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true"
    }
})