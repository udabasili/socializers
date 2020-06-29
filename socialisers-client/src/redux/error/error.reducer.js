import { errorActionTypes } from "./error.types";

const INITIAL_STATE = {
    error:null,
}

export default function errorReducer (state=INITIAL_STATE, action){
    switch (action.type) {
        case errorActionTypes.ADD_ERROR :
            return{
                error:action.payload,
            } 
        case errorActionTypes.REMOVE_ERROR :
            return{
                error:null,
            }    
        default:
            return state
    }

}