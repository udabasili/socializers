import React, { Component } from 'react'
import { faUser, faKey, faEnvelope, faUserTag } from '@fortawesome/free-solid-svg-icons';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import validator from '../components/validator';
import { Register, Login } from '../redux/user/user.actions';
import { removeError } from '../redux/error/error.actions';
import FormComponent from '../components/form-component';


class Auth extends Component {
  constructor(props) {
    super(props)
    this.state={
        loggedIn:false,
        auth:props.auth || "register",
        error:null,
        previousPath:"",
        loginData: {
          email: "",
          password: "",
        },
        registerData: {
          name: {
            value: ''
          },
          username: {
            value: ''
          },
          email: {
            validated: false,
            value: '',
            focused:false
          },
          password: {
            validated: false,
            value: '',
            focused:false

          },
          confirmPassword: {
            validated: false,
            value: '',
            focused:false
            },
          },

    }
  }
  
    

    componentDidMount(){
      const routeProp = this.props.history.location.state;
      
      if (routeProp){
        this.setState((prevState) =>({
          ...prevState,
          previousPath: routeProp.from.pathname
          })
        )        
      }
      
      
    }

    componentDidUpdate(prevProps){
      console.log(this.props.auth)
      if(this.props.auth !== prevProps.auth){
        this.setState((prevState) =>({
          ...prevState,
          auth: this.props.auth
        })
        )
      }
	}
	
    componentWillUnmount(){
      this.props.removeError()
    }

	/**
	 *  update state based on name to input
	 * @param {*} e 
	 */
    onChangeHandlerLogin= (e) =>{
      let {name, value} = e.target;
      this.setState((prevState)=>({
        ...prevState,
        loginData:{
          ...prevState.loginData,
          [name]:value
        }
      }))
    }

	/**
	 * handle the onchange for Register state
	 * @param {*} e 
	 */

    onChangeHandlerRegister = (e) =>{
    const {name, value} = e.target;
    this.setState((prevState)=>({
        ...prevState,
        registerData: {
        ...prevState.registerData,
        [name]: ({
          ...prevState.registerData[name],
          value: value,
          validated: validator(name, 
            name === "confirmPassword" ?  {
              password:this.state.registerData.password.value,
              confirm: value
              } : value)
          })
        }
      })
    )
  }

 
	onBlurHandler = (e) =>{
		const {name} = e.target
		this.setState((prevState)=>({
		...prevState,
		registerData: {
			...prevState.registerData,
			[name]: ({
			...prevState.registerData[name],
			focused: true
			})
			}
		})
		)
	}

	onSubmitHandler = (e) =>{
		let userData = {
			name: this.state.registerData.name.value,
			username:this.state.registerData.username.value,
			email:this.state.registerData.email.value,
			password: this.state.registerData.password.value,
		}
        e.preventDefault()
		switch (this.state.auth) {
			case "register":
			this.props.Register(userData)
				.then((response) =>{
				let currentUserId = response._id;
					this.props.history.push(
					`/user-info/${currentUserId}/add`
					);				
				
			})
				break;
			case "login":
				this.props.Login(this.state.loginData).then((response)=>{
				const previousPath = this.state.previousPath
				if(previousPath){
					this.props.history.push(previousPath)
				}
				else{
				this.props.history.push("/")

				}
          	})    
          		break;
        	default:
          		break;
      }
      
    }

	render() {
		const { error } = this.props;
		const{auth, registerData, loginData } = this.state;

		return (
		<div className="auth">
			<section className="auth__left-section"></section>
			<section className="auth__right-section">
				<div className="alert-error">{
					error && error.error
				}
				</div>
				<form className="form" onSubmit={this.onSubmitHandler} >
				{(auth === "register") ?
					<React.Fragment>
					<FormComponent
						name='name'
						onChangeHandler={this.onChangeHandlerRegister}
						labelIcon={faUserTag}
						label='name'
						value={registerData.name.value}
					/>
					<FormComponent
						name='username'
						onChangeHandler={this.onChangeHandlerRegister}
						labelIcon={faUser}
						label='username'
						value={registerData.username.value}
					/>
					<FormComponent
						name='email'
						onChangeHandler={this.onChangeHandlerRegister}
						labelIcon={faEnvelope}
						type='email'
						validated={registerData.email.validated}
						error='Email must be valid'
						label='email'
						focused={registerData.email.focused}
						onBlurredHandler={this.onBlurHandler}
						value={registerData.email.value}
					/>
						<FormComponent
						name='password'
						validated={registerData.password.validated}
						onChangeHandler={this.onChangeHandlerRegister}
						labelIcon={faKey}
						type='password'
						error='Password must be at least 7 characters'
						label='Password (Must be at least 7 Characters)'
						focused={registerData.password.focused}
						onBlurredHandler={this.onBlurHandler}
						value={registerData.password.value}
						/>
						<FormComponent
						name='confirmPassword'
						validated={registerData.confirmPassword.validated}
						onChangeHandler={this.onChangeHandlerRegister}
						labelIcon={faKey}
						type='password'
						error="Your passwords don't match"
						label='Confirm Password'
						focused={registerData.confirmPassword.focused}
						onBlurredHandler={this.onBlurHandler}
						value={registerData.confirmPassword.value}
						/>
					
					
				</React.Fragment> :
				<React.Fragment>
						<FormComponent
						name='email'
						onChangeHandler={this.onChangeHandlerLogin}
						labelIcon={faEnvelope}
						type='email'
						label='email'
						value={loginData.email}
						/>
						<FormComponent
						name='password'
						validated={loginData.password}
						onChangeHandler={this.onChangeHandlerLogin}
						labelIcon={faKey}
						type='password'
						label='password'
						value={loginData.password}
						/>
				</React.Fragment>
				}
				<input type="submit" className="submit-button" value="Submit"/>
			</form>
			</section>
		</div>  
		)
	}
}


const mapStateToProp = state =>({
  error : state.error
})

const mapDispatchToProp = dispatch => ({
  Login: (data) => dispatch(Login(data)),
  Register: (data) => dispatch(Register(data)),
  removeError: () => dispatch(removeError())
})

export default withRouter(connect(mapStateToProp, mapDispatchToProp)(Auth))