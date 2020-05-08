import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {toast} from "react-toastify";

/**
 * Requete d'authentification et stockage + token et header
 * @param {object} credentials
 * @returns {Promise<boolean>}
 */
function authenticate(credentials) {
    return axios
        .post(`http://localhost:8000/api/login_check`, credentials)
        .then(response => response.data.token)
        .then(token => {
            // on stocke le token dans le localStorage
            window.localStorage.setItem("authToken", token);
            const currentUser = jwtDecode(token)
            // console.log(currentUser)
            window.localStorage.setItem("currentUser", JSON.stringify({
                id: currentUser.id,
                isActive: currentUser.isActive,
                isAdmin: currentUser.isAdmin,
                name: currentUser.name,
                roles: currentUser.roles,
                username: currentUser.username
            }));

            // On prévient Axios qu'on a un header par default  sur toutes nos futures requêtes HTTP
            setAxiosToken(token);
            return true;
        });
}

/**
 * Suppression du token et du header
 */
function logout() {
    window.localStorage.removeItem('authToken');
    delete axios.defaults.headers['Authorization'];
    toast.info('🦄Vous êtes déconnecté');

}

/**
 * Positionne le token sur Axios
 * @param {string} token le token JWT
 */
function setAxiosToken(token) {
    axios.defaults.headers['Authorization'] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'app
 */
function setup() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {exp: expiration} = jwtDecode(token)
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

/**
 * Permet de savoir si on est authentifié
 * @returns {boolean}
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {exp: expiration} = jwtDecode(token)
        return expiration * 1000 > new Date().getTime();
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}
