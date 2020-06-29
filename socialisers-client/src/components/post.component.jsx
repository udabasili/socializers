import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faCheck } from '@fortawesome/free-solid-svg-icons';
import { addCommentToPost, addLikeToPost, deletePost } from '../redux/post/post.actions';
import { connect } from 'react-redux'
import noImage from '../assets/images/no-image.png'


function Post({post, currentUser, addCommentToPost, addLikeToPost, editPostHandler, deletePost }) {

	const user = post.user
	const [comment, setComment] = useState('')
	const [likeList, setLikeList] = useState(post.likes)
	const [commentList, setCommentList] = useState(post.comments)
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

    useEffect(() =>{
      setCommentList(post.comments)
      setLikeList(post.likes)
    }, [post.comments, post.likeList])

  	const handleWindowSizeChange = () => {

		if (window.innerWidth <= 600) {
		setIsMobile(true)
		}
		else {
		setIsMobile(false)
		}

  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);

    }
  }, [isMobile])

  const setUserComment = (e) =>{
    const value = e.target.value
    setComment(value)
  }


	const addLike = () => {
		const likedBy = currentUser.username
		addLikeToPost(likedBy, post._id)
	}


	const addComment = (event) =>{
		if (event.charCode === 13) {
		const commentContent = {
			authorName: currentUser.username,
			authorImage: currentUser.userImages[0],
			comment,
			createdOn: Date.now()
      }
		addCommentToPost(commentContent, post._id)
			.then((response) => {
			setCommentList(response)
			setComment('')
			})
  
    }
  }
    return (
      <div className="post">
        <div className="post__user">
          <div className="user-icon">
            <div className="user-icon__photo-border">
              <img
                src={user.userImages[0] ? user.userImages[0] : noImage}
                alt="your profile"
                className="user-icon__photo"
              />
            </div>
          </div>
          <div className="post__user-username">
            <span className="name">{user.name}</span>
            <span className="username">{`@${user.username}`}</span>
          </div>
        </div>
        <hr />
        <div className="post__message">{post.text}</div>
        <div className="post__options">
          <div className="post__status">
            <div className="likes">{likeList.length} like</div>
            <div className="comments">{commentList.length} Comments</div>
          </div>
          {currentUser.username === user.username && (
            <div className="post__edit">
              <div className="edit" onClick={() => editPostHandler(post)}>
                Edit
              </div>
              <div className="delete" onClick={() => deletePost(post._id)}>
                Delete
              </div>
            </div>
          )}
        </div>
        <hr />
        <div className="response">
          {!likeList.includes(currentUser.username) ? (
            <div
              className="response__item"
              style={{ color: "red", cursor: "pointer" }}
              onClick={addLike}
            >
              <FontAwesomeIcon className="response__icon" icon={faThumbsUp} />
              <p className="response__label">Like</p>
            </div>
          ) : (
            <div className="response__item" style={{ color: "black" }}>
              <FontAwesomeIcon className="response__icon" icon={faCheck} />
              <p className="response__label">Liked</p>
            </div>
          )}

          <div className="response__item">
            <FontAwesomeIcon className="response__icon" icon={faComment} />
            <p className="response__label">Comment</p>
          </div>
        </div>
        <hr />
        <div className="comment">
          <div className="comment__input-container">
            {!isMobile && (
              <div className="user-icon">
                <div className="user-icon__photo-border">
                  <img
                    src={user.userImages[0] ? user.userImages[0] : noImage}
                    alt="your profile"
                    className="user-icon__photo"
                  />
                </div>
              </div>
            )}
            <input
              className="comment__input"
              type="text"
              value={comment}
              onChange={setUserComment}
              placeholder="Type comment and press Enter"
              onKeyPress={addComment}
            />
          </div>
          {commentList.length > 0 && (
            <ul className="comment__list">
              {commentList.map((comment, index) => (
                <li key={index} className="comment__item">
                  {!isMobile && (
                    <div className="user-icon">
                      <div className="user-icon__photo-border">
                        <img
                          src={comment.authorImage}
                          alt="your profile"
                          className="user-icon__photo"
                        />
                      </div>
                    </div>
                  )}

                  <p className="comment__item-text">{comment.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
}


const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  addCommentToPost,
  addLikeToPost,
  deletePost
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)