import React from "react";
import firmwareService from '../services/firmware.service.client'
import schemaService from '../services/schema.service.client'
import configurationService, {fetchConfigurationFileContent, saveConfigurationFileContent} from '../services/configuration.service.client'
import ConfigurationFormEditor from "./ConfigurationFormEditor/ConfigurationFormEditor";
import ReactJson from "react-json-view";
import {NavLink} from "react-router-dom";

export default class ConfigurationFormEditorWrapper extends React.Component {
    state = {
        firmwares: [],
        schemas: [],
        firmwareFile: null,
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
        configuration: ''
    }

    componentDidMount() {
        let schema = ''

        let firmwares = []
        let schemas = []

        // fetch firmware files to populate dropdown
        firmwareService.fetchFirmwares()
            .then(_firmwares => {
                firmwares = _firmwares
                this.setState({
                  firmwareFile: firmwares[0]
                })

                // fetch all schema files for the first firmware
                return schemaService.fetchSchemaFiles(firmwares[0])
            })
            .then(_schemas => {
              schemas = _schemas

              if(this.props.history) {
                this.props.history.push(`/configurations/${firmwares[0]}/${schemas[0].file}`)
              }

                // fetch schema and configuration files for first schema file
                return this.fetchSchemaAndConfiguration(schemas[0].file)
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
        schemaService.fetchSchemaFiles(firmwareFile)
            .then(schemas => {
              this.setState({firmwareFile, schemas})
              if(this.state.schemaFile)
              {

                if(this.props.history) {
                  this.props.history.push(`/configurations/${firmwareFile}/${this.state.schemaFile}`)
                }

                return this.fetchSchemaAndConfiguration(this.state.schemaFile)
              }
              })
    fetchSchemaAndConfiguration = (schemaFile) => {
        let schema = {}

        // fetch schema file to configure form editor tool
        schemaService.fetchSchemaFileContent(this.state.firmwareFile, schemaFile)
            .then(_schema => {
                schema = _schema

              if(schema === null) {
                schema = this.state.schemas.find(schema => !schema.title.startsWith('__IGNORE'))
                this.fetchSchemaAndConfiguration(schema.file)
                return Promise.reject('null schema')
              }

                // TODO: confirm configuration file has same name as schema file
                // assume configuration file has same name as schema file
                this.setState({
                    schemaFile: schemaFile,
                    configurationFile: schemaFile
                })

                // fetch configuration file to populate form editor tool
                return configurationService.fetchConfigurationFileContent(this.state.firmwareFile, schemaFile)
            })
            .then(_configuration =>
                this.setState({
                    configuration: _configuration,
                    schema: schema
                })
            )
    }

    onSubmit = (formData) => {
      saveConfigurationFileContent(
        this.state.firmwareFile,
        this.state.configurationFile,
        formData.formData
      )
    }
    onLoadConfiguration = () => {
      this.fetchSchemaAndConfiguration(this.state.schemaFile)
    }

    render() {
        return(
            <div className="position-relative height-100pc">
                <br/>
                <div className="row">
                    <div className="col-xs-6">
                        Select file or folder
                        <select
                            value={this.state.firmwareFile}
                            onChange={(e) => this.fetchSchemasForFirmware(e.target.value)}
                            className="form-control">
                            {this.state.firmwares.map(firmware => <option key={firmware}>{firmware}</option> )}
                        </select>
                    </div>
                    <div className="col-xs-6">
                        Select configuration for selected file or folder
                        <select
                            value={this.state.schemaFile}
                            onChange={(e) => this.fetchSchemaAndConfiguration(e.target.value)}
                            className="form-control">
                            {this.state.schemas.filter(schema => !schema.file.endsWith("Cal.json") && !schema.file.startsWith('__IGNORE')).map(schema =>
                              <option key={schema.file} value={schema.file}>
                                {schema.title} ({schema.file})
                              </option> )}
                        </select>
                    </div>
                    {/*<div className="col-xs-2">*/}
                    {/*  &nbsp;*/}
                    {/*  <button onClick={this.onLoadConfiguration} className="btn btn-primary btn-block">Load Configuration</button>*/}
                    {/*</div>*/}
                  </div>
                <div className="row position-absolute height-100pc left-0px top-85px right-0px bottom-0px">
                    <div className="col-xs-12 position-absolute top-0px bottom-0px">
                        {
                            this.state.configuration && this.state.schema &&
                            <div>
                                {
                                  this.state.schemas && this.state.schemas.length > 0 && this.state.configuration !== null && this.state.schema !== null &&
                                  <ConfigurationFormEditor
                                    uiSchema={this.state.uiSchema}
                                    onSubmit={this.onSubmit}
                                    schema={this.state.schema}
                                    configuration={this.state.configuration}/>
                                }
                              {
                                this.state.schemas.length === 0 &&
                                  <div className="alert alert-danger">
                                    This configuration file or folder does not have
                                    schemas associated.
                                    Please upload schema files to edit configuration files.
                                    NOTE: Configuration files are assumed to have the same
                                    name as their corresponding schema files
                                    <br/>
                                    <br/>
                                    <NavLink className="btn btn-primary" to={`/firmwares/${this.state.firmwareFile}`}>
                                      Upload Schema Files
                                    </NavLink>
                                  </div>
                              }
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
