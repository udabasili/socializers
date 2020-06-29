import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { getLocation, addUserInfo, editUserInfo } from '../redux/user/user.actions';
import { connect } from 'react-redux';


class UserInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.match.params ? props.match.params.currentUserId : null,
            mode: props.match.params ? props.match.params.mode : null,
            currentUser:props.currentUser,
            userData:{
                birth: "",
                occupation:"",
                ethnicity:"asian",
                city:"",
                country:"",
                gender:"male",
            }
        }

        this.onInputChangeHandler = this.onInputChangeHandler.bind(this)
        this.onSubmitHandler = this.onSubmitHandler.bind(this)

        
    }

    componentDidMount(){
        this.getUserLocation()
        const {mode} = this.state
        if(mode === 'edit'){
            const userInfo = this.props.location.state.userInfo
            this.setState((prevState)=>({
                ...prevState,
                userData:{
                    birth: '',
                    occupation: userInfo.occupation,
                    ethnicity: userInfo.ethnicity,
                    city: userInfo.city,
                    country: userInfo.country,
                    gender: userInfo.gender,
                    }
                })
            )

        }
    }

    getUserLocation (){
            if(this.state.mode === 'add'){
                if (!navigator.geolocation) {
                    return alert("Sorry this browser doesn't support geolocation ")
                }

                navigator.geolocation.getCurrentPosition((position) => {
                    let lat = position.coords.latitude
                    let long = position.coords.longitude
                    let coords = { lat, long }
                    this.props.getLocation(coords)
                        .then((res) => {
                            this.setState((prevState) => ({
                                ...prevState,
                                userData: {
                                    ...prevState.userData,
                                    city: res.split(",")[0],
                                    country: res.split(",", 3)[2]
                                }
                            })
                            )
                        })
                })
            }
            
        }

    onInputChangeHandler (e){
        const {name, value} = e.target
        this.setState((prevState) =>({
            ...prevState,
            userData:{
                ...prevState.userData,
                [name]:value
                }
            })
        )
    }

    onSubmitHandler(e){
        e.preventDefault()
        const {userData, userId, mode} = this.state;
        const {addUserInformation, history, editUserInformation} = this.props; 
        switch (mode) {
            case 'add':
                addUserInformation(userData, userId)
                    .then(() => history.push(`/image-upload/${userId}/add`))
                break;
            case 'edit':
                editUserInformation(userData, userId)
                    .then(() => history.goBack())
                break;
        
            default:
                break;
        }
        
    }

    render() { 
        const {currentUser, userData, userId, mode} = this.state;

        return ( 
            currentUser._id === userId && mode ?
                <div className="user-info-form">
                    <form className="form-001" onSubmit={this.onSubmitHandler} >
                        <div className="form-001__component float-left">
                            <label className="form-001__label" htmlFor="name">Name</label>
                            <input 
                                className="form-001__input" 
                                type="text"  id="name" 
                                name="name" value={currentUser.name} disabled/>
                        </div>
                        <div className="form-001__component float-right">
                            <label  className="form-001__label " htmlFor="username">Username</label>
                            <input className="form-001__input" type="text"  id="username" name="username" value={currentUser.username} disabled/>
                        </div>
                        <div className="form-001__component float-right">
                            <label  className="form-001__label " htmlFor="birth">BirthDate</label>
                            <input 
                                className="form-001__input" 
                                type="date"  
                                id="birth" 
                                value={userData.birth}
                                onChange={this.onInputChangeHandler}
                                name="birth" 
                                required
                                />
                        </div>
                        <div className="form-001__component float-right">
                            <label  className="form-001__label " htmlFor="occupation">Occupation</label>
                            <input className="form-001__input" 
                                type="text"  
                                id="occupation" 
                                value={userData.occupation}
                                onChange={this.onInputChangeHandler}
                                name="occupation" 
                                required
                                />
                        </div>
                        <div className="form-001__component float-left">
                            <label  className="form-001__label " htmlFor="ethnicity">Ethnicity</label>
                            <select className="form-001__input" 
                                value={userData.ethnicity}
                                onChange={this.onInputChangeHandler}
                                id="ethnicity" name="ethnicity">
                                <option value="asian">Asian</option>
                                <option value="black">Black</option>
                                <option value="hispanic">Hispanic Latino</option>
                                <option value="asian">Asian</option>
                                <option value="native">Native American</option>
                                <option value="mixed">Mixed</option>
                            </select>
                        </div>
                        <div className="form-001__component float-left">
                            <label  className="form-001__label " htmlFor="gender">Gender</label>
                            <select className="form-001__input" 
                                value={userData.gender}
                                onChange={this.onInputChangeHandler}
                                id="gender" name="gender">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="form-001__component float-left">
                            <label  className="form-001__label " htmlFor="city">City</label>
                            <input className="form-001__input" type="text"  id="city" name="city" value={userData.city} disabled/>
                        </div>
                        <div className="form-001__component float-left">
                            <label  className="form-001__label " htmlFor="country">Country</label>
                            <input className="form-001__input" type="text"  id="country" name="country" value={userData.country} disabled/>
                        </div>         
                        <input className="submit-button" type="submit" value="Submit"/>
                    </form>
                </div> :
                    <Redirect to="/404" />
         );
    }
}
 


const mapDispatchToProps = (dispatch) => ({
    getLocation: (coords) => dispatch(getLocation(coords)),
    addUserInformation: (userInfo, userId) => dispatch(addUserInfo(userInfo, userId)),
    editUserInformation: (userInfo, userId) => dispatch(editUserInfo(userInfo, userId))

})

export default connect(null, mapDispatchToProps)(UserInfoForm);
