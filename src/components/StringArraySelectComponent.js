import React from "react";

export default class StringArraySelectComponent extends React.Component {
  render() {
    return(
      <select
        className="form-control"
        value={typeof this.props.selectedIndex !== 'undefined' ? this.props.array[this.props.selectedIndex] : this.props.array[0]}
        onChange={(e) => this.props.onChange(e)}
        className="form-control">
        {
          this.props.array.map((item, index) =>
            <option
              value={item}
              key={item}>
              {item}
            </option>
          )
        }
      </select>
    )
  }
}
