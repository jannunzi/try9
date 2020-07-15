const fs = require('fs')
const jsonDiff = require('json-diff')

module.exports = (app) => {
  const compareFirmwares = (req, res) => {
    const what = req.params.what;
    const firmware1 = req.params.firmware1
    const firmware2 = req.params.firmware2
    const what1 = req.params.what1
    const what2 = req.params.what2

    if(!(what1.endsWith(".json") && what2.endsWith(".json"))) {
      res.json({})
      return
    }

    const file1 = fs.readFileSync(`server/${what}/${firmware1}/${what1}`)
    const file2 = fs.readFileSync(`server/${what}/${firmware2}/${what2}`)

    const json1 = JSON.parse(file1)
    const json2 = JSON.parse(file2)

//    const difference = diff(json1, json2)
    const difference = jsonDiff.diff(json1, json2)
    // const difference2 = jsonDiff.diffString(json1, json2)

    // console.log("===========")
    // console.log(json1)
    // console.log(json2)
    // console.log(difference)
    // console.log(difference2)

    res.json(difference);
  }

  const compareJsons = (req, res) => {
    const json1 = req.body.json1
    const json2 = req.body.json2
    const difference = jsonDiff.diff(json1, json2)
    res.json(difference)
  }

  app.post("/api/compare/jsons", compareJsons);
  app.get("/api/compare/:what/:firmware1/:what1/with/:firmware2/:what2", compareFirmwares);
}
