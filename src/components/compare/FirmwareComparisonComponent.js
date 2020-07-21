import React from "react";
import {Link} from "react-router-dom";
import {fetchAllFirmwares, compareFirmwares, compareJsons} from "../../services/firmware.service.client";
import {fetchSchemaFileContent, fetchSchemaFilesWithContent} from "../../services/schema.service.client";
import {fetchConfigurationFiles, fetchConfigurationFilesWithContent} from "../../services/configuration.service.client";
import StringArraySelectComponent from "../StringArraySelectComponent";
import StringArrayDivListGroupComponent from "../StringArrayDivListGroupComponent";
import _ from "underscore"
import JsonDiffViewer from "./JsonDiffViewer";
import ReactJson from "react-json-view";
// import GenericJsonDiffViewer from "./GenericJsonDiffViewer";
import diff from './diff'
import test from './test'
import GenericJsonDiffViewer from "./generic/GenericJsonDiffViewer";
import GenericArrayDiffList from "./generic/GenericArrayDiffList";

export default class FirmwareComparisonComponent extends React.Component {

  state = {
    what: "configurations",
    selectedLeftFirmwareIndex: 1,
    selectedRightFirmwareIndex: 0,
    firmwares: [],
    firmwareLeft: {firmware: '', title: '', schemaFiles: [], configurationFiles: [], schemas: {}},
    firmwareRight: {firmware: '', title: '', schemaFiles: [], configurationFiles: [], schemas: {}},
    configurationFilesDiffs: [],
    schemaFilesDiffs: [],
    diff: null
  }

  componentDidMount() {
    fetchAllFirmwares()
      .then(firmwares => {
        this.setState({firmwares})
        this.selectFirmware(firmwares[this.state.selectedLeftFirmwareIndex], "firmwareLeft")
        this.selectFirmware(firmwares[this.state.selectedRightFirmwareIndex], "firmwareRight")
      })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  // [5,10,15,20]
  // [  10,15   ] ==> [0,10,15,0]

  // [5,15,10,20]
  // [  10,15   ] ==> [0,15,10,0]

  // [5,15,10,20     ] ==> [5,15,10,20, 0, 0]
  // [  10,15,  25,30] ==> [0,15,10, 0,25,30]

  selectFirmware = (firmware, leftOrRight) => {
    // console.log(firmware)
    // console.log(leftOrRight)
    fetchSchemaFilesWithContent(firmware)
      .then(schemaFiles => {
        this.setState(prevState => {
          let nextState = {...prevState}
          nextState[leftOrRight].schemaFiles = schemaFiles
          // nextState[leftOrRight].schemaFiles.sort((a, b) => a.file > b.file)
          nextState[leftOrRight].firmware = firmware
          return nextState
        })
      })
    fetchConfigurationFilesWithContent(firmware)
      .then(configurationFiles => {
        this.setState(prevState => {
          let nextState = {...prevState}
          nextState[leftOrRight].configurationFiles = configurationFiles
          nextState[leftOrRight].firmware = firmware
          return nextState
        })
      })
  }

  //[1,2,3,4] ==> [1,2,3,4,0]
  //[1,2,3,5] ==> [1,2,3,0,5]
  //
  //[2,4,6]   ==> [0,2,0,4,0,6]
  //[1,3,5]   ==> [1,0,3,0,5,0]
  //
  //[2,4,6,8] ==> [0,2,0,4,0,6,8]
  //[1,3,5]   ==> [1,0,3,0,5,0,0]


  compare = () => {
    this.compareSchemas()
    this.compareConfigurations()
  }

  compareConfigurations = () => {

    // console.log(this.state.firmwareLeft.configurationFiles)

    const leftConfigurationFiles = this.state.firmwareLeft.configurationFiles.map(file => file.file)
    const rightConfigurationFiles = this.state.firmwareRight.configurationFiles.map(file => file.file)

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
                  "configurations"
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
                const fileName = nextState.firmwareLeft.configurationFiles[index].file

                nextState.configurationFilesDiffs =
                  nextState.configurationFilesDiffs.map(file => {
                    if(file[1] === fileName && diff && file[0] === " ") {
                      file[0] = "~"
                    }
                    return file
                  })

                nextState.firmwareLeft.configurationFiles[index]['diff'] = diff
                nextState.firmwareLeft.configurationFiles[index]['selected'] = diff ? true : false
              })
              return nextState
            })
          })

      })
  }

  compareSchemas = () => {

    const leftSchemaFiles = this.state.firmwareLeft.schemaFiles.map(file => file.file)
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
                  "schemas"
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

  // compareSchemas = () => {
  //
  //   let schemaDiffArray = []
  //   this.state.firmwareLeft.schemaFiles.forEach(schemaLeft => {
  //     this.state.firmwareRight.schemaFiles.forEach(schemaRight => {
  //       if (schemaLeft.file === schemaRight.file) {
  //         schemaDiffArray.push(
  //           compareFirmwares(
  //             this.state.firmwareLeft.firmware,
  //             this.state.firmwareRight.firmware,
  //             schemaLeft.file,
  //             schemaRight.file,
  //             "schemas"
  //           )
  //         )
  //       }
  //     })
  //   })
  //
  //   Promise.all(schemaDiffArray)
  //     .then(results => {
  //       this.setState(prevState => {
  //         let nextState = {...prevState}
  //
  //         results.forEach((diff, index) => {
  //           nextState.firmwareLeft.schemaFiles[index]['diff'] = diff
  //           // debugger
  //           nextState.firmwareLeft.schemaFiles[index]['selected'] = diff ? true : false
  //         })
  //         return nextState
  //       })
  //     })
  // }

  onSelectItem = (selected, what) => {

    console.log(selected, what)

    this.state.firmwareLeft[what].forEach(schemaFile => {
      if(schemaFile.file === selected) {
        if(schemaFile.diff) {
          this.setState({
            diff: schemaFile.diff
          })
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
          className="btn btn-primary pull-right">
          Compare
        </button>
        <ul className="nav nav-tabs">
          <li className={`${this.props.match.params.what === 'configurations' ? 'active' : ''}`}>
            <Link to={`/compare/configurations`}>
              Configurations
            </Link>
          </li>
          <li className={`${this.props.match.params.what === 'schemas' ? 'active' : ''}`}>
            <Link to={`/compare/schemas`}>
              Schemas
            </Link>
          </li>
        </ul>
        <br/>
        <div className="row">
          <div className="col-xs-3">
            <StringArraySelectComponent
              selectedIndex={0}
              onChange={(e) => this.selectFirmware(e.target.value, "firmwareLeft")}
              array={this.state.firmwares}/>

            <br/>
            {
              this.props.match.params.what === "configurations" &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "configurationFiles")}
                side="left"
                arrayDifferences={this.state.configurationFilesDiffs}/>
            }
            {
              this.props.match.params.what === "schemas" &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "schemaFiles")}
                side="left"
                arrayDifferences={this.state.schemaFilesDiffs}/>
            }
          </div>
          <div className="col-xs-3">
            <StringArraySelectComponent
              selectedIndex={2}
              onChange={(e) => this.selectFirmware(e.target.value, "firmwareRight")}
              array={this.state.firmwares}/>

            <br/>

            {
              this.props.match.params.what === "configurations" &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "configurationFiles")}
                side="right"
                arrayDifferences={this.state.configurationFilesDiffs}/>
            }
            {
              this.props.match.params.what === "schemas" &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "schemaFiles")}
                side="right"
                arrayDifferences={this.state.schemaFilesDiffs}/>
            }
          </div>
          <div className="col-xs-6">

            {/*<ul className="nav nav-pills">*/}
            {/*  <li className="active">*/}
            {/*    <a href="#">*/}
            {/*      Difference*/}
            {/*    </a>*/}
            {/*  </li>*/}
            {/*</ul>*/}
            {/*<GenericJsonDiffViewer diff={this.state.diff}/>*/}
            {/*<JsonDiffViewer diff={diff}/>*/}
            {/*<JsonDiffViewer diff={this.state.diff}/>*/}
            {
              this.state.diff &&
              <div>
                <button className="btn btn-primary pull-right margin-left-15px">Merge Left</button>
                <button className="btn btn-primary pull-right margin-left-15px">Merge Right</button>
                <br/>
                <GenericJsonDiffViewer diff={this.state.diff}/>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
