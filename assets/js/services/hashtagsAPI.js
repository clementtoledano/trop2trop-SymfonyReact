import axios from 'axios';
import {URL_FEELINGS, URL_HASHTAGS} from "../config";


function findAll() {
    return axios
        .get(URL_HASHTAGS)
        .then(response => response.data['hydra:member'])
        .then(data => data.filter(tag => tag.totalPosts > 0 && tag.name.length > 1))
}

function findByName(name) {
    return axios
        .get(URL_HASHTAGS + "/" + name + "/findbyname")
        .then(response => response.data.id)
}

function findAllByTotalPost() {
    return axios
        .get(URL_HASHTAGS)
        .then(response => response.data['hydra:member'])
        .then(data => data.filter(tag => tag.totalPosts > 0 && tag.name.length > 1))
        .then(data => data.sort((a, b) => b.totalPosts - a.totalPosts))
}

function findFeelingByUser(userId) {
    return axios
        .get(URL_FEELINGS + `/${userId}`)
        .then(response => response.data)
}


export default {
    findAll,
    findByName,
    findAllByTotalPost,
    findFeelingByUser
}
