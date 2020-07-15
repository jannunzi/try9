const SCHEMA_IGNORE = {
    'complexVoltageSensorCal.json': '',
    'driveCal.json': '',
    'driveController.json': '',
    'frequencyController.json': '',
    'gainScheduler.json': '',
    'mainHilbertViSensorCal.json': '',
    'meterCalData.json': '',
    'railCal.json': '',
    'railController.json': ''
}

const CONFIGURATION_IGNORE = {

}

const SCHEMA2CONFIG = {
    'driveControllerGenesis.json': 'Drive Controller',
    'frequencyControllerEsc.json': 'ESC Tuner Configuration',
    'hardwareManager.json': 'Hardware Manager Configuration',
    'mainController.json': 'Main Controller Configuration',
    'meterConfig.json': 'Meter Configuration',
    'mainHilbertViSensor.json': 'Power Sensor Configuration',
    'pulseController.json': 'Pulsing Configuration',
    'railControllerPulse.json': 'Rail Controller',
    'timbersController.json': 'Timbers Configuration',
    'tlcConfig.json': 'TLC Communication Configuration'
}

module.exports = {
    SCHEMA2CONFIG, SCHEMA_IGNORE, CONFIGURATION_IGNORE
}
