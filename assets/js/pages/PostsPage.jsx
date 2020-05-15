import React, {useContext, useEffect, useState} from 'react';
import PostsAPI from "../services/postsAPI";
import InputSearch from "../components/InputSearch";
import HashtagsAPI from "../services/hashtagsAPI";
import AuthContext from "../contexts/AuthContext";
import {URL_MEDIA} from "../config";
import InfiniteScroll from 'react-infinite-scroll-component';
import {StickyContainer, Sticky} from 'react-sticky';

const PostsPage = () => {
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext)

    const [posts, setPosts] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [buttonFeeling, setButtonFeeling] = useState(false);

    useEffect(() => {
        fetchHashtags()
        fetchPosts()
    }, [])

    useEffect(() => {
        if (searchResults.length > 0) {
            fetchPosts()
        }
    }, [searchResults]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPosts()
            setButtonFeeling(false)
        }
    }, [buttonFeeling])

    const fetchPosts = async () => {
        setItemsPerPage(+itemsPerPage + 5)
        try {
            const {data} = await PostsAPI.findAll(itemsPerPage, searchResults)
            if (data['hydra:member'].length > 0) {
                setPosts(data['hydra:member']);
            }
        } catch (error) {
            console.log(error.response)
        }
    }

    const fetchHashtags = async () => {
        try {
            const data = await HashtagsAPI.findAllByTotalPost();
            setHashtags(data);
        } catch (error) {
            console.log(error.response)
        }
    }

    const hashtagList = {
        cursor: "pointer"
    };

    const [thePost, setThePost] = useState([]);
    const [postKey, setPostKey] = useState(null);

    const handleImageModal = post => {
        (postKey === null) ? setPostKey(post.id) : setPostKey(null);
        setThePost(post);
    };

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
        <div className={"row"}>

            {(postKey === thePost.id) && (
                <div
                    id="dialog"
                    className="c-dialog"
                    onClick={handleImageModal}>
                    <img className="c-dialog__box" src={URL_MEDIA + thePost.image.filePath}
                         onClick={handleImageModal} alt="no image"/>
                </div>
            )}
            <div className="col-8">

                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchPosts}
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                >
                    {posts.map(post => <div key={post.id} className="card mb-3">
                        <h3 className="card-header">{post.content}</h3>
                        <div id="myImg" className="image-column">
                            <img style={{cursor: "pointer"}} onClick={handleImageModal.bind(this, post)}
                                 className={"image-post"} src={URL_MEDIA + post.image.filePath} alt="Card image"/>
                        </div>

                        <div className="card-body">
                            {post.hashtags.map(hashtag => <span style={hashtagList} key={hashtag.id} className="card-link">
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
                    </div>)
                    }
                </InfiniteScroll>
            </div>
            <StickyContainer className="col-4">
                <Sticky
                    topOffset={-20}
                >
                    {({style, isSticky}) => (<aside style={{...style, marginTop: isSticky ? '20px' : '0px'}}>

                            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BAR DE RECHERCHE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}
                            <InputSearch theSearchResults={setSearchResults}/>
                            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> TOP 10 HASHTAG <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}
                            <div className="card text-white bg-primary mt-3">
                                <div className="card-header">TOP 10 - HASHTAGS</div>
                                <div className="card-body">
                                    {hashtags.slice(0, 10).map(tag => (<p key={tag.name}>
                                            <a style={hashtagList} onClick={() => setSearchResults([tag])}>{tag.name} ({tag.totalPosts})</a>
                                        </p>)
                                    )}
                                </div>
                            </div>
                            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> TOP POST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}
                            <div className="card text-white bg-primary mt-3">
                                <div className="card-header">TOP - TROP DE TROP</div>
                                <div className="card-body">
                                    <a href="#">les plus trop de trop</a>
                                    <br/>
                                    <a href="#">les moins trop de trop</a>
                                    <br/>
                                    <a href="#">les plus fou</a>
                                    <br/>
                                    <a href="#">les plus flippant</a>
                                </div>
                            </div>
                        </aside>
                    )}
                </Sticky>
            </StickyContainer>
        </div>

    );
}


export default PostsPage;
