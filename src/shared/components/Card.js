import React from 'react'

const Card = ({title, subtitle, indicator}) => {
    return (
        <div className="card">
            <span className="title"> {title} </span>
            <span className="subtitle"> {subtitle} </span>
        </div>
    )
}

export default Card
