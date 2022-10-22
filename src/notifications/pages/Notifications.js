import React, { useState, useContext } from 'react'
import DataTable from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions'
import Modal from 'react-modal'
import Input from 'shared/components/FormElements/Input'
import Loader from 'shared/UIElements/Loader'
import axios from 'axios'
import { AuthContext } from 'shared/context/auth-context'
import { useForm } from 'shared/hooks/form-hook'
import { VALIDATOR_REQUIRED } from 'shared/utils/validator'

const Notifications = () => {
  const auth = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      subtitle: {
        value: '',
        isValid: false
      }
    },
    false
  )

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const notificationSubmit = async (event) => {
    event.preventDefault()

    setIsLoading(true)

    try {
      const response = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        baseURL: `${process.env.REACT_APP_API_URL}/notifications/`,
        method: 'POST',
        data: {
          title: formState.inputs.title.value,
          subtitle: formState.inputs.subtitle.value,
          user_id: null,
          segments: 'active'
        }
      })

      setIsLoading(false)

      if (response.status === 200) {
        handleCloseModal()
      } else {
      }
    } catch (err) {
      setIsLoading(false)
      setError(
        err.response.data.detail || 'Something went wrong, please try again.'
      )
    }
  }

  const customStyles = {
    rows: {
      style: {
        minHeight: '70px', // override the row height
        borderBottom: '0px solid transparent'
      }
    },
    headCells: {
      style: {
        minHeight: '80px',
        fontWeight: 'bold',
        fontSize: '14px'
      }
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px'
      }
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
    }
  }

  const data = []

  const columns = [
    {
      name: 'Título',
      selector: 'title',
      sortable: true
    },
    {
      name: 'Contenido',
      selector: 'content',
      sortable: true
    },
    {
      name: 'Fecha',
      selector: 'date',
      sortable: true,
      right: true
    }
  ]

  const dataTable = {
    columns,
    data
  }

  return (
    <div>
      <div className='title-h1'>
        <h1>Notificaciones</h1>
        <button className='button right-h1' onClick={handleOpenModal}>
          Crear Nuevo
        </button>
      </div>

      <div className='columns'>
        <div className='column'>
          <div className='card no-padding'>
            {error}
            <DataTableExtensions {...dataTable} filterPlaceholder='Buscar'>
              <DataTable
                columns={columns}
                data={data}
                customStyles={customStyles}
              />
            </DataTableExtensions>
            <Modal
              ariaHideApp={false}
              isOpen={openModal}
              style={customStyles}
              onRequestClose={handleCloseModal}
              overlayClassName='Overlay'
            >
              {isLoading && <Loader asOverlay />}
              <h1>Nueva Notificación</h1>
              <form className='form-modal'>
                <Input
                  id='title'
                  label='Título'
                  validators={[VALIDATOR_REQUIRED()]}
                  errorText='Este campo es obligatorio'
                  onInput={inputHandler}
                />
                <Input
                  id='subtitle'
                  label='Subtítulo'
                  validators={[VALIDATOR_REQUIRED()]}
                  errorText='Este campo es obligatorio'
                  onInput={inputHandler}
                />
                <div className='columns'>
                  <div className='column buttons'>
                    <button className='button cancel'>Cancelar</button>
                    <button
                      onClick={notificationSubmit}
                      disabled={!formState.isValid}
                      className='button submit'
                    >
                      Enviar
                    </button>
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
