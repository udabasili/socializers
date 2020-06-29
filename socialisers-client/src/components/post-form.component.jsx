import React,{useState} from 'react'
import { addPost, editPost } from '../redux/post/post.actions'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

function PostForm({ showModalHandler, addPost, editMode, currentPost, editPost}) {
    const [post, setPost] = useState('')

    useEffect(() => {
        if(editMode){
            setPost(currentPost.text)
        }
    },[editMode])
    
    const changeTextHandler = (e) => {
        setPost(e.target.value)
    }
    const onSubmitHandler = (e) => {
        e.preventDefault()
        if(editMode){
            editPost(post, currentPost._id)
                .then(() => showModalHandler(false))

        } else{
            addPost(post)
                .then(() => showModalHandler(false))
        }
        
    }
    return (
        <form className='modal-form' onSubmit={onSubmitHandler}>
            <FontAwesomeIcon icon={faTimes} color='red' className='close-button' size='2x' onClick={() => showModalHandler(false)}/>
            <div class="row">
                <textarea
                    placeholder='Type in your post here '
                    value={post}
                        onChange={changeTextHandler} className='post-box__input' required />
                <input type="submit" value="Submit" className='post-box__button' disabled={!post.length > 0} />
            </div>
        </form>
    )
}




const mapDispatchToProps = {
    addPost,
    editPost
}

export default connect(null, mapDispatchToProps)(PostForm)