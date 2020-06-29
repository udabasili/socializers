import React,{ Component } from "react";
import ImageUploadCard from "../components/image-upload-card.component";
import 'react-image-crop/dist/ReactCrop.css';
import ImageModal from "../components/image-modal.component";
import { imageUpload } from "../redux/user/user.actions";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

class UserImageUpload extends Component {

    constructor(props){
        super(props);
        this.state = { 
            paramsId: props.match.params ? props.match.params.currentUserId : null,
            currentUser:props.currentUser,
            usersImagesComponents: [1,2],
            userImages: {},
            showModal: false,
            cardId:"",
            imageUrl: "",
            imageFile: "",
            imageSrc: "",
         }

        this.closeModal = this.closeModal.bind(this)
    
    }
    
    closeModal (){
        this.setState((prevState) => ({
            ...prevState,
            showModal: false,
            imageSrc: "",

            })
        )
    }

    setImageFile = (imageFile, cardId) => {        
        this.setState((prevState)=>({
            ...prevState,
            imageFile,
            showModal: true,
            cardId
            
            })
        )
    }

    getImageUrl = (url, imageBlob, cardNum) => {
        this.setState((prevState)=>({
            ...prevState,
            imageUrl: url,
            showModal: false,
            userImages:{
                ...prevState.userImages,
                [cardNum] : {
                    url,
                    imageBlob
                }
            }
            
            })
        )
    }
    submitImagesHandler = () => {
        const {currentUser, submitImages} = this.props;
        const imageData = new FormData();
        Object.values(this.state.userImages).forEach((image) => {
            imageData.append("file",image["imageBlob"] )
        })
        submitImages(imageData, currentUser._id).then(()=>{
            this.props.history.push(`/user-interests/${currentUser._id}/add`)
        })
        


    }

    setImage = (userImage) => {        
        this.setState((prevState)=>({
            ...prevState,
            userImages:[...prevState.userImages, userImage]
        }), () => console.log(this.state.userImages)
         )
    }

    render() { 
        const {usersImagesComponents, showModal, currentUser,  paramsId, imageFile, userImages, cardId} = this.state
        
        return (  
            currentUser._id === paramsId ?
            <div className="user-images-upload">
                { (showModal && imageFile) && 
                    <ImageModal imageFile={imageFile} getImageUrl={this.getImageUrl} cardNum={cardId} closeModal={this.closeModal} />}
                <div className="user-images">
                    {usersImagesComponents.map((number) =>{
                    return <ImageUploadCard key={number}
                        id={number} 
                        image={Object.keys(userImages).includes(String(number)) && userImages[number]["url"] }
                        getImageFile={this.setImageFile}
                        />
                    })
                    }
                </div>
                <a 
                    onClick={this.submitImagesHandler}
                    className="submit-button image-button">Submit</a>
            </div>:
                    <Redirect to="/404" />
        );
    }
}
 

const mapDispatchToProps = dispatch => ({
  submitImages: (images, userId) => dispatch(imageUpload(images, userId))
})


export default connect(null, mapDispatchToProps)(UserImageUpload);