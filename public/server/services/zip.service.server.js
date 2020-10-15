const fs = require("fs-extra")
const unzipper = require("unzipper")
const JSZip = require('jszip');
const utils = require('../common/utils')

const unzip = (inputFile, outputFolder, callback) => {
  // jga
  fs.createReadStream(inputFile)
    .pipe(unzipper.Parse())
    .on('entry', (entry) => {
      const fileName = entry.path
      const type = entry.type;
      if(!fileName.endsWith('.gz')) {
        if(type === "Directory") {
          fs.ensureDir(`${outputFolder}/${fileName}`)
        }
      }
      entry.autodrain().on('error', (error) => {
        console.log(error)
      })
    })
    .on('close', () => {
      fs.createReadStream(inputFile)
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        const fileName = entry.path
        const type = entry.type;
        if(!fileName.endsWith('.gz')) {
          if(type === "File") {
            entry.pipe(fs.createWriteStream(`${outputFolder}/${fileName}`))
          }
        }
        entry.autodrain().on('error', (error) => {
          console.log(error)
        })
      })
      .on('close', () => {
        if(typeof callback === "function")
          callback()
        })
      })  
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
