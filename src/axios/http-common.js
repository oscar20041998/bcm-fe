import axios from "axios";

export default axios.create({
    baseURL: " https://coffee-management-0498.herokuapp.com",
    headers: {
        "Content-type": "application/json",
    }
})