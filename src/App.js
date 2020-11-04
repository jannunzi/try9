import React from 'react';
import {HashRouter as Router} from "react-router-dom";
import './mks.scss'
import Dashboard from "./components/Dashboard";
import {createStore, combineReducers} from "redux";
import {Provider} from "react-redux"
import firmwareReducer from "./reducers/firmwareReducer";
import applicationReducer from "./reducers/applicationReducer";
import configurationReducer from "./reducers/configurationReducer";
import schemaReducer from "./reducers/schemaReducer";

const rootReducer = combineReducers({
  applicationReducer, firmwareReducer,
  configurationReducer, schemaReducer
})

const store = createStore(rootReducer)

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Dashboard/>
        </Router>
      </Provider>
    );
  }
}
