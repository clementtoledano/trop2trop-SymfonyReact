import React, {useContext, useEffect, useRef, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {StickyContainer, Sticky} from 'react-sticky';
import {URL_MEDIA} from "../config";

import InputSearch from "../components/InputSearch";
import AuthContext from "../contexts/AuthContext";
import AsideHashtags from "../components/AsideHashtags";
import AsideTopPost from "../components/AsideTopPost";
import PostsAPI from "../services/postsAPI";

const PostsPage = () => {
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext)
    const isMounted = useRef(null);

    const [posts, setPosts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [buttonFeeling, setButtonFeeling] = useState(false);

    const [thePost, setThePost] = useState([]);
    const [postKey, setPostKey] = useState(null);


    useEffect(() => {
        // executed when component mounted
        isMounted.current = true;
        fetchPosts()
        return () => {
            // executed when unmount
            isMounted.current = false;
        }
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

    const hashtagList = {
        cursor: "pointer"
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
                            <AsideHashtags setSearchResults={setSearchResults} hashtagList={hashtagList}/>
                            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> TOP POST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}
                           <AsideTopPost/>
                        </aside>
                    )}
                </Sticky>
            </StickyContainer>
        </div>

    );
}


export default PostsPage;
