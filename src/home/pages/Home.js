import { useState, useCallback } from 'react';
import update from 'immutability-helper';
import Modal from 'react-modal';
import SortItem from 'shared/components/SortItem';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const Home = () => {
    const [openModal, setOpenModal] = useState(false)

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
    };

    const [cards, setCards] = useState([
        {
            id: 1,
            text: 'Write a cool JS library',
        },
        {
            id: 2,
            text: 'Make it generic enough',
        },
        {
            id: 3,
            text: 'Write README',
        },
        {
            id: 4,
            text: 'Create some examples',
        },
    ]);

    const moveCard = useCallback((dragIndex, hoverIndex) => {
        const dragCard = cards[dragIndex];
        setCards(update(cards, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragCard],
            ],
        }));
    }, [cards]);
    const renderItems = (card, index) => {
        return (
            <SortItem key={card.id} index={index} id={card.id} moveCard={moveCard}>
                {card.text}
            </SortItem>
        );
    };

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
                                <label>Frase</label>
                                <input type="text" />
                            </form>

                            <button className="button full" onClick={handleOpenModal} >Agregar Contenido</button>

                            <DndProvider backend={HTML5Backend}>
                                {cards.map((card, i) => renderItems(card, i))}
                            </DndProvider>

                            <button className="button full" onClick={handleOpenModal} >Agregar Contenido</button>
                        </div>
                        <div className="column">
                            <div className="back-blue"></div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={openModal}
                style={customStyles}
                onRequestClose={handleCloseModal}
                overlayClassName="Overlay">
                <h1>Agregar Contenido</h1>
                <form className="form-modal">
                    <label>Categoría</label>
                    <input type="text" />
                    <label>Contenido Seleccionado</label>
                    <textarea name="" id="" cols="30" rows="10"></textarea>
                    <label>Link (opcional)</label>
                    <input type="text" />
                </form>
            </Modal>
        </div>
    )
}

export default Home
