const { PostActionTypes } = require("./post.types");

const postReducer = (state = [], action) => {
    switch(action.type){
        case PostActionTypes.GET_POSTS:
            return [...action.payload]
        
            default :
                return state
    }
}

export default postReducer
