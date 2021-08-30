import {useState, useContext, useEffect} from 'react'
import { AuthContext } from 'shared/context/auth-context'
import { useForm } from 'shared/hooks/form-hook'
import axios from 'axios'
import Scrollbars from 'react-custom-scrollbars-2'
import Modal from 'react-modal'
import CardCategory from 'categories/components/CardCategory'
import Loader from 'shared/UIElements/Loader'
import Input from 'shared/components/FormElements/Input'

const Categories = () => {
    const auth = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [isEditMode, setIsEditMode] = useState(false)
    const [categorySelected, setCategorySelected] = useState(null)
    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        color: {
            value: '',
            isValid: false
        },
    }, false)

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

            setCategories(response.data.results)
            setIsLoading(false)
        }
        fetchCategories()
    }, [auth])

    const handleOpenModal = (data) => {
        if (data.editMode) {
            setIsEditMode(true)
        }
        if (data.id !== null) {
            setCategorySelected(categories.find(cat => cat.id === data.id))
        }
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        if (isEditMode)
            setIsEditMode(false)
        setOpenModal(false)
    }

    const submitCategory = async e => {
        e.preventDefault()
    }

    const updateCategory = async e => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('title', formState.inputs.title.value)
        formData.append('description', formState.inputs.description.value)
        formData.append('color', formState.inputs.color.value)

        console.log(formState.inputs.title.value)
        console.log(formState.inputs.description.value)
        console.log(formState.inputs.color.value)

        try {
            setIsLoading(true)
            const resp = await axios({
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                baseURL: `https://api.wumi.app/api/v1/catalog/categories/${categorySelected.id}/`,
                method: 'PATCH',
                mode: 'no-cors',
                data: formData
            })

            setIsLoading(false)
                
            if (resp.status === 200) {
                console.log(resp.data)
            } else {
                //setError(resp)
                console.log(resp.status)
            }
        } catch (err) {
            setIsLoading(false)
            //setError(err.errors || 'Something went wrong, please try again.')
        }
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

    const listItems = categories.map(({id, title, color, description}) => 
        <div
            key={id}
            className="column is-one-quarter-desktop is-half-tablet">
            <CardCategory 
                id={id} 
                title={title} 
                background={color} 
                description={description}
                onClickEdit={handleOpenModal}
            />
        </div>
    )

    return (
        <div>
            <div className="title-h1">
                <h1>Categorias</h1>
                <button 
                    className="button right-h1" 
                    onClick={handleOpenModal}>
                    Nueva Categoría
                </button>
            </div>
            <div className="card no-margin">
                {isLoading && <Loader asOverlay />}
                <Scrollbars
                    style={{ height: 650}}
                    renderTrackHorizontal={props => 
                        <div {...props} style={{display: 'none'}} />
                    }
                    >
                    <div className="padding-container" style={{padding: '20px'}}>
                        <div className="columns is-multiline">
                            {listItems}
                        </div>
                    </div>
                </Scrollbars>
                <Modal
                    ariaHideApp={false}
                    isOpen={openModal}
                    style={customStyles}
                    onRequestClose={handleCloseModal}
                    overlayClassName="Overlay">
                    <h1>{isEditMode 
                        ? 'Editar Categoría' 
                        : 'Nueva Categoría'}</h1>
                    <form className="form-modal">
                        <Input 
                            id="title"
                            value={isEditMode ? categorySelected.title : ''}
                            element="text"
                            label="Nombre"
                            validators={[]}
                            onInput={inputHandler}
                        />
                        <Input 
                            id="description"
                            value={isEditMode ? categorySelected.description : ''}
                            element="textarea"
                            label="Descripción"
                            validators={[]}
                            onInput={inputHandler}
                        />
                        <Input 
                            id="color"
                            value={isEditMode ? categorySelected.color : ''}
                            element="text"
                            label="Color (Hexadecimal)"
                            validators={[]}
                            onInput={inputHandler}
                        />
                        <div className="columns">
                            <div className="column buttons">
                                <button
                                    onClick={handleCloseModal}
                                    type="button"
                                    className="button cancel">
                                    Cancelar
                                </button>
                                <button
                                    onClick={isEditMode ? updateCategory : submitCategory}
                                    className="button submit">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    )
}

export default Categories
