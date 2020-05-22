import React, {useEffect, useState} from 'react';

import HashtagsAPI from "../services/hashtagsAPI";

const AsideHashtags = ({setSearchResults}) => {
    const [hashtags, setHashtags] = useState([]);

    useEffect(() => {
        console.log(hashtags.length)
        fetchHashtags()
    }, [])

    const fetchHashtags = async () => {
        try {
            const data = await HashtagsAPI.findAllByTotalPost();
            setHashtags(data);
        } catch (error) {
            console.log(error.response)
        }
    }

    return (
        <div className="card text-white bg-primary mt-3">
            <div className="card-header">TOP 10 - HASHTAGS</div>
            <div className="card-body">
                {hashtags.slice(0, 10).map(tag => (<p key={tag.name}>
                        <a style={{cursor: "pointer"}} onClick={() => setSearchResults([tag])}>{tag.name} ({tag.totalPosts})</a>
                    </p>)
                )}
            </div>
        </div>
    );
};

export default React.memo(AsideHashtags);
