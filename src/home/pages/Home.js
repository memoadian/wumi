import { useState, useCallback, useContext, useEffect } from "react";
import { useForm } from "shared/hooks/form-hook";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AuthContext } from "shared/context/auth-context";
import update from "immutability-helper";
import Modal from "react-modal";
import SortItem from "shared/components/SortItem";
import DataTable from "react-data-table-component";
import axios from "axios";
import Input from "shared/components/FormElements/Input";
import Loader from "shared/UIElements/Loader";
import movilback from "movilback.png";
import "./Home.css";

const Home = () => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState([]);
  const [cardsMedit, setCardsMedit] = useState([]);
  const [cardsCap, setCardsCap] = useState([]);
  const [isCap, setIsCap] = useState(false);
  const [catSelected, setCatSelected] = useState(null);
  const [phrase, setPhrase] = useState("");
  const [formState, inputHandler] = useForm(
    {
      phrase: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const submitData = async () => {
    try {
      setIsLoading(true);
      const resp = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        baseURL: `${process.env.REACT_APP_API_URL}/phrases/1/`,
        method: "PATCH",
        mode: "no-cors",
        data: JSON.stringify({
          title: formState.inputs.phrase.value,
        }),
      });

      setIsLoading(false);

      if (resp.status === 200) {
        setPhrase(resp.data.title);
      } else {
        //setError(resp)
        console.log(resp.status);
      }
    } catch (error) {
      setIsLoading(false);
    }

    try {
      setIsLoading(true);

      const cardsIds = cardsMedit.map((cm) => cm.id);
      console.log(cardsMedit);
      console.log(cardsIds);

      const resp = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        baseURL: `${process.env.REACT_APP_API_URL}/tags/categories/1/`,
        method: "PATCH",
        mode: "no-cors",
        data: JSON.stringify({
          categories_id: cardsIds,
        }),
      });

      setIsLoading(false);

      if (resp.status === 200) {
        //setPhrase(resp.data.title)
      } else {
        //setError(resp)
        console.log(resp.status);
      }
    } catch (error) {
      setIsLoading(false);
    }

    try {
      setIsLoading(true);

      const cardsIds = cardsCap.map((cc) => cc.id);

      const resp = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        baseURL: `${process.env.REACT_APP_API_URL}/tags/categories/2/`,
        method: "PATCH",
        mode: "no-cors",
        data: JSON.stringify({
          categories_id: cardsIds,
        }),
      });

      setIsLoading(false);

      if (resp.status === 200) {
        //setPhrase(resp.data.title)
      } else {
        //setError(resp)
        console.log(resp.status);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.token) {
      return;
    }
    const getPhrase = async () => {
      const response = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        baseURL: `${process.env.REACT_APP_API_URL}/phrases/`,
        method: "GET",
      });

      if (response.status === 200) {
        setPhrase(response.data.results[0].title);
      }
    };
    getPhrase();

    const getCategories = async () => {
      const response = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        baseURL: `${process.env.REACT_APP_API_URL}/tags/categories/`,
        method: "GET",
      });

      if (response.status === 200) {
        setCardsMedit(response.data.results[0].categories);
        setCardsCap(response.data.results[1].categories);
      }
    };
    getCategories();
  }, [auth]);

  const getCategoriesMedit = async () => {
    const response = await axios({
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      baseURL: `${process.env.REACT_APP_API_URL}/catalog/categories/?type_content=2`,
      method: "GET",
    });

    if (response.status === 200) {
      setCategories(response.data.results);
    }
  };

  const getCategoriesCap = async () => {
    const response = await axios({
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      baseURL: `${process.env.REACT_APP_API_URL}/catalog/categories/?type_content=1`,
      method: "GET",
    });

    if (response.status === 200) {
      setCategories(response.data.results);
    }
  };

  const getCategoryContent = async (e) => {
    setIsLoading(true);
    const response = await axios({
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      baseURL: `${process.env.REACT_APP_API_URL}/contents/?category=${e.target.value}`,
      method: "GET",
    });

    setContent(response.data.results);
    setCatSelected(e.target.value);
    setIsLoading(false);
  };

  const handleOpenMeditModal = () => {
    getCategoriesMedit();
    setIsCap(false);
    setOpenModal(true);
  };

  const handleOpenCapModal = () => {
    getCategoriesCap();
    setIsCap(true);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setContent([]);
  };

  const customStyles = {
    content: {
      width: "80%",
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

  const moveCardMedit = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cardsMedit[dragIndex];
      setCardsMedit(
        update(cardsMedit, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      );
    },
    [cardsMedit]
  );

  const renderItemsMedit = (card, index) => {
    return (
      <SortItem
        key={card.id}
        index={index}
        id={card.id}
        moveCard={moveCardMedit}
        onClickRemove={removeMedit}
      >
        {card.title}
      </SortItem>
    );
  };

  const moveCardCap = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cardsCap[dragIndex];
      setCardsCap(
        update(cardsCap, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      );
    },
    [cardsCap]
  );

  const renderItemsCap = (card, index) => {
    return (
      <SortItem
        key={card.id}
        index={index}
        id={card.id}
        moveCard={moveCardCap}
        onClickRemove={removeCap}
      >
        {card.title}
      </SortItem>
    );
  };

  const saveSelected = () => {
    if (catSelected != null) {
      if (isCap) {
        if (cardsCap.filter((card) => card.id == catSelected).length == 0) {
          setCardsCap([
            ...cardsCap,
            categories.find((cat) => cat.id == catSelected),
          ]);
          handleCloseModal();
        }
      } else {
        if (cardsMedit.filter((card) => card.id == catSelected).length == 0) {
          setCardsMedit([
            ...cardsMedit,
            categories.find((cat) => cat.id == catSelected),
          ]);
          handleCloseModal();
        }
      }
    }
  };

  const columns = [
    {
      name: "Título",
      selector: (row) => row.title,
      sortable: true,
      maxWidth: "200px",
    },
    {
      name: "Descripción",
      selector: (row) => row.description,
      sortable: true,
      maxWidth: "200px",
    },
    {
      name: "Duración",
      selector: (row) =>
        row.content_asset != null ? row.content_asset.duration : "",
      sortable: true,
    },
    {
      name: "Nivel",
      selector: (row) => row.level.title,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.cstatus.title,
      sortable: true,
    },
  ];

  const CardMeditRender = () =>
    cardsMedit.map((item) => (
      <div key={item.id} style={{ backgroundImage: `url(${item.image})` }}>
        {item.title}
      </div>
    ));

  const CardCapsRender = () =>
    cardsCap.map((item) => (
      <div key={item.id} style={{ backgroundImage: `url(${item.image})` }}>
        {item.title}
      </div>
    ));

  const removeCap = (data) => {
    setCardsCap(cardsCap.filter((item) => item.id !== data.id));
  };

  const removeMedit = (data) => {
    console.log(data.id);
    setCardsMedit(cardsMedit.filter((item) => item.id !== data.id));
  };

  return (
    <div>
      {isLoading && <Loader asOverlay />}
      <div className="title-h1">
        <h1>Home</h1>
        <button className="button right-h1" onClick={submitData}>
          Publicar
        </button>
      </div>

      <div className="columns">
        <div className="card">
          <div className="columns">
            <div className="column">
              <p
                style={{
                  marginBottom: "30px",
                  fontSize: "24px",
                  color: "#003249",
                }}
              >
                {phrase}
              </p>
              <form action="" className="form-modal">
                {phrase != null && (
                  <Input
                    id="phrase"
                    label="Frase"
                    value={phrase}
                    validators={[]}
                    onInput={inputHandler}
                  />
                )}
              </form>

              <button
                type="button"
                className="button full button-home"
                onClick={handleOpenMeditModal}
              >
                Agregar Meditación
              </button>

              <DndProvider backend={HTML5Backend}>
                {cardsMedit.map((card, i) => renderItemsMedit(card, i))}
              </DndProvider>

              <button
                type="button"
                className="button full button-home"
                onClick={handleOpenCapModal}
              >
                Agregar Cápsula
              </button>

              <DndProvider backend={HTML5Backend}>
                {cardsCap.map((card, i) => renderItemsCap(card, i))}
              </DndProvider>
            </div>
            <div className="column">
              <div className="back-blue">
                <div className="container-device">
                  <img src={movilback} alt="" />
                  <div className="horizontal-scroll-wrapper">
                    <CardMeditRender />
                  </div>
                  <div className="listCapsula">
                    <CardCapsRender />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        ariaHideApp={false}
        isOpen={openModal}
        style={customStyles}
        onRequestClose={handleCloseModal}
        overlayClassName="Overlay"
      >
        <h1>Agregar Contenido</h1>
        <div className="form-control">
          <select onChange={getCategoryContent}>
            <option value="">Categoría</option>
            {categories &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
          </select>
        </div>
        <DataTable columns={columns} data={content} />
        <div className="columns">
          <div className="column buttons">
            <button
              onClick={saveSelected}
              className="button submit"
              style={{ float: "right" }}
            >
              Guardar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
