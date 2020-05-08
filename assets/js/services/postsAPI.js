import axios from 'axios';


function findAll(itemsPerPage, currentPage, searchResults) {
    return axios
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

function create(post) {
    console.log(post)
    try {
        uploadFile(post.image)
            .then(response => post['image'] = response.id)
            .then(data => {
                axios
                    .post(`http://localhost:8000/api/posts`, post)
            })


    } catch (error) {
        console.log(error)
    }
}

function update(post, id) {
    console.log(post)
    try {
        axios.put(`http://localhost:8000/api/posts/${id}`, post)
    } catch (error) {
        console.log(error)
    }
}

function uploadFile(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile[0]['file']);
    // console.log(imageFile[0]['file'])
    try {
        return axios
            .post(`http://localhost:8000/api/media_objects`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => response.data)
    } catch (error) {
        console.log(error)
    }
}

function deletePost(postId) {
    try {
        axios
            .delete(`http://localhost:8000/api/posts/${postId}`)
            .then(response => console.log(response.data))
    } catch (error) {
        console.log(error)
    }
}


function updatePostFeeling(feelings, id) {
    // console.log(feelings, id)
    try {
        axios.put(`http://localhost:8000/api/posts/${id}/feelings`, feelings)
    } catch (error) {
        console.log(error)
    }
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
