import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
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
