import React from "react";

export default class ToggleSwitch extends React.Component {
  state = {
    on: this.props.on
  }

  toggle = () => {
    this.setState(prevState => {
      this.props.callback(!prevState.on)
      return {
        on: !prevState.on
      }
    })
  }

  render() {
    return(
      <span className="mks-position-relative-bottom-3px">
        {
          this.props.leftLabel &&
          <span className="mks-position-relative-bottom-10px">{this.props.leftLabel}</span>
        }
        {
          this.state.on &&
          <i className="fa fa-toggle-on fa-3x mks-cursor-pointer mks-margin-left-5px"
             onClick={this.toggle}/>
        }
        {
          !this.state.on &&
          <i className="fa fa-toggle-off fa-3x mks-cursor-pointer mks-margin-left-5px"
             onClick={this.toggle}/>
        }
        {
          this.props.rightLabel &&
          <span className="mks-position-relative-bottom-10px">{this.props.rightLabel}</span>
        }
      </span>
    )
  }
}
