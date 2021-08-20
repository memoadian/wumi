import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import Card from 'shared/components/Card'
import { PieChart } from 'react-minimal-pie-chart'
import { AuthContext } from 'shared/context/auth-context'
import CardWithHeader from 'shared/components/CardWithHeader'
import CardMulti from 'shared/components/CardMulti'
import DataTable from 'react-data-table-component';
import getStatsCategories from 'shared/helpers/getStatsCategories'

const Dashboard = () => {

    const auth = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const [mostCategories, setMostCategories] = useState([])
    const [countUsers, setCountUsers] = useState([])

    useEffect(() => {
        if (!auth) { return }
        getStatsCategories(auth.token)
            .then(cats => {
                setMostCategories(cats)
            })

        const fetchUsers = async () => {
            const response = await axios({
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                baseURL: 'https://api.wumi.app/api/v1/users/',
                method: 'GET',
            })

            setCountUsers(response.data.count)
        }
        fetchUsers()
    }, [auth])

    const data = [
        { id: 1, tipo: 'Escaneo Coporal', vistas: '342' },
        { id: 2, tipo: 'Lorem ipsum', vistas: '342' },
        { id: 3, tipo: 'lorem ipsum', vistas: '342' },
        { id: 4, tipo: 'Escaneo Coporal', vistas: '342' },
    ];

    const columns = [
    {
        name: 'ID',
        selector: row => row.id,
    },
    {
        name: 'Tipo',
        selector: row => row.tipo,
    },
    {
        name: 'Vistas',
        selector: row => row.vistas,
        sortable: true,
        right: true,
    },
    ];

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="columns">
                <div className="column">
                    <Card title={countUsers} subtitle="Usuarios" indicator=""/>
                </div>
                <div className="column is-three-fifths">
                    <CardMulti/>
                </div>
                <div className="column">
                    <Card title="1,369" subtitle="Usuarios" indicator=""/>
                </div>
            </div>
            <div className="columns">
                <div className="column">
                    <CardWithHeader title="Categorías + visitadas" >
                        <div className="columns">
                            <div className="column">
                                <PieChart
                                    lineWidth="20"
                                    data={mostCategories}/>
                            </div>
                            <div className="column">
                                <ul className="labels">
                                    <li><span className="circle" style={{backgroundColor: '#fcece5'}}></span> Cuerpo <span className="num">20%</span></li>
                                    <li><span className="circle" style={{backgroundColor: '#fdf8dd'}}></span> Sanación <span className="num">20%</span></li>
                                    <li><span className="circle" style={{backgroundColor: '#d8eaf9'}}></span> Descanso <span className="num">20%</span></li>
                                    <li><span className="circle" style={{backgroundColor: '#dbf2d9'}}></span> Mente <span className="num">20%</span></li>
                                    <li><span className="circle" style={{backgroundColor: '#dddee8'}}></span> Respiración <span className="num">20%</span></li>
                                </ul>
                            </div>
                        </div>
                    </CardWithHeader>
                </div>
                <div className="column is-two-thirds">
                    <CardWithHeader title="Meditaciones + vistas">
                        <DataTable
                            columns={columns}
                            data={data}
                        />
                    </CardWithHeader>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
