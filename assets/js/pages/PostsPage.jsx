import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import PostsAPI from "../services/postsAPI";
import HashtagsAPI from "../services/hashtagsAPI";


function PostsPage() {

    const [posts, setPosts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const itemsPerPage = 20;

    useEffect(() => {
        fetchPosts()
    }, [currentPage, searchResults]);

    const fetchPosts = async () => {
        try {
            const data = await PostsAPI.findAll(itemsPerPage, currentPage, searchResults)
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

    const handleSearchInputChanges = ({currentTarget}) => {
        setSearchTerm(currentTarget.value)
        setCurrentPage(1)
    };

    const resetInputField = () => {
        setSearchTerm('')
        setSearchResults([])
    }

    const callSearchFunction = (e) => {
        e.preventDefault();
        search(searchTerm);
        resetInputField();
    }
    useEffect(() => {
        searchTerm && search(searchTerm)
    }, [searchTerm])

    const search = async () => {
        if (searchTerm.length > 1) {
            try {
                const search = await HashtagsAPI.findAll()
                const results = search.filter(tag =>
                    tag.name.toLowerCase().includes(searchTerm.toLowerCase().trim(), 0)
                );
                setSearchResults(results);
            } catch (e) {
                console.log(e.response)
            }
        } else {
            setSearchResults([])
        }
    };

    return (<>
            <form className="search">
                <input type="text" onDragEnter={callSearchFunction} onChange={handleSearchInputChanges}
                       value={searchTerm} className="form-control" placeholder="Rechercher ..."
                />
            </form>
            <ul className="bg-light text-dark">
                {
                    (searchTerm.length > 1) &&
                    searchResults.map((item) => <li key={item.id}>{item.name} ({item.posts.length})</li>)
                }
            </ul>

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
