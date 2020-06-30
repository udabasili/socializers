import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { addFriend } from '../redux/user/user.actions';
import {  Link } from 'react-router-dom';

class SearchUsers extends Component {

  render() {
    const users = this.props.users
    const { currentUser, setShowModal, addFriend} = this.props
    return (
      <div className="users">
        <FontAwesomeIcon
          icon={faTimes}
          color="red"
          className="close-button"
          size="2x"
          onClick={() => setShowModal(false)}
        />
        {users ? (
          <ul className="users__list">
            {users.map((user) => (
              <li className="users__item">
                <div className="users__user">
                  <div className="user-icon">
                    <div className="user-icon__photo-border">
                      <img
                        src={user.userImages[0]}
                        alt="your profile"
                        className="user-icon__photo"
                      />
                    </div>
                  </div>
                  <Link
                    onClick={() => setShowModal(false)}
                    to={`/profile/${user._id}`}
                    className="username"
                  >
                    {user.username}
                  </Link>
                </div>
                {(currentUser.username !== user.username &&
                  currentUser.friends.map(
                    (friend) => friend.username === user.username
                  ).length === 0) && (
                    <div
                      className="users__add-button"
                      onClick={() => addFriend(user._id)}
                    >
                      <FontAwesomeIcon icon={faUserPlus} />
                    </div>
                  )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Friends</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.user.users
})



const mapDispatchToProps = {
  addFriend
}



export default connect(mapStateToProps, mapDispatchToProps)(SearchUsers)
