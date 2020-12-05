import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.31.125:1510",
    headers: {
        "Content-type": "application/json"
    }
})