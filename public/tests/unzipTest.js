const utils = require("../server/common/utils")
const zipService = require("../server/services/zip.service.server")

// utils.openSslDecrypt(
//   "C:\\Users\\Victoria\\mks\\GUP-3611\\EDGE-50R40Z-E13_0348765_20201007_074814_UploadFiles.zip.aes",
//   "C:\\Users\\Victoria\\mks\\GUP-3611\\EDGE-50R40Z-E13_0348765_20201007_074814_UploadFiles.zip",
// )

/*
/Users/jannunzi/mks/configurator/tmp/__tmp.zip
/Users/jannunzi/mks/configurator/unpacked/E10060Z-E11_030045855_20201007_174612_UploadFiles.zip.aes
*/

// utils.nativeUnzip(
//   "C:\\Users\\Victoria\\mks\\GUP-3611\\TEST.zip",
//   "C:\\Users\\Victoria\\mks\\GUP-3611\\TEST")

zipService.unzip(
  "C:\\Users\\Victoria\\mks\\GUP-3611\\EDGE-50R40Z-E13_0348765_20201007_074814_UploadFiles.zip",
  "C:\\Users\\Victoria\\mks\\GUP-3611\\EDGE-50R40Z-E13_0348765_20201007_074814_UploadFiles", () => {
    console.log('YAY!!')
  })

