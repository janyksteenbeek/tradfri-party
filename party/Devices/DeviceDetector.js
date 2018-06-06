class DeviceDetector {
    constructor(device) {
        this.device = device;
        this.isColor = false;
    }

    _detect() {
        if(! this.isBulb()) {
            return false;
        }

        this.isColor = this.isColorBulb();

        let Bulb = require('./Bulb');
        return new Bulb(this.device.id, this.device.name, this.device.type, this.device.on, this.device.color, this.device.brightness, this.isColor);
    }

    isBulb() {
        // Only a bulb has brightness.
        if(this.device.brightness && this.device.brightness != null) {
            return true;
        }

        return false;
    }

    isColorBulb() {
        // Colored bulbs are 'CWS' bulbs. The bulb type is contained in the device type.
        return this.device.type.includes(' CWS ');
    }

    static detect(device) {
        return (new DeviceDetector(device))._detect();
    }
}

module.exports = DeviceDetector;