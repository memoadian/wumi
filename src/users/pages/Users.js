import React, {useEffect, useContext, useState, useMemo } from 'react'
import { AuthContext } from 'shared/context/auth-context'
import DataTable from 'react-data-table-component'
import styled from 'styled-components'
import getUsers from 'shared/helpers/getUsers'
import Modal from 'react-modal'

const Users = () => {

    const auth = useContext(AuthContext)
    const [openModal, setOpenModal] = useState(false)
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
    const [filterText, setFilterText] = useState('')
    const [users, setUsers] = useState([])
    const filteredUsers = users.filter(item =>
        item.first_name && item.first_name.toLowerCase().includes(filterText.toLocaleLowerCase())
    )

    useEffect(() => {
        if (!auth) { return }
        getUsers(auth.token)
            .then((data) => {
                setUsers(data)
            })
    }, [auth])

    const onRowClicked = (row, event) => { 
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

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

    const customStyles = {
        content: {
            width: '60%',
            height: '80%',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '36px 75px',
            border: 'none',
            borderRadius: '30px'
        },
    }

    const TextField = styled.input`
        height: 32px;
        width: 200px;
        border-radius: 3px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border: 1px solid #e5e5e5;
        padding: 0 32px 0 16px;

        &:hover {
            cursor: pointer;
        }
    `;

    const ClearButton = styled.button`
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        height: 34px;
        width: 32px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const FilterComponent = ({ filterText, onFilter, onClear }) => (
        <>
            <TextField
                id="search"
                type="text"
                placeholder="Filter By Name"
                aria-label="Search Input"
                value={filterText}
                onChange={onFilter}
            />
            <ClearButton type="button" onClick={onClear}>
                X
            </ClearButton>
        </>
    )

	const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
		);
	}, [filterText, resetPaginationToggle]);

    return (
        <div>
            <h1>Usuarios <span> {users && users.length} </span></h1>
            <div className="columns">
                <div className="column">
                    <div className="card no-margin">
                        <div>
                            <DataTable
                                columns={columns}
                                data={filteredUsers}
                                customStyles={customStyles}
                                pagination
			                    paginationResetDefaultPage={resetPaginationToggle}
                                subHeader
                                subHeaderComponent={subHeaderComponentMemo}
                                onRowClicked={onRowClicked}/>
                            <Modal
                                ariaHideApp={false}
                                isOpen={openModal}
                                style={customStyles}
                                onRequestClose={handleCloseModal}
                                overlayClassName="Overlay">
                                <h1>Información de perfil</h1>
                                <form className="form-modal">
                                    <div className="columns">
                                    </div>
                                    <div className="columns">

                                    </div>
                                </form>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users
