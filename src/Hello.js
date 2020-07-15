import React from "react";

export default class Hello extends React.Component {
  state = { message: 'Test' }
  componentDidMount() {
    fetch('http://localhost:4000/hello')
      .then(response => response.json())
      .then(data =>
        this.setState({ message: data.message }))
  }
  render() {
    return(
      <h1>Message: {this.state.message}</h1>
    )
  }
}
