import React from "react";
import {NavLink} from "react-router-dom";
import {fetchAllFirmwares, compareFirmwares, compareJsons} from "../../services/firmware.service.client";
import {fetchSchemaFilesWithContent} from "../../services/schema.service.client";
import {fetchConfigurationFilesWithContent} from "../../services/configuration.service.client";
import StringArraySelectComponent from "../StringArraySelectComponent";
// import diff from './diff'
import GenericJsonDiffViewer from "./generic/GenericJsonDiffViewer";
import GenericArrayDiffList from "./generic/GenericArrayDiffList";
import DeletedAddedChangedLabels from "./DeletedAddedChangedLabels";

export default class FirmwareComparisonComponent extends React.Component {

  state = {
    what: "configurations",
    selectedLeftFirmwareIndex: 0,
    selectedRightFirmwareIndex: 0,
    firmwares: [],
    firmwareLeft: {firmware: '', index: 0, title: '', schemaFiles: [], configurationFiles: [], schemas: {}},
    firmwareRight: {firmware: '', index: 0, title: '', schemaFiles: [], configurationFiles: [], schemas: {}},
    configurationFilesDiffs: [],
    schemaFilesDiffs: [],
    diff: null,
    selectedJsonFile: null
  }

  componentDidMount() {
    fetchAllFirmwares()
      .then(firmwares => {
        this.setState({firmwares})
        this.selectFirmware(this.state.firmwareLeft.index, "firmwareLeft")
        this.selectFirmware(this.state.firmwareRight.index, "firmwareRight")
      })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  // [5,10,15,20]
  // [  10,15   ] ==> [0,10,15,0]

  // [5,15,10,20]
  // [  10,15   ] ==> [0,15,10,0]

  // [5,15,10,20     ] ==> [5,15,10,20, 0, 0]
  // [  10,15,  25,30] ==> [0,15,10, 0,25,30]

  selectFirmware = (firmwareIndex, leftOrRight) => {
    // console.log(firmwareIndex)
    // console.log(leftOrRight)
    const firmware = this.state.firmwares[firmwareIndex]
    fetchSchemaFilesWithContent(firmware)
      .then(schemaFiles => {
        this.setState(prevState => {
          let nextState = {...prevState}
          nextState[leftOrRight].schemaFiles = schemaFiles
          // nextState[leftOrRight].schemaFiles.sort((a, b) => a.file > b.file)
          nextState[leftOrRight].firmware = firmware
          nextState[leftOrRight].index = firmwareIndex
          nextState.configurationFilesDiffs = []
          nextState.schemaFilesDiffs = []
          nextState.diff = null
          nextState.selectedJsonFile = null
          // jga

          return nextState
        })
      })
    fetchConfigurationFilesWithContent(firmware)
      .then(configurationFiles => {
        this.setState(prevState => {
          let nextState = {...prevState}
          nextState[leftOrRight].configurationFiles = configurationFiles
          nextState[leftOrRight].firmware = firmware
          nextState[leftOrRight].index = firmwareIndex
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
                  delete diff.fileName

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
    // jga
    this.state.firmwareLeft[what].forEach(schemaFile => {
      if(schemaFile.file === selected) {
        if(schemaFile.diff) {
            // this.setState({
            //   diff: schemaFile.diff
            // })

          this.setState(prevState => ({
            diff: schemaFile.diff,
            selectedJsonFile: selected
          }))
          // this.setState(prevState => {
          //   let nextState = {...prevState}
          //   nextState = {
          //     diff: schemaFile.diff.map(d => {
          //       return d
          //     })
          //   }
          //   return nextState
          // })

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
          <div className="col-xs-3">
            Select left firmware
            <StringArraySelectComponent
              onChange={(e) => this.selectFirmware(e.target.value, "firmwareLeft")}
              array={this.state.firmwares}/>

            <br/>
            {
              this.props.match.params.what === "configurations" &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "configurationFiles")}
                side="left"
                selectedJsonFile={this.state.selectedJsonFile}
                arrayDifferences={this.state.configurationFilesDiffs}/>
            }
            {
              this.props.match.params.what === "schemas" &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "schemaFiles")}
                side="left"
                selectedJsonFile={this.state.selectedJsonFile}
                arrayDifferences={this.state.schemaFilesDiffs}/>
            }
          </div>
          <div className="col-xs-3">
            Select right firmware
            <StringArraySelectComponent
              onChange={(e) => this.selectFirmware(e.target.value, "firmwareRight")}
              array={this.state.firmwares}/>

            <br/>

            {
              this.props.match.params.what === "configurations" &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "configurationFiles")}
                side="right"
                selectedJsonFile={this.state.selectedJsonFile}
                arrayDifferences={this.state.configurationFilesDiffs}/>
            }
            {
              this.props.match.params.what === "schemas" &&
              <GenericArrayDiffList
                onSelectItem={(file) => this.onSelectItem(file, "schemaFiles")}
                side="right"
                selectedJsonFile={this.state.selectedJsonFile}
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
                {/*<button className="btn btn-primary pull-right margin-left-15px">Merge Left</button>*/}
                {/*<button className="btn btn-primary pull-right margin-left-15px">Merge Right</button>*/}
                {/*<br/>*/}
                <DeletedAddedChangedLabels/>

                <GenericJsonDiffViewer diff={this.state.diff}/>
              </div>
            }
          </div>
          {
            this.state.configurationFilesDiffs &&
            this.state.configurationFilesDiffs.length > 0 &&
            this.state.selectedJsonFile === null &&
            <div className="col-xs-6">
              <div className="alert alert-info">
                Select files labeled <i className="fa fa-binoculars"/> on the left to compare them
              </div>
            </div>
          }
          {
            this.state.firmwareLeft.index == this.state.firmwareRight.index &&
            <div className="col-xs-12">
              <div className="alert alert-info">
                Please choose two different choices from the dropdowns above
              </div>
            </div>
          }
          {/*{this.state.firmwareLeft.index}*/}
          {/*{this.state.firmwareRight.index}*/}
          {/*{this.state.configurationFilesDiffs.length}*/}
          {
            this.state.firmwareLeft.index != this.state.firmwareRight.index &&
            this.state.configurationFilesDiffs.length === 0 &&
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
      </div>
    )
  }
}
