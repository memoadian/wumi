import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from 'shared/context/auth-context'
import logo from "logo.png"

const Sidebar = () => {
    const auth = useContext(AuthContext)
    
    return (
        <>
        {auth.isLoggedIn && (
        <div className="sidebar">
            <div className="logo">
                <img src={logo} alt="" />
                <span>WUMI</span>
            </div>
            <ul>
                <li>
                    <NavLink to="/panel">Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/users">Usuarios</NavLink>
                </li>
                <li>
                    <NavLink to="/home">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/categories">Categorias</NavLink>
                </li>
                <li>
                    <NavLink to="/notifications">Notificaciones</NavLink>
                </li>
            </ul>
        </div>
        )}
        </>
    )
}

export default Sidebar