import axios from "axios";

export default axios.create({
    baseURL: "https://coffee-management-api.herokuapp.com",
    headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "https://coffee-management-fe-0498.herokuapp.com",
        "Access-Control-Allow-Methods": "GET,POST, DELETE",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true"
    }
})