import React from "react";

export default class StringArraySelectComponent extends React.Component {
  state = {
    selectedIndex: this.props.selectedIndex || "0"
  }
  render() {
    return(
      <select
        value={this.state.selectedIndex}
        onChange={(e) => {
          this.props.onChange(e)
          this.setState({
            selectedIndex: e.target.value
          })
        }}
        className="form-control">
        {
          this.props.array && this.props.array.map((item, index) =>
            <option
              value={index}
              key={index}>
              {item.replace(/\+/g, '/')}
            </option>
          )
        }
      </select>
    )
  }
}
