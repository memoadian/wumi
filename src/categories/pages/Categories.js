import {useState} from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import Modal from 'react-modal'
import CardCategory from 'shared/components/CardCategory'

const Categories = () => {
    const [openModal, setOpenModal] = useState(false)

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
    };

    return (
        <div>
            <div className="title-h1">
                <h1>Categorias</h1>
                <button className="button right-h1" onClick={handleOpenModal} >Nueva Categoría</button>
            </div>
            <div className="card no-margin">
                <Scrollbars
                    style={{ height: 650}}
                    renderTrackHorizontal={props => <div {...props} style={{display: 'none'}} />}
                    >
                    <div className="padding-container" style={{padding: '20px'}}>
                        <div className="columns is-multiline">
                            <div className="column is-one-quarter-desktop is-half-tablet">
                                <CardCategory title="Cuerpo" background="#fcece5"></CardCategory>
                            </div>
                            <div className="column is-one-quarter-desktop is-half-tablet">
                                <CardCategory title="Mente"  background="#dbf2d9" ></CardCategory>
                            </div>
                            <div className="column is-one-quarter-desktop is-half-tablet">
                                <CardCategory title="Respiración"  background="#dddee8" ></CardCategory>
                            </div>
                            <div className="column is-one-quarter-desktop is-half-tablet">
                                <CardCategory title="Sanación"  background="#fdf8dd" ></CardCategory>
                            </div>
                            <div className="column is-one-quarter-desktop is-half-tablet">
                                <CardCategory title="Descanso" background="#d8eaf9"></CardCategory>
                            </div>
                            <div className="column is-one-quarter-desktop is-half-tablet">
                                <CardCategory title="Cuerpo" background="#fcece5"></CardCategory>
                            </div>
                            <div className="column is-one-quarter-desktop is-half-tablet">
                                <CardCategory title="Mente"  background="#dbf2d9" ></CardCategory>
                            </div>
                            <div className="column is-one-quarter-desktop is-half-tablet">
                                <CardCategory title="Respiración"  background="#dddee8" ></CardCategory>
                            </div>
                            <div className="column is-one-quarter-desktop is-half-tablet">
                                <CardCategory title="Sanación"  background="#fdf8dd" ></CardCategory>
                            </div>
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
                                <button className="button cancel">Cancelar</button>
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
