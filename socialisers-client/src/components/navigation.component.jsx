import  React,{useState, useEffect} from 'react'
import {ReactComponent as AppIcon} from "../assets/images/icons8-myspace-circled-100.svg";
import { NavLink } from 'react-router-dom';
import {connect} from "react-redux";
import { logOut, messengerButton, notificationButton, clearNotifications } from '../redux/user/user.actions';
import NavIcon from './nav-icon.component';
import { faComment, faSignOutAlt, faSearch, faBell, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from './modal.component';
import SearchUsers from './search-users.component';
import CCManager from '../services/cometChat';
import Notification from './notification.component';


function Navigation({currentUser, 
    logOut, 
    notificationDropdown, 
    messengerPopUp, 
    hideNotificationDropDown, 
    notifications ,
    clearNotifications}) {
    const [isAuthenticated, setAuthentication] = useState(currentUser.isAuthenticated);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [showModal, setShowModal] = useState(false)
    const logOutHandler = () => {
      logOut();
      CCManager.logOut()
        .then((result) => {
          console.log('log out successfully')

        }).catch((err) => {
          console.log(err)
        });
    }
    const handleWindowSizeChange = () => {

        if (window.innerWidth <= 600) {
            setIsMobile(true)
        }
        else {
            setIsMobile(false)
        }        

    };
    useEffect(() =>{
        setAuthentication(currentUser.isAuthenticated)
        
    },[currentUser.isAuthenticated])

    useEffect(() =>{
        window.addEventListener('resize', handleWindowSizeChange);
        
        return () => {
         window.removeEventListener('resize', handleWindowSizeChange);

        }
    },[isMobile])


    
    return (
      <nav className="navigation">
        {showModal && (
          <Modal>
            <SearchUsers
              setShowModal={setShowModal}
              showModal={showModal}
              currentUser={currentUser.currentUser}
            />
          </Modal>
        )}
        <div className="logo-box">
          <div className="app-name">Socialisers</div>
        </div>
        <ul className="navigation__list">
          {isAuthenticated && (
            <React.Fragment>
              <li className="navigation__item">
                <div
                  className="navigation__link"
                  onClick={() => setShowModal(true)}
                >
                  {isMobile ? (
                    <FontAwesomeIcon icon={faSearch} size="2x" />
                  ) : (
                    "Users"
                  )}
                </div>
              </li>
              
              <li className="navigation__item">
                <div
                  className="navigation__link"
                  onClick={() => {
                    notificationDropdown();
                  }}
                >
                  <NavIcon icon={faBell} notifications={notifications} />
                </div>
              </li>
              <li className="navigation__item">
                <div className="navigation__link" onClick={messengerPopUp}>
                  <NavIcon icon={faComment} />
                </div>
              </li>
            </React.Fragment>
          )}
          {!isAuthenticated ? (
            <React.Fragment>
              <li className="navigation__item">
                <NavLink
                  to="/auth/login"
                  className="navigation__link"
                  activeClassName={null}
                >
                  Login
                </NavLink>
              </li>
              <li className="navigation__item">
                <NavLink
                  to="/auth/register"
                  className="navigation__link"
                  activeClassName={null}
                >
                  Register
                </NavLink>
              </li>
            </React.Fragment>
          ) : (
            <li className="navigation__item">
              <div onClick={logOutHandler} className="navigation__link">
                {isMobile ? (
                  <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
                ) : (
                  "LogOut"
                )}
              </div>
            </li>
          )}
        </ul>
        {!hideNotificationDropDown && <Notification />}
      </nav>
    );
}

const mapStateToProps = (state) => ({
  currentUser: state.user,
  hideNotificationDropDown: state.user.hideNotificationDropDown,
  hideMessenger: state.user.hideMessenger,
  notifications: state.user.userNotifications

})

const mapDispatchToProps = (dispatch) => ({
  messengerPopUp: () => dispatch(messengerButton()),
  notificationDropdown: () => dispatch(notificationButton()),
  clearNotifications: () => dispatch(clearNotifications()),
  logOut: () => dispatch(logOut())
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);