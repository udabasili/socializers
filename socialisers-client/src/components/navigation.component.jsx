import  React,{useState, useEffect} from 'react'
import { NavLink } from 'react-router-dom';
import {connect} from "react-redux";
import { logOut, notificationButton, clearNotifications } from '../redux/user/user.actions';
import NavIcon from './nav-icon.component';
import { faSignOutAlt, faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from './modal.component';
import SearchUsers from './search-users.component';
import Notification from './notification.component';


function Navigation({
	currentUser, 
    logOut, 
    notificationDropdown, 
	hideNotificationDropDown, 
	isMobile,
	notifications 
	}) {
	console.log(isMobile)
    const [isAuthenticated, setAuthentication] = useState(currentUser.isAuthenticated);
    const [showModal, setShowModal] = useState(false)
    const logOutHandler = () => {
      logOut();
    }
  
    useEffect(() =>{
        setAuthentication(currentUser.isAuthenticated)
        
	},[currentUser.isAuthenticated])
	
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
                    <FontAwesomeIcon icon={faSearch}/>
                  ) : (
                    "Users"
                  )}
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
                  <FontAwesomeIcon icon={faSignOutAlt} />
                ) : (
                  "LogOut"
                )}
              </div>
            </li>
          )}
        </ul>
      </nav>
    );
}

const mapStateToProps = (state) => ({
  currentUser: state.user,
  hideNotificationDropDown: state.user.hideNotificationDropDown,
  notifications: state.user.userNotifications

})

const mapDispatchToProps = (dispatch) => ({
  notificationDropdown: () => dispatch(notificationButton()),
  clearNotifications: () => dispatch(clearNotifications()),
  logOut: () => dispatch(logOut())
})

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);