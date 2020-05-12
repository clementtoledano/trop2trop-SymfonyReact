import React, {useEffect, useState} from "react";
import HashtagsAPI from "../../services/hashtagsAPI";


const TagField = React.memo(({name, tag, onAddHashtag, placeholder, error = ""}) => {
    const [hashtagSearchTerm, setHashtagSearchTerm] = useState("");
    const [hashtagSearchResults, setHashtagSearchResults] = useState([]);
    const [closed, setClosed] = useState(true);

    useEffect(() => {
        tag && setHashtagSearchTerm(tag)
    }, [tag]);

    useEffect(() => {
        hashtagSearchTerm && search(hashtagSearchTerm)
    }, [hashtagSearchTerm]);

    const sendTag = (tag) => {
       onAddHashtag(tag)
    }

    const handleSearchInputChanges = ({target}) => {
        // console.log(target.value.length)
        setHashtagSearchTerm(target.value)
       // if (target.value.length < 2) {
       //     // setHashtagSearchTerm("")
       //     sendTag("")
       // }else{
           sendTag(target.value)
       // }
        setClosed(false)

    };

    const callSearchFunction = ({target}) => {
        if (target.key === 'Enter') {
            target.preventDefault();
            setHashtagSearchTerm(target.value)
            sendTag(target.value)

            // theHashtag(value);
            setClosed(true)
        }
    }

    function persistAndClosed(value) {
        setHashtagSearchTerm(value.name)
        sendTag(value.name)

        // theHashtag(value.name);
        setClosed(true)

    }
    const handleTouch = () => {
        setClosed(true)
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
                <input name={name}
                       onBlur={handleTouch}
                       type="text"
                       value={hashtagSearchTerm}
                       onKeyPress={callSearchFunction}
                       onChange={handleSearchInputChanges}
                       placeholder={placeholder}
                       className={"form-control" + (error && " is-invalid")}
                />
                <div className={"autocomplete-items " + (closed && "d-none")}>
                    {(hashtagSearchTerm.length > 1) &&
                    hashtagSearchResults.map((tag) =>
                        (tag.posts.length > 0) &&
                        (<div key={tag.id} onClick={persistAndClosed.bind(this, tag)}>{tag.name} ({tag.posts.length})</div>)
                    )
                    }
                </div>
            </div>
            {error && <p className={"invalid-feedback"}>{error.hashtag}</p>}
        </div>
    );
});
export default TagField;
