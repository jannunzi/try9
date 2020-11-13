import React from "react";
import '../styling/dashboard.css'
import {NavLink, Redirect, Route} from "react-router-dom";
import FirmwareComparisonComponent from "./comparisons/FirmwareComparisonComponent";
import Firmwares from "./firmwares/firmware-manager";
import logo from "../images/mks-logo.png"
import ConfigurationFormEditorWrapper from "./configurations/ConfigurationFormEditorWrapper";
import Help from "./Help";
import {findAllSettings} from "../actions/applicationActions";
import {connect} from "react-redux"
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from "react-notifications";
import ErrorBoundary from "./ErrorBoundary";

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.findAllSettings()
  }

  componentDidCatch(error, errorInfo) {
    NotificationManager.error(error, "", 100000);
  }

  render() {
    return (
      <div className="height-100pc">
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                      aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <span className="navbar-brand">
                <img alt="" src={logo} className="mks-width-5em"/>
              </span>
            </div>
            <div id="navbar" className="navbar-collapse collapse mks-invisible">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <NavLink to={`/firmwares`} activeClassName={`active`}>
                    Add Configurations
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/configurations`} activeClassName={`active`}>
                    Configurations
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/compare/configurations`} activeClassName={`active`}>
                    Compare
                  </NavLink>
                </li>
              </ul>
              <form className="navbar-form navbar-right">
                <input type="text" className="form-control" placeholder="Search..."/>
              </form>
            </div>
          </div>
        </nav>
        <div className="container-fluid height-100pc">
          <div className="row height-100pc">
            <div className="col-md-2 sidebar hidden-sm">
              <ErrorBoundary/>
              <ul className="nav nav-sidebar">
                <li>
                  <NavLink to={`/firmwares`} activeClassName={`active`}>
                    Add Configurations
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/configurations`} activeClassName={`active`}>
                    Edit Configurations
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/compare/configurations`} activeClassName={`active`}>
                    Compare Configurations
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/help`} activeClassName={`active`}>
                    Help
                  </NavLink>
                </li>
              </ul>
              <div className="mks-position-absolute-bottom-15px">
                version {this.props.settings.version}
              </div>
            </div>
            <div className="col-sm-12 col-md-10 col-md-offset-2 main height-100pc">
              <NotificationContainer/>
              {/*<Route path="/"*/}
              {/*       exact={true}*/}
              {/*       render={() => {*/}
              {/*         return(<Redirect to="/firmwares"/>)}}/>*/}
              <Route path={['/', '/firmwares', '/firmwares/:fileName']}
                     exact={true}
                     render={(props) => <Firmwares {...props}/>}/>
              <Route path="/configurations" exact={true}
                     component={ConfigurationFormEditorWrapper}/>
              <Route path="/configurations/:firmware/:configuration" exact={true}
                     render={(props) => <ConfigurationFormEditorWrapper {...props}/>}/>
              <Route path="/help" exact={true} component={Help}/>
              <Route
                path={["/compare", "/compare/:what", "/compare/:what/:firmware1", "/compare/:what/:firmware1/:firmware2"]}
                exact={true}
                render={(props) => <FirmwareComparisonComponent {...props} contrast={false}/> }/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const stateToPropertyMapper = (state) => ({
  settings: state.applicationReducer.settings
})

const dispatchToPropertyMapper = (dispatch) => ({
  findAllSettings: () => findAllSettings(dispatch)
})

export default connect
(stateToPropertyMapper, dispatchToPropertyMapper)
(Dashboard)
