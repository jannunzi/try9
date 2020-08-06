import React from "react";
import {API_BASE_URL} from '../config'
import {Link, NavLink} from "react-router-dom";

export default class Home extends React.Component {

    state = {
        path: ''
    }

    componentDidMount() {
        console.log(window.location.href.split('/'))
        this.setState({
            path: window.location.href.split('/')[3]
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(window.location.href.split('/'))
        if(prevProps !== this.props) {
            this.setState({
                path: window.location.href.split('/')[3]
            })
        }
    }

    render() {
        return (
            <div>
                <div className="list-group">
                    <NavLink to="/dashboard"
                             activeClassName={`active`}
                             className={`list-group-item list-group-item-action`}>
                        Dashboard
                    </NavLink>
                    <NavLink to={`/firmwares`}
                             activeClassName={`active`}
                          className={`list-group-item list-group-item-action`}>
                        Firmwares
                    </NavLink>
                    <NavLink to={`/configurations`}
                             activeClassName={`active`}
                          className={`list-group-item list-group-item-action`}>
                        Configurations
                    </NavLink>
                    <NavLink to={`/compare/configurations`}
                             activeClassName={`active`}
                          className={`list-group-item list-group-item-action`}>
                        Compare
                    </NavLink>
                </div>
            </div>
        );
    }
}
