import React, { useContext, useState } from 'react'
import axios from 'axios'
import logo from 'logo.png'
import { useHistory } from 'react-router-dom'
import { AuthContext } from 'shared/context/auth-context'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRED } from 'shared/utils/validator'
import Input from 'shared/components/ForElements/Input'
import { useForm } from 'shared/hooks/form-hook'
import LoadingSpinner from 'shared/UIElements/Loader'
import './Login.css'

const Login = () => {
    const history = useHistory()

    const auth = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState();
    const [formState, inputHandler] = useForm({
        email: {
            value: '',
            isValid: false,
        },
        password: {
            value: '',
            isValid: false,
        }
    }, false)

    const authSubmitHandler = async event => {
        event.preventDefault()

        setIsLoading(true)

        try {
            const response = await axios({
                baseURL: 'https://api.wumi.app/api/v1/oauth/login/',
                method: 'POST',
                data: {
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value,
                    device_id: "IrCUWvrPEqYZr7fT-mrFRi0U4cfGhCPAtHL7VmQQ"
                }
            })
            
            setIsLoading(false)

            if (response.status === 200) {
                history.replace('/panel')
                auth.login(response.data.user, response.data.token)
            } else {
                console.log(response)
            }
        } catch (err) {
            console.log(err.response.data)
            setIsLoading(false)
            setError(err.response.data.detail || 'Something went wrong, please try again.')
        }
    }

    return (
        <div className="columns is-centered page-login">
            <div className="logo">
                <img src={logo} alt="" width="68"/>
                <p>WUMI</p>
                <div className="slogan">
                    Bienvenido. Es un placer saludarte.
                </div>
                <div className="sesion">
                    Inicia sesión para configurar, editar y crear nuevo contenido
                </div>
                <div className="form-login">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <p className="error">{error}</p>
                    <form onSubmit={authSubmitHandler}>
                        <Input 
                            id="email"
                            type="email"
                            placeholder="Correo Electrónico"
                            validators={[VALIDATOR_REQUIRED(), VALIDATOR_EMAIL()]}
                            errorText="El correo electrónico no es válido"
                            onInput={inputHandler}
                        />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Contraseña (+8 caracteres)"
                            validators={[VALIDATOR_MINLENGTH(8)]}
                            errorText="Este campo es obligatorio y requiere al menos 8 caractéres"
                            onInput={inputHandler}
                        />
                        <span>¿Olvidé mi contraseña?</span>
                        <button disabled={!formState.isValid}  >Comenzar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
