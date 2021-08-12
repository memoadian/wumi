import React, {useState} from 'react'
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import Modal from 'react-modal';

const Notifications = () => {
    const [openModal, setOpenModal] = useState(false)

    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const customStyles = {
        rows: {
            style: {
                minHeight: '70px', // override the row height
                borderBottom: '0px solid transparent',
            }
        },
        headCells: {
            style: {
                minHeight: '80px',
                fontWeight: 'bold',
                fontSize: '14px'
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
            },
        },
        content: {
            width: '50%',
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
    };

    const data = [
        { title: 'Bienvenidos a WUMI', content: 'Lorem ipsum...', date: '20.06.2021' },
        { title: 'Nueva Meditación sobre sanación', content: '...', date: '20.06.2021' },
    ];

    const columns = [
    {
        name: 'Título',
        selector: 'title',
        sortable: true,
    },
    {
        name: 'Contenido',
        selector: 'content',
        sortable: true,
    },
    {
        name: 'Fecha',
        selector: 'date',
        sortable: true,
        right: true,
    },
    ];

    const dataTable = {
        columns,
        data,
    }

    return (
        <div>
            <div className="title-h1">
                <h1>Notificaciones</h1>
                <button className="button right-h1" onClick={handleOpenModal} >Crear Nuevo</button>
            </div>

            <div className="columns">
                <div className="column">
                    <div className="card no-padding">
                        <DataTableExtensions {...dataTable} 
                                filterPlaceholder="Buscar"
                            >
                            <DataTable
                                columns={columns}
                                data={data}
                                customStyles={customStyles}
                            />
                        </DataTableExtensions>
                        <Modal
                            isOpen={openModal}
                            style={customStyles}
                            onRequestClose={handleCloseModal}
                            overlayClassName="Overlay">
                            <h1>Nueva Notificación</h1>
                            <form className="form-modal">
                                <label>Título</label>
                                <input type="text" />
                                <label>Contenido</label>
                                <textarea name="" id="" cols="30" rows="10"></textarea>
                                <label>Link (opcional)</label>
                                <input type="text" />
                                <div className="columns">
                                    <div className="column buttons">
                                        <button className="button cancel">Cancelar</button>
                                        <button className="button submit">Enviar</button>
                                    </div>
                                </div>
                            </form>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notifications
