import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import PostsAPI from "../services/postsAPI";


function PostsPage({theCurrentPage, theSearchResults=[]}) {

    const [posts, setPosts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const searchResult = theSearchResults
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 20;

    useEffect(() => {

        fetchPosts()
    }, [currentPage, theCurrentPage, theSearchResults]);

    const fetchPosts = async () => {
        try {
            const data = await PostsAPI.findAll(itemsPerPage, currentPage, searchResult)
            setLoading(false);
            setPosts(data.data['hydra:member']);
            setTotalItems(data.data['hydra:totalItems']);
        } catch (error) {
            console.log(error.response)
        }
    }


    const handlePageChange = page => {
        setCurrentPage(page);
        setLoading(true);
    };


    return (<>

            {itemsPerPage < totalItems && (<Pagination
                currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} onPageChanged={handlePageChange}/>)
            }
            {loading &&
            (<h3>loading...</h3>)
            }
            {!loading && posts.map(post => <div key={post.id} className="card mb-3">
                <h3 className="card-header">{post.content}</h3>
                <img height={"350px"} width={"100%"} src={post.image.url} alt="Card image"/>
                <div className="card-body">
                    {post.hashtags.map(hashtag => <span key={hashtag.id} className="card-link"><a href="#">#{hashtag.name}</a></span>)}
                </div>
                <div className="card-body text-center">
                    <span className="card-link">&#129324; {post.totalFeelingAngry}</span> |
                    <span className="card-link">&#128528; {post.totalFeelingBored}</span> |
                    <span className="card-link">&#129315; {post.totalFeelingSilly}</span> |
                    <span className="card-link">&#129314; {post.totalFeelingScary}</span>
                </div>
                <div className="card-footer text-muted">
                    Posté le {(new Date(post.createAt)).toLocaleDateString('fr-FR')} par {post.user.name}
                </div>
            </div>)}
        </>
    );
}


export default PostsPage;
