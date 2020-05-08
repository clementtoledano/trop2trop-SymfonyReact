import React, {useContext, useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import PostsAPI from "../services/postsAPI";
import InputSearch from "../components/InputSearch";
import HashtagsAPI from "../services/hashtagsAPI";
import AuthContext from "../contexts/AuthContext";


const PostsPage = () => {
    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext)

    const [posts, setPosts] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);

    const itemsPerPage = 5;
    const [buttonFeeling, setButtonFeeling] = useState(false);

    useEffect(() => {
        fetchHashtags()
        fetchPosts()
    }, [currentPage, searchResults]);

    useEffect(() => {
        fetchPosts()
    }, [currentPage]);

    useEffect(() => {
        fetchPosts()
        setButtonFeeling(false)
    }, [buttonFeeling])

    const fetchPosts = async () => {
        try {
            const {data} = await PostsAPI.findAll(itemsPerPage, currentPage, searchResults)
            setLoading(false);
            if (data['hydra:member'].length > 0) {
                setPosts(data['hydra:member']);
                setTotalItems(data['hydra:totalItems']);
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
    // const fetchFeelings = async () => {
    //     try {
    //         const biatch = await HashtagsAPI.findFeelingByUser(JSON.parse(localStorage.currentUser).id);
    //         console.log(biatch)
    //     } catch (error) {
    //         console.log(error.response)
    //     }
    // }


    const handlePageChange = page => {
        setCurrentPage(page);
        setLoading(true);
    };

    // const handleTopTags = (tag, event) => {
    //     console.log(tag, event)
    //     setSearchResults(tag)
    //     fetchPosts()
    // }

    const hashtagList = {
        cursor: "pointer"
    };

    // const imageView = ({target}) => {
    //     console.log(target.src)
    //
    // };

    const [thePost, setThePost] = useState([]);
    const [postKey, setPostKey] = useState(null);

    const handleImageModal = post => {
        (postKey === null) ? setPostKey(post.id) : setPostKey(null);
        setThePost(post);
    };

    const handleFeelingAngry = (post) => {
        setButtonFeeling(true)

        PostsAPI.updatePostFeeling({
            "angry": true,
            "bored": false,
            "silly": false,
            "scared": false
        }, post.id)
    };
    const handleFeelingBored = (post) => {
        setButtonFeeling(true)

        PostsAPI.updatePostFeeling({
            "angry": false,
            "bored": true,
            "silly": false,
            "scared": false
        }, post.id)
    };
    const handleFeelingSilly = (post) => {
        setButtonFeeling(true)

        PostsAPI.updatePostFeeling({
            "angry": false,
            "bored": false,
            "silly": true,
            "scared": false
        }, post.id)
    };
    const handleFeelingScary = (post) => {
        setButtonFeeling(true)

        PostsAPI.updatePostFeeling({
            "angry": false,
            "bored": false,
            "silly": false,
            "scared": true
        }, post.id)
    };


    return (<div className={"row"}>
        {(postKey === thePost.id) && (
            <div
                id="dialog"
                className="c-dialog"
                onClick={handleImageModal}>
                <img className="c-dialog__box" src={"http://localhost:8000/media/" + thePost.image.filePath}
                     onClick={handleImageModal} alt="no image"/>
            </div>
        )}
        <div className="col-8">
            {itemsPerPage < totalItems && (<Pagination
                currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} onPageChanged={handlePageChange}/>)
            }
            {loading &&
            (<h3>loading...</h3>)
            }
            {!loading && posts.map(post => <div key={post.id} className="card mb-3">
                <h3 className="card-header">{post.content}</h3>
                <div id="myImg" className="image-column">
                    <img style={{cursor: "pointer"}} onClick={handleImageModal.bind(this, post)}
                         className={"image-post"} src={"http://localhost:8000/media/" + post.image.filePath} alt="Card image"/>
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
            </div>)}
        </div>
        <aside className="col-4">
            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BAR DE RECHERCHE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}
            <InputSearch theSearchResults={setSearchResults} theCurrentPage={setCurrentPage}/>
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

                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>
        </aside>
    </div>);
}


export default React.memo(PostsPage);
