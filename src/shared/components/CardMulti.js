import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { AuthContext } from 'shared/context/auth-context'

const CardMulti = () => {

    const auth = useContext(AuthContext)
    const [men, setMen] = useState(0)
    const [women, setWomen] = useState(0)
    const [omit, setOmit] = useState(0)
    const [other, setOther] = useState(0)

    useEffect(() => {
        if (!auth.token) { return }
        const fetchByGender = async () => {
            const response = await axios({
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                baseURL: 'https://api.wumi.app/api/v1/statistics/users/',
                method: 'GET',
            })

            const data = response.data.results
            const total = data.reduce((sum, {total}) => sum + total, 0)
            const men = Math.round((data[0].total / total)*100)
            const women = Math.round((data[1].total / total)*100)
            const omit = Math.round((data[2].total / total)*100)
            const other = Math.round((data[3].total / total)*100)

            setMen(isNaN(men) ? 0 : men)
            setWomen(isNaN(women) ? 0 : women)
            setOmit(isNaN(omit) ? 0 : omit)
            setOther(isNaN(other) ? 0 : other)
        }
        fetchByGender()        
    }, [auth])

    return (
        <div className="card card-multi">
            <div className="columns">
                <div className="column">
                    <span className="title">{men}%</span>
                    <span className="subtitle">Hombres</span>
                </div>
                <div className="column">
                    <span className="title">{women}%</span>
                    <span className="subtitle">Mujeres</span>
                </div>
                <div className="column">
                    <span className="title">{omit}%</span>
                    <span className="subtitle">Omitir</span>
                </div>
                <div className="column">
                    <span className="title">{other}%</span>
                    <span className="subtitle">Otro</span>
                </div>
            </div>
        </div>
    )
}

export default CardMulti
