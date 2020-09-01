import React from "react";
import '../styling/dashboard.css'
import {NavLink, Route} from "react-router-dom";
import FirmwareComparisonComponent from "./compare/FirmwareComparisonComponent";
import Firmwares from "./Firmwares";
import logo from "../images/mks-logo.png"
import ConfigurationFormEditorWrapper from "./ConfigurationFormEditorWrapper";
import Help from "./Help";
import SchemaManager from "./schemas/SchemaManager";

export default class Dashboard extends React.Component {
  state = {
    contrast: false
  }

  toggleContrast = () => {
    this.setState(prevState => ({
      contrast: !prevState.contrast
    }))
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
              <a className="navbar-brand" href="/">
                <img alt="" src={logo} className="mks-width-5em"/>
              </a>
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
            <div className="col-sm-3 col-md-2 sidebar">
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
                <li>
                  <a href="#">
                    <span className="mks-position-relative-bottom-3px">
                      <span className="mks-position-relative-bottom-10px">High Contrast</span>
                      {
                        this.state.contrast &&
                        <i className="fa fa-toggle-on fa-3x mks-cursor-pointer mks-margin-left-5px"
                           onClick={this.toggleContrast}/>
                      }
                      {
                        !this.state.contrast &&
                        <i className="fa fa-toggle-off fa-3x mks-cursor-pointer mks-margin-left-5px"
                           onClick={this.toggleContrast}/>
                      }
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main height-100pc">
              <Route path={[`/firmwares`, `/firmwares/:fileName`]}
                     exact={true}
                     render={(props) => <Firmwares contrast={this.state.contrast} {...props} contrast={this.state.contrast}/>}/>
              <Route path="/configurations" exact={true}
                     component={ConfigurationFormEditorWrapper}/>
              <Route path="/schemas" exact={true}
                     component={SchemaManager}/>
              <Route path="/configurations/:firmware/:configuration" exact={true}
                     render={(props) => <ConfigurationFormEditorWrapper {...props}/>}/>
              <Route path="/help" exact={true} component={Help}/>
              <Route
                path={["/compare", "/compare/:what", "/compare/:what/:firmware1", "/compare/:what/:firmware1/:firmware2"]}
                exact={true}
                render={(props) => <FirmwareComparisonComponent {...props} contrast={this.state.contrast}/> }/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
