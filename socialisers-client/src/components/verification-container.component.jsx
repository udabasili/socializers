import  React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function VerificationContainer(props) {
  return (
    <div className="verification-container">
        <div className="verification-content">
            <div className="verification-content__header">
                <div className="icon-box">
                    <FontAwesomeIcon className="icon" style={{color: props.color}} icon={props.icon}/>
                </div>			
            </div>
            <div className="verification-content__body">
                <h1>
                    {props.header}
                </h1>	
               {props.children}
            </div>
        </div>
    </div>
  );
}
