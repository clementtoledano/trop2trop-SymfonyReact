import axios from 'axios';
import {URL_USERS} from "../config";

/**
 * Requete de création d'un user
 * @param {object} user
 */
function create(user) {
    return axios
        .post(URL_USERS, user)
        .then(response => console.log(response))
}

function findById(userId) {
    return axios
        .get(URL_USERS + `/${userId}`)
        .then(response => response.data)
}

function update(user, userId) {
    return axios.put(URL_USERS + `/${userId}`, user)
        .then(response => console.log(response))
}

function updatePassword(passwords, userId) {
    return axios
        .put(URL_USERS + `/${userId}/reset-password`, passwords)
        .then(response => console.log(response.data))
}

export default {
    create,
    findById,
    update,
    updatePassword
}
