import React from "react";
import JsonObjectDiffDetailsViewer from "./JsonObjectDiffDetailsViewer";

export default class JsonObjectDiffViewer extends React.Component {
  render() {
    return(
      <div>
        <ul className="list-group">
        {
          Object.keys(this.props.object).map(key => {
            return (
              <li className={`list-group-item
               ${key.endsWith('deleted')?"list-group-item-danger":""}
               ${key.endsWith('added')?"list-group-item-success":""}
               ${!key.endsWith('deleted') && !key.endsWith('added')?"list-group-item-info":""}
               `}>
                {
                  key.endsWith('added') &&
                  <i className="fa fa-plus pull-right"/>
                }
                {
                  key.endsWith('deleted') &&
                  <i className="fa fa-remove pull-right"/>
                }
                {
                  !key.endsWith('deleted') && !key.endsWith('added') &&
                  <div>
                    {key}
                    <br/>
                    <br/>
                    <JsonObjectDiffDetailsViewer object={this.props.object[key]}/>
                  </div>
                }
                {
                  (key.endsWith('deleted') || key.endsWith('added')) &&
                      key.replace("__added", "")
                        .replace("__deleted", "")
                }
              </li>
            )
          })
        }
        </ul>
      </div>
    )
  }
}
