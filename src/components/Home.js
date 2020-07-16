import React from "react";
import {API_BASE_URL} from '../config'
import {Link} from "react-router-dom";

export default class Home extends React.Component {

    componentDidMount = () => {
        console.log(process.env)
        console.log(API_BASE_URL)
    }

    render() {
        return (
            <div>
                <div className="list-group">
                    <Link to={`/firmwares`}
                          className="list-group-item list-group-item-action">
                        Firmwares
                    </Link>
                    <Link to={`/configuration-editor-form-test`}
                          className="list-group-item list-group-item-action">
                        Configurations
                    </Link>
                    <Link to={`/compare/configurations`}
                          className="list-group-item list-group-item-action">
                        Compare
                    </Link>
                </div>
            </div>
        );
    }
}
