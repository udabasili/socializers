import React,{ Component } from "react";
import movieGenre from "../data/movie-genre";
import hobbies from "../data/hobbies";
import sports from "../data/sports";
import musicGenre from "../data/music-genre";
import SelectPure from "select-pure";
import { connect } from 'react-redux';
import { addUserInterest } from "../redux/user/user.actions";
import { Redirect } from 'react-router-dom';
import CCManager from "../services/cometChat";


class UserInterest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paramsId: props.match.params ? props.match.params.currentUserId : null,
            currentUser:props.currentUser,
            userData:{
                bio:"",
                movieGenre: [],
                sports: [],
                musicGenre: [],
                hobbies: []
            },
            movieGenre: Object.values(movieGenre).map((mgenre) => ({
                label: mgenre,
                value: mgenre
                })
            ),
            sports: Object.values(sports).map((sport) => ({
                label: sport,
                value: sport
                })
            ),
            hobbies: Object.values(hobbies).map((hobby) => ({
                label: hobby,
                value: hobby
                })
            ),
            musicGenre: musicGenre.map((music) => ({
                label: music,
                value: music
                })
            )
              
        }
        this.onSubmitHandler = this.onSubmitHandler.bind(this)
    }
    
    componentDidMount(){
      let span =  document.querySelectorAll(".select-pure")
      Array.from(span).forEach(sp => this.selectPureFunction(sp.id))
    }

    onInputChangeHandler = (e) => {
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

    selectPureFunction(id){
        new SelectPure(`#${id}`, {
            options: this.state[id] ,
            placeholder: "-Please select-",
            multiple: true,
            icon: "fa fa-times",
            onChange: value => {
                this.setState((prevState) => ({
                    ...prevState,
                    userData: {
                        ...prevState.userData,
                        [id]: value
                        }
                    })
                )
            },
            classNames: {
            select: "select-pure__select",
            dropdownShown: "select-pure__select--opened",
            multiselect: "select-pure__select--multiple",
            label: "select-pure__label",
            placeholder: "select-pure__placeholder",
            dropdown: "select-pure__options",
            option: "select-pure__option",
            autocompleteInput: "select-pure__autocomplete",
            selectedLabel: "select-pure__selected-label",
            selectedOption: "select-pure__option--selected",
            placeholderHidden: "select-pure__placeholder--hidden",
            optionHidden: "select-pure__option--hidden",
        },
        autocomplete: true 
    });
        
    }
    onSubmitHandler(e){
        e.preventDefault()
        const {userData, paramsId} = this.state 
        this.props.addUserInterest(userData,paramsId)
        .then((response)=> {
            CCManager.createUser(response, response).then(
              (user) => {
                console.log("user created", user);
              },
              (error) => {
                console.log("error", error);
              }
            );
            this.props.history.push("/") 
            }
        )
    }


    render(){
        const { currentUser, userData, paramsId } = this.state;
        return(
            currentUser._id === paramsId ?
                <div className="user-info-form">
                    <form className="form-001" onSubmit={this.onSubmitHandler}>
                        <div className="form-001__component ">
                            <label className="form-001__label" htmlFor="bio">Bio</label>
                            <textarea 
                                value={userData.bio}
                                onChange={this.onInputChangeHandler}
                                className="form-001__input form-001__text-area" 
                                type="text"  
                                id="bio" 
                                name="bio" >
                            </textarea>
                        </div>
                        <div className="form-001__component form-001__component-select">
                            <label  className="form-001__label " htmlFor="sports">Favourite Sports</label>
                            <span id="sports" className="select-pure" > </span>
                        </div>
                        <div className="form-001__component form-001__component-select">
                            <label  className="form-001__label " htmlFor="movie-genre">Favourite Movie Genre</label>
                            <span id="movieGenre" className="select-pure" > </span>

                        </div>
                        <div className="form-001__component form-001__component-select">
                            <label  className="form-001__label " htmlFor="hobbies">Hobbies</label>
                            <span id="hobbies" className="select-pure"> </span>

                        </div>
                        <div className="form-001__component form-001__component-select">
                            <label  className="form-001__label " htmlFor="musicGenre">Favourite Music Genre</label>
                            <span id="musicGenre" className="select-pure"> </span>

                        </div>
                        <input className="submit-button" type="submit" value="Submit"/>

                    </form>
                </div>:
                    <Redirect to="/404" />
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    addUserInterest: (userData, userId) => dispatch(addUserInterest(userData, userId))
})

export default connect(null, mapDispatchToProps)(UserInterest);