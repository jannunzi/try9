import React from "react";
import {API_BASE_URL} from "../config";
import {Link} from "react-router-dom";
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';
import configurationService from '../services/configuration.service.client'
import schemaService from '../services/schema.service.client'

export default class Firmware extends React.Component {

    state = {
        firmware: '',
        configurationFiles: [],
        configurationFile: '',
        configurationFileContent: {},
        configurationFileContentUpdates: {},

        schemaFiles: []
    }

    componentDidMount() {
        const firmware = this.props.match.params.firmware
        const configurationFile = this.props.match.params.file
        const layout = this.props.match.params.layout || 'schemas'
        this.setState({
            layout: layout
        })

        this.fetchSchemaFiles(firmware)

        if(firmware && configurationFile) {
            this.fetchConfigurationFileContent(firmware, configurationFile)
        }
        this.untar()
            .then(this.fetchConfigurationFiles)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const configurationFile = this.props.match.params.file
        const layout = this.props.match.params.layout
        if(prevProps.match.params.file !== configurationFile || prevProps.match.params.layout !== layout) {
            this.setState({
                layout: layout,
                configurationFile: configurationFile
            })
            if(layout === 'configurations') {
                this.fetchConfigurationFileContent(this.state.firmware, configurationFile)
            } else if(layout === 'schemas') {
                this.fetchSchemaFileContent(this.state.firmware, this.props.match.params.file)
            }
        }
    }

    fetchSchemaFileContent = (firmware, schemaFile) => {
        schemaService.fetchSchemaFileContent(firmware, schemaFile)
            .then(fileContent => this.setState({
                schemaFileContent: fileContent
            }))
    }

    untar = () => {
        const firmware = this.props.match.params.firmware
        this.setState({
            firmware: firmware
        })
        return fetch(`${API_BASE_URL}/api/firmwares/${firmware}/untar`, {
            method: 'POST'
        })
    }

    fetchSchemaFiles = (firmware) =>
        schemaService.fetchSchemaFiles(firmware)
            .then(schemaFiles => this.setState({
                schemaFiles: schemaFiles
            }))

    fetchConfigurationFiles = () => {
        configurationService.fetchConfigurationFiles(this.state.firmware)
            .then(configurationFiles => this.setState({
                configurationFiles: configurationFiles.filter(file => file.endsWith(".json"))
            }))
    }

    fetchConfigurationFileContent = (firmware, configurationFile) => {
        configurationService.fetchConfigurationFileContent(firmware, configurationFile)
            .then(configurationFileContent => {
                this.setState({
                    configurationFile: this.props.match.params.configuration,
                    configurationFileContent: configurationFileContent
                })
            })
    }

    configurationFileChanged = (changes) => {
        console.log(changes)
        this.setState({
            configurationFileContentUpdates: changes.json
        })
    }

    render() {
        return(
            <div>
                <h1>
                    <Link className="btn btn-primary" to="/firmwares">
                        Back
                    </Link>
                    {this.state.firmware}</h1>
                <div className="row">
                    <div className="col-xs-3">
                        <ul className="nav nav-tabs">
                            <li className={`${this.state.layout === 'schemas' ? 'active': ''}`}>
                                <Link
                                    to={`/firmwares/${this.state.firmware}/schemas/${this.state.configurationFile}`}>
                                    Schemas
                                </Link>
                            </li>
                            <li className={`${this.state.layout === 'configurations' ? 'active': ''}`}>
                                <Link
                                    to={`/firmwares/${this.state.firmware}/configurations/${this.state.configurationFile}`}>
                                    Configurations
                                </Link>
                            </li>
                        </ul>
                        <br/>
                        {
                            this.state.layout === 'configurations' &&
                            <div className="list-group">
                                {
                                    this.state.configurationFiles.map(configFile =>
                                        <Link key={configFile}
                                              to={`/firmwares/${this.state.firmware}/configurations/${configFile}`}
                                              className={`list-group-item list-group-item-action
                                            ${configFile===this.props.match.params.configuration?'active':''}`}>
                                            {configFile}
                                        </Link>
                                    )
                                }
                            </div>
                        }
                        {
                            this.state.layout === 'schemas' &&
                            <div className="list-group">
                                {
                                    this.state.schemaFiles.map(file =>
                                        <Link key={file}
                                              to={`/firmwares/${this.state.firmware}/schemas/${file}`}
                                              className={`list-group-item list-group-item-action
                                            ${file===this.props.match.params.file?'active':''}`}>
                                            {file}
                                        </Link>
                                    )
                                }
                            </div>
                        }
                    </div>
                    <div className="col-xs-9">
                        {
                            this.state.layout === 'schemas' &&
                            <h1>Schemas</h1>
                        }
                        {
                            this.state.layout === 'configurations' &&
                            <div>
                                <button
                                    onClick={() => configurationService.saveConfigurationFileContent(
                                        this.state.firmware,
                                        this.state.configurationFile,
                                        this.state.configurationFileContentUpdates
                                    )}
                                    className="btn btn-success pull-right">Save
                                </button>
                                <ul className="nav nav-tabs">
                                    <li className="active"><a href="#">JSON</a></li>
                                    <li><a href="#">Form</a></li>
                                </ul>
                                <br/>
                                <JSONInput
                                    id          = 'a_unique_id'
                                    placeholder = { this.state.configurationFileContent }
                                    theme       = "light_mitsuketa_tribute"
                                    locale      = { locale }
                                    width       = "100%"
                                    onChange    = {this.configurationFileChanged}
                                />
                                {/*<Editor*/}
                                {/*    value={this.state.configurationFileContent}*/}
                                {/*/>*/}
                                {/*<ReactJson src={this.state.configurationFileContent} />*/}
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
