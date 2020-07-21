import React from "react";
import {API_BASE_URL} from '../config'
import {Link} from "react-router-dom";

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
                    <Link to={`/firmwares`}
                          className={`list-group-item list-group-item-action ${this.state.path === 'firmwares' ? 'active': ''}`}>
                        Firmwares
                    </Link>
                    <Link to={`/configurations`}
                          className={`list-group-item list-group-item-action ${this.state.path === 'configurations' ? 'active': ''}`}>
                        Configurations
                    </Link>
                    <Link to={`/compare/configurations`}
                          className={`list-group-item list-group-item-action ${this.state.path === 'compare' ? 'active': ''}`}>
                        Compare
                    </Link>
                </div>
            </div>
        );
    }
}
