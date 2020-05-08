import React, {useEffect, useState} from 'react';

import PostsAPI from "../services/postsAPI"
import ImageUploading from "react-images-uploading";
import TagField from "../components/forms/TagField";
import {toast} from "react-toastify";

const PostEditPage = React.memo(({history, match}) => {

    const [post, setPost] = useState({
        hashtags: [],
        content: "",
        image: []
    });

    const {id = "new"} = match.params;
    const [editing, setEditing] = useState(false)
    const maxMbFileSize = 1;

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchPost(id)
        }
    }, [id]);

    const fetchPost = async id => {
        try {
            await PostsAPI.findById(id)
                .then(response => response.data)
                .then(data => {
                    setPost({...post, content: data.content, image: data.image, hashtags: (data.hashtags.map(hashtag => hashtag.name))})
                });
        } catch (e) {
            console.log(e.response)
        }
    }

    const [errors, setErrors] = useState({
        hashtag1: "",
        hashtag2: "",
        hashtag3: "",
        hashtag4: "",
        content: ""
    });

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setErrors({});
            if (editing) {
                await PostsAPI.update({
                    content: post.content,
                    hashtags: post.hashtags
                }, id)
                toast.success('🦄Post mis a jour !');
            } else {
                await PostsAPI.create(post)
                toast.success('🦄Post créé !');
                history.replace("/posts")
            }
        } catch (error) {
            toast.error("Erreur pendant la création")
        }
    }

    const onChange = imageList => {
        setPost({...post, image: imageList})
    };

    function handleChange({target}) {
        setPost({...post, content: target.value})
    }

    const addHashtag1Handler = hashtag => {
        const hashtags = post.hashtags.slice();
        if (hashtag.length > 1) {
            hashtags[0] = hashtag;
        } else {
            hashtags[0] = "";
        }
        setPost({...post, hashtags: hashtags})
    }
    const addHashtag2Handler = hashtag => {
        const hashtags = post.hashtags.slice();
        if (hashtag.length > 1) {
            hashtags[1] = hashtag;
        } else {
            hashtags[1] = "";
        }
        setPost({...post, hashtags: hashtags})
    }
    const addHashtag3Handler = hashtag => {
        const hashtags = post.hashtags.slice();
        if (hashtag.length > 1) {
            hashtags[2] = hashtag;
        } else {
            hashtags[2] = "";
        }
        setPost({...post, hashtags: hashtags})
    }
    const addHashtag4Handler = hashtag => {
        const hashtags = post.hashtags.slice();
        if (hashtag.length > 1) {
            hashtags[3] = hashtag;
        } else {
            hashtags[3] = "";
        }
        setPost({...post, hashtags: hashtags})
    }


    return (<div>
        {!editing && <h1>Nouveau TROP 2 TROP</h1> || <h1>Modification du TROP 2 TROP</h1>}
        <form onSubmit={handleSubmit}>
            <br/><br/>
            <div className="form-group">
                <button type="submit" className="btn btn-primary">{!editing && "Poster" || "Mettre à jour"}</button>
            </div>
            <p>4 tags max, pas d'espaces ni caractères spéciaux</p>
            <div className="row">
                <div className="col-3">
                    <TagField name="hashtag1" onAddHashtag={addHashtag1Handler}
                              tag={post.hashtags[0]}
                              placeholder="#hashtag 1" error={errors.hashtag1}/>
                </div>
                <div className="col-3">
                    <TagField name="hashtag2"
                              onAddHashtag={addHashtag2Handler}
                              tag={post.hashtags[1]}
                              placeholder="#hashtag 2" error={errors.hashtag2}/>
                </div>
                <div className="col-3">
                    <TagField name="hashtag3"
                              onAddHashtag={addHashtag3Handler}
                              tag={post.hashtags[2]}
                              placeholder="#hashtag 3" error={errors.hashtag2}/>
                </div>
                <div className="col-3">
                    <TagField name="theHashtag4"
                              onAddHashtag={addHashtag4Handler}
                              tag={post.hashtags[3]}
                              placeholder="#hashtag 4" error={errors.theHashtag2}/>
                </div>

            </div>

            <div className="form-group">
                <label htmlFor="content">content</label>
                <textarea name="content"
                          value={post.content}
                          onChange={handleChange}
                          placeholder="Votre trop de trop !"
                          className={"form-control" + (errors && " is-invalid")}
                />
                {errors && <p className={"invalid-feedback"}>{errors.content}</p>}
            </div>
            {!editing && <ImageUploading onChange={onChange}
                                         maxFileSize={maxMbFileSize}
                                         acceptType={["jpg", "gif", "png"]}
            >
                {({imageList, onImageUpload, onImageRemoveAll, errors}) => (
                    <div className="upload__image-wrapper">
                        <button type="button" className={"btn btn-dark"} onClick={onImageUpload}>Upload image</button>
                        &nbsp;
                        <button className={"btn btn-dark"} onClick={onImageRemoveAll}>Remove image</button>
                        {imageList.map(image => (
                            <div key={image.key} className="image-item">
                                <img src={image.dataURL} alt="" width="400"/>
                            </div>
                        ))}
                        <div>
                            {errors.maxNumber && <span>Number of selected images exceed maxNumber</span>}
                            {errors.acceptType && <span>Your selected file type is not allow</span>}
                            {errors.maxFileSize && <span>Selected file size exceed maxFileSize</span>}
                        </div>
                    </div>
                )}
            </ImageUploading> || <img src={"http://localhost:8000/media/" + post.image.filePath} alt=""/>}
        </form>
    </div>);
});

export default PostEditPage;
