import axios from 'axios';
import {URL_HASHTAGS, URL_MEDIA_OBJECTS, URL_POSTS, URL_USERS} from "../config";
import HashtagsAPI from "./hashtagsAPI";


async function findAll(itemsPerPage, searchResults) {
    return await axios
        // .get(URL_POSTS + `?pagination=true&count=${itemsPerPage}&page=${currentPage}&hashtags=${(searchResults[0] !== undefined) ? searchResults[0].id : ''}`)
        .get(URL_POSTS + `?pagination=true&count=${itemsPerPage}&hashtags=${(searchResults[0] !== undefined) ? searchResults[0].id : ''}`)
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


const create = async post => {
    try {
        post["hashtags"] = await hashtags(post.hashtags)
        await uploadFile(post.image)
            .then(response => post['image'] = "/api/media_objects/" + response.id)
        await axios
            .post(URL_POSTS, post)
    } catch (e) {
        console.log(e)
    }
}

const hashtags = hashtags =>
    Promise.all(hashtags.map(async theHashtag =>
            await HashtagsAPI.findByName(theHashtag)
                .then(id => {
                        if (id === null) {
                            return axios
                                .post(URL_HASHTAGS, {
                                    "name": theHashtag
                                })
                                .then(res => "/api/hashtags/" + res.data.id)
                        } else {
                            return "/api/hashtags/" + id
                        }
                    }
                )
        )
    )


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

function update(post, id) {
    axios.put(URL_POSTS + `/${id}`, post).then(r => r)
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
