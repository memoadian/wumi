import React from 'react'
import { NavLink } from 'react-router-dom'

const CardCategory = props => {

    const trigger = () => {
        props.onClickEdit({editMode: true, id: props.id})
    }

    return (
        <>
            <div className="card-category">
                <div className="card-category-header" style={{backgroundColor: `${props.background}`}}>
                    {props.title}
                </div>
                <div className="card-category-body">
                    {props.description}
                </div>
                <div className="card-category-footer">
                    <NavLink to={`/category/${props.id}`}>
                        <span className="left">Ingresar</span>
                    </NavLink>
                    <span 
                        className="right"
                        onClick={trigger} >
                        Editar
                    </span>
                </div>
            </div>
        </>
    )
}

export default CardCategory
