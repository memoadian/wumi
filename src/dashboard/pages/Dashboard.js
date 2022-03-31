import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Card from "shared/components/Card";
import { PieChart } from "react-minimal-pie-chart";
import { AuthContext } from "shared/context/auth-context";
import CardWithHeader from "shared/components/CardWithHeader";
import CardMulti from "shared/components/CardMulti";
import DataTable from "react-data-table-component";
import getStatsCategories from "shared/helpers/getStatsCategories";

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [mostCategories, setMostCategories] = useState([]);
  const [countUsers, setCountUsers] = useState([]);

  useEffect(() => {
    if (!auth.token) {
      return;
    }
    getStatsCategories(auth.token).then((cats) => {
      setMostCategories(cats);
    });

    const fetchUsers = async () => {
      const response = await axios({
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        baseURL: `${process.env.REACT_APP_API_URL}/users/`,
        method: "GET",
      });

      setCountUsers(response.data.count);
    };
    fetchUsers();
  }, [auth]);

  const data = [];

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
    },
    {
      name: "Tipo",
      selector: (row) => row.tipo,
    },
    {
      name: "Vistas",
      selector: (row) => row.vistas,
      sortable: true,
      right: true,
    },
  ];

  const total = mostCategories.reduce((sum, { value }) => sum + value, 0);

  const labels = mostCategories.map((m) => (
    <li key={m.id}>
      <span className="circle" style={{ backgroundColor: m.color }}></span>{" "}
      {m.title}
      <span className="num">
        {isNaN(Math.round((m.value / total) * 100))
          ? 0
          : Math.round((m.value / total) * 100)}
        %
      </span>
    </li>
  ));

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="columns">
        <div className="column is-one-quarter">
          <Card title={countUsers} subtitle="Usuarios" indicator="" />
        </div>
        <div className="column is-three-fifths">
          <CardMulti />
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <CardWithHeader title="Categorías + visitadas">
            <div className="columns">
              <div className="column">
                <PieChart lineWidth="20" data={mostCategories} />
              </div>
              <div className="column">
                <ul className="labels">{labels}</ul>
              </div>
            </div>
          </CardWithHeader>
        </div>
        <div className="column is-three-fifths">
          <CardWithHeader title="Meditaciones + vistas">
            <DataTable columns={columns} data={data} />
          </CardWithHeader>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
