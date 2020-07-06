import { UserActionTypes } from "./user.types";

const INITIAL_STATE = {
    currentUser:{},
    users: null,
    isAuthenticated:false,
    hideNotificationDropDown: true,
    hideMessenger: true,
    userNotifications:[],
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
        case UserActionTypes.MESSENGER_BUTTON:
            console.log(action.payload !== undefined )
             return {
                 ...state,
                 hideMessenger: action.payload !== undefined ? action.payload : !state.hideMessenger,
             };
        
        case UserActionTypes.ADD_NOTIFICATION:
            return {
                ...state,
                userNotifications: [...state.userNotifications, action.payload],
            };
        case UserActionTypes.CLEAR_NOTIFICATIONS:
            return {
                ...state,
                userNotifications: [],
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