import React, { Component } from 'react'
import { Link, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import noImage from "../assets/images/no-image.png";

class Profile extends Component {
 
    render() {
        let user ;
        const {userId} = this.props.match.params
        user = this.props.users !== undefined && this.props.users.find((user) => user._id === userId)

        return (
            (user !== undefined && userId) ?
                <div className='profile'>
                <section className="profile__left">
                    <div className="profile__avatar">
                        <img src={user.userImages[0]? user.userImages[0] : noImage }
                            className='profile__image' />
                    </div>
                    <div className='profile__user-info'>
                            <h2 className='header-secondary'>
                                {user.name}
                            </h2>
                            <h3 className="header-tertiary" >
                                {`@${user.username}`}
                            </h3>
                            <h3 className="header-tertiary" style={{ 
                                    fontWeight: 100,  
                                    fontSize: '1.5rem', 
                                    textTransform: 'capitalize' }}>
                                {`${user.ethnicity}`}
                            </h3>
                            <h3 className="header-tertiary" style={{ fontWeight: 100, fontSize: '1.5rem', textTransform: 'capitalize' }}>
                                {`${user.gender}`}
                            </h3>
                    </div>
                    {
                            user._id === this.props.currentUser._id &&
                            <div className="button-container">
                                <Link
                                
                                    to={{
                                        pathname: `/user-info/${user._id}/edit`,
                                        state: {
                                            edit: true,
                                            userInfo: user
                                        }
                                    }}
                                    className="submit-button image-button">Edit Info</Link>
                            </div>
                    }
                    
                    </section> 
                <section className='profile__right'>
                    <div className="profile__bio">
                            <span className=' header-tertiary profile__bio-title'>About {user.name}</span>
                            <span className="paragraph profile__bio-content ">{user.bio}</span>
                    </div>
                    <div className="profile__interests">
                            <h3 className="header-tertiary profile__interest-header">Interests</h3>
                        { user.interests && Object.entries(user.interests).map(([interestTitle, interestContent], index) =>(
                            <React.Fragment>
                                <span key={index} className="profile__interest-title">{interestTitle}</span>
                                <span className="profile__interest-content paragraph">{interestContent.join(' , ')}</span>
                            </React.Fragment>
                            

                        ))}
                    </div>
                    
                </section>
                </div> :
                <Redirect to='/404'/>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.user.users

})

export default withRouter(connect(mapStateToProps, null)(Profile))