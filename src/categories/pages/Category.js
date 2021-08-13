import {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import cat1 from 'assets/cat1.png'
import cat2 from 'assets/cat2.png'
import Modal from 'react-modal'
import DataTable from 'react-data-table-component';
import { AuthContext } from 'shared/context/auth-context'

import './Category.css'

const Category = props => {
    const auth = useContext(AuthContext)
    const [openModal, setOpenModal] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
        if (!auth.token) {return}
        const getCategory = async () => {
            const response = await axios({
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                baseURL: `https://api.wumi.app/api/v1/contents/?category=${props.match.params.id}`,
                method: 'GET',
            })

            console.log(response.data.results)
            setData(response.data.results)
        }
        getCategory()
    }, [auth, props.match.params.id])

    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const customStyles = {
        content: {
            width: '80%',
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

    const columns = [{
        name: 'Título',
        selector: row => row.title,
        sortable: true,
        maxWidth: '200px',
    },
    {
        name: 'Descripción',
        selector: row => row.description,
        sortable: true,
        maxWidth: '200px',
    },
    {
        name: 'Duración',
        selector: row => row.content_asset.duration,
        sortable: true,
    },
    {
        name: 'Nivel',
        selector: row => row.level.title,
        sortable: true,
    },
    {
        name: 'Tipo',
        selector: row => row.type_content.title,
        sortable: true,
    },
    {
        name: 'Status',
        selector: row => row.cstatus.title,
        sortable: true,
    }];

    return (
        <div>
            <div className="title-h1">
                {data[0] && (<h1>{data[0].category.title}</h1>)}
                <button className="button right-h1" onClick={handleOpenModal} >Nuevo Contenido</button>
            </div>
            <div className="card no-margin">
                <div>
                    <DataTable
                        columns={columns}
                        data={data}
                    />
                </div>
            </div>
            <Modal
                isOpen={openModal}
                style={customStyles}
                onRequestClose={handleCloseModal}
                overlayClassName="Overlay">
                <h1>Nueva Categoría</h1>
                <form className="form-modal">
                    <div className="columns">
                        <div className="column">
                            <img src={cat1} alt="" />
                        </div>
                        <div className="column">
                            <img src={cat2} alt="" />
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column buttons">
                            <button onClick={handleCloseModal} type="button" className="button cancel">Cancelar</button>
                            <button className="button submit">Continuar</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Category
