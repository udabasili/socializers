import { UserActionTypes } from "./user.types";

const INITIAL_STATE = {
    currentUser:{},
    users: null,
    isAuthenticated:false,
    hideNotificationDropDown: true,
    news: null

}
export default function userReducer (state=INITIAL_STATE, action){
    switch (action.type) {
        case UserActionTypes.SET_CURRENT_USER :
            return{
                ...state,
                currentUser:action.payload,
                isAuthenticated:!!Object.keys(action.payload).length,
            }    
        case UserActionTypes.SET_USERS:
            return{
                ...state,
                users: action.payload

            }
        case UserActionTypes.NOTIFICATION_BUTTON:
             return {
                 ...state,
                 hideNotificationDropDown: action.payload !== undefined  ? action.payload : !state.hideNotificationDropDown,
             };
         
        case UserActionTypes.GET_NEWS:
            return {
                ...state,
                news: action.payload,
            };
        
        default:
            return state
    }

}