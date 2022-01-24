import axios from "axios";

const getStatsCategories = async (token) => {
  const client = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: "no-cors",
  });

  if (token) {
    const resp = await client.get("/categories/visits/");

    const { results } = await resp.data;

    const data = results.map((item) => {
      return {
        id: item.id,
        title: item.title,
        value: item.visits,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        description: item.description,
      };
    });

    return data;
  }
};

export default getStatsCategories;
