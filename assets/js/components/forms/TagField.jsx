import React, {useEffect, useState} from "react";
import HashtagsAPI from "../../services/hashtagsAPI";


const TagField = ({name, tag, onAddHashtag, placeholder, error = ""}) => {
    const [hashtagSearchTerm, setHashtagSearchTerm] = useState("");
    const [hashtagSearchResults, setHashtagSearchResults] = useState([]);
    const [closed, setClosed] = useState(true);

    useEffect(() => {
        tag && setHashtagSearchTerm(tag)
    }, [tag]);

    useEffect(() => {
        if (hashtagSearchTerm.length > 1) hashtagSearchTerm && search(hashtagSearchTerm)
    }, [hashtagSearchTerm]);

    const sendTag = (tag) => {
        onAddHashtag(tag)
    }

    const handleSearchInputChanges = ({target}) => {
        setHashtagSearchTerm(target.value)
        sendTag(target.value)
        setClosed(false)
    };

    const handleKeyEnterPress = event => {
        const {key, value} = event.target
        if (key === 'Enter') {
            setHashtagSearchTerm(hashtagSearchResults[0] && hashtagSearchResults[0].name || value)
            sendTag(value)
            setClosed(true)
        }
    }

    const persistAndClosed = value => {
        setHashtagSearchTerm(value.name)
        sendTag(value.name)
        setClosed(true)
    }

    const handleTouch = () => {
        setTimeout(() => {
            setClosed(true)
        }, 500);
    }

    const search = async () => {
        try {
            const search = await HashtagsAPI.findAll()
            const results = search.filter(tag =>
                tag.name.toLowerCase().includes(hashtagSearchTerm.toLowerCase().trim(), 0)
            );
            setHashtagSearchResults(results);
        } catch (e) {
            console.log(e.response)
        }
    };

    return (
        <div className="form-group">
            <div className="autocomplete">
                <div className={"autocomplete-items " + (closed && "d-none")}>
                    {(hashtagSearchTerm.length > 1) &&
                    hashtagSearchResults.map(tag =>
                        (tag.posts.length > 2) &&
                        (<div key={tag.id} onClick={() => persistAndClosed(tag)}>{tag.name} ({tag.posts.length})</div>))
                    }
                </div>
                <input name={name}
                       autoComplete="off"
                       type="text"
                       value={hashtagSearchTerm}
                       onKeyPress={handleKeyEnterPress}
                       onChange={handleSearchInputChanges}
                       placeholder={placeholder}
                       className={"form-control" + (error && " is-invalid")}
                       onBlur={handleTouch}
                />
            </div>
            {error && <p className={"invalid-feedback"}>{error.hashtag}</p>}
        </div>
    );
};
export default TagField;
