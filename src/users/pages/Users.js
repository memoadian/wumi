import React, {useEffect, useContext, useState } from 'react'
import axios from 'axios'
import { AuthContext } from 'shared/context/auth-context'
import DataTable from 'react-data-table-component';

const Users = () => {

    const auth = useContext(AuthContext)
    const [data, setData] = useState([])
    const [users, setUsers] = useState(0)

    useEffect(() => {
        if (!auth.token) {return}
        const fetchUsers = async () => {
            const response = await axios({
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                baseURL: 'https://api.wumi.app/api/v1/users/',
                method: 'GET',
            })

            setData(response.data.results)
            setUsers(response.data.count)
        }
        fetchUsers()
    }, [auth])

    const columns = [{
        name: 'Nombre(s)',
        selector: row => row.first_name,
    },
    {
        name: 'Apellidos',
        selector: row => row.last_name,
    },
    {
        name: 'Correo',
        selector: row => row.email,
    },
    {
        name: 'Género',
        selector: row => row.gender.title,
    },
    {
        name: 'Rango de Edad',
        selector: row => row.age.title,
    },
    {
        name: 'Momento',
        selector: row => row.my_time.title,
    },
    {
        name: 'Área de oportunidad',
        selector: row => row.opportunity.title,
    }]

    return (
        <div>
            <h1>Usuarios <span> {users} </span></h1>
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
