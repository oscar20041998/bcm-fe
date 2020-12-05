import axios from "axios";

export default axios.create({
    baseURL: "https://bcm-api.com",
    headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "http://bcm-app.com",
        "Access-Control-Allow-Methods": "GET,POST, DELETE",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true"
    }
})