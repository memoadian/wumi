import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const CardCategory = (props) => {
  const [color, setColor] = useState(null);

  useEffect(() => {
    switch (props.background) {
      case "amarillo":
        setColor("#fff654");
        break;
      case "azul":
        setColor("#54d1ff");
        break;
      case "morado":
        setColor("#c6a5e2");
        break;
      case "naranja":
        setColor("#ffbb84");
        break;
      case "turqueza":
        setColor("#67BAAD");
        break;
      case "verde":
        setColor("#55CF45");
        break;
    }
    console.log(color);
  }, [props.color]);

  const trigger = () => {
    props.onClickEdit({ editMode: true, id: props.id });
  };

  return (
    <>
      <div className="card-category">
        <div
          className="card-category-header"
          style={{ backgroundColor: `${color}` }}
        >
          {props.title}
        </div>
        <div className="card-category-body">{props.description}</div>
        <div className="card-category-footer">
          <NavLink to={`/category/${props.id}`}>
            <span className="left">Ingresar</span>
          </NavLink>
          <span className="right" onClick={trigger}>
            Editar
          </span>
        </div>
      </div>
    </>
  );
};

export default CardCategory;
