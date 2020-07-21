const fs = require('fs')
const sys = require('util')
const exec = require('child_process').execSync;
const UNTAR = "tar -xzf SOURCE_FILE -C TARGET_DIRECTORY"
const RM_RECURSIVE = "rm -rf TARGET"
const CP_RECURSIVE = "cp -R SOURCE TARGET"
const jsonDiff = require('json-diff')
const homedir = require('os').homedir();

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

const untar = (soureFile, targetDirectory) => {
    const untar = UNTAR
        .replace("SOURCE_FILE", soureFile)
        .replace("TARGET_DIRECTORY", targetDirectory)
    exec(untar)
}

const createDirectory = (dir) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

const compareJsonObjects = (json1, json2) => {
    return jsonDiff.diff(json1, json2)
}

const array1 = [
    "123",
    "234",
    "567",
    "678",
    "789",
    "890"
]

const array2 = [
    "123",
    "234",
    "345",
    "456",
    "567",
    "678"
]

console.log(compareJsonObjects(array1, array2))

module.exports = {
    untar,
    createDirectory,
    copyFilesRecursively,
    removeFilesRecursively,
    compareJsonObjects,
    readDirectoryContent
}
