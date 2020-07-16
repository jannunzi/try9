import React from "react";
import {fetchFirmwares} from "../services/firmware.service.client";
import {fetchSchemaFileContent, fetchSchemaFiles} from '../services/schema.service.client'
import configurationService, {fetchConfigurationFileContent, saveConfigurationFileContent} from '../services/configuration.service.client'
import ConfigurationFormEditor from "./ConfigurationFormEditor/ConfigurationFormEditor";
import ReactJson from "react-json-view";
import {Link} from "react-router-dom";

export default class ConfigurationFormEditorTest extends React.Component {
    state = {
        firmwares: [],
        schemas: [],
        firmwareFile: 'TEST1.zcz',
        schemaFile: 'mainController.json',
        uiSchema: {
          "Customer" : {
            "Hopping Presets" : {
              "ui:options":  {
                "orderable": false
                // ,"addable": false
              }
            }
          }
        },
        configurationFile: 'Broadcast.json',
        schema: null,
        configuration: null
    }

    componentDidMount() {
        let schema = ''

        let firmwares = []
        let schemas = []
        fetchFirmwares()
            .then(_firmwares => {
                firmwares = _firmwares
                return fetchSchemaFiles(firmwares[0])
            })
            .then(_schemas => {
                schemas = _schemas
                return this.fetchSchemaAndConfiguration(this.state.schemaFile)
            })
            .then(() => this.setState({
                firmwares, schemas
            }))

        // fetchSchemaFileContent(this.state.firmwareFile, this.state.schemaFile)
        //     .then(_schema => {
        //         schema = _schema
        //         return fetchConfigurationFileContent(this.state.firmwareFile, this.state.configurationFile)
        //     })
        //     .then(_configuration =>
        //         this.setState({
        //             schema: schema,
        //             configuration: _configuration
        //         })
        //     )
    }

    fetchSchemasForFirmware = (firmwareFile) =>
        fetchSchemaFiles(firmwareFile)
            .then(schemas => this.setState({firmwareFile, schemas}))

    fetchSchemaAndConfiguration = (schemaFile) =>
    {
        let schema = {}
        fetchSchemaFileContent(this.state.firmwareFile, schemaFile)
            .then(_schema => {
                schema = _schema
                this.setState({
                    schemaFile: schemaFile,
                    configurationFile: schemaFile
                })
                return fetchConfigurationFileContent(this.state.firmwareFile, schemaFile)
            })
            .then(_configuration =>
                this.setState({
                    configuration: _configuration,
                    schema: schema
                })
            )
    }

    onSubmit = (formData) => {
      // console.log(formData)
      debugger
      saveConfigurationFileContent(
        this.state.firmwareFile,
        this.state.configurationFile,
        formData.formData
      )
    }

    render() {
        return(
            <div className="position-relative height-100pc">
                <div className="row">
                    <div className="col-xs-6">
                        <select
                            value={this.state.firmwareFile}
                            onChange={(e) => this.fetchSchemasForFirmware(e.target.value)}
                            className="form-control">
                            {this.state.firmwares.map(firmware => <option key={firmware}>{firmware}</option> )}
                        </select>
                    </div>
                    <div className="col-xs-6">
                        <select
                            value={this.state.schemaFile}
                            onChange={(e) => this.fetchSchemaAndConfiguration(e.target.value)}
                            className="form-control">
                            {this.state.schemas.map(schema => <option key={schema.file} value={schema.file}>{schema.title}</option> )}
                        </select>
                    </div>
                </div>
                <div className="row position-absolute height-100pc left-0px top-85px right-0px bottom-0px">
                    <div className="col-xs-12 position-absolute top-0px bottom-0px overflow-scroll">
                        {
                            this.state.configuration && this.state.schema &&
                            <div>
                                <button
                                    className="position-relative top-20px btn btn-success pull-right">Save</button>
                                <ConfigurationFormEditor
                                  schema={this.state.schema}
                                  uiSchema={this.state.uiSchema}
                                  onSubmit={this.onSubmit}
                                  configuration={this.state.configuration}/>
                            </div>
                        }
                    </div>
                    {/*<div className="col-xs-4 position-absolute left-50pc top-0px bottom-0px overflow-scroll">*/}
                    {/*    <h2>*/}
                    {/*        Schema*/}
                    {/*        <button className="btn btn-warning pull-right">Edit</button>*/}
                    {/*    </h2>*/}
                    {/*    {*/}
                    {/*        this.state.schema &&*/}
                    {/*        <ReactJson src={this.state.schema} />*/}
                    {/*    }*/}
                    {/*</div>*/}
                    {/*<div className="col-xs-2 position-absolute right-0px top-0px bottom-0px overflow-scroll">*/}
                    {/*    <h2>*/}
                    {/*        Configuration*/}
                    {/*        <button className="btn btn-warning pull-right">Edit</button>*/}
                    {/*    </h2>*/}
                    {/*    {*/}
                    {/*        this.state.configuration &&*/}
                    {/*        <ReactJson src={this.state.configuration}/>*/}
                    {/*    }*/}
                    {/*</div>*/}
                </div>
            </div>
        )
    }
}
