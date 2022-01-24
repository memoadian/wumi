import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "shared/context/auth-context";
import axios from "axios";
import Modal from "react-modal";
import Table from "shared/components/DataTable/Table";

import "./Users.css";

const Users = () => {
  const auth = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState(null);

  useEffect(() => {
    if (!auth.token) {
      return;
    }
    const fetchUsers = async () => {
      const response = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        baseURL: `${process.env.REACT_APP_API_URL}/users/?limit=100`,
        method: "GET",
      });

      setUsers(response.data.results);
    };
    fetchUsers();
  }, [auth]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const customStyles = {
    content: {
      width: "60%",
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

  const headers = [
    {
      Header: "Nombre(s)",
      accessor: "first_name",
    },
    {
      Header: "Apellidos",
      accessor: "last_name",
    },
    {
      Header: "Correo",
      accessor: "email",
    },
    {
      Header: "Género",
      accessor: "gender.title",
    },
    {
      Header: "Rango de Edad",
      accessor: "age.title",
    },
    {
      Header: "Momento",
      accessor: "my_time.title",
    },
    {
      Header: "Área de oportunidad",
      accessor: "opportunity.title",
    },
  ];

  const onRowClicked = (userData, e) => {
    setUserSelected(userData);
    console.log(userSelected);
    setOpenModal(true);
  };

  return (
    <div>
      <h1>
        Usuarios <span> {users && users.length} </span>
      </h1>
      <div className="columns">
        <div className="column">
          <div className="card no-margin">
            <div>
              <Table
                dataHeaders={headers}
                dataBody={users}
                onRowClicked={onRowClicked}
              />

              <Modal
                ariaHideApp={false}
                isOpen={openModal}
                style={customStyles}
                onRequestClose={handleCloseModal}
                overlayClassName="Overlay"
              >
                <h1>Información de perfil</h1>
                {userSelected && (
                  <div className="columns">
                    <div className="column">
                      <div className="row">
                        <p>Fecha de Creación</p>
                        <span>{userSelected.date_joined}</span>
                      </div>
                      <div className="row">
                        <p>Nombre</p>
                        <span>{userSelected.first_name}</span>
                      </div>
                      <div className="row">
                        <p>Apellido</p>
                        <span>{userSelected.last_name}</span>
                      </div>
                      <div className="row">
                        <p>Correo</p>
                        <span>{userSelected.email}</span>
                      </div>
                      <div className="row">
                        <p>Género</p>
                        <span>{userSelected.gender.title}</span>
                      </div>
                      <div className="row">
                        <p>Rango de edad</p>
                        <span>{userSelected.age.title}</span>
                      </div>
                      <div className="row">
                        <p>Momento</p>
                        <span>{userSelected.my_time.title}</span>
                      </div>
                      <div className="row">
                        <p>Área de oportunidad</p>
                        <span>{userSelected.opportunity.title}</span>
                      </div>
                    </div>
                    <div className="column"></div>
                  </div>
                )}
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
