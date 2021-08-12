import React from 'react'
import DataTable from 'react-data-table-component';

const Users = () => {
    const data = [
        { name: 'Belén', surname: 'Sosa', email: 'belen@mail.com', genre: 'Mujer', range: '20-25', moment: 'Mientras..', area: 'Relaciones interpersonales', level: 'algunas veces' },
        { name: 'Belén', surname: 'Sosa', email: 'belen@mail.com', genre: 'Mujer', range: '20-25', moment: 'Mientras..', area: 'Relaciones interpersonales', level: 'algunas veces' },
        { name: 'Belén', surname: 'Sosa', email: 'belen@mail.com', genre: 'Mujer', range: '20-25', moment: 'Mientras..', area: 'Relaciones interpersonales', level: 'algunas veces' },
        { name: 'Belén', surname: 'Sosa', email: 'belen@mail.com', genre: 'Mujer', range: '20-25', moment: 'Mientras..', area: 'Relaciones interpersonales', level: 'algunas veces' },
        { name: 'Belén', surname: 'Sosa', email: 'belen@mail.com', genre: 'Mujer', range: '20-25', moment: 'Mientras..', area: 'Relaciones interpersonales', level: 'algunas veces' },
        { name: 'Belén', surname: 'Sosa', email: 'belen@mail.com', genre: 'Mujer', range: '20-25', moment: 'Mientras..', area: 'Relaciones interpersonales', level: 'algunas veces' },
        { name: 'Belén', surname: 'Sosa', email: 'belen@mail.com', genre: 'Mujer', range: '20-25', moment: 'Mientras..', area: 'Relaciones interpersonales', level: 'algunas veces' },
        { name: 'Belén', surname: 'Sosa', email: 'belen@mail.com', genre: 'Mujer', range: '20-25', moment: 'Mientras..', area: 'Relaciones interpersonales', level: 'algunas veces' },
        { name: 'Belén', surname: 'Sosa', email: 'belen@mail.com', genre: 'Mujer', range: '20-25', moment: 'Mientras..', area: 'Relaciones interpersonales', level: 'algunas veces' },
        { name: 'Belén', surname: 'Sosa', email: 'belen@mail.com', genre: 'Mujer', range: '20-25', moment: 'Mientras..', area: 'Relaciones interpersonales', level: 'algunas veces' },
        { name: 'Belén', surname: 'Sosa', email: 'belen@mail.com', genre: 'Mujer', range: '20-25', moment: 'Mientras..', area: 'Relaciones interpersonales', level: 'algunas veces' },
    ];

    const columns = [
    {
        name: 'Nombre(s)',
        selector: 'name',
        sortable: true,
    },
    {
        name: 'Apellidos',
        selector: 'surname',
        sortable: true,
    },
    {
        name: 'Correo',
        selector: 'email',
        sortable: true,
        right: true,
    },
    {
        name: 'Género',
        selector: 'genre',
        sortable: true,
        right: true,
    },
    {
        name: 'Rango de Edad',
        selector: 'range',
        sortable: true,
        right: true,
    },
    {
        name: 'Momento',
        selector: 'moment',
        sortable: true,
        right: true,
    },
    {
        name: 'Área de oportunidad',
        selector: 'area',
        sortable: true,
        right: true,
    },
    {
        name: 'Nivel',
        selector: 'level',
        sortable: true,
        right: true,
    },
    ];

    return (
        <div>
            <h1>Usuarios <span>1,369</span></h1>
            <div className="columns">
                <div className="column">
                    <div className="card no-margin">
                        <div>
                            <DataTable
                                columns={columns}
                                data={data}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users
