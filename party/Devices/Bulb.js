class Bulb {
    constructor(id, name, type, enabled, color, brightness, isColor) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.enabled = enabled;
        this.color = color;
        this.brightness = brightness;
        this.isColor = isColor;
        this.busy = false;
    }

    toggleEnabled() {
        this.enabled = !this.enabled;
    }

    startBusy() {
        this.busy = true;
    }

    stopBusy() {
        this.busy = false;
    }

    isBusy() {
        return this.busy;
    }
}

module.exports = Bulb;