const fs = require("fs-extra")
const unzipper = require("unzipper")
const JSZip = require('jszip');

const unzip = (inputFile, outputFile, callback) => {
  const stream = fs.createReadStream(inputFile)
    .pipe(unzipper.Extract({ path: outputFile }))
  stream.on('close', callback)
}

const zip = (inputFolder, outputFile, jsZip) => {
  if(!jsZip) {
    jsZip = new JSZip();
  }
  const files = fs.readdirSync(inputFolder)
  files.forEach(file => {
    const stat = fs.lstatSync(`${inputFolder}/${file}`)
    if(stat.isDirectory()) {
      const folder = jsZip.folder(file)
      zip(`${inputFolder}/${file}`, outputFile, folder)
    } else {
      const fileContent = fs.readFileSync(`${inputFolder}/${file}`)
      jsZip.file(file, fileContent)
    }
  })

  return jsZip.generateAsync({type:"nodebuffer"})
    .then(content => {
      return fs.writeFileSync(outputFile, content)
    })
}

module.exports = {
  unzip, zip
}
