import React from "react";

export default class JsonArrayDiffViewer extends React.Component {
  render() {
    return (
      <div>
        <ul className="list-group">
          {
            this.props.array.map((item, index) => {
              if(item[0] !== " ") {
                return (
                  <li key={index}
                      className={`list-group-item
                       ${item[0] === "+" ? "list-group-item-success" : ""}
                       ${item[0] === "-" ? "list-group-item-danger" : ""}
                       `}>
                    {
                      item[0] === "+" &&
                      <i className="fa fa-plus pull-right"/>
                    }
                    {
                      item[0] === "-" &&
                      <i className="fa fa-remove pull-right"/>
                    }
                    &nbsp;
                    {item[1]}
                  </li>
                )
              }
            })
          }
        </ul>
      </div>
    );
  }
}
