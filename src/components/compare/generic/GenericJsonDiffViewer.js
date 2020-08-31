import React from "react";

export default class GenericJsonDiffViewer extends React.Component {
  state = {
    show: {}
  }
  toggle = (key) => {
    this.setState(prevState => {
      let nextState = {...prevState}
      if(typeof nextState["show"][key] === "undefined" || nextState["show"][key] === true) {
        nextState["show"][key] = false;
      } else {
        nextState["show"][key] = true;
      }
      return nextState
    })
  }
  typeOf = (item) => {
    if(Array.isArray(item)) {
      return "array"
    }
    return typeof item
  }
  render() {
    return(
      <div>
        {/*{typeof this.props.diff}*/}
        { /* jga */
          this.props.diff && this.typeOf(this.props.diff) === "object" &&
          <div>
            {"{"}
            <ul className="list-group">
              {
                Object.keys(this.props.diff).map((key, index) => {
                  if(key.endsWith("__deleted")) {
                    return (
                      <li key={key} className="list-group-item list-group-item-danger">
                        <i className="fa fa-remove"/>
                        &nbsp;
                        <span className="mks-text-decoration-overline">
                          <b>{key.replace("__deleted", "")}</b>
                        </span>
                      </li>
                    )}
                  else if(key.endsWith("__added")) {
                    return (
                      <li key={key} className="list-group-item list-group-item-success">
                        <i className="fa fa-plus"/>
                        &nbsp;
                        <b>{key.replace("__added", "")}</b>
                      </li>
                    )}
                  else if(this.typeOf(this.props.diff[key]["__old"]) !== "undefined") {
                    return (
                      <li key={key} className="list-group-item list-group-item-info">
                        <div className="row">
                          <div className="col-xs-4">
                            <b>{key}</b>:
                          </div>
                          <div className="col-xs-4 mks-color-white">
                            <i className="fa fa-remove"/>
                            &nbsp;
                            <span className="mks-text-decoration-overline">
                            { this.props.diff[key]["__old"].toString()}
                            </span>
                          </div>
                          <div className="col-xs-4 mks-color-white">
                            <i className="fa fa-plus"/>
                            &nbsp;
                            {this.props.diff[key]["__new"].toString()}
                          </div>
                        </div>
                      </li>
                    )
                  } else {
                    return (
                      <li key={key} className="list-group-item">
                        <div onClick={() => this.toggle(key)}
                             className="mks-pointer-cursor mks-margin-bottom-10px mks-color-black">
                          <b>{key}</b>: &nbsp;
                          {
                            (this.typeOf(this.props.diff[key]) === "boolean" || this.typeOf(this.props.diff[key]) === "string" || this.typeOf(this.props.diff[key]) === "number") &&
                            <span>{JSON.stringify(this.props.diff[key])}</span>
                          }
                        </div>
                        {
                          (this.typeOf(this.props.diff[key]) !== "boolean" && this.typeOf(this.props.diff[key]) !== "string" && this.typeOf(this.props.diff[key]) !== "number") &&
                            <span>
                          <GenericJsonDiffViewer diff={this.props.diff[key]}/>
                          </span>
                        }
                      </li>)
                  }
                })
              }
              {"}"}<i className="fa"/>
            </ul>
          </div>
        }
        {
          this.typeOf(this.props.diff) === "array" &&
          <div>
            [
            <ul className="list-group">
              {
                this.props.diff.map((item, index) => {
                    if(item[0] === "+") {
                      return (
                        <li key={index} className="list-group-item list-group-item-success">
                          {
                            typeof item[1] === "object" &&
                            <GenericJsonDiffViewer diff={item[1]}/>
                          }
                          {
                            typeof item[1] !== "object" &&
                            <span>
                            <i className="fa fa-plus"/>
                                &nbsp;
                                <b>{item[1]}</b>
                            </span>
                          }
                        </li>
                      )
                    }
                    if(item[0] === "-") {
                      return (
                        <li key={index} className="list-group-item list-group-item-danger mks-color-white">
                          {
                            typeof item[1] === "object" &&
                            <GenericJsonDiffViewer diff={item[1]}/>
                          }
                          {
                            typeof item[1] !== "object" &&
                            <span>
                              <i className="fa fa-remove"/>
                              &nbsp;
                              <span className="mks-text-decoration-overline">
                                <b>{typeof item[1]}</b>
                              </span>
                            </span>
                          }
                        </li>
                      )
                    }
                    return null
                })
              }
            </ul>
            ]
          </div>
        }
      </div>
    )
  }
}
