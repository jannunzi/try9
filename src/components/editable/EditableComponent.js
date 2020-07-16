import React from "react";

export default class EditableComponent extends React.Component {

  state = {

  }
  render() {
    return(
      <div>
        {this.props.children}
        <div>
          <button>Edit</button>
          <button>Delete</button>
          <button>Save</button>
          <button>Cancel</button>
        </div>
      </div>
    )
  }
}
