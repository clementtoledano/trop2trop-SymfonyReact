import axios from 'axios';
import {URL_MEDIA_OBJECTS, URL_POSTS, URL_USERS} from "../config";


async function findAll(itemsPerPage, currentPage, searchResults) {
    return await axios
        .get(URL_POSTS + `?pagination=true&count=${itemsPerPage}&page=${currentPage}&hashtags=${(searchResults[0] !== undefined) ? searchResults[0].id : ''}`)
}

function findByUser() {
    const userId = JSON.parse(localStorage.currentUser).id
    return axios
        .get(URL_USERS + `/${userId}/posts`)
        .then(response => response.data['hydra:member'])
}

function findById(postId) {
    return axios
        .get(URL_POSTS + `/${postId}`)
}

async function create(post) {
    await uploadFile(post.image)
        .then(response => post['image'] = response.id)
    await axios
        .post(URL_POSTS, post)
}

async function update(post, id) {
    await axios.put(URL_POSTS + `/${id}`, post)
}

async function uploadFile(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile[0]['file']);
    return await axios
        .post(URL_MEDIA_OBJECTS, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => response.data)
}

function deletePost(postId) {
    axios
        .delete(URL_POSTS + `/${postId}`)
        .then(response => console.log(response.data))
}


async function updatePostFeeling(feelings, id) {
    await axios.put(URL_POSTS + `/${id}/feelings`, feelings)
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
