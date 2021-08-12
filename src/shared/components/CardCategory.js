import React from 'react'

const CardCategory = ({title, background}) => {
    return (
        <>
            <div className="card-category">
                <div className="card-category-header" style={{backgroundColor: `${background}`}}>
                    {title}
                </div>
                <div className="card-category-body">
                    <p>Meditaciones totales:</p>
                    <p>23</p>
                    <p>Capsulas totales:</p>
                    <p>5</p>
                </div>
                <div className="card-category-footer">
                    <span className="left">Ingresar</span>
                    <span className="right">Editar</span>
                </div>
            </div>
        </>
    )
}

export default CardCategory
