import React from "react";
import firmwareService from '../services/firmware.service.client'
import schemaService, {fetchSchemaFileContent} from '../services/schema.service.client'
import configurationService, {fetchConfigurationFileContent, saveConfigurationFileContent} from '../services/configuration.service.client'
import ConfigurationFormEditor from "./ConfigurationFormEditor/ConfigurationFormEditor";
import ReactJson from "react-json-view";
import {NavLink} from "react-router-dom";
import {API_BASE_URL} from "../config";

export default class ConfigurationFormEditorWrapper extends React.Component {
    state = {
        firmwares: [],
        schemas: [],
        firmwareFile: '',
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
        configuration: '',
        showSpinner: false
    }

    downloadLink = ""

    componentDidMount = () => {
      debugger
        let schema = ''

        let firmwares = []
        let schemas = []
        // fetch firmware files to populate dropdown
        firmwareService.fetchFirmwares()
            .then(_firmwares => {
                firmwares = _firmwares
                this.setState({
                  firmwares,
                  firmwareFile: firmwares[0],
                  schemas: []
                })

                // fetch all schema files for the first firmware
                // return schemaService.fetchSchemaFiles(firmwares[0])
              return this.fetchSchemasForFirmware(firmwares[0])
            })
            .then(_schemas => {

              schemas = _schemas || []
              this.setState({
                schemas: schemas.filter(schema => !schema.file.startsWith('__IGNORE') && !schema.file.endsWith('Cal.json')),
              })
              if(schemas && schemas.length > 0) {
                // return this.fetchSchemaFileContent
                this.fetchSchemaAndConfiguration(schemas[0].file)
              }

              // schemas = _schemas || []
              //
              //
              // this.setState({
              //   schemas: schemas//.filter(schema => !schema.file.endsWith("Cal.json") && !schema.file.startsWith('__IGNORE'))
              // })

              // if(schemas && schemas.length > 0 && this.props.history) {
              //   // this.props.history.push(`/configurations/${firmwares[0]}/${schemas[0].file}`)
              //   // fetch schema and configuration files for first schema file
              //   return this.fetchSchemaAndConfiguration(schemas[0].file)
              // } else {
              //   this.setState({
              //     schemas: []
              //   })
              //   return Promise.resolve([])
              // }
            })
            // .then((schemas) => this.setState({
            //     schemas
            // }))
    }

    packageFirmware = (firmwareName) => {
      // this.showDownloading(firmwareName, true)
      this.setState({
        showSpinner: true
      })
      firmwareService.packageFirmware(firmwareName)
        .then((response) => {
          setTimeout(() => {
            // this.showDownloading(firmwareName, false)
            this.setState({
              showSpinner: false
            })
            this.downloadLink.click()
          }, 3000)
        })
        .catch(e => console.log(e))
    }

    fetchSchemasForFirmware = (firmwareFile) => {
      debugger
      return schemaService.fetchSchemaFiles(firmwareFile)
    }

    fetchSchemaAndConfiguration = (schemaFile) => {
      debugger
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
      debugger
      saveConfigurationFileContent(
        this.state.firmwareFile,
        this.state.configurationFile,
        formData.formData
      )
    }
    onLoadConfiguration = () => {
      debugger
      this.fetchSchemaAndConfiguration(this.state.schemaFile)
    }
    onFirmwareSelect = (e) => {
      debugger
      const firmwareFile = e.target.value
      this.fetchSchemasForFirmware(firmwareFile)
        .then(schemas => {
          schemas = schemas || []
          this.setState({
            schemas: schemas.filter(schema => !schema.file.startsWith('__IGNORE') && !schema.file.endsWith('Cal.json')),
            firmwareFile: firmwareFile
          })
          if(schemas && schemas.length > 0) {
            // return this.fetchSchemaFileContent
            this.fetchSchemaAndConfiguration(schemas[0].file)
          }
        })
    }

    render() {
        const modifiedConfigFileName = this.state.firmwareFile.endsWith('aes') ?
          this.state.firmwareFile.replace('.zip.aes', '_modified_configs.zip.aes') :
          this.state.firmwareFile.replace('.zcz', '_modified_configs.zcz')

      return(
            <div className="position-relative height-100pc">
                <br/>
                <div className="row">
                    <div className="col-xs-6">
                        Select file or folder
                        <select
                            value={this.state.firmwareFile}
                            onChange={this.onFirmwareSelect}
                            className="form-control">
                            {this.state.firmwares.map(firmware =>
                              <option key={firmware} value={firmware}>
                                {firmware.replace(/\+/g, '/')}
                              </option> )}
                        </select>
                    </div>
                    <div className="col-xs-6">
                        Select configuration for selected file or folder ({this.state.schemas.length})
                        <select
                            value={this.state.schemaFile}
                            onChange={(e) => this.fetchSchemaAndConfiguration(e.target.value)}
                            className="form-control">
                            {this.state.schemas && this.state.schemas.map(schema =>
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
                      <a className="pull-right mks-margin-left-5px mks-invisible"
                         ref={link => {this.downloadLink = link}}
                         href={`${API_BASE_URL}/api/firmwares/${modifiedConfigFileName}`}>
                        Download
                      </a>

                      <button onClick={() => this.packageFirmware(this.state.firmwareFile)}
                              className="mks-download-modified-configs-file-btn btn btn-success">
                        <span className={`${this.state.showSpinner ? '':'mks-display-none'}`}>
                          <i className={`fa fa-spinner fa-spin`}></i>
                          &nbsp;
                        </span>
                        Download File
                      </button>
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
                            </div>
                        }
                    </div>
                    <div className="col-xs-12 position-absolute top-0px bottom-0px mks-z-index-1">
                      {
                        this.state.schemas && this.state.schemas.length === 0 &&
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
