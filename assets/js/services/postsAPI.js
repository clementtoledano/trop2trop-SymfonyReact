import axios from 'axios';


async function findAll(itemsPerPage, currentPage, searchResults) {
    return await axios
        .get(`http://localhost:8000/api/posts?pagination=true&count=${itemsPerPage}&page=${currentPage}&hashtags=${(searchResults[0] !== undefined) ? searchResults[0].id : ''}`)
}

function findByUser() {
    const userId = JSON.parse(localStorage.currentUser).id
    return axios
        .get(`http://localhost:8000/api/users/${userId}/posts`)
        .then(response => response.data['hydra:member'])
}

function findById(postId) {
    return axios
        .get(`http://localhost:8000/api/posts/${postId}`)
}

async function create(post) {
    await uploadFile(post.image)
        .then(response => post['image'] = response.id)
    await axios
        .post(`http://localhost:8000/api/posts`, post)
}

async function update(post, id) {
    await axios.put(`http://localhost:8000/api/posts/${id}`, post)
}

async function uploadFile(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile[0]['file']);
     return await axios
        .post(`http://localhost:8000/api/media_objects`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => response.data)
}

function deletePost(postId) {
    axios
        .delete(`http://localhost:8000/api/posts/${postId}`)
        .then(response => console.log(response.data))
}


async function updatePostFeeling(feelings, id) {
    await axios.put(`http://localhost:8000/api/posts/${id}/feelings`, feelings)
}

export default {
    findAll,
    findByUser,
    create,
    update,
    deletePost,
    findById,
    updatePostFeeling

}
