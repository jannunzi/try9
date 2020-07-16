import React from "react";
import JsonArrayDiffViewer from "./JsonArrayDiffViewer";
import JsonObjectDiffViewer from "./JsonObjectDiffViewer";
import DeletedAddedChangedLabels from './DeletedAddedChangedLabels'
import ReactJson from "react-json-view";

export default class JsonDiffViewer extends React.Component {
  state = {
    raw: false,
    toggle: {}
  }
  toggleRaw = () =>
    this.setState(prevState => ({
      raw: !prevState.raw
    }))
  toggle = (key) =>
    this.setState(prevState => {
      debugger
      let nextState = {...prevState}
      if(typeof nextState.toggle[key] === 'undefined') {
        nextState.toggle[key] = true
      } else if(nextState.toggle[key] === true) {
        nextState.toggle[key] = false
      } else {
        nextState.toggle[key] = true
      }
      return nextState;
    })
  render() {
    return (
      <div>
        <ul className="nav nav-tabs">
          <li onClick={this.toggleRaw} className={`${!this.state.raw ? "active": ""}`}>
            <a>Diff</a>
          </li>
          <li onClick={this.toggleRaw} className={`${this.state.raw ? "active": ""}`}>
            <a>Raw</a>
          </li>
        </ul>
        <br/>
        {
          this.state.raw &&
          <ReactJson src={this.props.diff} />
        }
        {
          !this.state.raw &&
          <ul className="list-group">
            {
              this.props.diff &&
              this.props.diff.properties &&
              Object.keys(this.props.diff.properties).map(key =>
                <li key={key}
                    className="list-group-item">
                  <h4 className="mks-pointer-cursor"
                      onClick={(e) => {
                    e.preventDefault()
                    this.toggle(key)
                  }}>{key}</h4>
                  {
                    this.state.toggle[key] &&
                    <ul className="list-group">
                      <li className="list-group-item">
                        <DeletedAddedChangedLabels/>
                        <h4 className="mks-pointer-cursor"
                            onClick={(e) => {
                          e.preventDefault()
                          this.toggle("required")
                        }}>
                          required:
                        </h4>
                        {
                          this.state.toggle["required"] &&
                          <JsonArrayDiffViewer array={this.props.diff.properties[key].required}/>
                        }
                      </li>
                      <li className="list-group-item">
                        <DeletedAddedChangedLabels/>
                        <h4 className="mks-pointer-cursor"
                            onClick={() => this.toggle("properties")}>
                          properties:
                        </h4>
                        {
                          this.state.toggle["properties"] &&
                          <JsonObjectDiffViewer object={this.props.diff.properties[key].properties}/>
                        }
                      </li>
                    </ul>
                  }
                </li>
              )
            }
          </ul>
        }
      </div>
    );
  }
}
