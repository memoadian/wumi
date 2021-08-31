import React, { useState, useCallback, useEffect } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom'

import Sidebar from 'shared/components/Sidebar'
import ContentBody from './ContentBody'

import Caps from '../categories/pages/Caps'
import Medit from '../categories/pages/Medit'
import Category from '../categories/pages/Category'
import NewContentSingle from '../categories/pages/NewContentSingle'
import NewContentChapter from '../categories/pages/NewContentChapter'
import EditContentSingle from 'categories/pages/EditContentSingle'
import EditContentChapter from 'categories/pages/EditContentChapter'
import Home from '../home/pages/Home'
import Login from '../login/pages/Login'
import Notifications from '../notifications/pages/Notifications'
import Users from '../users/pages/Users'
import Profile from '../profile/pages/Profile'
import Dashboard from '../dashboard/pages/Dashboard'
import { AuthContext } from 'shared/context/auth-context'

const Main = () => {
    const [token, setToken] = useState(false)
    const [user, setUser] = useState(false)

    const login = useCallback((user, token) => {
        setToken(token)
        setUser(user)
        localStorage.setItem('userData', JSON.stringify({
            user: user,
            token: token
        }))
    },[])

    const logout = useCallback(() => {
        setToken(false)
        setUser(null)
        localStorage.removeItem('userData')
    },[])

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'))
        if (storedData && storedData.token) {
            login(storedData.user, storedData.token)
        }
    }, [login])

    return (
        <AuthContext.Provider value={{
            isLoggedIn: !!token,
            token: token,
            user: user,
            login: login,
            logout: logout
        }}>
            <Router>
                <Route 
                    render={({location}) => ['/', '/login'].includes(location.pathname)
                        ? null
                        : <Sidebar/>
                    } />
                <ContentBody>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route exact path="/panel" component={Dashboard} />
                        <Route exact path="/users" component={Users} />
                        <Route exact path="/home" component={Home} />
                        <Route exact path="/capsulas" component={Caps} />
                        <Route exact path="/meditacion" component={Medit} />
                        <Route exact path="/notifications" component={Notifications} />
                        <Route exact path="/profile" component={Profile} />
                        <Route exact path="/category/:id" component={Category} />
                        <Route exact path="/content-single/:cat_id" component={NewContentSingle} />
                        <Route exact path="/content-chapter/:cat_id" component={NewContentChapter} />
                        <Route exact path="/edit-single/:id" component={EditContentSingle} />
                        <Route exact path="/edit-chapter/:id" component={EditContentChapter} />
                    </Switch>
                </ContentBody>
            </Router>
        </AuthContext.Provider>
    )
}

export default Main
