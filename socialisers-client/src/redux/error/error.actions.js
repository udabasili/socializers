import { errorActionTypes } from "./error.types";

export const addError = (error) => ({
    type: errorActionTypes.ADD_ERROR,
    payload: error
})

export const removeError = () => ({
    type: errorActionTypes.REMOVE_ERROR,
})