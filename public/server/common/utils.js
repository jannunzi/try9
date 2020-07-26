const fs = require('fs')
const sys = require('util')
const exec = require('child_process').execSync;
const UNTAR = "tar -xzf SOURCE_FILE -C TARGET_DIRECTORY"
const TAR   = "tar -czf TARGET_FILE -C SOURCE_DIRECTORY ."
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
    untar,
    tar,
    createDirectory,
    copyFilesRecursively,
    removeFilesRecursively,
    compareJsonObjects,
    readDirectoryContent
}
