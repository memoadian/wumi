import React, { useReducer, useEffect } from 'react'
import { validate } from 'shared/utils/validator'

import './Input.css'

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            }
        case 'TOUCH':
            return {
                ...state,
                isTouched: true,
                value: action.val,
                isValid: validate(action.val, action.validators)
            }
        default: 
            return state
    }
}

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.value || '',
        isTouched: false,
        isValid: props.valid || false
    })

    const { id, onInput} = props
    const { value, isValid } = inputState

    useEffect(() => {
        props.onInput(props.id, inputState.value, inputState.isValid)
    }, [id, value, isValid, onInput])

    const changeHandler = event => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators
        })
    }

    const touchHandler = event => {
        dispatch({
            type: 'TOUCH',
            val: event.target.value,
            validators: props.validators
        })
    }

    const element = () => {
        switch (props.element) {
            case 'textarea':
                return <textarea
                    id={props.id}
                    onChange={changeHandler}
                    onBlur={touchHandler}
                    value={inputState.value}
                />
            case 'select':
                return <select
                    id={props.id}
                    onChange={changeHandler}
                    onBlur={touchHandler}
                    value={inputState.value}
                />
            default:
                return <input 
                    id={props.id}
                    type={props.type}
                    placeholder={props.placeholder}
                    onChange={changeHandler}
                    onBlur={touchHandler}
                    value={inputState.value}
                />
        }
    }

    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`} >
            <label htmlFor={props.id}>{props.label}</label>
            {element()}
            {!inputState.isValid && inputState.isTouched && <span>{props.errorText}</span>}
        </div>
    )
}

export default Input
