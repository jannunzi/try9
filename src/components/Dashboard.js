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
  render() {
    return(
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
                {/*<li><a href="#">Settings</a></li>*/}
                {/*<li><a href="#">Profile</a></li>*/}
                {/*<li><a href="#">Help</a></li>*/}
              </ul>
            </div>
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main height-100pc">
              <Route path={[`/firmwares`, `/firmwares/:fileName`]}
                     exact={true}
                     component={Firmwares}/>
              <Route path="/configurations" exact={true}
                     component={ConfigurationFormEditorWrapper}/>
              <Route path="/schemas" exact={true}
                     component={SchemaManager}/>
              <Route path="/configurations/:firmware/:configuration" exact={true}
                     render={() => <ConfigurationFormEditorWrapper {...this.props}/>}/>
              <Route path="/help" exact={true} component={Help}/>
              <Route
                path={["/compare", "/compare/:what", "/compare/:what/:firmware1", "/compare/:what/:firmware1/:firmware2"]}
                exact={true}
                component={FirmwareComparisonComponent}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
