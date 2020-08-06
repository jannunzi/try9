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
import Dashboard from "./components/Dashboard";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Dashboard/>
      </Router>
    );
  }
}
