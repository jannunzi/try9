import React from "react";

export default class JsonObjectDiffDetailsViewer extends React.Component {
  render() {
    return (
      <div>
        <ul className="list-group">
          <li className="list-group-item active">
            <div className="row">
              <div className="col-xs-4">
                <b>Property</b>
              </div>
              <div className="col-xs-4">
                <b>Old</b>
              </div>
              <div className="col-xs-4">
                <b>New</b>
              </div>
            </div>
          </li>
        {
          Object.keys(this.props.object).map(key => {
            return (<li className="list-group-item">
              <div className="row">
                <div className="col-xs-4">{key}</div>
                <div className="col-xs-4">
                  {this.props.object[key]['__old']}
                </div>
                <div className="col-xs-4">
                  {this.props.object[key]['__new']}
                </div>
              </div>
            </li>)
          })
        }
        </ul>
      </div>
    );
  }
}
