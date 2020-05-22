import React from 'react';
import {URL_MEDIA} from "../config";
import PostsAPI from "../services/postsAPI";


const Post = ({isAuthenticated, post, handleImageModal, setButtonFeeling, setSearchResults}) => {

    const handleFeelingAngry = async (post) => {
        setButtonFeeling(true)
        await PostsAPI.updatePostFeeling({
            "angry": true,
            "bored": false,
            "silly": false,
            "scared": false
        }, post.id)
    };
    const handleFeelingBored = async (post) => {
        setButtonFeeling(true)
        await PostsAPI.updatePostFeeling({
            "angry": false,
            "bored": true,
            "silly": false,
            "scared": false
        }, post.id)
    };
    const handleFeelingSilly = async (post) => {
        setButtonFeeling(true)
        await PostsAPI.updatePostFeeling({
            "angry": false,
            "bored": false,
            "silly": true,
            "scared": false
        }, post.id)
    };
    const handleFeelingScary = async (post) => {
        setButtonFeeling(true)
        await PostsAPI.updatePostFeeling({
            "angry": false,
            "bored": false,
            "silly": false,
            "scared": true
        }, post.id)
    };
    return (
        <div key={post.id} className="card mb-3">
            <h3 className="card-header">{post.content}</h3>
            <div id="myImg" className="image-column">
                <img style={{cursor: "pointer"}} onClick={handleImageModal.bind(this, post)}
                     className={"image-post"} src={URL_MEDIA + post.image.filePath} alt="Card image"/>
            </div>

            <div className="card-body">
                {post.hashtags.map(hashtag => <span style={{cursor: "pointer"}} key={hashtag.id} className="card-link">
                        <a onClick={() => setSearchResults([hashtag])}>#{hashtag.name}</a>
                    </span>)}
            </div>
            {isAuthenticated && (JSON.parse(localStorage.currentUser).id !== post.user.id) &&
            (<div className="card-body text-center">
                <button
                    name="angry"
                    className={"btn mr-2 " + ((post.userFeelingAngry.filter(post => post.id === JSON.parse(localStorage.currentUser).id).length === 0) && "btn-dark" || "btn-light")}
                    onClick={handleFeelingAngry.bind(this, post)}>
                    &#129324; {post.totalFeelingAngry}
                </button>
                <button
                    name="bored"
                    className={"btn mr-2 " + ((post.userFeelingBored.filter(post => post.id === JSON.parse(localStorage.currentUser).id).length === 0) && "btn-dark" || "btn-light")}
                    onClick={handleFeelingBored.bind(this, post)}>
                    &#128528; {(post.userFeelingBored).length}
                </button>
                <button
                    name="silly"
                    className={"btn mr-2 " + ((post.userFeelingSilly.filter(post => post.id === JSON.parse(localStorage.currentUser).id).length === 0) && "btn-dark" || "btn-light")}
                    onClick={handleFeelingSilly.bind(this, post)}>
                    &#129315; {(post.userFeelingSilly).length}
                </button>
                <button
                    name="scary"
                    className={"btn " + ((post.userFeelingScary.filter(post => post.id === JSON.parse(localStorage.currentUser).id).length === 0) && "btn-dark" || "btn-light")}
                    onClick={handleFeelingScary.bind(this, post)}>
                    &#129314; {(post.userFeelingScary).length}</button>
            </div>)
            || (<div className="card-body text-center">
                <span className="card-link">&#129324; {(post.userFeelingAngry).length}</span> |
                <span className="card-link">&#128528; {(post.userFeelingBored).length}</span> |
                <span className="card-link">&#129315; {(post.userFeelingSilly).length}</span> |
                <span className="card-link">&#129314; {(post.userFeelingScary).length}</span>
            </div>)}
            <div className="card-footer text-muted">
                Posté le {(new Date(post.createAt)).toLocaleDateString('fr-FR')} par {post.user.name}
            </div>
        </div>
    );
};

export default React.memo(Post);
