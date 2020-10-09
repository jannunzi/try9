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
const glob = require("glob")

const UNTAR = "tar -xzf SOURCE_FILE -C TARGET_DIRECTORY"
const TAR   = "tar -czf TARGET_FILE -C SOURCE_DIRECTORY ."
// const RM_RECURSIVE = "rm -rf TARGET"

const OPENSSL_ENCRYPTION_CMD = `openssl aes-256-cbc -salt -in INPUT_FILE -out OUTPUT_FILE -k n0v1n@`
const OPENSSL_DECRYPTION_CMD = `openssl aes-256-cbc -d -salt -k n0v1n@ -in INPUT_FILE -out OUTPUT_FILE`
const UNZIP = `unzip  INPUT_FILE  -d OUTPUT_FILE`
// const ZIP = 'cd INPUT_FOLDER && zip -r OUTPUT_ZIP *'

const jsonDiff = require('json-diff')
const homedir = require('os').homedir();

const {TMP_PATH, DOWNLOADS_PATH, UPLOAD_PATH, UPLOADS_PATH, UNPACKED_PATH, FIRMWARE_PATH} = require('./paths');

const UNZIP_OS_MAP = (inputFile, outputFolder) => ({
    win32:  `unzip ${inputFile} -d ${outputFolder}`,
    darwin: `unzip ${inputFile} -d ${outputFolder}`,
    linux:  `unzip ${inputFile} -d ${outputFolder}`
})

const cleanFolders = () => {
    fs.emptyDirSync(TMP_PATH);
    fs.emptyDirSync(DOWNLOADS_PATH);
    fs.emptyDirSync(UPLOAD_PATH);
}

const execShellCommand = (cmd, callback)  => {
    return new Promise((resolve, reject) => {
        exec(cmd, null, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

const execShellCommandCallback = (cmd, callback) => {
    exec(cmd, null, callback)
}

const nativeUnzip = (inputFile, outputFolder, callback) => {
    const platform = process.platform
    const cmd = UNZIP_OS_MAP(inputFile, outputFolder)[platform]
    // console.log(cmd)
    exec(cmd)
    if(typeof callback === "function")
        callback()
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

const copyFilesRecursively = (source, target) =>
  copy(source, target, {overwrite: true})

const readDirectoryContent = (directory) =>
    fs.readdirSync(directory)
      .filter(filename => filename !== '.DS_Store')

const untar2 = (sourceFile, targetDirectory) => {
    fs.ensureDirSync(targetDirectory)
    // targetDirectoryParts.splice(targetDirectoryParts.length - 1, 1)
    // const cwdParent = targetDirectoryParts.join('/')
    return tar.extract({
        file: sourceFile,
        cwd: targetDirectory
    }).then(() => {
        let targetDirectoryParts = targetDirectory.split('/')
        const last = targetDirectoryParts[targetDirectoryParts.length - 1]
        if(fs.existsSync(`${targetDirectory}/${last}`)) {
            targetDirectoryParts = targetDirectoryParts.slice(0, targetDirectoryParts.length - 1)
            const parent = targetDirectoryParts.join('/')
            fs.renameSync(targetDirectory, `${targetDirectory}1`)
            fs.moveSync(`${targetDirectory}1/${last}`, `${parent}/${last}`)
            fs.removeSync(`${targetDirectory}1`)
        }
    }).catch(e => {})
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

const myGunzip = (source, destination, callback) => {
    if(fs.existsSync(source) && fs.existsSync(destination))
        gunzip(source, destination, callback)
    else
        callback()
}

// DO NOT USE
// unpackZczFile(
//   '/Users/jannunzi/mks/configurator',
//   'INv1692.90.1473_Fixtures_400kHz.zcz')

// USE THIS INSTEAD - unpacks to unpackaed/Configs, Schemas
const unpackZczFile2 = (configuratorBasePath, zczFileName) => {
    // cleanup, remove old content
    // TODO: make this a reusable function?
    fs.emptyDirSync(`${configuratorBasePath}/downloads`)
    fs.emptyDirSync(`${configuratorBasePath}/tmp`)

    /* gunzip uploaded zcz file to a tar file in tmp
     * uploads/XYZ.zcz --> tmp/XYZ.zcz.tar
     */
    const zczPath = `${UPLOADS_PATH}/${zczFileName}`
    const tarPath = `${UPLOADS_PATH}/${zczFileName}.tar`
    const unpackedFirmwarePath = `${FIRMWARE_PATH(zczFileName)}`
    gunzip(
      zczPath,
      tarPath,
      () => {
          /* untar zcz file to a directory in tmp, e.g.,
           * tmp/XYZ.zcz.tar --> unpacked/image35-2
           * NOTE: "image35-2" is a token related to the product model
           */
          untar2(
            tarPath,
            UNPACKED_PATH)
            .then(() => {
                /* rename unpacked zcz image35-2 to original zcz file name
                 * unpacked/image35-2 --> unpacked/XYZ.zcz
                 */
                fs.removeSync(tarPath)
                fs.renameSync(
                  `${UNPACKED_PATH}/image35-2`,
                  `${unpackedFirmwarePath}`
                )
                /* gunzip Configs.tar.gz to Configs.tar, e.g.,
                 * unpacked/XYZ.zcz/Configs.tar.gz --> unpacked/XYZ.zcz/Configs.tar
                 */
                gunzip(
                  `${unpackedFirmwarePath}/Configs.tar.gz`,
                  `${unpackedFirmwarePath}/Configs.tar`,
                  () => {
                      /* gunzip Schema.tar.gz to Schema.tar, e.g.,
                       * unpacked/XYZ.zcz/Schema.tar.gz --> unpacked/XYZ.zcz/Schema.tar
                       */

                      // jga
                      gunzip(
                        `${unpackedFirmwarePath}/Schema.tar.gz`,
                        `${unpackedFirmwarePath}/Schema.tar`,
                        () => {
                            /* untar Configs.tar and Schema.tar to directories, e.g.,
                             * unpacked/XYZ.zcz/Configs.tar --> unpacked/XYZ.zcz/Configs
                             * unpacked/XYZ.zcz/Schema.tar --> unpacked/XYZ.zcz/Schemas
                             * [DONE] TODO: should be Schema (singular)
                             */
                            untar2(
                              `${unpackedFirmwarePath}/Configs.tar`,
                              `${unpackedFirmwarePath}/Configs`).then(() =>
                              // untar Schema.tar to schemas directory
                              untar2(
                                `${unpackedFirmwarePath}/Schema.tar`,
                                `${unpackedFirmwarePath}/Schema`)).then(() => {

                                chmodSyncDir(`${unpackedFirmwarePath}/Configs`, '777')
                                chmodSyncDir(`${unpackedFirmwarePath}/Schema`, '777')
                                /* remove content in tmp
                                 * remove unpacked Configs.tar
                                 * remove unpacked Schema.tar
                                 * TODO: should I always remove these tar files especially when I repackage?
                                 */
                                fs.emptyDirSync(`${TMP_PATH}/tmp`)
                                fs.removeSync(`${unpackedFirmwarePath}/Configs.tar`)
                                fs.removeSync(`${unpackedFirmwarePath}/Schema.tar`)
                                const now = Date.now()
                                const timeStampFile = `__IGNORE__${now}.txt`

                                // TODO: dont show these files in client

                                fs.writeFileSync(`${unpackedFirmwarePath}/Configs/${timeStampFile}`, now)
                                fs.writeFileSync(`${unpackedFirmwarePath}/Schema/${timeStampFile}`, now)
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

    const modifiedConfigsFileName = zczFileName.replace('.zcz', '_modified_configs.zcz')

    /* tar and gzip Configs and Schemas folders in unpacked ZCZ file into *.tar.gz files, e.g.,
     * unpacked/XYZ.zcz/Configs --> unpacked/Configs.tar.gz
     * unpacked/XYZ.zcz/Schemas --> unpacked/Schemas.tar.gz
     * TODO: should be Schema and Schema.tar.gz (singular) [OK]
     * TODO: request to change it to plural
     * TODO: fix in unpack as well [OK]
     */
    return tarNgzip(
      `${configuratorBasePath}/unpacked/${zczFileName}`,
      `Configs`,
      `${configuratorBasePath}/unpacked/${zczFileName}/Configs.tar.gz`,)
      .then(() => tarNgzip(
        `${configuratorBasePath}/unpacked/${zczFileName}`,
        `Schema`,
        `${configuratorBasePath}/unpacked/${zczFileName}/Schema.tar.gz`)
      )
      .then(() => {

          /* move Configs and Schemas folders to tmp so unpacked zcz file can be repacked
           * these folders should not end up in the zcz file. They were created by the tool
           * unpacked/XYZ.zcz/Configs --> tmp/Configs
           * unpacked/XYZ.zcz/Schemas --> tmp/Schemas
           * TODO: should be Schema (singular)
           * TODO: fix in unpack as well
           */
          fs.moveSync(
            `${configuratorBasePath}/unpacked/${zczFileName}/Configs`,
            `${configuratorBasePath}/tmp/Configs`)
          fs.moveSync(
            `${configuratorBasePath}/unpacked/${zczFileName}/Schema`,
            `${configuratorBasePath}/tmp/Schema`)

          /* rename unpacked zcz file to image35-2 since that's what it should unpack as, e.g.,
           * unpacked/XYZ.zcz --> unpacked/image35-2
           */
          fs.renameSync(
            `${configuratorBasePath}/unpacked/${zczFileName}`,
            `${configuratorBasePath}/unpacked/image35-2`
          )

          /* tar and zip unpacked zcz file to downloads folder, e.g.,
           * unpacked/image35-2 --> downloads/XZY.zcz
           */
          return tarNgzip(
            `${configuratorBasePath}/unpacked`,
            'image35-2',
            `${configuratorBasePath}/downloads/${modifiedConfigsFileName}`
          )
      })
      .then(() => {

          /* rename image35-2 back to unpacked zcz file
           * unpacked/image35-2 --> unpacked/XZY.zcz
           */
          fs.renameSync(
            `${configuratorBasePath}/unpacked/image35-2`,
            `${configuratorBasePath}/unpacked/${zczFileName}`
          )
          /* move Configs and Schemas folders back to the unpacked zcz folder, e.g.,
           * tmp/Configs --> unpacked/XYZ.zcz/Configs
           * tmp/Schemas --> unpacked/XYZ.zcz/Schemas
           */
          fs.moveSync(
            `${configuratorBasePath}/tmp/Configs`,
            `${configuratorBasePath}/unpacked/${zczFileName}/Configs`)
          fs.moveSync(
            `${configuratorBasePath}/tmp/Schema`,
            `${configuratorBasePath}/unpacked/${zczFileName}/Schema`)

          return 0
      })
}

const unpackAesFile = (configuratorBasePath, aesFileName) => {
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

const chmodSyncDir = (dir, mode) => {
    const files = fs.readdirSync(dir)
    console.log(files)
    files.forEach(file => {
        fs.chmodSync(
          `${dir}/${file}`,
          mode)
    })
}

const configurationsDirectory = firmware =>
  firmware.endsWith('zcz') ?
    `${homedir}/mks/configurator/unpacked/${firmware}/Configs` :
    `${homedir}/mks/configurator/unpacked/${firmware}/Configs/Permanent`

const schemasDir = firmware =>
  firmware.endsWith('zcz') ?
    `${homedir}/mks/configurator/unpacked/${firmware}/Schema` :
    `${homedir}/mks/configurator/unpacked/${firmware}/Schemas`

const writeTimestampFile = (folder, baseFileName) => {
    const now = Date.now()
    const timeStampFile = `${baseFileName}${now}.txt`

    try {
        fs.writeFileSync(`${folder}/${timeStampFile}`, now)
    } catch (e) {
        // ignore
    }
}

const removeTimestampFiles = (folder) => {
    try {
        glob(`${folder}/__IGNORE__*`, (er, files) => {
            files.forEach(file => {
                fs.removeSync(file)
            })
        })
    } catch (e) {
        // ignore
    }
}

module.exports = {
    removeTimestampFiles,
    writeTimestampFile,
    cleanFolders,

    openSslEncrypt,
    openSslDecrypt,
    // zip,
    zipAesFile,
    unzipAesFile,
    tar,
    untar,
    untar2,
    createDirectory,
    copyFilesRecursively,
    compareJsonObjects,
    readDirectoryContent,

    unpackZczFile,
    unpackZczFile2,
    repackageZczFile,

    repackageAesFile,
    unpackAesFile,

    tarNgzip,

    execShellCommand,
    execShellCommandCallback,

    configurationsDirectory,
    schemasDir,

    nativeUnzip: nativeUnzip
}
