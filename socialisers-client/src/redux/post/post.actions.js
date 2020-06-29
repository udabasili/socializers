import { PostActionTypes } from "./post.types";
import { addError, removeError } from "../error/error.actions";
const { apiCall } = require("../../services/api")

export const loadPosts = (posts) =>({
    type: PostActionTypes.GET_POSTS,
    payload: posts
})

export const addPost = (text) => (dispatch, getState) => {
  const { user } = getState();
  const id = user.currentUser._id
    return apiCall("post", `/api/${id}/posts/create-post`, {text})
      .then((response) => {
            dispatch(removeError())
            dispatch(loadPosts(response.posts));
          })
      .catch((err) => dispatch(addError(err.message)));
};

export const editPost = (updatedPost, postId) => (dispatch, getState) => {
  const {
    user
  } = getState();
  const id = user.currentUser._id
  return apiCall("put", `/api/${id}/posts/${postId}/edit`, {
      updatedPost
    })
    .then((response) => {
      dispatch(removeError())
      dispatch(loadPosts(response.posts));
    })
    .catch((err) => dispatch(addError(err.message)));
};

export const deletePost = (postId) => (dispatch, getState) => {
  const {
    user
  } = getState();
  const id = user.currentUser._id
  return apiCall("delete", `/api/${id}/posts/${postId}/delete`)
    .then((response) => {
      dispatch(removeError())
      dispatch(loadPosts(response.posts));
    })
    .catch((err) => dispatch(addError(err.message)));
};


export const getPosts = () => (dispatch, getState) => {
   const {
     user
   } = getState();
   const id = user.currentUser._id
        return apiCall("get", `/api/${id}/posts`)
          .then((response) => {
            dispatch(removeError())
            dispatch(loadPosts(response.posts));
            return response
          })
          .catch((err) => {
              console.log(err)
          });
      
};


export const addCommentToPost = (commentContent, postId) => (dispatch, getState) => {
  const {
    user
  } = getState();
  const id = user.currentUser._id
    return apiCall('post', `/api/${id}/posts/${postId}/comment/add`, commentContent)
      .then((response) => {
          dispatch(removeError())
          return (response.comments);
        })
        .catch((err) => {
          dispatch(addError(err.message))
          console.log(err)
        });
  
}

export const addLikeToPost = (likedBy, postId) => (dispatch, getState) => {
  const {
    user
  } = getState();
  const id = user.currentUser._id
    dispatch(removeError())
    return apiCall('post', `/api/${id}/posts/${postId}/like`, {
      likedBy
    })
      .then((response) => {
        return (response.likes);
      })
      .catch((err) => {
        console.log(err)
      });
  
}