import React from "react";

export class Differ extends React.Component {
  typeOf = (item) => {
    if(Array.isArray(item)) {
      return "array"
    }
    return typeof item
  }
  render() {
    return (
      <div>
        <ul>
          {
            this.typeOf(this.props.diff) === "object" &&
            Object.keys(this.props.diff).map(key => {
              // { "__old": 10500, "__new": 10250 }
              if (key === "__old")
                return (
                  key === "__old" &&
                  <li>
                    <span className="mks-text-decoration-overline mks-color-red mks-bold">{JSON.stringify(this.props.diff["__old"])}</span>
                      &nbsp;
                    <i className="fa fa-arrow-right"></i>
                      &nbsp;
                    <span className="mks-color-green mks-bold">{JSON.stringify(this.props.diff["__new"])}</span>
                  </li>
                )
              else if(key === "__new")
                  return null
              else {
                return (
                  <li>
                    {key}
                    <Differ diff={this.props.diff[key]}/>
                  </li>
                )
              }
            })
          }
          {
            this.typeOf(this.props.diff) === "array" &&
              <ul>
                {
                  this.props.diff.map(item => {
                    if(this.typeOf(item) === "array") {
                      if(item[0] === "-")
                        return(
                          <li className="mks-text-decoration-overline mks-color-red mks-bold">
                            {JSON.stringify(item[1])}
                          </li>
                        )
                      else if(item[0] === "+")
                        return(
                          <li className="mks-color-green mks-bold">
                            {JSON.stringify(item[1])}
                          </li>
                        )
                    }
                  })
                }
              </ul>
          }
        </ul>
      </div>
    );
  }
}
