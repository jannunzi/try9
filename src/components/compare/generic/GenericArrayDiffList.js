import React from "react";

export default class GenericArrayDiffList extends React.Component {
  render() {
    return(
      <ul className="list-group">
        {
          this.props.side === "left" &&
          this.props.arrayDifferences.filter(diff => !diff[1].startsWith('__IGNORE')).map(diff =>
            <li key={diff[1]}
                onClick={() => {
              if(diff[0] === "~") this.props.onSelectItem(diff[1])
            }}
              className={`
                  list-group-item mks-white-space-nowrap
                   ${diff[0] === "~" ? "list-group-item-info" : ""}
                   ${diff[0] === "-" ? "list-group-item-success" : ""}
                   ${diff[0] === "+" ? "list-group-item-danger mks-text-decoration-overline" : ""}
                   `}>
              <i className="fa fa-file-text"/> {diff[1]}
            </li>
          )
        }
        {
          this.props.side === "right" &&
          this.props.arrayDifferences.filter(diff => !diff[1].startsWith('__IGNORE')).map(diff =>
            <li key={diff[1]}
              onClick={() => {
              if(diff[0] === "~") this.props.onSelectItem(diff[1])
            }}
                className={`
                  list-group-item mks-white-space-nowrap
                   ${diff[0] === "~" ? "list-group-item-info" : ""}
                   ${diff[0] === "+" ? "list-group-item-success" : ""}
                   ${diff[0] === "-" ? "list-group-item-danger mks-text-decoration-overline" : ""}
                   `}>
              <i className="fa fa-file-text"/> {diff[1]}
            </li>
          )
        }
      </ul>
    )
  }
}
