import React from 'react'

const CardWithHeader = ({children, title}) => {
    return (
        <div className="card-with-header">
            <div className="header">
                <span className="title">{title}</span>
            </div>
            <div className="body">
                {children}
            </div>
        </div>
    )
}

export default CardWithHeader
