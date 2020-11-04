import React from "react";
import {NavLink} from "react-router-dom";
import firmwareService, {fetchAllFirmwares, compareFirmwares, compareJsons} from "../../services/firmware.service.client";
import firmwareActions from "../../actions/firwareActions"
import schemaService, {fetchSchemaFilesWithContent} from "../../services/schema.service.client";
import configurationService, {fetchConfigurationFilesWithContent} from "../../services/configuration.service.client";
import StringArraySelectComponent from "./StringArraySelectComponent";
import GenericJsonDiffViewer from "./generic/GenericJsonDiffViewer";
import GenericArrayDiffList from "./generic/GenericArrayDiffList";
import DeletedAddedChangedLabels from "./DeletedAddedChangedLabels";
import ToggleSwitch from "../widgets/ToggleSwitch";
import diff1 from "./diff1"
import diff2 from "./diff2"
import DiffJson from "./DiffJson";
import {connect} from "react-redux";
import configurationActions from "../../actions/configurationActions"
import { JsonEditor as Editor } from 'jsoneditor-react';
import ReactJson from 'react-json-view'

import 'jsoneditor-react/es/editor.min.css';

class FirmwareComparisonComponent extends React.Component {

  state = {
    what: "configurations",
    selectedLeftFirmwareIndex: 0,
    selectedRightFirmwareIndex: 0,
    // firmwares: [],
    firmwareLeft: {firmware: '', index: 0, title: '', schemaFiles: [], configurationFiles: [], schemas: {}},
    firmwareRight: {firmware: '', index: 0, title: '', schemaFiles: [], configurationFiles: [], schemas: {}},
    configurationFilesDiffs: [],
    schemaFilesDiffs: [],
    diff: null,
    selectedJsonFile: null,
    contrast: this.props.contrast,
    diff1: diff1,
    diff2: diff2,
    props: this.props
  }

  componentDidMount() {
    this.props.fetchAllFirmwares()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.contrast !== this.props.contrast) {
      this.setState({
        contrast: this.props.contrast
      })
    }
    if(prevProps.firmwares !== this.props.firmwares) {
      this.selectFirmware(0, "firmwareLeft")
      this.selectFirmware(0, "firmwareRight")
    }
    if(prevProps !== this.props) {
      this.setState({props: this.props})
    }
  }

  selectFirmware = (firmwareIndex, leftOrRight) => {
    const firmware = this.props.firmwares[firmwareIndex]

    this.props.fetchConfigurationAndSchemaFilesWithContent(firmware, firmwareIndex, leftOrRight)

    // schemaService.fetchSchemaFilesWithContent(firmware)
    //   .then(schemaFiles => {
    //     this.setState(prevState => {
    //       let nextState = {...prevState}
    //       nextState[leftOrRight].schemaFiles = schemaFiles
    //       nextState[leftOrRight].firmware = firmware
    //       nextState[leftOrRight].index = firmwareIndex
    //       nextState.configurationFilesDiffs = []
    //       nextState.schemaFilesDiffs = []
    //       nextState.diff = null
    //       nextState.selectedJsonFile = null
    //
    //       return nextState
    //     })
    //   })
    // configurationService.fetchConfigurationFilesWithContent(firmware)
    //   .then(configurationFiles => {
    //     this.setState(prevState => {
    //       let nextState = {...prevState}
    //       nextState[leftOrRight].configurationFiles = configurationFiles
    //       nextState[leftOrRight].firmware = firmware
    //       nextState[leftOrRight].index = firmwareIndex
    //       return nextState
    //     })
    //   })
  }

  compare = () => {
    // this.compareSchemas()
    this.compareConfigurations()
  }

  compareConfigurations = () => {
    this.props.compareConfigurations(this.props.firmwareLeft, this.props.firmwareRight)
  }

  compareConfigurations2 = () => {


    const leftConfigurationFiles  = this.props.firmwareLeft.configurationFiles.map(file => file.file)
    const rightConfigurationFiles = this.props.firmwareRight.configurationFiles.map(file => file.file)

    compareJsons(
      leftConfigurationFiles,
      rightConfigurationFiles)
      .then(diff => {
        this.setState(prevState => {
          let nextState = {...prevState}
          nextState.configurationFilesDiffs = diff;
          return nextState
        })

        let configurationDiffArray = []
        this.state.firmwareLeft.configurationFiles.forEach(configurationLeft => {
          this.state.firmwareRight.configurationFiles.forEach(configurationRight => {
            if (configurationLeft.file === configurationRight.file) {
              configurationDiffArray.push(
                compareFirmwares(
                  this.state.firmwareLeft.firmware,
                  this.state.firmwareRight.firmware,
                  configurationLeft.file,
                  configurationRight.file,
                  "Configs"
                )
              )
            }
          })
        })

        Promise.all(configurationDiffArray)
          .then(results => {
            this.setState(prevState => {
              let nextState = {...prevState}

              results.forEach((diff, index) => {
                if(diff && diff.fileName) {
                  const fileName = diff.fileName
                  const diffString = diff.diffString
                  const diffJson = diff.diffJson
                  delete diff.fileName
                  delete diff.diffString

                  nextState.configurationFilesDiffs =
                    nextState.configurationFilesDiffs.map(file => {
                      const fff = JSON.stringify(diff)
                      if(file[1] === fileName && diff && fff !== "{}" && file[0] === " ") {
                        file[0] = "~"
                      }
                      return file
                    })

                  this.state.firmwareLeft.configurationFiles.forEach((configurationLeft, i) => {
                    if (configurationLeft.file === fileName) {
                      nextState.firmwareLeft.configurationFiles[i]['diff'] = diff
                      nextState.firmwareLeft.configurationFiles[i]['diffJson'] = diffJson
                      nextState.firmwareLeft.configurationFiles[i]['selected'] = diff ? true : false
                    }
                  })
                }
              })
              return nextState
            })
          })

      })
  }

  compareSchemas = () => {

    const leftSchemaFiles  = this.state.firmwareLeft.schemaFiles.map(file => file.file)
    const rightSchemaFiles = this.state.firmwareRight.schemaFiles.map(file => file.file)

    compareJsons(
      leftSchemaFiles,
      rightSchemaFiles)
      .then(diff => {
        this.setState(prevState => {
          let nextState = {...prevState}
          nextState.schemaFilesDiffs = diff;
          return nextState
        })

        let schemaDiffArray = []
        this.state.firmwareLeft.schemaFiles.forEach(schemaLeft => {
          this.state.firmwareRight.schemaFiles.forEach(schemaRight => {
            if (schemaLeft.file === schemaRight.file) {
              schemaDiffArray.push(
                compareFirmwares(
                  this.state.firmwareLeft.firmware,
                  this.state.firmwareRight.firmware,
                  schemaLeft.file,
                  schemaRight.file,
                  "Schema"
                )
              )
            }
          })
        })

        Promise.all(schemaDiffArray)
          .then(results => {
            this.setState(prevState => {
              let nextState = {...prevState}

              results.forEach((diff, index) => {
                const fileName = nextState.firmwareLeft.schemaFiles[index].file

                nextState.schemaFilesDiffs =
                  nextState.schemaFilesDiffs.map(file => {
                    if(file[1] === fileName && diff && file[0] === " ") {
                      file[0] = "~"
                    }
                    return file
                  })

                nextState.firmwareLeft.schemaFiles[index]['diff'] = diff
                nextState.firmwareLeft.schemaFiles[index]['selected'] = diff ? true : false
              })
              return nextState
            })
          })
      })
  }

  onSelectItem = (selected, what) => {
    debugger
    this.props.firmwareLeft[what].forEach(schemaFile => {
      debugger
      if(schemaFile.file === selected) {
        if(schemaFile.diff) {
          this.setState(prevState => ({
            diff: schemaFile.diff,
            diffJson: schemaFile.diffJson,
            selectedJsonFile: selected
          }))
        }
      }
    })
  }

  onSelectIndex = (index) => {
  }

  render() {
    return (
      <div>
        <button
          onClick={this.compare}
          className="btn btn-primary pull-right mks-margin-left-15px">
          Compare
        </button>
        <span className="pull-right">
        <ToggleSwitch leftLabel="High Contrast" callback={(contrast) => this.setState({
          contrast: contrast
        })}/>
        </span>
        <ul className="nav nav-tabs">
          <li className={`${this.props.match.params.what === 'configurations' ? 'active' : ''}`}>
            <NavLink to={`/compare/configurations`}>
              Configurations
            </NavLink>
          </li>
          <li className={`${this.props.match.params.what === 'schemas' ? 'active' : ''}`}>
            <NavLink to={`/compare/schemas`}>
              Schemas
            </NavLink>
          </li>
          {/*<li className={`${this.props.match.params.what === 'schemas' ? 'active' : ''}`}>*/}
          {/*  <NavLink to={`/compare/folders`}>*/}
          {/*    Folders*/}
          {/*  </NavLink>*/}
          {/*</li>*/}
        </ul>
        <br/>
        <div className="row">
          <div className="col-xs-4">
            Select left firmware
            <StringArraySelectComponent
              onChange={(e) => this.selectFirmware(e.target.value, "firmwareLeft")}
              array={this.props.firmwares}/>

            <br/>
            {
              this.props.match.params.what === "configurations" &&
              this.props.firmwareLeft &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "configurationFiles")}
                side="left"
                leftFirmware={this.props.firmwareLeft.firmware}
                rightFirmware={this.props.firmwareLeft.firmware}
                contrast={this.props.contrast}
                selectedJsonFile={this.props.selectedJsonFile}
                arrayDifferences={this.props.configurationFilesDiffs}/>
            }
            {
              this.props.match.params.what === "schemas" &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "schemaFiles")}
                side="left"
                contrast={this.props.contrast}
                selectedJsonFile={this.props.selectedJsonFile}
                arrayDifferences={this.props.schemaFilesDiffs}/>
            }
          </div>
          <div className="col-xs-4">
            Select right firmware
            <StringArraySelectComponent
              onChange={(e) => this.selectFirmware(e.target.value, "firmwareRight")}
              array={this.props.firmwares}/>

            <br/>

            {
              this.props.match.params.what === "configurations" &&
              this.props.configurationFilesDiffs &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "configurationFiles")}
                side="right"
                contrast={this.props.contrast}
                selectedJsonFile={this.props.selectedJsonFile}
                arrayDifferences={this.props.configurationFilesDiffs}/>
            }
            {
              this.props.match.params.what === "schemas" &&
              this.props.schemaFilesDiffs &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "schemaFiles")}
                side="right"
                contrast={this.props.contrast}
                selectedJsonFile={this.props.selectedJsonFile}
                arrayDifferences={this.props.schemaFilesDiffs}/>
            }
          </div>
          <div className="col-xs-4">
            {
              this.state.diff &&
              <div>
                <span className="hide">
                Comparing<br/>
                {this.props.firmwareLeft.firmware}<br/>
                with<br/>
                {this.props.firmwareRight.firmware}<br/>
                </span>
                <div className="mks-font-size-15">
                  {"{"}
                  <DiffJson diff={this.state.diffJson}/>
                  {"}"}
                </div>
                <DeletedAddedChangedLabels/>
              </div>
            }
          </div>
          {
            this.props.configurationFilesDiffs &&
            this.props.configurationFilesDiffs.length &&
            this.props.configurationFilesDiffs.length > 0 &&
            !this.props.selectedJsonFile &&
            <div className="col-xs-6">
              <div className="alert alert-info">
                Select files labeled <i className="fa fa-eye"/> on the left to compare them
              </div>
            </div>
          }
          {
            this.props.firmwareLeft &&
            this.props.firmwareRight &&
            typeof this.props.firmwareLeft.index !== "undefined" &&
            <span>Please choose two different choices from the dropdowns above|
              {JSON.stringify(this.props.firmwareLeft.index === this.props.firmwareRight.index)}|</span>
          }
          {
            this.props.firmwareLeft &&
            this.props.firmwareRight &&
            typeof this.props.firmwareLeft.index !== "undefined" &&
            typeof this.props.firmwareRight.index !== "undefined" &&
            this.props.firmwareLeft.index === this.props.firmwareRight.index &&
            <div className="col-xs-12">
              <div className="alert alert-info">
                Please choose two different choices from the dropdowns above
              </div>
            </div>
          }
          {
            this.props.firmwareLeft &&
            this.props.firmwareRight &&
            typeof this.props.firmwareLeft.index !== "undefined" &&
            typeof this.props.firmwareRight.index !== "undefined" &&
            this.props.firmwareLeft.index !== this.props.firmwareRight.index &&
            this.props.configurationFilesDiffs.length === 0 &&
            <div className="col-xs-12">
              <div className="alert alert-info">
                Click on
                &nbsp;
                <button
                  onClick={this.compare}
                  className="btn btn-primary btn-sm">
                  Compare
                </button>
                &nbsp;
                to compare
              </div>
            </div>
          }
        </div>
        {/*<Editor value={this.state.props}/>*/}
        {/*<ReactJson src={this.state.props}/>*/}

          {JSON.stringify(this.props)}
      </div>
    )
  }
}

const stateToPropertyMapper = (state) => ({
  ...state.firmwareReducer,
  ...state.configurationReducer
})

const dispatchToPropertyMapper = (dispatch) => ({
  compareConfigurations: (firmwareLeft, firmwareRight) => configurationActions.compareConfigurations(dispatch, firmwareLeft, firmwareRight),
  fetchAllFirmwares: () => firmwareActions.fetchAllFirmwares(dispatch),
  fetchConfigurationAndSchemaFilesWithContent:
    (firmware, firmwareIndex, leftOrRight) =>
      firmwareActions.fetchConfigurationAndSchemaFilesWithContent(dispatch, firmware, firmwareIndex, leftOrRight)
})

export default connect
  (stateToPropertyMapper, dispatchToPropertyMapper)
  (FirmwareComparisonComponent)
