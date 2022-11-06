import React, { useState, useContext, useEffect } from 'react'
import { useForm } from 'shared/hooks/form-hook'
import { useHistory } from 'react-router-dom'
import { AuthContext } from 'shared/context/auth-context'
import getContentTypes from 'shared/helpers/getContentTypes'
import getStatus from 'shared/helpers/getStatus'
import getLevels from 'shared/helpers/getLevels'
import AudioUpload from 'shared/components/FormElements/AudioUpload'
import Input from 'shared/components/FormElements/Input'
import Loader from 'shared/UIElements/Loader'
import axios from 'axios'
import 'react-notifications/lib/notifications.css'
import { NotificationContainer, NotificationManager } from 'react-notifications'

import './Form.css'

const EditContentSingle = (props) => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const [status, setStatus] = useState([])
  const [levels, setLevels] = useState([])
  const [data, setData] = useState(null)
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
      level_id: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      },
      cstatus_id: {
        value: '',
        isValid: false
      }
    },
    false
  )

  useEffect(() => {
    if (auth.token) {
      getContentTypes(auth.token).then((ct) => {
        //setContentTypes(ct)
      })

      getStatus(auth.token).then((status) => {
        setStatus(status)
      })

      getLevels(auth.token).then((levels) => {
        setLevels(levels)
      })

      const getContent = async () => {
        setIsLoading(true)
        const response = await axios({
          headers: {
            Authorization: `Bearer ${auth.token}`
          },
          baseURL: `${process.env.REACT_APP_API_URL}/contents/${props.match.params.id}/`,
          method: 'GET'
        })

        setData(response.data)
        setIsLoading(false)
      }
      getContent()
    }
  }, [auth])

  const submitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append('title', formState.inputs.title.value)
    formData.append('description', formState.inputs.description.value)
    formData.append('order', 1)
    formData.append('level_id', formState.inputs.level_id.value)
    formData.append('cstatus_id', formState.inputs.cstatus_id.value)

    try {
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        baseURL: `${process.env.REACT_APP_API_URL}/contents/${props.match.params.id}/`,
        method: 'PATCH',
        mode: 'no-cors',
        data: formData
      })

      setIsLoading(false)

      if (resp.status === 200) {
        //history.replace(`/category/${resp.data.category.id}`)
        NotificationManager.success(
          'Success',
          'Los cambios se realizaron exitosamente',
          30000
        )
      } else {
        //setError(resp)
        NotificationManager.error('Error', 'Error', 30000)
      }
    } catch (err) {
      setIsLoading(false)
      setError(err.errors || 'Something went wrong, please try again.')
      NotificationManager.error('Error', 'Error', 30000)
    }
  }

  return (
    <div>
      <div className='title-h1'>
        <h1>Nuevo Contenido / Individual</h1>
        <button className='button right-h1' onClick={submitHandler}>
          Guardar
        </button>
      </div>
      <div className='card no-margin'>
        {isLoading && <Loader asOverlay />}
        {data && (
          <form onSubmit={submitHandler}>
            <div className='columns'>
              <div className='column'>
                <Input
                  id='title'
                  label='Título'
                  validators={[]}
                  value={data.title}
                  onInput={inputHandler}
                />
                <Input
                  id='description'
                  label='Description'
                  element='textarea'
                  value={data.description}
                  validators={[]}
                  onInput={inputHandler}
                />
                <Input
                  id='level_id'
                  label='Nivel'
                  element='select'
                  value={data.level.id}
                  validators={[]}
                  onInput={inputHandler}
                >
                  <option value=''>Seleccionar</option>
                  {levels &&
                    levels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.title}
                      </option>
                    ))}
                </Input>
              </div>
              <div className='column'>
                <AudioUpload
                  id='audio'
                  value={data.content_asset && data.content_asset.asset}
                  isChapter={false}
                  contentId={props.match.params.id}
                />
                <img
                  style={{ width: '100%' }}
                  src={data.category.image}
                  alt=''
                />
                {/*<ImageUpload 
                                center
                                id="image"
                                value={data.image}
                                onInput={inputHandler}
                                errorText="Selecciona una imagen"
                            />*/}
                <Input
                  id='cstatus_id'
                  label='Status'
                  element='select'
                  value={data.cstatus.id}
                  validators={[]}
                  onInput={inputHandler}
                >
                  <option value=''>Seleccionar</option>
                  {status &&
                    status.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.title}
                      </option>
                    ))}
                </Input>
              </div>
              <div className='column'></div>
            </div>
          </form>
        )}
        <NotificationContainer />
      </div>
    </div>
  )
}

export default EditContentSingle
