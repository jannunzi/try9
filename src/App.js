import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import './mks.scss'
import Dashboard from "./components/Dashboard";
import {createStore, combineReducers} from "redux";
import {Provider} from "react-redux"
import firmwareReducer from "./reducers/firmwareReducer";
import applicationReducer from "./reducers/applicationReducer";

const rootReducer = combineReducers({
  applicationReducer, firmwareReducer
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
