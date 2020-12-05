import axios from "axios";

export default axios.create({
    baseURL: "http://bcm-api.com",
    headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "http://bcm-web-app.vtd777.prd.com",
        "Access-Control-Allow-Methods": "GET,POST, DELETE",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true"
    }
})