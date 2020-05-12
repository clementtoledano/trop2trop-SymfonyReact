import axios from 'axios';

/**
 * Requete de création d'un user
 * @param {object} user
 */
function create(user) {
    return axios
        .post(`http://localhost:8000/api/users`, user)
        .then(response => console.log(response))
}


export default {
    create
}
