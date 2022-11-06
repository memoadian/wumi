import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router'
import { AuthContext } from 'shared/context/auth-context'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import cat1 from 'assets/cat1.png'
import cat2 from 'assets/cat2.png'
import Modal from 'react-modal'
import Table from 'shared/components/DataTable/Table'
import Loader from 'shared/UIElements/Loader'
import './Category.css'

import 'react-notifications/lib/notifications.css'
import { NotificationContainer, NotificationManager } from 'react-notifications'

const Category = (props) => {
  const auth = useContext(AuthContext)
  const history = useHistory()
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [type, setType] = useState('')
  const [data, setData] = useState([])
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalNumPages, setTotalNumPages] = useState(1)
  const [showModal, setShowModal] = useState('')
  const [itemId, setItemId] = useState(null)

  let limit = 20
  let offset = 0
  let totalResultsTemp = 0
  const searchParams = new URLSearchParams(props.location.search)
  const page = parseInt(searchParams.get('page'))

  useEffect(() => {
    if (!auth.token) {
      return
    }

    getCategoryContent()
    getCategory()
  }, [auth])

  const setTotalPages = () => {
    let total = Math.ceil(totalResultsTemp / limit)
    let pages = []
    if (total > 10) {
      for (let i = 1; i <= total; i++) {
        if (i <= 2 || i >= total - 2 || (i >= page - 2 && i <= page + 2)) {
          pages.push(i)
        }

        if (page <= 2 || page >= total - 1) {
          if (
            i >= Math.floor(total / 2) - 2 &&
            i <= Math.floor(total / 2) + 2
          ) {
            pages.push(i)
          }
        }

        if (page === total - 2 && i === total - 4) {
          pages.push(i)
        }
      }

      if (page <= 2 && total > 15) {
        pages.splice(page + 2, 0, '...')
      }

      if (page > 5) {
        pages.splice(2, 0, '...')
      }

      if (page < total - 4) {
        pages.splice(pages.length - 3, 0, '...')
      }
    } else {
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    }
    setTotalNumPages(total)
    setPages(pages)
  }

  const getCategoryContent = async () => {
    setIsLoading(true)

    if (searchParams.has('page')) {
      setCurrentPage(page)
      if (page > 1) {
        offset = (page - 1) * limit
      }
    }

    try {
      const response = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        baseURL: `${process.env.REACT_APP_API_URL}/contents/?category=${props.match.params.id}&offset=${offset}&limit=${limit}`,
        method: 'GET'
      })

      if (response.status === 200) {
        var activeResults = response.data.results /*.filter(
          (item) => item.active === true
        )*/
        setData(activeResults)
        totalResultsTemp = response.data.count
        setTotalPages()
      } else {
        NotificationManager.error('Error', 'Error al cargar los datos', 30000)
      }
    } catch (err) {
      NotificationManager.error(
        'Error',
        'Error al obtener los contenidos',
        30000
      )
    } finally {
      setIsLoading(false)
    }
  }

  const getCategory = async () => {
    setIsLoading(true)
    const response = await axios({
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      baseURL: `${process.env.REACT_APP_API_URL}/catalog/categories/${props.match.params.id}/`,
      method: 'GET'
    })

    setTitle(response.data.title)
    setIsLoading(false)
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const openModalDelete = (id) => {
    setShowModal('is-active')
    console.log(id)
    setItemId(id)
  }

  const closeModalDelete = () => {
    setShowModal('')
    setItemId(null)
  }

  const handleContent = (type) => {
    setType(type)
  }

  const handleGoContent = () => {
    if (type === 'single') {
      history.push(`/content-single/${props.match.params.id}`)
    } else if (type === 'chapter') {
      history.push(`/content-chapter/${props.match.params.id}`)
    }
  }

  const deleteItem = async () => {
    const formData = new FormData()
    formData.append('is_active', 0)

    try {
      setIsLoading(true)
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        baseURL: `${process.env.REACT_APP_API_URL}/contents/${itemId}/`,
        method: 'PATCH',
        mode: 'no-cors',
        data: formData
      })

      setIsLoading(false)

      if (resp.status === 200) {
        NotificationManager.success(
          'Success',
          'El contenido se ha eliminado correctamente',
          30000
        )
      } else {
        NotificationManager.error(
          'Error',
          'Ócurrio un error al eliminar la capsula',
          30000
        )
      }
    } catch (err) {
      setIsLoading(false)
      NotificationManager.error(
        JSON.stringify(err.response.data.errors),
        'Error',
        30000
      )
    }

    getCategoryContent()
    setShowModal('')
    setItemId(null)
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
    }
  }

  const headers = [
    {
      Header: 'Título',
      accessor: 'title'
    },
    {
      Header: 'Descripción',
      accessor: 'description',
      sortable: true,
      maxWidth: '200px'
    },
    {
      Header: 'Duración',
      accessor: 'content_asset' != null ? 'content_asset.duration' : '',
      sortable: true
    },
    {
      Header: 'Nivel',
      accessor: 'level.title',
      sortable: true
    },
    {
      Header: 'Tipo',
      accessor: 'category.type_content.title',
      sortable: true
    },
    {
      Header: 'Status',
      accessor: 'cstatus.title',
      sortable: true
    },
    {
      Header: 'Individual/capítulo',
      accessor: 'is_individual',
      sortable: true,
      Cell: (row) => <>{row.value ? 'Individual' : 'Capítulo'}</>
    },
    {
      Header: 'Acciones',
      accessor: 'id',
      Cell: (row) => (
        <>
          <NavLink
            style={{ marginRight: '20px', display: 'inline-block' }}
            to={
              row.row.values.is_individual
                ? `/edit-single/${row.value}`
                : `/edit-chapter/${row.value}`
            }
          >
            Editar
          </NavLink>
          <span
            onClick={() => openModalDelete(row.value)}
            style={{
              display: 'inline-block',
              color: '#ff7d54',
              cursor: 'pointer'
            }}
          >
            Borrar
          </span>
        </>
      )
    }
  ]

  return (
    <div>
      {isLoading && <Loader asOverlay />}
      <div className='title-h1'>
        <h1>{title}</h1>
        <button className='button right-h1' onClick={handleOpenModal}>
          Nuevo Contenido
        </button>
      </div>
      <div className='card no-margin'>
        <div>
          {data && (
            <div>
              <nav
                className='pagination'
                role='navigation'
                aria-label='pagination'
              >
                <ul className='pagination-list'>
                  {pages &&
                    totalNumPages >= 10 &&
                    pages.map((page, index) => {
                      return (
                        <li key={index}>
                          {page === '...' ? (
                            <span className='pagination-ellipsis'>{page}</span>
                          ) : (
                            <a
                              className={`pagination-link ${
                                page === currentPage ? 'is-current' : ''
                              }`}
                              href={`?page=${page}`}
                            >
                              {page}
                            </a>
                          )}
                        </li>
                      )
                    })}
                  {pages &&
                    totalNumPages < 10 &&
                    pages.map((page, index) => (
                      <li key={index}>
                        <a
                          className={`pagination-link ${
                            page === currentPage ? 'is-current' : ''
                          }`}
                          href={`?page=${page}`}
                        >
                          {page}
                        </a>
                      </li>
                    ))}
                </ul>
              </nav>
              <Table dataHeaders={headers} dataBody={data} />
            </div>
          )}
        </div>
      </div>
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
              Confirma que deseas eliminar este contenido, esta acción solo se
              puede revertir desde el panel de administración de backend.
            </section>
            <footer className='modal-card-foot'>
              <button
                className='button is-danger'
                onClick={() => deleteItem(itemId)}
              >
                Eliminar Contenido
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
        <h1>Nueva Categoría</h1>
        <form className='form-modal'>
          <div className='columns'>
            <div className='column'>
              <div
                className={`single ${type === 'single' ? 'active' : ''}`}
                onClick={() => handleContent('single')}
              >
                <img src={cat1} alt='' />
                <h1 className='desc'>Contenido Individual</h1>
              </div>
            </div>
            <div className='column'>
              <div
                className={`single ${type === 'chapter' ? 'active' : ''}`}
                onClick={() => handleContent('chapter')}
              >
                <img src={cat2} alt='' />
                <h1 className='desc'>Contenido Por Capítulo</h1>
              </div>
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
                onClick={handleGoContent}
                type='button'
                className='button submit'
              >
                Continuar
              </button>
            </div>
          </div>
        </form>
      </Modal>
      <NotificationContainer />
    </div>
  )
}

export default Category
