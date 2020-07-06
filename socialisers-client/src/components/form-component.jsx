import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function FormComponent({
        labelIcon,
        value, 
        onChangeHandler, 
        type ='text',
        onBlurredHandler,
        label, 
        name, 
        validated='true', 
        error = null, 
        focused=null
    }) {
        
    return (
        <div className="form__component">
            <i className="form__group__icon"><FontAwesomeIcon icon={labelIcon}/></i>
            <div className="form__group">
                <input
                    type={type}
                    name={name}
                    onBlur={onBlurredHandler}
                    onChange={onChangeHandler}
                    value={value}
                    style={{ color: validated ? "black" : "red" }}
                    className="form__input" required/>
                <label htmlFor={name} className="form__label">
                    {label}
                  </label>
                {(!validated && focused && error) &&
                    <div className="validation-error">{error}</div>
                }
            </div>
        </div>
    )
}
