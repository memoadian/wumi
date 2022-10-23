import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from 'shared/context/auth-context'
//import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Modal from 'react-modal'
import Table from 'shared/components/DataTable/Table'

import './Users.css'
import Loader from 'shared/UIElements/Loader'

const Users = (props) => {
  const auth = useContext(AuthContext)
  //const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [users, setUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [userSelected, setUserSelected] = useState(null)
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalNumPages, setTotalNumPages] = useState(1)
  const [error, setError] = useState(null)

  let limit = 20
  let offset = 0
  let totalUsersTemp = 0
  const searchParams = new URLSearchParams(props.location.search)
  const page = parseInt(searchParams.get('page'))

  useEffect(() => {
    if (!auth.token) {
      return
    }

    fetchUsers()
  }, [auth])

  const setTotalPages = () => {
    let total = Math.ceil(totalUsersTemp / limit)
    let pages = []
    if (total > 10) {
      for (let i = 1; i <= total; i++) {
        if (
          i === 1 ||
          i === 2 ||
          i === total ||
          i === total - 1 ||
          (i >= page - 2 && i <= page + 2)
        ) {
          if (pages.indexOf(i) === -1) {
            pages.push(i)
          }
        }

        if (page === 1 || page === 2 || page === total || page === total - 1) {
          if (
            i >= Math.floor(total / 2) - 2 &&
            i <= Math.floor(total / 2) + 2
          ) {
            if (pages.indexOf(i) === -1) {
              pages.push(i)
            }
          }
        }

        if (page === 3) {
          if (i === 5) {
            if (pages.indexOf(i) === -1) {
              pages.push(i)
            }
          }
        }

        if (page === total - 2) {
          if (i === total - 4) {
            if (pages.indexOf(i) === -1) {
              pages.push(i)
            }
          }
        }
      }

      if (page > 5) {
        pages.splice(2, 0, '...')
      }

      if (page < total - 4) {
        pages.splice(pages.length - 2, 0, '...')
      }
    } else {
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    }
    setTotalNumPages(total)
    setPages(pages)
  }

  const fetchUsers = async () => {
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
        baseURL: `${process.env.REACT_APP_API_URL}/users/?limit=${limit}&offset=${offset}`,
        method: 'GET'
      })

      setUsers(response.data.results)
      setTotalUsers(response.data.count)
      totalUsersTemp = response.data.count
      setTotalPages()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const customStyles = {
    content: {
      width: '60%',
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
      Header: 'Nombre(s)',
      accessor: 'first_name'
    },
    {
      Header: 'Apellidos',
      accessor: 'last_name'
    },
    {
      Header: 'Correo',
      accessor: 'email'
    },
    {
      Header: 'Género',
      accessor: 'gender.title'
    },
    {
      Header: 'Rango de Edad',
      accessor: 'age.title'
    },
    {
      Header: 'Momento',
      accessor: 'my_time.title'
    },
    {
      Header: 'Área de oportunidad',
      accessor: 'opportunity.title'
    }
  ]

  const setUsersPerPage = async (e) => {
    console.log(e.target.value)
    limit = e.target.value

    await fetchUsers()
  }

  const onRowClicked = (userData, e) => {
    setUserSelected(userData)
    setOpenModal(true)
  }

  return (
    <div>
      {isLoading && <Loader asOverlay='true' />}
      <h1>
        Usuarios <span> {users && totalUsers} </span>
      </h1>
      <div className='columns'>
        <div className='column'>
          <div className='card no-margin'>
            <div>
              <div className='columns'>
                <div className='column'>
                  <label htmlFor=''>&nbsp;</label>
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
                                <span className='pagination-ellipsis'>
                                  {page}
                                </span>
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
                </div>
                <div className='column is-one-fifth'>
                  <label htmlFor=''>Usuarios por página</label>
                  <select onChange={setUsersPerPage} defaultValue='20'>
                    <option value='20'>20</option>
                    <option value='30'>30</option>
                    <option value='40'>40</option>
                    <option value='50'>50</option>
                    <option value='100'>100</option>
                  </select>
                </div>
              </div>
              <Table
                dataHeaders={headers}
                dataBody={users}
                onRowClicked={onRowClicked}
              />
              <div className='columns'>
                <div className='column'>
                  <label htmlFor=''>&nbsp;</label>
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
                                <span className='pagination-ellipsis'>
                                  {page}
                                </span>
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
                </div>
              </div>
              <Modal
                ariaHideApp={false}
                isOpen={openModal}
                style={customStyles}
                onRequestClose={handleCloseModal}
                overlayClassName='Overlay'
              >
                <h1>Información de perfil</h1>
                {userSelected && (
                  <div className='columns'>
                    <div className='column'>
                      <div className='row'>
                        <p>Fecha de Creación</p>
                        <span>{userSelected.date_joined}</span>
                      </div>
                      <div className='row'>
                        <p>Nombre</p>
                        <span>{userSelected.first_name}</span>
                      </div>
                      <div className='row'>
                        <p>Apellido</p>
                        <span>{userSelected.last_name}</span>
                      </div>
                      <div className='row'>
                        <p>Correo</p>
                        <span>{userSelected.email}</span>
                      </div>
                      <div className='row'>
                        <p>Género</p>
                        <span>{userSelected.gender.title}</span>
                      </div>
                      <div className='row'>
                        <p>Rango de edad</p>
                        <span>{userSelected.age.title}</span>
                      </div>
                      <div className='row'>
                        <p>Momento</p>
                        <span>{userSelected.my_time.title}</span>
                      </div>
                      <div className='row'>
                        <p>Área de oportunidad</p>
                        <span>{userSelected.opportunity.title}</span>
                      </div>
                    </div>
                    <div className='column'></div>
                  </div>
                )}
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users
