const fs = require('fs')
const jsonDiff = require('json-diff')
const homedir = require('os').homedir();

const comparisonFilePath = (firmwareFileName, configOrSchema, jsonFileName) => {
  if(firmwareFileName.endsWith('aes')) {
    if(configOrSchema === 'Schema') {
      configOrSchema = 'Schemas'
    }
    if(configOrSchema === 'Configs') {
      configOrSchema = 'Configs/Permanent'
    }
  }
  return `${homedir}/mks/configurator/unpacked/${firmwareFileName}/${configOrSchema}/${jsonFileName}`
}

module.exports = (app) => {
  const compareFirmwares = (req, res) => {
    const configOrSchema = req.params.what;
    const firmware1 = req.params.firmware1
    const firmware2 = req.params.firmware2
    const jsonFile1 = req.params.what1
    const jsonFile2 = req.params.what2

    if(!(jsonFile1.endsWith(".json") && jsonFile2.endsWith(".json"))) {
      res.json({})
      return
    }

    // const file1 = fs.readFileSync(`${homedir}/mks/configurator/${what}/${firmware1}/${what1}`)
    // const file2 = fs.readFileSync(`${homedir}/mks/configurator/${what}/${firmware2}/${what2}`)
    let file1 = '{}'
    let file2 = '{}'

    try {
      const path1 = comparisonFilePath(firmware1, configOrSchema, jsonFile1)
      const path2 = comparisonFilePath(firmware2, configOrSchema, jsonFile1)
      file1 = fs.readFileSync(path1)
      file2 = fs.readFileSync(path2)
    }
    catch (e) {
      // ignore
    }

    const json1 = JSON.parse(file1)
    const json2 = JSON.parse(file2)

    const difference = jsonDiff.diff(json1, json2)
    if(difference) {
      difference.fileName = jsonFile1
    }

    res.json(difference);
  }

  const compareJsons = (req, res) => {
    const json1 = req.body.json1
    const json2 = req.body.json2
    const difference = jsonDiff.diff(json1, json2) || []
    res.json(difference)
  }

  app.post("/api/compare/jsons", compareJsons);
  app.get("/api/compare/:what/:firmware1/:what1/with/:firmware2/:what2", compareFirmwares);
}
