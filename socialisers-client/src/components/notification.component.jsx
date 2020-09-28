import React from 'react'
import { connect } from 'react-redux'

function Notification({notifications}) {
    return (
        <div className="dropdown">
            <div className="dropdown__items">
                {notifications && notifications.map((notification, index) => (
                    <div className="dropdown__item" key={index}>
                        <div className="dropdown__item__details">
                            <span class="name">{notification}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    notifications: state.user.userNotifications
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
