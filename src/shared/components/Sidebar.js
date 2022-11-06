import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from 'shared/context/auth-context'
import logo from 'logo.png'

const Sidebar = () => {
  const auth = useContext(AuthContext)

  return (
    <>
      {auth.isLoggedIn && (
        <div className='sidebar'>
          <div className='logo'>
            <img src={logo} alt='' />
          </div>
          <ul>
            <li>
              <NavLink to='/panel'>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to='/users?page=1'>Usuarios</NavLink>
            </li>
            <li>
              <NavLink to='/home'>Home</NavLink>
            </li>
            <li>
              <NavLink to='/capsulas'>Cats Capsula</NavLink>
            </li>
            <li>
              <NavLink to='/meditacion'>Cats Meditación</NavLink>
            </li>
            <li>
              <NavLink to='/notifications'>Notificaciones</NavLink>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}

export default Sidebar
