import firmwareService from "../services/firmware.service.client";

export const COMPARE_CONFIGURATIONS = "COMPARE_CONFIGURATIONS"

export const compareConfigurations = (dispatch, firmwareLeft, firmwareRight) => {

  const leftConfigurationFiles  = firmwareLeft.configurationFiles.map(file => file.file)
  const rightConfigurationFiles = firmwareRight.configurationFiles.map(file => file.file)

  firmwareService.compareJsons(leftConfigurationFiles, rightConfigurationFiles)
    .then(diff => {

      let nextState = {}


      // this.setState(prevState => {
      //   let nextState = {...prevState}
        nextState.configurationFilesDiffs = diff;
      //   return nextState
      // })

      let configurationDiffPromises = []
      firmwareLeft.configurationFiles.forEach(configurationLeft => {
        firmwareRight.configurationFiles.forEach(configurationRight => {
          if (configurationLeft.file === configurationRight.file) {
            configurationDiffPromises.push(
              firmwareService.compareFirmwares(
                firmwareLeft.firmware,
                firmwareRight.firmware,
                configurationLeft.file,
                configurationRight.file,
                "Configs"
              )
            )
          }
        })
      })
      // debugger
      Promise.all(configurationDiffPromises)
        .then(results => {
          // this.setState(prevState => {
          //   let nextState = {...prevState}

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

                nextState['firmwareLeft'] = {
                  configurationFiles: []
                }

                // debugger

                firmwareLeft.configurationFiles.forEach((configurationLeft, i) => {
                  if (configurationLeft.file === fileName) {
                    // debugger
                    nextState.firmwareLeft.configurationFiles[i] = {
                      diff,
                      diffJson,
                      selected: diff ? true : false,
                      file: fileName
                    }
                    // nextState.firmwareLeft.configurationFiles[i]['diff'] = diff
                    // nextState.firmwareLeft.configurationFiles[i]['diffJson'] = diffJson
                    // nextState.firmwareLeft.configurationFiles[i]['selected'] = diff ? true : false
                  }
                })
              }
            })

          debugger

          dispatch({
            type: COMPARE_CONFIGURATIONS,
            configurationFilesDiffs: nextState.configurationFilesDiffs,
            firmwareLeft: nextState.firmwareLeft
          })
          // console.log(nextState)
          //   return nextState
          // })
        })
    })
}

export default {
  compareConfigurations
}
