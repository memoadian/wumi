import React from 'react'
import Input from 'shared/components/FormElements/Input'
import { VALIDATOR_REQUIRED } from 'shared/utils/validator'
import { useForm } from 'shared/hooks/form-hook'
import ImageUpload from 'shared/components/FormElements/ImageUpload'
import './Form.css'

const NewContentChapter = () => {
    const [formState, inputHandler] = useForm({
    }, false)

    return (
        <div>
            <div className="title-h1">
                <h1>Nuevo Contenido / Capítulos</h1>
                <button className="button right-h1">Publicar</button>
            </div>
            <div className="card no-margin">
                <form action="">
                    <div className="columns">
                        <div className="column">
                            <div className="form-control">
                                <label htmlFor="">Tipo de Contenido</label>
                                <select name="" id="">
                                    <option value="">Básico</option>
                                    <option value="">Medio</option>
                                    <option value="">avanzado</option>
                                </select>
                            </div>
                            <Input
                                id=""
                                label="Título"
                                validators={[]}
                                onInput={inputHandler}
                            />
                            <Input
                                id=""
                                label="Description"
                                element="textarea"
                                validators={[]}
                                onInput={inputHandler}
                            />
                            <div className="form-control">
                                <label htmlFor="">Nivel</label>
                                <select name="" id="">
                                    <option value="">Básico</option>
                                    <option value="">Medio</option>
                                    <option value="">avanzado</option>
                                </select>
                            </div>
                        </div>
                        <div className="column">
                            <ImageUpload 
                                center
                                id="image"
                                onInput={inputHandler}
                                errorText="Selecciona una imagen"
                            />
                            <Input
                                id=""
                                label="Nivel"
                                validators={[]}
                                onInput={inputHandler}
                            />
                            <div className="form-control">
                                <label htmlFor="">Status</label>
                                <select name="" id="">
                                    <option value="">Básico</option>
                                    <option value="">Medio</option>
                                    <option value="">avanzado</option>
                                </select>
                            </div>
                        </div>
                        <div className="column">

                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewContentChapter
