import React from "react";
import {NavLink} from "react-router-dom";

const Help = () =>
  <div>
    <h1>Help</h1>
    <h2>Firmwares</h2>

    The Novina Configurator allows uploading and downloading
    firmware files containing configuration and schemas for
    particular hardware. Files of type ZCZ and AES are supported.
    To manage firmware files navigate to the
    &nbsp;
    <NavLink to={`/firmwares`} activeClassName={`active`}>
      Managing Firmware Files
    </NavLink>
    &nbsp;
    link on the left.

    <h3>Uploading Firmware Files</h3>

    To upload firmware files to Novina Configurator following these steps

    <ol>
      <li>
        Navigate to
        &nbsp;
        <NavLink to={`/firmwares`} activeClassName={`active`}>
          Firmwares
        </NavLink>
        &nbsp;
        link on the left.
      </li>
      <li>
        Click on the Upload button on the top right of the screen
      </li>
      <li>
        Navigate to the firmware file, select it, and click on Open.
        NOTE: only ZCZ and AES files are currently supported
      </li>
      <li>
        The firmware file will be listed along with the date the file
        was uploaded
      </li>
    </ol>

    Under your home directory, the firmware file will be uploaded to
    mks/configurator/uploads and unpacked to mks/configurator/unpacked.

    <h3>Deleting Firmware Files</h3>

    To delete firmware files from Novina Configurator follow these steps:

    <ol>
      <li>
        Navigate to
        &nbsp;
        <NavLink to={`/firmwares`} activeClassName={`active`}>
          Firmwares
        </NavLink>
        &nbsp;
        link on the left.
      </li>
      <li>
        Click the Remove button to the right of the firmware file
        you wish to remove
      </li>
      <li>
        The file is removed from the list
      </li>
    </ol>

    Under your home directory, the firmware file will be removed from
    mks/configurator/uploads and from mks/configurator/unpacked.

    NOTE: this operation can not be undone

    <h3>Downloading Firmwares</h3>

    The Novina Configurator tool allows editing firmware files. Once
    the changes have been saved, the firmware files can be repackaged
    into new files and downloaded.

    To download firmware files from Novina Configurator follow these steps:

    <ol>
      <li>
        Navigate to
        &nbsp;
        <NavLink to={`/firmwares`} activeClassName={`active`}>
          Firmwares
        </NavLink>
        &nbsp;
        link on the left.
      </li>
      <li>
        Click the Download button to the right of the firmware file
        you wish to download
      </li>
      <li>
        The latest changes to the firmware are packaged into a new
        firmware file and then downloaded to your local download folder
      </li>
    </ol>

    The latest changes to the firmware file are kept under your home
    folder under mks/configurator/unpacked. The original, unchanged
    firmware is kept under mks/configurator/uploads.

    <h2>Editing Firmware Configurations</h2>

    To edit firmware files from Novina Configurator follow these steps:

    <ol>
      <li>
        Navigate to
        &nbsp;
        <NavLink to={`/configurations`} activeClassName={`active`}>
          Configurations
        </NavLink>
        &nbsp;
        link on the left.
      </li>
    </ol>

    <h2>Comparing Firmware Configurations and Schemas</h2>
  </div>

export default Help
