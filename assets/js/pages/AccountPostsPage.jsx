import React, {useEffect, useState} from 'react';
import PostsAPI from "../services/postsAPI";
import {toast} from "react-toastify";
import {NavLink} from "react-router-dom";
import {URL_MEDIA} from "../config";

const AccountPostsPage = () => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setPosts(await PostsAPI.findByUser());
        } catch (e) {
            console.log(e.response)
        }
    }

    const deletePost = async (postId) => {

        try {
            const newPosts = [...posts].filter(post => post.id !== postId);
            setPosts(newPosts)
            await PostsAPI.deletePost(postId)
            toast.success('🦄Post supprimé !');
        } catch (e) {
            console.log(e.response)
            toast.error('🦄Erreur pendant la suppression!');
        }
    }

    return (<>
            <h1>Ici on gere ses posts!</h1>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th scope="col">Date de création</th>
                    <th scope="col">image</th>
                    <th scope="col">Titre</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                {posts.map(post => <tr key={post.id}>
                    <td>{(new Date(post.createAt)).toLocaleDateString('fr-FR')}</td>
                    <td><img height={"50px"} src={URL_MEDIA + post.image.filePath} alt=""/></td>
                    <td>{post.content}</td>
                    <td><NavLink className={"btn btn-warning"} to={"/post-edit/" + post.id}>modifier</NavLink></td>
                    <td>
                        <button className={"btn btn-danger"} onClick={() => deletePost(post.id)}>supprimer</button>
                    </td>
                </tr>)}
                </tbody>
            </table>


        </>
    );
};

export default AccountPostsPage;
