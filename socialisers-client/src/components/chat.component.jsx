import React, {useState} from 'react'
import { faTimesCircle, faComments } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChatMessenger from './chat-messenger.component';
import { connect } from 'react-redux'
import { messengerButton } from '../redux/user/user.actions';
import { useEffect } from 'react';
import { useCallback } from 'react';
import CCManager from "../services/cometChat";
import { CometChat } from "@cometchat-pro/chat";

function Chat({currentUser, hideMessenger, messengerButton, isMobile}) { 

  const loadChatWindow = useCallback(() => {
      CCManager.addMessageListener((data, error) => {
        if (error) return console.log(`error: ${error}`);
          setReceiver(data.sender.uid);
          messengerButton(false)

      });
    })
  useEffect(() => {
    loadChatWindow()
    
  }, [loadChatWindow])
  
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
              onClick={messengerButton}
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
                      onClick={() => openChatWindow(friend.username)}
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
          <div className="chat__button" onClick={ () => messengerButton()}>
            <FontAwesomeIcon
              className="chat__icon"
              size="1x"
              color={hideMessenger ? "#75a1f3" : "gray"}
              icon={faComments}
            />
          </div>
        )}
      </div>
    );
}
const mapStateToProps = (state) => ({
  hideMessenger: state.user.hideMessenger,
})

const mapDispatchToProps = {
  messengerButton
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)
