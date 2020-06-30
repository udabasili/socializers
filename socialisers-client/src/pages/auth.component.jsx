import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey, faEnvelope, faUserTag } from '@fortawesome/free-solid-svg-icons';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import validator from '../components/validator';
import { Register, Login } from '../redux/user/user.actions';
import { removeError } from '../redux/error/error.actions';
import CCManager from '../services/cometChat';


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

    //update state based on name to input
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
    //handle the onchange for Register state
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

              CCManager.createUser(response.username, response.name)
              .then((result) => {
                console.log(currentUserId)
              }).catch((err) => {
                
              });
              
              
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

  

    changeAuthState = (value)=>{
      this.setState({auth:value})
      // this.props.removeError()
    }

  render() {
    const { error,history, removeError } = this.props;
    const{auth, registerData, loginData } = this.state;
    history.listen(() =>{
       removeError()
    })

    return (
      <div className="auth">
      <section className="auth__left-section"></section>
      <section className="auth__right-section">
        <div className="alert-error">{
            error.error === "Email doesn't exist. Please Register" ? 
            <div>
            <span>Email doesn't exist. Please </span>
            <span 
              className="switch-auth" 
              style={{color:"blue", cursor:"pointer"}} 
              onClick={()=>this.changeAuthState("register")}> Register </span>
            </div>
            :
            error.error
        }
        </div>
        <form className="form" onSubmit={this.onSubmitHandler} >
          {(auth === "register") ?
            <React.Fragment>
              <div className="form__component">
                <i className="form__group__icon"><FontAwesomeIcon icon={faUserTag}/></i>
                <div className="form__group">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Name"
                    onChange={this.onChangeHandlerRegister} 
                    value={registerData.name.value}
                    className="form__input" required/>
                </div>
              </div>
              <div className="form__component">
                <i className="form__group__icon"><FontAwesomeIcon icon={faUser}/></i>
                <div className="form__group">
                  <input 
                    type="text" 
                    name="username" 
                    placeholder="Username"
                    onChange={this.onChangeHandlerRegister} 
                    value={registerData.username.value}
                    className="form__input" required/>
                </div>
              </div>
              <div className="form__component">
                <i className="form__group__icon">
                  <FontAwesomeIcon icon={faEnvelope}/>
                </i>
                <div className="form__group">
                  <input 
                    type="email"  
                    onBlur={(e) => this.onBlurHandler(e)}
                    placeholder="Email"
                    onChange={this.onChangeHandlerRegister}
                    value={registerData.email.value}
                    style={{color : registerData.email.validated ? "black" : "red"}}
                      name="email" 
                      className="form__input" required/>
                  {(!registerData.email.validated && registerData.email.focused ) && 
                  <div className="validation-error">Email must be valid</div>
                  }
                  </div>
                  
                  </div>

              <div className="form__component">
                  <i className="form__group__icon"><FontAwesomeIcon icon={faKey}/></i>
                  <div className="form__group">
                      <input 
                      type="password" 
                      name="password" 
                      onBlur={(e) => this.onBlurHandler(e)}
                      placeholder="Password at least 7 characters)"
                      onChange={this.onChangeHandlerRegister}
                      style={{color : registerData.password.validated ? "black" : "red"}}
                      value={registerData.password.value}
                      className="form__input" required/>
                      {(!registerData.password.validated && registerData.password.focused ) && 
                  <div className="validation-error">Password must be at least 7 characters</div>
                  }
                  </div>
                  </div>
                  <div className="form__component">
                  <i className="form__group__icon">
                      <FontAwesomeIcon icon={faKey}/>
                  </i>
                  <div className="form__group">
                  <input 
                  type="password" 
                  name="confirmPassword" 
                  placeholder="Confirm password"
                  onBlur={(e) => this.onBlurHandler(e)}
                  onChange={this.onChangeHandlerRegister}
                  style={{color : registerData.confirmPassword.validated ? "black" : "red"}}
                  value={registerData.confirmPassword.value}
                  className="form__input" required/>
                  {(!registerData.confirmPassword.validated && registerData.confirmPassword.focused ) && 
                  <div className="validation-error">Your passwords don't match</div>
                  }
                  
              </div>
              </div>
          </React.Fragment> :
          <React.Fragment>
              <div className="form__component">
              <i className="form__group__icon">
                  <FontAwesomeIcon icon={faEnvelope}/>
              </i>
              <div className="form__group">
                  <input 
                  type="email"  
                  placeholder="Email"
                  onChange={this.onChangeHandlerLogin}
                  value={loginData.email}
                  name="email" 
                  className="form__input" required/>
              </div>
              </div>
              <div className="form__component">
              <i className="form__group__icon"><FontAwesomeIcon icon={faKey}/></i>
              <div className="form__group">
                  <input 
                  type="password" 
                  name="password" 
                  placeholder="Password"
                  onChange={this.onChangeHandlerLogin}
                  value={loginData.password}
                  className="form__input" required/>
              </div>
              </div>
          </React.Fragment>
          }
        <input type="submit" className="submit-button" value="Submit"/>
      </form>
      {(auth === "register") ?
        <div className="register-form-option">
          <span>Registered Already? </span>
          <span className="switch-auth" onClick={() => this.changeAuthState("login")}>Login</span>
        </div> :
        <div className="login-form-option">
        </div>

        }
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