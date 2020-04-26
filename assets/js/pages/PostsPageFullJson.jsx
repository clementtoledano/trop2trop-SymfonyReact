import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Pagination from "../components/Pagination";


function PostsPageFullJson() {

    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get('http://localhost:8000/api/posts')
            .then(response => response.data['hydra:member'])
            .then(data => setPosts(data))
            .catch(error => console.log(error.response))
    }, [])

    const handlePageChange = page => {
        setCurrentPage(page)
    };

    const itemsPerPage = 10;
    const paginatedPosts = Pagination.getData(posts, currentPage, itemsPerPage);

    console.log(posts.length)

    return (<>
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={posts.length} onPageChanged={handlePageChange}/>
            {paginatedPosts.map(post => <div key={post.id} className="card mb-3 col-6">
                <h3 className="card-header">{post.content}</h3>
                {/*<img height={"350px"} width={"100%"} src={post.image.url} alt="Card image"/>*/}
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


export default PostsPageFullJson;
