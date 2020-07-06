import { UserActionTypes } from "./user.types";
import { apiCall, setTokenHeader } from "../../services/api";
import { addError, removeError } from "../error/error.actions";
import CCManager from "../../services/cometChat";

export function setAuthorizationToken(token) {
    return setTokenHeader(token);
}

const setCurrentUser = (user) => ({
    type: UserActionTypes.SET_CURRENT_USER,
    payload: user
})

const setNews = (news) => ({
    type: UserActionTypes.GET_NEWS,
    payload: news
})

export const setUsers = (users) => ({
    type: UserActionTypes.SET_USERS,
    payload: users
})

export const addNotification = (notification) => ({
    type: UserActionTypes.ADD_NOTIFICATION,
    payload: notification
})

export const clearNotifications = () => ({
    type: UserActionTypes.CLEAR_NOTIFICATIONS,
})


export const notificationButton = (hideWindow) => ({
    type: UserActionTypes.NOTIFICATION_BUTTON,
    payload: hideWindow

});

export const messengerButton = (hideWindow) => ({
    type: UserActionTypes.MESSENGER_BUTTON,
    payload: hideWindow
});

export const getUsers = () => (dispatch, getState) => {
    const {
        user
    } = getState();
    const id = user.currentUser._id
    return apiCall('get', `/api/${id}/users`)
    .then((result) => {
        dispatch(removeError())
        dispatch(setUsers(result))
    }).catch((err) => {

    });
}
export const Register = (data) => {
    return dispatch =>{
        return new Promise((res, rej) =>{
            return apiCall("post",`/api/auth/register`,data)
                .then((response) =>{
                    setAuthorizationToken(response.token)
                    dispatch(removeError())
                    dispatch(setCurrentUser(response.user))
                    localStorage.setItem("userId", response.user._id);
                    localStorage.setItem("validator", response.token)
                     return res(response.user);
                })
                .catch((error) =>{                    
                    dispatch(addError(error.message))
                    return rej(error.message)
                })
        })
    }  
} 

export const Login = (data) => {
    return dispatch =>{
        return new Promise((res, rej) =>{
            return apiCall("post",`/api/auth/login`,data)
                .then((response) =>{
                    setAuthorizationToken(response.token)
                    dispatch(removeError())
                    dispatch(setCurrentUser(response.user))
                    console.log(response)
                    localStorage.setItem("userId", response.user._id);
                    localStorage.setItem("validator", response.token)
                    return res(response.user.username)
                })
                .catch((error) =>{                                        
                    dispatch(addError(error.message))
                    return rej(error.message)
                })
        })
    }  
}



export const logOut = () => {
    return dispatch => {
        setAuthorizationToken(false)
        dispatch(setCurrentUser({}))
        localStorage.clear()
        CCManager.logOut().then(() =>{
            console.log("Logout completed successfully");
        }, error => {
            console.log("Logout failed with exception:", {
                error
            });
        })
    }
}

export const addUserInfo = (data, userId) => {
    return dispatch => {
        return new Promise((res, rej) => {
            apiCall("post",`/api/${userId}/user-info/add`,data)
            .then((response) => {
                dispatch(removeError())
                dispatch(setCurrentUser(response.user))
                localStorage.setItem("userId", response.user._id);
                localStorage.setItem("validator", response.token)
                res()
            }).catch((err) => {
                dispatch(addError(err.message))
                rej()
            });
        })
    }
}

export const editUserInfo = (data, userId) => {
    return dispatch => {
        return new Promise((res, rej) => {
            apiCall("put", `/api/${userId}/user-info/edit`, data)
                .then((response) => {
                    dispatch(removeError())
                    dispatch(setCurrentUser(response.user))
                    res()
                }).catch((err) => {
                    dispatch(addError(err.message))

                    rej()
                });
        })
    }
}


export const imageUpload = (images, userId) =>{
    return dispatch => {
        return new Promise((res, rej) =>{
            return apiCall("post", `/api/${userId}/image-upload/add`, images)
            .then((response) =>{
                dispatch(removeError())
                dispatch(setCurrentUser(response.user))
                res()
            })
            .catch((error) =>{       
                dispatch(addError(error.message))
                return rej()
            })
        })
    }
} 

export const addUserInterest = (userData, userId) =>{
    return dispatch => {
        return new Promise((res, rej) =>{
            return apiCall("post", `/api/${userId}/user-interests/add`, userData)
            .then((response) =>{
                 dispatch(removeError())
                 dispatch(setCurrentUser(response.user))
                 return res(response.user.username)
                
            })
            .catch((error) =>{                    
                return rej()
            })
        })
    }
} 

export const getLocation = (coords, userId) =>{
    return dispatch =>{
    return new Promise((resolve, reject) =>{
        return apiCall("post", `/api/${userId}/get-current-location`, coords)
            .then((result) => {                
                dispatch(removeError())
                resolve(result)                
                return result
                
            }).catch((err) => {                
                dispatch(addError(err))
                reject()
            });
    })
    }
}

export function verifyUser() {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCall('get', '/authenticate-user')
                .then((response) => {
                    setAuthorizationToken(response.validator)
                    dispatch(removeError())
                    dispatch(setCurrentUser(response.currentUser))
                    localStorage.setItem("userId", response.currentUser._id);
                    localStorage.setItem("validator", response.validator)
                    return resolve(response.currentUser.username)
                })
                .catch((e) => {
                    console.log(e)
                    dispatch(addError('Please Login again'))
                    dispatch(setCurrentUser({}))
                    localStorage.clear()
                    setAuthorizationToken(false)
                    return reject()
                })
        })
    }
}


export const addFriend = (addedFriendId) => (dispatch, getState) => {
    const {
        user
    } = getState();
    const userId = user.currentUser._id
    return apiCall('get', `/api/${userId}/add-friend/${addedFriendId}`)
        .then((result) => {
            dispatch(removeError())
            dispatch(setCurrentUser(result.user))

        }).catch((err) => {
            dispatch(addError(err.message))

        });
}



export const getNews = () => (dispatch, getState) => {
    const {
        user
    } = getState();
    const userId = user.currentUser._id
    return apiCall("get", `/api/${userId}/world-news`)
        .then((response) => {
            console.log(response)
            dispatch(setNews(response.articles))
    })
        .catch((error) => {
            console.log(error)
    })
}