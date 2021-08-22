import { useState, useCallback, useContext, useEffect } from 'react'
import { useForm } from 'shared/hooks/form-hook'
import update from 'immutability-helper'
import Modal from 'react-modal'
import SortItem from 'shared/components/SortItem'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { AuthContext } from 'shared/context/auth-context'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import Input from 'shared/components/FormElements/Input'
import './Home.css'

const Home = () => {
    const auth = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [content, setContent] = useState([])
    const [cards, setCards] = useState([])
    const [formState, inputHandler] = useForm({
        type_content_id: {
            value: '',
            isValid: false
        },
    }, false)

    useEffect(() => {
        if (!auth.token) {return}
        const getCategories = async () => {
            const response = await axios({
                headers: {
                    Authorization: `Bearer ${auth.token}`
                },
                baseURL: `https://api.wumi.app/api/v1/catalog/categories/`,
                method: 'GET',
            })

            if (response.status === 200) {
                setCategories(response.data.results)
            }
        }
        getCategories()
    }, [auth])

    const getCategoryContent = async e => {
        setIsLoading(true)
        const response = await axios({
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            baseURL: `https://api.wumi.app/api/v1/contents/?category=${e.target.value}`,
            method: 'GET',
        })

        setContent(response.data.results)
        setIsLoading(false)
    }

    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const onRowClicked = (row, event) => {
        if (cards.length < 5) {
            setCards([...cards, row])
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

    const moveCard = useCallback((dragIndex, hoverIndex) => {
        const dragCard = cards[dragIndex]
        setCards(update(cards, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragCard],
            ],
        }))
    }, [cards])

    const renderItems = (card, index) => {
        return (
            <SortItem key={card.id} index={index} id={card.id} moveCard={moveCard}>
                {card.title}
            </SortItem>
        )
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
        selector: row => row.type_content.title,
        sortable: true,
    },
    {
        name: 'Status',
        selector: row => row.cstatus.title,
        sortable: true,
    }]

    return (
        <div>
            <div className="title-h1">
                <h1>Home</h1>
                <button className="button right-h1" onClick={handleOpenModal} >
                    Publicar
                </button>
            </div>

            <div className="columns">
                <div className="card">
                    <div className="columns">
                        <div className="column">
                            <p style={{
                                marginBottom: '30px',
                                fontSize: '14px',
                                color: '#003249'
                            }}>
                            Reference site about Lorem Ipsum, giving information on its origins
                            </p>
                            <form action="" className="form-modal">
                                <Input
                                    id="phrase"
                                    label="Frase"
                                    onInput={inputHandler}
                                />
                            </form>

                            <button 
                                type="button"
                                className="button full"
                                onClick={handleOpenModal}>
                                Agregar Contenido
                            </button>

                            <DndProvider backend={HTML5Backend}>
                                {cards.map((card, i) => renderItems(card, i))}
                            </DndProvider>

                            <button 
                                type="button"
                                className="button full"
                                onClick={handleOpenModal}>
                                Agregar Contenido
                            </button>
                        </div>
                        <div className="column">
                            <div className="back-blue"></div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                ariaHideApp={false}
                isOpen={openModal}
                style={customStyles}
                onRequestClose={handleCloseModal}
                overlayClassName="Overlay">
                <h1>Agregar Contenido</h1>
                <div className="form-control">
                <select
                    onChange={getCategoryContent}
                    >
                    <option value="">Categoría</option>
                    { categories && 
                        categories.map((cat) =>
                            <option
                                key={cat.id}
                                value={cat.id}>
                                {cat.title}
                            </option>
                        )
                    }
                </select>
                </div>
                <DataTable
                    columns={columns}
                    data={content}
                    onRowClicked={onRowClicked}
                />
            </Modal>
        </div>
    )
}

export default Home
