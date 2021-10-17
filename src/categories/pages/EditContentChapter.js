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
import Modal from "react-modal";
import axios from "axios";

import "react-notifications/lib/notifications.css";
import AudioUpload from "shared/components/FormElements/AudioUpload";
import CardChapter from "categories/components/CardChapter";

const EditContentChapter = (props) => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [status, setStatus] = useState([]);
  const [levels, setLevels] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [chapterSelected, setChapterSelected] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [ID, setID] = useState(0);
  const [formState, inputHandler] = useForm(
    {
      type_content_id: {
        value: "",
        isValid: false,
      },
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
      image: {
        value: null,
        isValid: false,
      },
      cstatus_id: {
        value: "",
        isValid: false,
      },
      cap_type_content_id: {
        value: "",
        isValid: false,
      },
      cap_title: {
        value: "",
        isValid: false,
      },
      cap_description: {
        value: "",
        isValid: false,
      },
      cap_level_id: {
        value: "",
        isValid: false,
      },
      cap_image: {
        value: null,
        isValid: false,
      },
      cap_cstatus_id: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const getContent = async () => {
    setIsLoading(true);
    const response = await axios({
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      baseURL: `https://api.wumi.app/api/v1/contents/${props.match.params.id}/`,
      method: "GET",
    });

    setData(response.data);
    setIsLoading(false);
  };

  const getChapters = async () => {
    setIsLoading(true);
    const response = await axios({
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      baseURL: `https://api.wumi.app/api/v1/chapters/?content=${props.match.params.id}`,
      method: "GET",
    });

    setChapter(response.data.results);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!auth.token) {
      return;
    }
    getStatus(auth.token).then((status) => {
      setStatus(status);
    });

    getLevels(auth.token).then((levels) => {
      setLevels(levels);
    });

    getContent();

    getChapters();
  }, [auth]);

  const handleOpenModal = (data) => {
    if (data.editMode) {
      setIsEdit(true);
    }
    if (data.id !== null) {
      setChapterSelected(chapter.find((ch) => ch.id === data.id));
      setID(data.id);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsEdit(false);
    setOpenModal(false);
  };

  const customStyles = {
    content: {
      width: "50%",
      height: "80%",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "36px 75px",
      border: "none",
      borderRadius: "30px",
    },
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("order", 1);
    formData.append("level_id", formState.inputs.level_id.value);
    formData.append("cstatus_id", formState.inputs.cstatus_id.value);

    try {
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        baseURL: `https://api.wumi.app/api/v1/contents/${props.match.params.id}/`,
        method: "PATCH",
        mode: "no-cors",
        data: formData,
      });

      setIsLoading(false);

      if (resp.status === 201) {
        console.log(resp.data);
      } else {
        //setError(resp)
        console.log(resp.status);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.errors || "Something went wrong, please try again.");
    }
  };

  const submitChapter = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", formState.inputs.cap_title.value);
    formData.append("description", formState.inputs.cap_description.value);
    formData.append("order", 1);
    formData.append("level_id", formState.inputs.cap_level_id.value);
    formData.append("cstatus_id", formState.inputs.cap_cstatus_id.value);
    formData.append("content_id", props.match.params.id);

    try {
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        baseURL: "https://api.wumi.app/api/v1/chapters/",
        method: "POST",
        mode: "no-cors",
        data: formData,
      });

      setIsLoading(false);

      if (resp.status === 201) {
        getChapters();
        setIsEdit(true);
        setID(resp.data.id);
      } else {
        //setError(resp)
        console.log(resp.status);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.errors || "Something went wrong, please try again.");
    }
  };

  const updateChapter = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", formState.inputs.cap_title.value);
    formData.append("description", formState.inputs.cap_description.value);
    formData.append("order", 1);
    formData.append("level_id", formState.inputs.cap_level_id.value);
    formData.append("cstatus_id", formState.inputs.cap_cstatus_id.value);
    formData.append("content_id", props.match.params.id);

    try {
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        baseURL: "https://api.wumi.app/api/v1/chapters/",
        method: "POST",
        mode: "no-cors",
        data: formData,
      });

      setIsLoading(false);

      if (resp.status === 201) {
        console.log(resp.data);
        setIsEdit(true);
        setID(resp.data.id);
      } else {
        //setError(resp)
        console.log(resp.status);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.errors || "Something went wrong, please try again.");
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
        {error}
        {data && (
          <form onSubmit={submitHandler}>
            <div className="columns">
              <div className="column">
                <Input
                  id="title"
                  label="Título"
                  validators={[]}
                  value={data.title}
                  onInput={inputHandler}
                />
                <Input
                  id="description"
                  label="Description"
                  element="textarea"
                  value={data.description}
                  validators={[]}
                  onInput={inputHandler}
                />
                <Input
                  id="level_id"
                  label="Nivel"
                  element="select"
                  value={data.level.id}
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
                <img src={data.category.image} alt="" />
                {/*<ImageUpload
                  center
                  id="image"
                  value={data.image}
                  onInput={inputHandler}
                  errorText="Selecciona una imagen"
                />*/}
                <Input
                  id="cstatus_id"
                  label="Status"
                  element="select"
                  value={data.cstatus.id}
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
              <div className="column">
                <button
                  className="button"
                  type="button"
                  onClick={handleOpenModal}
                >
                  Agregar Capitulo
                </button>
                {chapter &&
                  chapter.map((chapter) => (
                    <CardChapter
                      id={chapter.id}
                      title={chapter.title}
                      onClickEdit={handleOpenModal}
                    />
                  ))}
                <Modal
                  ariaHideApp={false}
                  isOpen={openModal}
                  style={customStyles}
                  onRequestClose={handleCloseModal}
                  overlayClassName="Overlay"
                >
                  <h1>{isEdit ? "Editar Capítulo" : "Nuevo Capítulo"}</h1>
                  <form className="form-modal">
                    <div className="columns">
                      <div className="column">
                        <Input
                          id="cap_title"
                          value={
                            isEdit && chapterSelected != null
                              ? chapterSelected.title
                              : data.title
                          }
                          label="Título"
                          validators={[]}
                          onInput={inputHandler}
                        />
                        <Input
                          id="cap_description"
                          label="Description"
                          element="textarea"
                          validators={[]}
                          value={
                            isEdit && chapterSelected != null
                              ? chapterSelected.description
                              : data.description
                          }
                          onInput={inputHandler}
                        />
                        <Input
                          id="cap_level_id"
                          label="Nivel"
                          element="select"
                          validators={[]}
                          value={data.level.id}
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
                        {isEdit && (
                          <AudioUpload
                            id="cap_audio"
                            value={
                              chapterSelected != null &&
                              chapterSelected.chapter_asset != null
                                ? chapterSelected.chapter_asset.asset
                                : ""
                            }
                            isChapter={true}
                            contentId={ID}
                          />
                        )}
                        <img
                          style={{ width: "100%" }}
                          src={data.category.image}
                          alt=""
                        />
                        {/*<ImageUpload
                          center
                          id="cap_image"
                          value={
                            isEdit && chapterSelected != null
                              ? chapterSelected.image
                              : ""
                          }
                          onInput={inputHandler}
                          errorText="Selecciona una imagen"
                        />*/}
                        <Input
                          id="cap_cstatus_id"
                          label="Status"
                          element="select"
                          validators={[]}
                          value={data.cstatus.id}
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
                    </div>
                    <div className="columns">
                      <div className="column" style={{ textAlign: "right" }}>
                        <button
                          onClick={isEdit ? updateChapter : submitChapter}
                          style={{ marginBottom: "0" }}
                          className="button"
                          type="button"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  </form>
                </Modal>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditContentChapter;
