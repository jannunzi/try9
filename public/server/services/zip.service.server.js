const fs = require("fs-extra")
const unzipper = require("unzipper")
const JSZip = require('jszip');
const utils = require('../common/utils')

const unzip = (inputFile, outputFolder, callback) => {
  console.log("[111]====================")
  console.log(inputFile)
  console.log(outputFolder)
  utils.nativeUnzip(inputFile, outputFolder, callback)
  // utils.nativeUnzip()
  // callback()
  // fs.createReadStream(inputFile)
  //   .pipe(unzipper.Extract({ path: outputFile }))
  //   .on('entry', (entry) => {
  //     const fileName = entry.path;
  //     const type = entry.type; // 'Directory' or 'File'
  //     const size = entry.vars.uncompressedSize; // There is also compressedSize;
  //     if (fileName === "this IS the file I'm looking for") {
  //       entry.pipe(fs.createWriteStream('output/path'));
  //     } else {
  //       entry.autodrain();
  //     }
  //   })
  //   .on('close', callback)
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
