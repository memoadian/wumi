import React from 'react'
import { NavLink } from 'react-router-dom'

const CardCategory = ({id, title, background, description}) => {
    return (
        <>
            <div className="card-category">
                <div className="card-category-header" style={{backgroundColor: `${background}`}}>
                    {title}
                </div>
                <div className="card-category-body">
                    {description}
                </div>
                <div className="card-category-footer">
                    <NavLink to={`/category/${id}`}>
                        <span className="left">Ingresar</span>
                    </NavLink>
                    <span className="right">Editar</span>
                </div>
            </div>
        </>
    )
}

export default CardCategory
