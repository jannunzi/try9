import React from "react";

export default class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  }
  constructor(props) {
    super(props)
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }
  render() {
    if (this.state.hasError) {
      return (<div id="myModal" className="modal d-block" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                   aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 id="myModalLabel">Modal header</h3>
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
            </div>
            <div className="modal-body">
              <p>One fine body
                {JSON.stringify(this.state)}
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn" data-dismiss="modal" aria-hidden="true">Close</button>
              <button className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>)
    } else {
      return null;
    }
    // return this.props.children;
  }
}
