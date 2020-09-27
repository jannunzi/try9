import React from "react";

export class Tree extends React.Component {
  state = {
    hide: {},
    contrast: this.props.contrast
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.contrast            !== this.props.contrast ||
      JSON.stringify(prevProps.diff) !== JSON.stringify(this.props.diff)) {
      this.setState({
        contrast: this.props.contrast
      })
    }
  }
  typeOf = (item) => {
    if(Array.isArray(item)) {
      return "array"
    }
    return typeof item
  }
  render() {
    return (
      <div className={`tree ${this.props.hide ? "mks-display-none" : ""}`}>
        {
            this.typeOf(this.props.diff) === "object" &&
            <div className="">
              <span className="mks-bracket-open">{'{'}</span>
                <ul className="mks object list list-group">
                    {
                      Object.keys(this.props.diff).map((key, index) =>
                        <li key={index} className={`list-group-item mks ${key} ${key === "__new" ? "mks-display-none" : ""}  `}>
                          {
                            (key === "__old") &&
                              <div className="row mks">
                                <div className="mks __old col-xs-6">{JSON.stringify(this.props.diff[key])}</div>
                                <div className="mks __new col-xs-6">{JSON.stringify(this.props.diff["__new"])}</div>
                              </div>
                          }
                          {
                            (key === "__new") && null
                          }
                          {
                            key !== "__old" && key !== "__new" &&
                              <span>
                                {key}
                                <Tree hide={this.state.hide[key] === true} diff={this.props.diff[key]}/>
                              </span>
                          }
                        </li>
                    )}
                </ul>
              <span className="mks-bracket-closed">{'}'}</span>
            </div>
          }
          {
            this.typeOf(this.props.diff) === "array" &&
            <div>
              {
                this.props.diff[0] === "-" &&
                <span className="deleted">{JSON.stringify(this.props.diff[1])}</span>
              }
              {
                this.props.diff[0] === "+" &&
                <span className="added">{JSON.stringify(this.props.diff[1])}</span>
              }
              {
                this.props.diff[0] === "~" &&
                <span><Tree diff={this.props.diff[1]}/></span>
              }
              {
                this.props.diff[0] === " " &&
                <span>{JSON.stringify(this.props.diff[1])}</span>
              }
              {
                this.props.diff[0] !== "~" && this.props.diff[0] !== "+" && this.props.diff[0] !== "-" && this.props.diff[0] !== " " &&
                <div className="">
                  <span className="mks-bracket-open">{'['}</span>
                  <ul className="mks array list list-group">
                    {
                      this.props.diff.map((item, index) =>
                        <li key={index}
                            className={`
                              mks
                              list-group-item
                              ${this.state.contrast ? "mks-color-blind" : ""}
                              ${JSON.stringify(item)}
                              ${this.typeOf(item) === "array" && item[0] === "+" ? "list-group-item-success":""}
                              ${this.typeOf(item) === "array" && item[0] === "-" ? "list-group-item-danger":""}
                              `}>
                          <Tree contrast={this.state.contrast} diff={item}/>
                        </li>
                      )}
                  </ul>
                  <span className="mks-bracket-closed">{']'}</span>
                </div>
              }
            </div>
          }
        {
          this.typeOf(this.props.diff) === "string"
          ||
          this.typeOf(this.props.diff) === "number"
          &&
          <span className={JSON.stringify(this.props.diff)}>{JSON.stringify(this.props.diff)}</span>
        }
        {
          this.typeOf(this.props.diff) === "boolean" &&
          <span className={JSON.stringify(this.props.diff)}>{JSON.stringify(this.props.diff)}</span>
        }
      </div>
    );
  }
}
