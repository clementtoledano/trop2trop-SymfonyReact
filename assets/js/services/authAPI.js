import axios from 'axios';
import jwtDecode from 'jwt-decode';

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
            // On prévient Axios qu'on a un header par default  sur toutes nos futures requetes HTTP
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
