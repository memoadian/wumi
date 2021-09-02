import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router'
import { AuthContext } from 'shared/context/auth-context'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import cat1 from 'assets/cat1.png'
import cat2 from 'assets/cat2.png'
import Modal from 'react-modal'
import DataTable from 'react-data-table-component';
import Loader from 'shared/UIElements/Loader'
import './Category.css'

const Category = props => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const [title, setTitle] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [type, setType] = useState('')
    const [data, setData] = useState([])

    useEffect(() => {
        if (!auth.token) {return}
        const getCategoryContent = async () => {
            setIsLoading(true)
            const response = await axios({
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                baseURL: `https://api.wumi.app/api/v1/contents/?category=${props.match.params.id}`,
                method: 'GET',
            })

            setData(response.data.results)
            setIsLoading(false)
        }
        getCategoryContent()

        const getCategory = async () => {
            setIsLoading(true)
            const response = await axios({
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                baseURL: `https://api.wumi.app/api/v1/catalog/categories/${props.match.params.id}/`,
                method: 'GET',
            })

            setTitle(response.data.title)
            setIsLoading(false)
        }
        getCategory()
    }, [auth, props.match.params.id])

    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const handleContent = type => {
        setType(type)
    }

    const handleGoContent = () => {
        if (type === 'single') {
            history.push(`/content-single/${props.match.params.id}`)
        } else if (type === 'chapter') {
            history.push(`/content-chapter/${props.match.params.id}`)
        }
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
        selector: row => (row.content_asset != null) ? row.content_asset.duration : '',
        sortable: true,
    },
    {
        name: 'Nivel',
        selector: row => row.level.title,
        sortable: true,
    },
    {
        name: 'Tipo',
        selector: row => row.category.type_content.title,
        sortable: true,
    },
    {
        name: 'Status',
        selector: row => row.cstatus.title,
        sortable: true,
    },
    {
        name: '',
        button: true,
        cell: row => <NavLink to={(row.is_individual) ? `/edit-single/${row.id}` : `/edit-chapter/${row.id}`}>Edit</NavLink>,
    }]

    return (
        <div>
            <div className="title-h1">
                <h1>{title}</h1>
                <button className="button right-h1" onClick={handleOpenModal} >Nuevo Contenido</button>
            </div>
            <div className="card no-margin">
                {isLoading && <Loader asOverlay />}
                <div>
                    {data && <DataTable
                        columns={columns}
                        data={data}/>}
                </div>
            </div>
            <Modal
                ariaHideApp={false}
                isOpen={openModal}
                style={customStyles}
                onRequestClose={handleCloseModal}
                overlayClassName="Overlay">
                <h1>Nueva Categoría</h1>
                <form className="form-modal">
                    <div className="columns">
                        <div className="column">
                            <div className={`single ${type === "single" ? "active" : ""}`} onClick={() => handleContent('single')}>
                                <img src={cat1} alt="" />
                                <h1 className="desc">Contenido Individual</h1>
                            </div>
                        </div>
                        <div className="column">
                            <div className={`single ${type === "chapter" ? "active" : ""}`} onClick={() => handleContent('chapter')}>
                                <img src={cat2} alt="" />
                                <h1 className="desc">Contenido Por Capítulo</h1>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column buttons">
                            <button onClick={handleCloseModal} type="button" className="button cancel">Cancelar</button>
                            <button onClick={handleGoContent} type="button" className="button submit">Continuar</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Category
