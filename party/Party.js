class Party {

    constructor(tradfri, interval) {
        this.tradfri = tradfri;
        this.interval = interval;
        this.devices = [];
        this.doLogging = true;
    }

    async discover() {
        const devices = await this.tradfri.getDevices();
        this.log('Discovered IKEA TRÅDFRI gateway. The following bulbs are present on the gateway:')
        let DeviceDetector = require('./Devices/DeviceDetector');

        devices.forEach(device => {
            const bulb = DeviceDetector.detect(device);

            if(bulb) {
                this.devices.push(bulb);
                if(this.doLogging) {
                    console.log('\x1b[33m', '  - ' 
                                            + bulb.id 
                                            + ' | ' 
                                            + bulb.name 
                                            + ' (' + bulb.type + (bulb.isColor ? ' - multi-color available' : '') 
                                            +')');
                }
            }
        })
        console.log();

        this.disableAll();
    }

    start() {
        setInterval(() => {
            this.doParty();
        }, this.interval);
    }

    doParty() {
        this.devices.forEach(device => {
            if(device.busy) {
                return;
            }

            let randomAction = (Math.random() >= 0.5);

            if(randomAction) {
                this.enableDevice(device);
            } else {
                this.disableDevice(device);
            }
        })
    }

    disableAll() {
        this.log('Turning off all devices...');
        this.devices.forEach(device => {
            this.disableDevice(device);
        })
    }

    disableDevice(device) {
        if(! device.enabled) {
            return;
        }

        device.busy = true;

        this.tradfri.setDeviceState(device.id, { state: 'off', transitionTime: 30}).then((res) => {
            this.log(device.name + ' has been turned off.');
            device.toggleEnabled();
            device.busy = false;
        });
    }

    enableDevice(device) {
        if(device.enabled) {
            return;
        }

        device.busy = true;

        // The device has color.
        if(device.isColor) {
            this.tradfri.setDeviceState(device.id, { state: 'on', transitionTime: 30, colorX: Math.floor(Math.random() * 65535), colorY: Math.floor(Math.random() * 65535)}).then((res) => {
                this.log(device.name + ' has been turned on with a color.');
                device.toggleEnabled();
                device.busy = false;
            });

            return;
        }

        this.tradfri.setDeviceState(device.id, { state: 'on', transitionTime: 30}).then((res) => {
            this.log(device.name + ' has been turned on.');
            device.toggleEnabled();
            device.busy = false;
        });
    }


    static create(tradfri, interval) {
        return new Party(tradfri, interval);
    }

    log(message) {
        if(this.doLogging) {
            console.log('\x1b[0m\x1b[2m', "[" + (new Date()).toLocaleString() + "] ", '\x1b[0m', message);
        }
    }
}

module.exports = Party;