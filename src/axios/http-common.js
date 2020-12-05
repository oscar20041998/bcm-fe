import axios from "axios";

export default axios.create({
    baseURL: "https://coffee-management-api.herokuapp.com",
    headers: {
        "Content-type": "application/json"
    }
})