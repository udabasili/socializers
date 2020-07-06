import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { addFriend } from '../redux/user/user.actions';
import {  Link } from 'react-router-dom';
import { Snackbar } from '@material-ui/core';

class SearchUsers extends Component {
	state = {
		vertical: 0,
		horizontal: 0,
		message: "",
		open: false,
	};

	addFriendHandler = (friendId, friendUsername) => {
		const message = `${friendUsername} added as a friend`
		this.props.addFriend(friendId)
			.then((result) => {
				this.setState((prevState) => ({
					...prevState,
					vertical: 'top',
					horizontal: 'center',
					open: 'true',
					message
				  })
			);
		})
		.catch((err) => {});
	};

	handleClose = (event, reason) => {
		if (reason === "clickaway") {
		return;
		}
		this.setState((prevState) => ({
			...prevState,
			open: false,
			})
		)
	};
  render() {
    const users = this.props.users;
    const { open, vertical, horizontal, message } = this.state;
    const { currentUser, setShowModal, addFriend } = this.props;
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
                {currentUser.username !== user.username &&
                  currentUser.friends.filter(
                    (friend) => friend.username === user.username
                  ).length === 0 && (
                    <div
                      className="users__add-button"
                      onClick={() => this.addFriendHandler(user._id, user.username)}
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
        {open && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            autoHideDuration={3000}
            open={open}
            onClose={this.handleClose}
            message={message}
            key={vertical + horizontal}
          />
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
