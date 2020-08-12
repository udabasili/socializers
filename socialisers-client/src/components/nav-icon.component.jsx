import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function NavIcon({icon, notifications}) {
    return (
        <div className='nav-icon'>
            <FontAwesomeIcon  className="nav-icon__icon" icon={icon}/>
            {notifications &&
                notifications.length > 0 &&
                <div className='notification'>
                    <div className='count'>
                        {notifications.length}
                    </div>
                </div>
            }
            
        </div>
    )
}
