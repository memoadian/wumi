import React, { useRef, useState, useEffect } from 'react'
import './ImageUpload.css'

const ImageUpload = props => {

    const [file, setFile] = useState()
    const [previewUrl, setPreviewUrl] = useState()
    const [isValid, setIsValid] = useState(false)

    const filePickerRef = useRef()

    useEffect(() => {
        if (!file) {
            return
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    }, [file])

    const pickHandler = event => {
        let pickedFile
        let fileIsValid = isValid
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0]
            setFile(pickedFile)
            setIsValid(true)
            fileIsValid = true
        } else {
            setIsValid(false)
            fileIsValid = false
        }

        props.onInput(props.id, pickedFile, fileIsValid)
    }

    const pickImageHandler = () => {
        filePickerRef.current.click()
    }

    return (
        <div className="form-control">
            <input
                id={props.id}
                ref={filePickerRef}
                style={{display: 'none'}}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickHandler}
            />
            <div className="image-upload">
                <div className="desc">
                    <button type="button" onClick={pickImageHandler}>></button>
                </div>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {(props.value && !previewUrl) && <img src={props.value} alt="Preview" />}
                    {(!previewUrl && !props.value) && <p>Escoge una imagen</p>}
                </div>
            </div>
            {!isValid && <span> {props.errorText} </span>}
        </div>
    )
}

export default ImageUpload
