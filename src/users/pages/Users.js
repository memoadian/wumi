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
        selector: 'first_name',
        sortable: true,
    },
    {
        name: 'Apellidos',
        selector: 'last_name',
        sortable: true,
    },
    {
        name: 'Correo',
        selector: 'email',
        sortable: true,
    },
    {
        name: 'Género',
        selector: 'gender.title',
        sortable: true,
    },
    {
        name: 'Rango de Edad',
        selector: 'age.title',
        sortable: true,
    },
    {
        name: 'Momento',
        selector: 'my_time.title',
        sortable: true,
    },
    {
        name: 'Área de oportunidad',
        selector: 'opportunity.title',
        sortable: true,
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
