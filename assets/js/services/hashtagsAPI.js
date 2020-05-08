import axios from 'axios';


function findAll() {
    return axios
        .get(`http://localhost:8000/api/hashtags`)
        .then(response => response.data['hydra:member'])
        .then(data => data.filter(tag => tag.totalPosts > 0 && tag.name.length >1))
}

function findAllByTotalPost() {
    return axios
        .get(`http://localhost:8000/api/hashtags`)
        .then(response => response.data['hydra:member'])
        .then(data => data.filter(tag => tag.totalPosts > 0 && tag.name.length > 1))
        .then(data => data.sort((a, b) => b.totalPosts - a.totalPosts))
}

function findFeelingByUser(userId) {
    return axios
        .get(`http://localhost:8000/api/feelings/${userId}`)
        .then(response => response.data)
}


export default {
    findAll,
    findAllByTotalPost,
    findFeelingByUser
}
