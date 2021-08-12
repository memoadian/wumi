import React from 'react'
import Card from 'shared/components/Card'
import { PieChart } from 'react-minimal-pie-chart'
import CardWithHeader from 'shared/components/CardWithHeader'
import CardMulti from 'shared/components/CardMulti'
import DataTable, { createTheme } from 'react-data-table-component';

const Dashboard = () => {

    const data = [
        { id: 1, tipo: 'Escaneo Coporal', vistas: '342' },
        { id: 2, tipo: 'Lorem ipsum', vistas: '342' },
        { id: 3, tipo: 'lorem ipsum', vistas: '342' },
        { id: 4, tipo: 'Escaneo Coporal', vistas: '342' },
    ];

    const columns = [
    {
        name: 'ID',
        selector: 'id',
        sortable: true,
    },
    {
        name: 'Tipo',
        selector: 'tipo',
        sortable: true,
    },
    {
        name: 'Vistas',
        selector: 'vistas',
        sortable: true,
        right: true,
    },
    ];

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="columns">
                <div className="column">
                    <Card title="1,369" subtitle="Usuarios" indicator=""/>
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
                                    data={[
                                    { title: 'Cuerpo', value: 10, color: '#fcece5' },
                                    { title: 'Sanación', value: 15, color: '#fdf8dd' },
                                    { title: 'Descanso', value: 20, color: '#d8eaf9' },
                                    { title: 'Mente', value: 20, color: '#dbf2d9' },
                                    { title: 'Respiración', value: 20, color: '#dddee8' },
                                ]}/>
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
