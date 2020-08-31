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

    <p>
      To edit firmware files from Novina Configurator follow these steps:
    </p>

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
      <li>
        Select a firmware from the dropdown on the top left.
        The dropdown on the top right updates with the schemas
        in the selected firmware.
      </li>
      <li>
        Select a schema from the dropdown on the top right.
        The configurations related to the selected firmware
        and schema is loaded and a form is rendered below the dropdowns.
      </li>
      <li>
        In the form below the dropdowns, update the configurations.
        Click on the Save Changes button to make the changes permanent.
      </li>
    </ol>

    <h2>Comparing Firmware Configurations and Schemas</h2>

    <p>
      To compare firmwares from Novina Configurator follow these steps:
    </p>

    <ol>
      <li>
        Navigate to
        &nbsp;
        <NavLink to={`/compare/configurations`} activeClassName={`active`}>
          Compare
        </NavLink>
        &nbsp;
        link on the left.
      </li>
      <li>
        Select whether you want to compare Configurations or Schemas
        by selecting the corresponding tab
      </li>
      <li>
        Select two firmwares to compare from the top left and right dropdowns
      </li>
      <li>
        Click on the Compare button on the top right.
        A list of configuration or schemas files are listed below the
        selected firmwares.
      </li>
      <li>
        Files that are present in one of the firmwares, but missing in the
        other firmware, are highlighted as green and red. Green for present
        and red for missing.
      </li>
      <li>
        Files that are different between the selected firmwares are
        highlighted as blue. Select the highlighted file to display the differences
      </li>
      <li>
        Differences between selected files are shown on the right of the screen.
        Values that been removed are highlighted red.
        New values are highlighted green.
        Values that have changed are highlighted blue.
      </li>
    </ol>

    <h2>OpenSSL</h2>

    <p>
      Novina Configurator needs OpenSSL installed on your computer.
      Use the steps below for your corresponding operating system.
    </p>

    <h3>Installing OpenSSL on Windows</h3>

    On windows, download the &nbsp;

    <a href="/windows/Win64OpenSSL_Light-1_1_1g.msi">
      Win64 OpenSSL v1.1.1g
    </a>

    &nbsp; OpenSSL Windows installer.
    Run the installer following the instructions.
    Add OpenSSL to your <code>PATH</code> environment variable.

    <h3>Installing OpenSSL on MacOS</h3>

    On MacOS, follow the steps below to install OpenSSL

    <ol>
      <li>
        Press <code>Command+Space</code> and type <code>Terminal</code> and press enter/return key.
      </li>
      <li>
        Run in Terminal app:
        <pre>
          ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" &lt; /dev/null 2&gt; /dev/null
            </pre>
        and press enter/return key. Enter your password if the screen prompts for a password.
        Wait for the command to finish.
      </li>
      <li>
        Run:
        <pre>
          brew install openssl
        </pre>
      </li>
    </ol>
  </div>

export default Help
