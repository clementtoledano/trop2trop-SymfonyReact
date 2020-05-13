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


export default {
    create
}
