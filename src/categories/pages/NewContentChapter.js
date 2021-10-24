import React, { useState, useContext, useEffect } from "react";
import { useForm } from "shared/hooks/form-hook";
import { useHistory } from "react-router-dom";
import { AuthContext } from "shared/context/auth-context";
import getContentTypes from "shared/helpers/getContentTypes";
import getStatus from "shared/helpers/getStatus";
import getLevels from "shared/helpers/getLevels";
import ImageUpload from "shared/components/FormElements/ImageUpload";
import Input from "shared/components/FormElements/Input";
import Loader from "shared/UIElements/Loader";
import axios from "axios";

const NewContentChapter = (props) => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [contentTypes, setContentTypes] = useState([]);
  const [status, setStatus] = useState([]);
  const [levels, setLevels] = useState([]);
  const [image, setImage] = useState(null);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      level_id: {
        value: "",
        isValid: false,
      },
      cstatus_id: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    if (!auth.token) {
      return;
    }

    const getCategory = async () => {
      setIsLoading(true);
      const response = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        baseURL: `https://api.wumi.app/api/v1/catalog/categories/${props.match.params.cat_id}/`,
        method: "GET",
      });

      setImage(response.data.image);
      setIsLoading(false);
    };
    getCategory();

    getContentTypes(auth.token).then((ct) => {
      setContentTypes(ct);
    });

    getStatus(auth.token).then((status) => {
      setStatus(status);
    });

    getLevels(auth.token).then((levels) => {
      setLevels(levels);
    });
  }, [auth]);

  const submitHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("order", 1);
    formData.append("category_id", props.match.params.cat_id);
    formData.append("level_id", formState.inputs.level_id.value);
    formData.append("cstatus_id", formState.inputs.cstatus_id.value);

    try {
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        baseURL: "https://api.wumi.app/api/v1/contents/",
        method: "POST",
        mode: "no-cors",
        data: formData,
      });

      setIsLoading(false);

      if (resp.status === 201) {
        console.log(resp.data);
        history.replace(`/edit-chapter/${resp.data.id}`);
      } else {
        //setError(resp)
        console.log(resp.status);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response.data.errors);
    }
  };

  return (
    <div>
      <div className="title-h1">
        <h1>Nuevo Contenido / Capítulos</h1>
        <button className="button right-h1" onClick={submitHandler}>
          Guardar
        </button>
      </div>
      <div className="card no-margin">
        {isLoading && <Loader asOverlay />}
        {error && <pre>{JSON.stringify(error)}</pre>}
        <form onSubmit={submitHandler}>
          <div className="columns">
            <div className="column">
              <Input
                id="title"
                label="Título"
                validators={[]}
                onInput={inputHandler}
              />
              <Input
                id="description"
                label="Description"
                element="textarea"
                validators={[]}
                onInput={inputHandler}
              />
              <Input
                id="level_id"
                label="Nivel"
                element="select"
                validators={[]}
                onInput={inputHandler}
              >
                <option value="">Seleccionar</option>
                {levels &&
                  levels.map((level) => {
                    return (
                      <option key={level.id} value={level.id}>
                        {level.title}
                      </option>
                    );
                  })}
              </Input>
            </div>
            <div className="column">
              <img src={image} alt="" />
              {/*<ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText="Selecciona una imagen"
              />*/}
              <Input
                id="cstatus_id"
                label="Status"
                element="select"
                validators={[]}
                onInput={inputHandler}
              >
                <option value="">Seleccionar</option>
                {status &&
                  status.map((status) => {
                    return (
                      <option key={status.id} value={status.id}>
                        {status.title}
                      </option>
                    );
                  })}
              </Input>
            </div>
            <div className="column"></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewContentChapter;
