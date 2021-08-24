import React, { useRef, useState, useContext } from 'react'
import { useForm } from 'shared/hooks/form-hook'
import { AuthContext } from 'shared/context/auth-context'
import Loader from 'shared/UIElements/Loader'
import axios from 'axios'

import './AudioUpload.css'

const AudioUpload = props => {

    const auth = useContext(AuthContext)
    const [error, setError] = useState('')
    const [file, setFile] = useState(null)
    const [isValid, setIsValid] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formState] = useForm({
        extension: {
            value: '',
            isValid: false
        },
        audio : {
            value: null,
            isValid: false
        }
    }, false)
    const filePickerRef = useRef()

    const pickHandler = event => {
        let pickedFile
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0]
            setFile(pickedFile)
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }

    const pickAudioHandler = () => {
        filePickerRef.current.click()
    }

    const url = (props.isChapter) 
    ? 'https://api.wumi.app/api/v1/presigned/chapter/upload/'
    : 'https://api.wumi.app/api/v1/presigned/content/upload/'

    const data = (props.isChapter)
    ? JSON.stringify({extension: 'mp3', chapter_id: props.contentId})
    : JSON.stringify({extension: 'mp3', content_id: props.contentId})

    const submitPresigned = async e => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const resp = await axios({
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
                baseURL: url,
                method: 'POST',
                mode: 'no-cors',
                data: data
            })

            setIsLoading(false)
                
            if (resp.status === 201) {
                console.log(resp.data)
                submitAudio(resp.data)
            } else {
                //setError(resp)
                console.log(resp.status)
            }
        } catch (err) {
            setIsLoading(false)
            setError(err.errors || 'Something went wrong, please try again.')
        }
    }

    const submitAudio = async (response) => {
        setIsLoading(true)

        const form = response.form_data

        const formData = new FormData()
        formData.append('acl', form.acl)
        formData.append('Content-Type', 'audio/mp3')
        formData.append('success_action_redirect', form.success_action_redirect)
        formData.append('key', form.key)
        formData.append('AWSAccessKeyId', form.AWSAccessKeyId)
        formData.append('policy', form.policy)
        formData.append('signature', form.signature)
        formData.append('file', formState.inputs.audio.value)

        try {
            const resp = await axios({
                baseURL: response.url,
                method: 'POST',
                mode: 'no-cors',
                data: formData
            })            

            setIsLoading(false)

            if (resp.status === 200) {

            } else {
                setError(resp.data.message || 'Something went wrong, please try again.')
            }
        } catch (err) {
            setIsLoading(false)
            setError(err.errors || 'Something went wrong, please try again.')
        }
    }

    return (
        <div className="form-control">
            {isLoading && <Loader asOverlay />}
            <input
                id={props.id}
                ref={filePickerRef}
                style={{display: 'none'}}
                type="file"
                accept=".mp3"
                onChange={pickHandler}
            />
            <div className="audio-upload">
                <div className="desc">
                    {file && file.name}
                    <button type="button" onClick={pickAudioHandler}>></button>
                </div>
            </div>
            {!isValid && <span> {props.errorText} </span>}
            <button
                disabled={!file ? 'disabled' : ''}
                type="button"
                onClick={submitPresigned}>
                Subir Audio
            </button>
        </div>
    )
}

export default AudioUpload
