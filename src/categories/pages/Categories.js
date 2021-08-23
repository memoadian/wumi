import {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import Scrollbars from 'react-custom-scrollbars-2'
import Modal from 'react-modal'
import CardCategory from 'categories/components/CardCategory'
import { AuthContext } from 'shared/context/auth-context'
import Loader from 'shared/UIElements/Loader'

const Categories = () => {
    const auth = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
        if (!auth.token) {return}
        const fetchCategories = async () => {
            setIsLoading(true)
            const response = await axios({
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                baseURL: 'https://api.wumi.app/api/v1/catalog/categories',
                method: 'GET',
            })

            setData(response.data.results)
            setIsLoading(false)
        }
        fetchCategories()
    }, [auth])

    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const customStyles = {
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
    }

    const listItems = data.map(({id, title, color, description}) => 
        <div key={id} className="column is-one-quarter-desktop is-half-tablet">
            <CardCategory 
                id={id} 
                title={title} 
                background={color} 
                description={description} />
        </div>
    )

    return (
        <div>
            <div className="title-h1">
                <h1>Categorias</h1>
                <button className="button right-h1" onClick={handleOpenModal} >Nueva Categoría</button>
            </div>
            <div className="card no-margin">
                {isLoading && <Loader asOverlay />}
                <Scrollbars
                    style={{ height: 650}}
                    renderTrackHorizontal={props => <div {...props} style={{display: 'none'}} />}
                    >
                    <div className="padding-container" style={{padding: '20px'}}>
                        <div className="columns is-multiline">
                            {listItems}
                        </div>
                    </div>
                </Scrollbars>
                <Modal
                    isOpen={openModal}
                    style={customStyles}
                    onRequestClose={handleCloseModal}
                    overlayClassName="Overlay">
                    <h1>Nueva Categoría</h1>
                    <form className="form-modal">
                        <label>Título</label>
                        <input type="text" />
                        <label>Descripción</label>
                        <textarea name="" id="" cols="30" rows="10"></textarea>
                        <label>Color</label>
                        <div className="columns">
                            <div className="column buttons">
                                <button onClick={handleCloseModal} type="button" className="button cancel">Cancelar</button>
                                <button className="button submit">Guardar</button>
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    )
}

export default Categories
