import React from "react";

export default class GenericArrayDiffList extends React.Component {
  render() {
    return(
      <div>
      <ul className="list-group">
        {
          this.props.side === "left" &&
          this.props.arrayDifferences.filter(diff => !diff[1].startsWith('__IGNORE')).map(diff =>
            <li key={diff[1]} title={diff[1]}
                onClick={() => {
              if(diff[0] === "~") this.props.onSelectItem(diff[1])
            }}
              className={`
                  list-group-item mks-white-space-nowrap mks-overflow-hidden
                   ${this.props.contrast ? "mks-color-blind" : ""}
                   ${diff[1] === this.props.selectedJsonFile ? "mks-selected" : ""}
                   ${diff[0] === "~" ? "list-group-item-info" : ""}
                   ${diff[0] === "-" ? "list-group-item-success" : ""}
                   ${diff[0] === "+" ? "list-group-item-danger mks-text-decoration-overline" : ""}
                   `}>
              <i className="fa fa-file-text"/>
              &nbsp;
              {diff[1]}
              {
                diff[0] === "~" &&
                <i className="fa mks-position-absolute-top-right-15px"/>
              }
              {
                diff[0] === "+" &&
                <i className="fa fa-remove mks-position-absolute-top-right-15px"/>
              }
              {
                diff[0] === "-" &&
                <i className="fa fa-check mks-position-absolute-top-right-15px"/>
              }
            </li>
          )
        }
        {
          this.props.side === "right" &&
          this.props.arrayDifferences.filter(diff => !diff[1].startsWith('__IGNORE')).map(diff =>
            <li key={diff[1]} title={diff[1]}
              onClick={() => {
              if(diff[0] === "~") this.props.onSelectItem(diff[1])
            }}
                className={`
                  list-group-item mks-white-space-nowrap mks-overflow-hidden
                   ${this.props.contrast ? "mks-color-blind" : ""}
                   ${diff[1] === this.props.selectedJsonFile ? "mks-selected" : ""}
                   ${diff[0] === "~" ? "list-group-item-info" : ""}
                   ${diff[0] === "+" ? "list-group-item-success" : ""}
                   ${diff[0] === "-" ? "list-group-item-danger mks-text-decoration-overline" : ""}
                   `}>
              <i className="fa fa-file-text"/>
              &nbsp;
              {diff[1]}
              {
                diff[0] === "~" &&
                <i className="fa mks-position-absolute-top-right-15px"/>
              }
              {
                diff[0] === "+" &&
                <i className="fa fa-check mks-position-absolute-top-right-15px"/>
              }
              {
                diff[0] === "-" &&
                <i className="fa fa-remove mks-position-absolute-top-right-15px"/>
              }
            </li>
          )
        }
      </ul>
      </div>
    )
  }
}
