const utils = require("../server/common/utils")

utils.openSslDecrypt(
  "/Users/jannunzi/mks/configurator/uploads/TEST1.zip.aes",
  "/Users/jannunzi/mks/configurator/uploads/TEST1.zip",
)

/*
/Users/jannunzi/mks/configurator/tmp/__tmp.zip
/Users/jannunzi/mks/configurator/unpacked/E10060Z-E11_030045855_20201007_174612_UploadFiles.zip.aes
*/

utils.nativeUnzip(
  "/Users/jannunzi/mks/configurator/uploads/TEST1.zip",
  "/Users/jannunzi/mks/configurator/uploads")
