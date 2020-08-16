const tarFs = require('tar-fs')
const fs = require('fs-extra')
const sys = require('util')
const exec = require('child_process').execSync;
const copy = require('recursive-copy');
const JSZip = require('jszip');
var AdmZip = require('adm-zip');
var unzipper = require('unzipper')
const gunzip = require('gunzip-file')
const tar = require('tar')
const openssl = require('openssl-nodejs')

const UNTAR = "tar -xzf SOURCE_FILE -C TARGET_DIRECTORY"
const TAR   = "tar -czf TARGET_FILE -C SOURCE_DIRECTORY ."
// const RM_RECURSIVE = "rm -rf TARGET"

const OPENSSL_ENCRYPTION_CMD = `openssl aes-256-cbc -salt -in INPUT_FILE -out OUTPUT_FILE -k n0v1n@`
const OPENSSL_DECRYPTION_CMD = `openssl aes-256-cbc -d -salt -k n0v1n@ -in INPUT_FILE -out OUTPUT_FILE`
const UNZIP = `unzip  INPUT_FILE  -d OUTPUT_FILE`
// const ZIP = 'cd INPUT_FOLDER && zip -r OUTPUT_ZIP *'

const jsonDiff = require('json-diff')
const homedir = require('os').homedir();

const execShellCommand = (cmd)  => {
    return new Promise((resolve, reject) => {
        exec(cmd, null, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

const openSslEncrypt2 = (inputFile, outputFile, callback) => {
    let CMD = OPENSSL_ENCRYPTION_CMD
      .replace('INPUT_FILE', inputFile)
      .replace('OUTPUT_FILE', outputFile)

    openssl(OPENSSL_ENCRYPTION_CMD, callback)
}

const openSslDecrypt2 = (inputFile, outputFile, callback) => {
    let CMD = OPENSSL_DECRYPTION_CMD
      .replace('INPUT_FILE', inputFile)
      .replace('OUTPUT_FILE', outputFile)

    openssl(OPENSSL_DECRYPTION_CMD, callback)
}

const openSslEncrypt = (inputFile, outputFile) => {
    let CMD = OPENSSL_ENCRYPTION_CMD
      .replace('INPUT_FILE', inputFile)
      .replace('OUTPUT_FILE', outputFile)

    // console.log('openSslEncrypt')
    // console.log(CMD)

    // return execShellCommand(CMD)
    exec(CMD)
}

const openSslDecrypt = (inputFile, outputFile) => {
    let CMD = OPENSSL_DECRYPTION_CMD
      .replace('INPUT_FILE', inputFile)
      .replace('OUTPUT_FILE', outputFile)
    // return execShellCommand(CMD)
    exec(CMD)
}

const unzip = (inputFile, outputFile) => {
    fs.createReadStream(inputFile)
      .pipe(unzipper.Extract({ path: outputFile }))
}

const unzipAesFile = (inputFile, outputFile) => {
    const zip = new AdmZip(inputFile)
    zip.extractAllTo(outputFile)
}

const zipAesFile = (inputFolder, outputZipFile) => {

    const jszip = new JSZip();

    const Permanent = jszip.folder('Configs/Permanent')
    const Temporary = jszip.folder('Configs/Temporary')
    const Schemas = jszip.folder('Schemas')

    const filesInPermanentFolder = fs.readdirSync(
      `${inputFolder}/Configs/Permanent`, { withFileTypes: true })
    const filesInTemporaryFolder = fs.readdirSync(
      `${inputFolder}/Configs/Temporary`, { withFileTypes: true })
    const filesInSchemasFolder = fs.readdirSync(
      `${inputFolder}/Schemas`, { withFileTypes: true })

    filesInPermanentFolder.forEach(file => {
        console.log(`${inputFolder}/Configs/Permanent/${file.name}`)
        Permanent.file(
          file.name,
          fs.readFileSync(`${inputFolder}/Configs/Permanent/${file.name}`))
    })

    filesInTemporaryFolder.forEach(file => {
        console.log(`${inputFolder}/Configs/Temporary/${file.name}`)
        Temporary.file(
          file.name,
          fs.readFileSync(`${inputFolder}/Configs/Temporary/${file.name}`))
    })

    filesInSchemasFolder.forEach(file => {
        console.log(`${inputFolder}/Schemas/${file.name}`)
        Schemas.file(
          file.name,
          fs.readFileSync(`${inputFolder}/Schemas/${file.name}`))
    })

    return jszip.generateAsync({type: "nodebuffer"})
      .then(content => fs.writeFileSync(outputZipFile, content))
}

// const zip = (inputFolder, outputFile) => {
    // return jszip
    //   .folder(inputFolder).generateAsync({type: "nodebuffer"})
    //   .then(content => fs.writeFileSync(outputFile, content))
    //
    //
    // let CMD = ZIP
    //   .replace('INPUT_FOLDER', inputFolder)
    //   .replace('OUTPUT_ZIP', outputFile)
    //
    // console.log('ZIP')
    // console.log(CMD)
    //
    // return execShellCommand(CMD)
// }

const copyFilesRecursively = (source, target) =>
  copy(source, target, {overwrite: true})

const readDirectoryContent = (directory) =>
    fs.readdirSync(directory)
      .filter(filename => filename !== '.DS_Store')

const untar2 = (sourceFile, targetDirectory) => {
    fs.ensureDirSync(targetDirectory)
    return tar.extract({
        file: sourceFile,
        cwd: targetDirectory
    })
}

const tarNgzip = (workingFolder, folderToTar, targetTarFile) => {
    return tar.create({
        gzip: true,
        file: targetTarFile,
        C: workingFolder
    }, [folderToTar])
      // .pipe(fs.createWriteStream(targetFile))
}

const untar = (sourceFile, targetDirectory) => {

    return fs.createReadStream(sourceFile)
          .pipe(tarFs.extract(targetDirectory))
}

// const tar = (sourceDirectory, targetFile) => {
//     // console.log('TAR')
//     // console.log(sourceDirectory)
//     // console.log(targetFile)
//     // const tar = TAR
//     //   .replace("SOURCE_DIRECTORY", sourceDirectory)
//     //   .replace("TARGET_FILE", targetFile)
//     // console.log(tar)
//     // console.log('===============')
//     // exec(tar)
//
//     tarFs
//       .pack(sourceDirectory)
//       .pipe(fs.createWriteStream(targetFile))
// }

const createDirectory = (dir) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

const compareJsonObjects = (json1, json2) => {
    return jsonDiff.diff(json1, json2)
}

// DO NOT USE this version uses separate configurations and schemas folders
const unpackZczFile = (configuratorBasePath, zczFileName) => {
    console.log(`Expanding ZCZ File ${configuratorBasePath}/uploads/${zczFileName}`)
    // cleanup, remove old content
    // TODO: make this a reusable function?
    fs.emptyDirSync(`${configuratorBasePath}/downloads`)
    fs.emptyDirSync(`${configuratorBasePath}/tmp`)
    fs.removeSync(`${configuratorBasePath}/configurations/${zczFileName}`)
    fs.removeSync(`${configuratorBasePath}/schemas/${zczFileName}`)
    fs.ensureDir(`${configuratorBasePath}/configurations/${zczFileName}`)
    fs.ensureDir(`${configuratorBasePath}/schemas/${zczFileName}`)
    // gunzip zcz file to a tar file in tmp
    gunzip(
      `${configuratorBasePath}/uploads/${zczFileName}`,
      `${configuratorBasePath}/tmp/${zczFileName}.tar`,
      () => {
          // untar zcz file to a directory in tmp
        untar2(
          `${configuratorBasePath}/tmp/${zczFileName}.tar`,
          `${configuratorBasePath}/tmp/${zczFileName}`)
          .then(() => {
              // gunzip Configs.tar.gz to Configs.tar
              gunzip(
                `${configuratorBasePath}/tmp/${zczFileName}/image35-2/Configs.tar.gz`,
                `${configuratorBasePath}/tmp/${zczFileName}/image35-2/Configs.tar`,
                () => {
                    // gunzip Schema.tar.gz to Schema.tar
                    gunzip(
                      `${configuratorBasePath}/tmp/${zczFileName}/image35-2/Schema.tar.gz`,
                      `${configuratorBasePath}/tmp/${zczFileName}/image35-2/Schema.tar`,
                      () => {
                          // untar Configs.tar to configurations directory
                          untar2(
                            `${configuratorBasePath}/tmp/${zczFileName}/image35-2/Configs.tar`,
                            `${configuratorBasePath}/configurations/${zczFileName}`).then(() =>
                            // untar Schema.tar to schemas directory
                            untar2(
                              `${configuratorBasePath}/tmp/${zczFileName}/image35-2/Schema.tar`,
                              `${configuratorBasePath}/schemas/${zczFileName}`)).then(() => {
                              fs.emptyDirSync(`${configuratorBasePath}/tmp`)
                          })
                      })
                })
          })
      })
}

// DO NOT USE
// unpackZczFile(
//   '/Users/jannunzi/mks/configurator',
//   'INv1692.90.1473_Fixtures_400kHz.zcz')

// USE THIS INSTEAD - unpacks to unpackaed/Configs, Schemas
const unpackZczFile2 = (configuratorBasePath, zczFileName) => {
    console.log(`Expanding ZCZ File ${configuratorBasePath}/uploads/${zczFileName}`)
    // cleanup, remove old content
    // TODO: make this a reusable function?
    fs.emptyDirSync(`${configuratorBasePath}/downloads`)
    fs.emptyDirSync(`${configuratorBasePath}/tmp`)

    // fs.removeSync(`${configuratorBasePath}/unpacked/${zczFileName}`)
    // fs.ensureDir(`${configuratorBasePath}/unpacked/${zczFileName}`)

    // gunzip zcz file to a tar file in tmp
    gunzip(
      `${configuratorBasePath}/uploads/${zczFileName}`,
      `${configuratorBasePath}/tmp/${zczFileName}.tar`,
      () => {
          // untar zcz file to a directory in tmp
          untar2(
            `${configuratorBasePath}/tmp/${zczFileName}.tar`,
            `${configuratorBasePath}/unpacked`)
            .then(() => {
                // rename
                fs.renameSync(
                  `${configuratorBasePath}/unpacked/image35-2`,
                  `${configuratorBasePath}/unpacked/${zczFileName}`
                )
                // gunzip Configs.tar.gz to Configs.tar
                gunzip(
                  `${configuratorBasePath}/unpacked/${zczFileName}/Configs.tar.gz`,
                  `${configuratorBasePath}/unpacked/${zczFileName}/Configs.tar`,
                  () => {
                      // gunzip Schema.tar.gz to Schema.tar
                      gunzip(
                        `${configuratorBasePath}/unpacked/${zczFileName}/Schema.tar.gz`,
                        `${configuratorBasePath}/unpacked/${zczFileName}/Schema.tar`,
                        () => {
                            // untar Configs.tar to configurations directory
                            untar2(
                              `${configuratorBasePath}/unpacked/${zczFileName}/Configs.tar`,
                              `${configuratorBasePath}/unpacked/${zczFileName}/Configs`).then(() =>
                              // untar Schema.tar to schemas directory
                              untar2(
                                `${configuratorBasePath}/unpacked/${zczFileName}/Schema.tar`,
                                `${configuratorBasePath}/unpacked/${zczFileName}/Schemas`)).then(() => {
                                fs.emptyDirSync(`${configuratorBasePath}/tmp`)
                                fs.removeSync(`${configuratorBasePath}/unpacked/${zczFileName}/Configs.tar`)
                                fs.removeSync(`${configuratorBasePath}/unpacked/${zczFileName}/Schema.tar`)
                                // fs.renameSync(
                                //   `${configuratorBasePath}/unpacked/${zczFileName}/_configurations`,
                                //   `${configuratorBasePath}/unpacked/${zczFileName}/Configs.tar`
                                // )
                                // fs.renameSync(
                                //   `${configuratorBasePath}/unpacked/${zczFileName}/_schemas`,
                                //   `${configuratorBasePath}/unpacked/${zczFileName}/Schema.tar`
                                // )
                            })
                        })
                  })
            })
      })
}

const repackageZczFile = (configuratorBasePath, zczFileName) => {
    console.log(`Collapsing ZCZ File ${configuratorBasePath}/uploads/${zczFileName}`)
    // cleanup
    fs.emptyDirSync(`${configuratorBasePath}/tmp`)
    fs.emptyDirSync(`${configuratorBasePath}/downloads`)

    return tarNgzip(
      `${configuratorBasePath}/unpacked/${zczFileName}`,
      `Configs`,
      `${configuratorBasePath}/unpacked/${zczFileName}/Configs.tar.gz`,)
      .then(() => tarNgzip(
        `${configuratorBasePath}/unpacked/${zczFileName}`,
        `Schemas`,
        `${configuratorBasePath}/unpacked/${zczFileName}/Schemas.tar.gz`)
      )
      .then(() => {

          fs.moveSync(
            `${configuratorBasePath}/unpacked/${zczFileName}/Configs`,
            `${configuratorBasePath}/tmp/Configs`)
          fs.moveSync(
            `${configuratorBasePath}/unpacked/${zczFileName}/Schemas`,
            `${configuratorBasePath}/tmp/Schemas`)
          fs.renameSync(
            `${configuratorBasePath}/unpacked/${zczFileName}`,
            `${configuratorBasePath}/unpacked/image35-2`
          )

          return tarNgzip(
            `${configuratorBasePath}/unpacked`,
            'image35-2',
            `${configuratorBasePath}/downloads/${zczFileName}`
          )
      })
      .then(() => {
          fs.renameSync(
            `${configuratorBasePath}/unpacked/image35-2`,
            `${configuratorBasePath}/unpacked/${zczFileName}`
          )
          fs.moveSync(
            `${configuratorBasePath}/tmp/Configs`,
            `${configuratorBasePath}/unpacked/${zczFileName}/Configs`)
          fs.moveSync(
            `${configuratorBasePath}/tmp/Schemas`,
            `${configuratorBasePath}/unpacked/${zczFileName}/Schemas`)

          return 0
    })
}

const unpackAesFile1 = (configuratorBasePath, aesFileName) => {
    console.log(`Unpacking ${configuratorBasePath}/uploads/${aesFileName}`)

    fs.emptyDirSync(`${configuratorBasePath}/tmp`)
    fs.emptyDirSync(`${configuratorBasePath}/downloads`)
    fs.ensureDirSync(`${configuratorBasePath}/unpacked/${aesFileName}`)

    const ZIP_FILE_NAME = aesFileName.replace('.aes', '')
    openSslDecrypt(
      `${configuratorBasePath}/uploads/${aesFileName}`,
      `${configuratorBasePath}/tmp/${ZIP_FILE_NAME}`)
    unzip(
    `${configuratorBasePath}/tmp/${ZIP_FILE_NAME}`,
    `${configuratorBasePath}/unpacked/${aesFileName}`
    )

    // fs.emptyDirSync(`${configuratorBasePath}/tmp`)
}

const repackageAesFile = (configuratorBasePath, aesFileName) => {
    console.log(`Packing ${configuratorBasePath}/uploads/${aesFileName}`)

    fs.emptyDirSync(`${configuratorBasePath}/tmp`)
    fs.emptyDirSync(`${configuratorBasePath}/downloads`)

    gunzip(
      `${configuratorBasePath}/unpacked/${aesFileName}`,
      `${configuratorBasePath}/unpacked/${aesFileName}`
    )

    fs.emptyDirSync(`${configuratorBasePath}/tmp`)
}

// WORK IN PROGRESS
// unpackAesFile1(
//   '/Users/jannunzi/mks/configurator',
//   'EDGE-50R40Z-E13_0348765_20200813_074435_UploadFiles.aes'
// )

// unpackZczFile2(
//   '/Users/jannunzi/mks/configurator',
//   'INv1692.90.1473_Fixtures_400kHz.zcz')

// repackageZczFile(
//   '/Users/jannunzi/mks/configurator',
//   'INv1692.90.1473_Fixtures_400kHz.zcz')

module.exports = {
    openSslEncrypt,
    openSslDecrypt,
    // zip,
    zipAesFile,
    unzipAesFile,
    tar,
    untar,
    createDirectory,
    copyFilesRecursively,
    compareJsonObjects,
    readDirectoryContent,

    unpackZczFile,
    unpackZczFile2,
    repackageZczFile,

    repackageAesFile,
    unpackAesFile1,

    tarNgzip
}
