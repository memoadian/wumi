import React from 'react'
import './GlobalFilter.css'

const GlobalFilter = ({filter, setFilter}) => {
    return (
        <p className="search">
            <span>Buscar: {' '}</span>
            <input
                className=""
                value={filter || ''}
                onChange={e => setFilter(e.target.value)}
                type="text"
            />
        </p>
    )
}

export default GlobalFilter
