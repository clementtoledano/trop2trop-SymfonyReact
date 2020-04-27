import axios from 'axios';


function findAll(itemsPerPage, currentPage, searchResults) {
    return axios
        .get(`http://localhost:8000/api/posts?pagination=true&count=${itemsPerPage}&page=${currentPage}&hashtags=${(searchResults[0] !== undefined) ? searchResults[0].id : ''}`)
}

export default {
    findAll
}
