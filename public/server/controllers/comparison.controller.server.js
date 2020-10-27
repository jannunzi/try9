const fs = require('fs')
const jsonDiff = require('json-diff')
const diffJson = require('diff-json');

const homedir = require('os').homedir();
const {CONFIGS_PATH, SCHEMAS_PATH} = require('../common/paths');

const comparisonFilePath = (firmwareFileName, configOrSchema, jsonFileName) =>
  configOrSchema === 'Schema' ?
    `${SCHEMAS_PATH(firmwareFileName)}/${jsonFileName}` :
    `${CONFIGS_PATH(firmwareFileName)}/${jsonFileName}`

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
    let file1 = '{}'
    let file2 = '{}'

    try {
      const path1 = comparisonFilePath(firmware1, configOrSchema, jsonFile1)
      const path2 = comparisonFilePath(firmware2, configOrSchema, jsonFile2)
      file1 = fs.readFileSync(path1)
      file2 = fs.readFileSync(path2)
    }
    catch (e) {
      // ignore
    }

    const json1 = JSON.parse(file1)
    const json2 = JSON.parse(file2)

    const difference = jsonDiff.diff(json1, json2)
    const diffString = jsonDiff.diffString(json1, json2)
    if(difference) {
      difference.fileName = jsonFile1
      difference.diffString = diffString
      difference.diffJson = diffJson.diff(json1, json2);
    }

    res.json(difference);
  }

  const compareJsons = (req, res) => {
    const json1 = req.body.json1.filter(json => json != ".DS_Store")
    const json2 = req.body.json2.filter(json => json != ".DS_Store")
    const difference = jsonDiff.diff(json1, json2) || []
    res.json(difference)
  }

  app.post("/api/compare/jsons", compareJsons);
  app.get("/api/compare/:what/:firmware1/:what1/with/:firmware2/:what2", compareFirmwares);
}
