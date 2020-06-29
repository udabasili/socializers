import React from "react";
import { Route, Redirect } from "react-router-dom";


const ProtectedRoute = ({component: Component, currentUser, isAuthenticated, ...otherProps}) => {
    return ( 
        <Route {...otherProps} render={(props) => (
            isAuthenticated  ?
            <Component currentUser={currentUser} {...props}/> :
            <Redirect to={{
                pathname:"/auth/register",
                state: {from: props.location}
                }} /> 
        )}/>
    )
    
}
 
export default ProtectedRoute;