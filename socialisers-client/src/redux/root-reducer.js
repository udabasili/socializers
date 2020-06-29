import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from "./user/user.reducer";
import errorReducer from "./error/error.reducer";
import postReducer from "./post/post.reducer";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user']
  };

const rootReducer = combineReducers({
    user: userReducer,
    error: errorReducer,
    posts: postReducer
})

export default persistReducer(persistConfig, rootReducer)