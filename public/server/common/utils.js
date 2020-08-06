const fs = require('fs')
const sys = require('util')
const exec = require('child_process').execSync;
const UNTAR = "tar -xzf SOURCE_FILE -C TARGET_DIRECTORY"
const TAR   = "tar -czf TARGET_FILE -C SOURCE_DIRECTORY ."
const RM_RECURSIVE = "rm -rf TARGET"
const CP_RECURSIVE = "cp -R SOURCE TARGET"

const OPENSSL_ENCRYPTION_CMD = `openssl aes-256-cbc -salt -in INPUT_FILE -out OUTPUT_FILE -k n0v1n@`
const OPENSSL_DECRYPTION_CMD = `openssl aes-256-cbc -d -salt -k n0v1n@ -in INPUT_FILE -out OUTPUT_FILE`
const UNZIP = `unzip  INPUT_FILE  -d OUTPUT_FILE`
const ZIP = 'cd INPUT_FOLDER && zip -r OUTPUT_ZIP *'

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

const openSslEncrypt = (inputFile, outputFile) => {
    let CMD = OPENSSL_ENCRYPTION_CMD
      .replace('INPUT_FILE', inputFile)
      .replace('OUTPUT_FILE', outputFile)

    console.log('openSslEncrypt')
    console.log(CMD)

    return execShellCommand(CMD)
}

const openSslDecrypt = (inputFile, outputFile) => {
    let CMD = OPENSSL_DECRYPTION_CMD
      .replace('INPUT_FILE', inputFile)
      .replace('OUTPUT_FILE', outputFile)
    return execShellCommand(CMD)
}

const unzip = (inputFile, outputFile) => {
    let CMD = UNZIP
      .replace('INPUT_FILE', inputFile)
      .replace('OUTPUT_FILE', outputFile)
    return execShellCommand(CMD)
}

const zip = (inputFolder, outputFile) => {
    let CMD = ZIP
      .replace('INPUT_FOLDER', inputFolder)
      .replace('OUTPUT_ZIP', outputFile)

    console.log('ZIP')
    console.log(CMD)

    return execShellCommand(CMD)
}

const copyFilesRecursively = (source, target) => {
    const cp = CP_RECURSIVE
        .replace('SOURCE', source)
        .replace('TARGET', target)
    exec(cp)
}

const removeFilesRecursively = (target) => {
    const rm = RM_RECURSIVE.replace("TARGET", target)
    exec(rm)
}

const readDirectoryContent = (directory) =>
    fs.readdirSync(directory)
      .filter(filename => filename !== '.DS_Store')

const untar = (sourceFile, targetDirectory) => {
    console.log('UNTAR')
    console.log(sourceFile)
    console.log(targetDirectory)
    const untar = UNTAR
        .replace("SOURCE_FILE", sourceFile)
        .replace("TARGET_DIRECTORY", targetDirectory)
    console.log(untar)
    console.log('===============')
    exec(untar)
}

const tar = (sourceDirectory, targetFile) => {
    console.log('TAR')
    console.log(sourceDirectory)
    console.log(targetFile)
    const tar = TAR
      .replace("SOURCE_DIRECTORY", sourceDirectory)
      .replace("TARGET_FILE", targetFile)
    console.log(tar)
    console.log('===============')
    exec(tar)
}

const createDirectory = (dir) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

const compareJsonObjects = (json1, json2) => {
    return jsonDiff.diff(json1, json2)
}

module.exports = {
    openSslEncrypt,
    openSslDecrypt,
    zip,
    unzip,
    tar,
    untar,
    createDirectory,
    copyFilesRecursively,
    removeFilesRecursively,
    compareJsonObjects,
    readDirectoryContent
}
