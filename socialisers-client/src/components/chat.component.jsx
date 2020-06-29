import React, {useState} from 'react'
import { faBell, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChatMessenger from './chat-messenger.component';
import { connect } from 'react-redux'
import { messengerButton } from '../redux/user/user.actions';


function Chat({currentUser, hideMessenger, messengerPopUp, isMobile}) {
  
  const [receiver, setReceiver] = useState(null)

  const openChatWindow = (user) => {
    setReceiver(user);
   
  };
  const friends = currentUser.friends
    return (
      <div className="chat">
        {!hideMessenger && (
          <div className="chat__window">
            <FontAwesomeIcon
              icon={faTimesCircle}
              color="red"
              className="close-button"
              size="2x"
              onClick={messengerPopUp}
            />
            <div className="chat__content">
              {receiver ? (
                <ChatMessenger
                  receiver={receiver}
                  setReceiver={setReceiver}
                  currentUser={currentUser}
                />
              ) : (
                friends &&
                friends.map((friend) => (
                  <ul className="chat__list">
                    <li
                      className="users__item"
                      onClick={() => openChatWindow(friend)}
                    >
                      <div className="users__user">
                        <div className="user-icon">
                          <div className="user-icon__photo-border">
                            <img
                              src={friend.userImages[0]}
                              alt="your profile"
                              className="user-icon__photo"
                            />
                          </div>
                        </div>
                        <div className="username">{friend.username}</div>
                      </div>
                    </li>
                  </ul>
                ))
              )}
            </div>
          </div>
        )}
        {!isMobile && (
          <div className="chat__button" onClick={messengerPopUp}>
            <FontAwesomeIcon
              className="chat__icon"
              size="1x"
              color={hideMessenger ? "blue" : "gray"}
              icon={faBell}
            />
          </div>
        )}
      </div>
    );
}
const mapStateToProps = (state) => ({
  hideMessenger: state.user.hideMessenger,

})

const mapDispatchToProps = (dispatch) => ({
  messengerPopUp: () => dispatch(messengerButton()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
