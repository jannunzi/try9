import React from 'react';
import logo from './logo.svg';
import Home from "./components/Home";
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import ListComponent from "./components/ListComponent";
import SchemaEditorComponent from "./components/SchemaEditorComponent";
import FormTest from "./components/FormTest";
import Firmwares from "./components/Firmwares";
import Firmware from "./components/Firmware";
import ConfigurationFormEditorWrapper from "./components/ConfigurationFormEditorWrapper";
import FirmwareComparisonComponent from "./components/compare/FirmwareComparisonComponent";
import './mks.scss'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <div className="container-fluid">
            <h1>Configurator</h1>
            <div className="row">
              <div className="col-xs-2">
                <Home/>
              </div>
              <div className="col-xs-10">
                <Route
                  path={["/compare", "/compare/:what", "/compare/:what/:firmware1", "/compare/:what/:firmware1/:firmware2"]}
                  exact={true}
                  component={FirmwareComparisonComponent}/>
                <Route path="/configurations" exact={true} component={ConfigurationFormEditorWrapper}/>
                <Route path="/configurations/:firmware" exact={true}
                       component={ConfigurationFormEditorWrapper}/>
                <Route path="/configurations/:firmware/:schema" exact={true}
                       component={ConfigurationFormEditorWrapper}/>
                <Route path={["/form-test", "/form-test/:schema"]} exact={true} component={FormTest}/>
                <Route path={`/firmwares`} exact={true} component={Firmwares}/>
                <Route path={`/firmwares/:firmware`} exact={true} component={Firmware}/>
                <Route path={[`/firmwares/:firmware/:layout`, `/firmwares/:firmware/:layout/:file`]} exact={true}
                       component={Firmware}/>
                <Route path={`/_schemas`} exact={true} component={SchemaEditorComponent}/>
                <Route path={`/collections/:collection/schema`} exact={true} component={SchemaEditorComponent}/>
                <Route path={`/collections`} exact={true} render={() => <ListComponent hrefAppend={'schema'}/>}/>
              </div>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}
