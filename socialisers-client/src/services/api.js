import axios from "axios";

export function setTokenHeader(token) {
    if (token) {
        return axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
}

export const apiCall =  (type, path, data) => {
    return new Promise((resolve, reject) => {
        return axios[type](path, data)
            .then((response) => {                
                return resolve(response.data.message)
            })
            .catch(error => { 
                return reject(error.response.data)
            })
    })
}