import  React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import Auth from './pages/auth.component';
import NotFoundPage from './components/not-found';
import Home from './pages/home.component';
import { connect } from 'react-redux';
import UserInfoForm from './pages/user-info-form.component';
import UserImageUpload from './pages/user-images-upload.component';
import ProtectedRoute from './components/protected-route.component';
import UserPreference from './pages/user-preference.component';
import UserInterest from './pages/user-interest.component';
import { getUsers } from './redux/user/user.actions';
import CCManager from './services/cometChat';


function MainRouter(props) {
	const {currentUser, isAuthenticated} = props.currentUser
	const{ getUsers } = props
	React.useEffect(() => {
		getUsers()
		CCManager.init()
			.then((result) => {
		CCManager.login(currentUser.username).then(
			user => {
				        CCManager.getLoggedinUser().then((result) => console.log(result)).catch((error) => console.log(error))
				console.log("Login Successful:", {
					user
				});
			},
			error => {
				console.log("Login failed with exception:", {
					error
				});
			}
		)		;

			}).catch((error) => {
				    console.log("Initialization failed with error:", error);
			});

	},[getUsers, currentUser.username])
	return (
			<React.Fragment>
				<Switch>
					<Route  exact path="/auth/login" render={props =>(
						isAuthenticated ?
							<Redirect to="/"/> :
							<Auth auth="login" {...props}/>  
						)
					}/>
					<Route exact path="/auth/register" render={props =>(
						isAuthenticated ?
							<Redirect to="/"/> :
							<Auth auth="register" {...props}/>  
						)
					}/>
					<ProtectedRoute  
						path="/user-info/:currentUserId/:mode" 
						isAuthenticated = {
							isAuthenticated
						}
						currentUser={currentUser} 
						component={UserInfoForm} />
					<ProtectedRoute  exact path="/image-upload/:currentUserId/add" 
						currentUser={currentUser} isAuthenticated={isAuthenticated} component={UserImageUpload}/>
					<ProtectedRoute  exact path="/user-preference/:currentUserId/add" 
					currentUser={currentUser} isAuthenticated={isAuthenticated} component={UserPreference}/>
					<ProtectedRoute  exact path="/user-interests/:currentUserId/add" 
						currentUser={currentUser} isAuthenticated={isAuthenticated} component={UserInterest}/>
					<ProtectedRoute currentUser={currentUser} path="/" isAuthenticated={isAuthenticated} component={Home} />

					<Route exact path="/404" component={NotFoundPage} />
				</Switch>
			</React.Fragment>
		
	);
}

const mapStateToProps = (state) => ({
	 currentUser: state.user
})

const mapDispatchToProps =  {
	getUsers
}


export default connect(mapStateToProps, mapDispatchToProps)(MainRouter);