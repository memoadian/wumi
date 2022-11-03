import { useState, useContext, useEffect } from 'react'
import { AuthContext } from 'shared/context/auth-context'
import { useForm } from 'shared/hooks/form-hook'
import axios from 'axios'
import Scrollbars from 'react-custom-scrollbars-2'
import Modal from 'react-modal'
import CardCategory from 'categories/components/CardCategory'
import Loader from 'shared/UIElements/Loader'
import Input from 'shared/components/FormElements/Input'
import ImageUpload from 'shared/components/FormElements/ImageUpload'

const Medit = () => {
  const auth = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [categories, setCategories] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [categorySelected, setCategorySelected] = useState(null)
  const [colors, setColors] = useState([])
  const [showModal, setShowModal] = useState('')
  const [meditId, setMeditId] = useState(null)
  const [formState, inputHandler] = useForm(
    {
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
      image: {
        value: null,
        isValid: false
      }
    },
    false
  )

  const fetchCategories = async () => {
    setIsLoading(true)
    const response = await axios({
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      baseURL: `${process.env.REACT_APP_API_URL}/catalog/categories/?type_content=2`,
      method: 'GET'
    })

    setCategories(response.data.results)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!auth.token) {
      return
    }
    fetchCategories()
    setColors([
      { id: 'azul', title: 'Azul' },
      { id: 'amarillo', title: 'Amarillo' },
      { id: 'verde', title: 'Verde' },
      { id: 'naranja', title: 'Naranja' },
      { id: 'turqueza', title: 'Turqueza' },
      { id: 'morado', title: 'Morado' }
    ])
  }, [auth])

  const handleOpenModal = (data) => {
    if (data.editMode) {
      setIsEditMode(true)
    }
    if (data.id !== null) {
      setCategorySelected(categories.find((cat) => cat.id === data.id))
    }
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    if (isEditMode) setIsEditMode(false)
    setOpenModal(false)
  }

  const openModalDelete = (id) => {
    setShowModal('is-active')
    setMeditId(id)
  }

  const closeModalDelete = () => {
    setShowModal('')
    setMeditId(null)
  }

  const submitCategory = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', formState.inputs.title.value)
    formData.append('description', formState.inputs.description.value)
    formData.append('color', formState.inputs.color.value)
    formData.append('type_content_id', 2)
    formData.append('is_active', 1)
    formData.append('image', formState.inputs.image.value)

    try {
      setIsLoading(true)
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        baseURL: `${process.env.REACT_APP_API_URL}/catalog/categories/`,
        method: 'POST',
        mode: 'no-cors',
        data: formData
      })

      setIsLoading(false)

      if (resp.status === 201) {
        handleCloseModal()
        fetchCategories()
      } else {
        //setError(resp)
      }
    } catch (err) {
      setIsLoading(false)
      //setError(err.errors || 'Something went wrong, please try again.')
    }
  }

  const updateCategory = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', formState.inputs.title.value)
    formData.append('description', formState.inputs.description.value)
    formData.append('color', formState.inputs.color.value)
    formData.append('is_active', 1)
    if (formState.inputs.image.value != null) {
      formData.append('image', formState.inputs.image.value)
    }

    try {
      setIsLoading(true)
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        baseURL: `${process.env.REACT_APP_API_URL}/catalog/categories/${categorySelected.id}/`,
        method: 'PATCH',
        mode: 'no-cors',
        data: formData
      })

      setIsLoading(false)

      if (resp.status === 200) {
        handleCloseModal()
        fetchCategories()
      } else {
        //setError(resp)
      }
    } catch (err) {
      setIsLoading(false)
      //setError(err.errors || 'Something went wrong, please try again.')
    }
  }

  const deleteMedit = async () => {}

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
    }
  }

  const listItems = categories.map(({ id, title, color, description }) => (
    <div key={id} className='column is-one-quarter-desktop is-half-tablet'>
      <CardCategory
        id={id}
        title={title}
        background={color}
        description={description}
        onClickEdit={handleOpenModal}
        onClickDelete={openModalDelete}
      />
    </div>
  ))

  return (
    <div>
      {isLoading && <Loader asOverlay />}
      <div className='title-h1'>
        <h1>Categorías Meditación</h1>
        <button className='button right-h1' onClick={handleOpenModal}>
          Nueva Categoría
        </button>
      </div>
      <div className='card no-margin'>
        <Scrollbars
          style={{ height: 650 }}
          renderTrackHorizontal={(props) => (
            <div {...props} style={{ display: 'none' }} />
          )}
        >
          <div className='padding-container' style={{ padding: '20px' }}>
            <div className='columns is-multiline'>{listItems}</div>
          </div>
        </Scrollbars>
        <div className={`modal ${showModal}`}>
          <div className='modal-background'></div>
          <div className='modal-content'>
            <div className='modal-card'>
              <header className='modal-card-head'>
                <p className='modal-card-title'>Confirmar</p>
                <button
                  className='delete'
                  aria-label='close'
                  onClick={() => closeModalDelete()}
                ></button>
              </header>
              <section className='modal-card-body'>
                Confirma que deseas eliminar esta meditacion, esta acción solo
                se puede revertir desde el panel de administración de backend.
              </section>
              <footer className='modal-card-foot'>
                <button
                  className='button is-danger'
                  onClick={() => deleteMedit(meditId)}
                >
                  Eliminar Meditacion
                </button>
                <button className='button' onClick={() => closeModalDelete()}>
                  Cancelar
                </button>
              </footer>
            </div>
          </div>
        </div>
        <Modal
          ariaHideApp={false}
          isOpen={openModal}
          style={customStyles}
          onRequestClose={handleCloseModal}
          overlayClassName='Overlay'
        >
          <h1>{isEditMode ? 'Editar Categoría' : 'Nueva Categoría'}</h1>
          <form className='form-modal'>
            <div className='columns'>
              <div className='column'>
                <Input
                  id='title'
                  value={isEditMode ? categorySelected.title : ''}
                  element='text'
                  label='Nombre'
                  validators={[]}
                  onInput={inputHandler}
                />
                <Input
                  id='description'
                  value={isEditMode ? categorySelected.description : ''}
                  element='textarea'
                  label='Descripción'
                  validators={[]}
                  onInput={inputHandler}
                />
                <div className='columns'>
                  <div className='column'>
                    <Input
                      id='color'
                      label='Color'
                      element='select'
                      validators={[]}
                      onInput={inputHandler}
                    >
                      <option value=''>Seleccionar</option>
                      {colors &&
                        colors.map((color) => {
                          return (
                            <option key={color.id} value={color.id}>
                              {color.title}
                            </option>
                          )
                        })}
                    </Input>
                  </div>
                </div>
              </div>
              <div className='column'>
                {isEditMode && (
                  <img
                    style={{ width: '50%', margin: '0 auto', display: 'block' }}
                    src={categorySelected.image}
                    alt=''
                  />
                )}
                <ImageUpload
                  center
                  id='image'
                  onInput={inputHandler}
                  errorText='Selecciona una imagen'
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column buttons'>
                <button
                  onClick={handleCloseModal}
                  type='button'
                  className='button cancel'
                >
                  Cancelar
                </button>
                <button
                  onClick={isEditMode ? updateCategory : submitCategory}
                  className='button submit'
                >
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

export default Medit
