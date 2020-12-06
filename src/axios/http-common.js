import axios from "axios";

export default axios.create({
    baseURL: "https://bcm-api-v1.herokuapp.com",
    headers: {
        "Content-type": "application/json"
    }
})