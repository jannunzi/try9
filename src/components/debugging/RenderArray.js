import React from "react";

const RenderArray = ({array}) =>
  <div>
    <ul className="list-group">
      {
        array.map((item, index) =>
          <li key={index} className="list-group-item">
            {JSON.stringify(item)}
          </li>
        )
      }
    </ul>
  </div>

export default RenderArray
