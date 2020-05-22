import React, {useContext, useEffect, useRef, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {StickyContainer, Sticky} from 'react-sticky';
import {URL_MEDIA} from "../config";

import InputSearch from "../components/InputSearch";
import AuthContext from "../contexts/AuthContext";
import AsideHashtags from "../components/AsideHashtags";
import AsideTopPost from "../components/AsideTopPost";
import PostsAPI from "../services/postsAPI";
import Post from "../components/Post";

const PostsPage = () => {
    const {isAuthenticated} = useContext(AuthContext)
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

    return (
        <div className={"row"}>
            {(postKey === thePost.id) && (
                <div id="dialog" className="c-dialog" onClick={handleImageModal}>
                    <img className="c-dialog__box" src={URL_MEDIA + thePost.image.filePath}
                         onClick={handleImageModal} alt="no image"/>
                </div>
            )}
            <div className="col-8">
                <InfiniteScroll dataLength={posts.length} next={fetchPosts} hasMore={true} loader={<h4>Loading...</h4>}>
                    {posts.map(post =>
                        <Post key={post.id} post={post} handleImageModal={handleImageModal}
                              isAuthenticated={isAuthenticated} setButtonFeeling={setButtonFeeling}
                              setSearchResults={setSearchResults}/>)}
                </InfiniteScroll>
            </div>
            <StickyContainer className="col-4">
                <Sticky topOffset={-20}>
                    {({style, isSticky}) => (<aside style={{...style, marginTop: isSticky ? '20px' : '0px'}}>
                            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BAR DE RECHERCHE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}
                            <InputSearch theSearchResults={setSearchResults}/>
                            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> TOP 10 HASHTAG <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}
                            <AsideHashtags setSearchResults={setSearchResults}/>
                            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> TOP POST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}
                            <AsideTopPost/>
                        </aside>
                    )}
                </Sticky>
            </StickyContainer>
        </div>

    );
}


export default React.memo(PostsPage);
