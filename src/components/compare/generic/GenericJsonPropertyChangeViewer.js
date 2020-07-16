import React from "react";

export default class GenericJsonPropertyChangeViewer extends React.Component {
  render() {
    return(
      <div className="row">
        <div className="col-xs-4">
          {this.props.property}:
        </div>
        <div className="col-xs-4 mks-color-red mks-text-decoration-overline">
          {this.props.oldValue}
        </div>
        <div className="col-xs-4 mks-color-green">
          {this.props.newValue}
        </div>
      </div>
    )
  }
}
