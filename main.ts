radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 42) {
        Oppskytning = true
    }
    if (receivedNumber == 11) {
        LinkStatus = true
        sistSettAktiv = input.runningTime()
    }
})
function NeoPixels () {
    if (SelfStatus) {
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Red))
    }
    if (LinkStatus) {
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Red))
    }
    if (IgniterStatus) {
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Red))
    }
    if (ArmStatus) {
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Red))
    }
    strip.show()
}
function Launch () {
    Oppskytning = false
    if (Klar) {
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
        pins.digitalWritePin(DigitalPin.P16, 1)
        basic.pause(500)
        pins.digitalWritePin(DigitalPin.P16, 0)
        strip.clear()
        strip.show()
        while (pins.digitalReadPin(DigitalPin.P1) == 1) {
            pins.digitalWritePin(DigitalPin.P8, 1)
            basic.showLeds(`
                . . . . .
                . # # # .
                . # # # .
                . # # # .
                . . . . .
                `)
            pins.digitalWritePin(DigitalPin.P8, 0)
            basic.showLeds(`
                . . . . .
                . # # # .
                . # . # .
                . # # # .
                . . . . .
                `)
        }
        Initialize()
    }
}
function Initialize () {
    SelfStatus = false
    LinkStatus = false
    IgniterStatus = false
    ArmStatus = false
    Oppskytning = false
    Klar = false
    strip.showColor(neopixel.colors(NeoPixelColors.Purple))
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . # # # .
        . # . # .
        . # # # .
        . . . . .
        `)
    basic.showLeds(`
        # # # # #
        # . . . #
        # . . . #
        # . . . #
        # # # # #
        `)
    basic.showLeds(`
        # . . . #
        # # . # #
        # . # . #
        # . . . #
        # . . . #
        `)
    strip.showColor(neopixel.colors(NeoPixelColors.Red))
    basic.pause(200)
}
let Klar = false
let ArmStatus = false
let IgniterStatus = false
let SelfStatus = false
let sistSettAktiv = 0
let LinkStatus = false
let Oppskytning = false
let strip: neopixel.Strip = null
radio.setGroup(1)
radio.setTransmitPower(7)
strip = neopixel.create(DigitalPin.P0, 4, NeoPixelMode.RGB)
pins.digitalWritePin(DigitalPin.P15, 1)
let Oppdateringsfrekvens = 200
Initialize()
basic.forever(function () {
    SelfStatus = true
    if (pins.digitalReadPin(DigitalPin.P1) == 1) {
        ArmStatus = true
        radio.sendNumber(31)
    } else {
        ArmStatus = false
        radio.sendNumber(32)
    }
    if (pins.digitalReadPin(DigitalPin.P5) == 0) {
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        pins.digitalWritePin(DigitalPin.P14, 1)
        basic.pause(200)
        if (pins.digitalReadPin(DigitalPin.P2) == 1) {
            IgniterStatus = true
            radio.sendNumber(21)
        } else {
            IgniterStatus = false
            radio.sendNumber(22)
        }
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
    if (SelfStatus && LinkStatus && IgniterStatus && ArmStatus) {
        Klar = true
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
    } else {
        Klar = false
        basic.showLeds(`
            # . . . #
            # # . # #
            # . # . #
            # . . . #
            # . . . #
            `)
    }
    if (Oppskytning) {
        Launch()
    }
    NeoPixels()
    basic.pause(100)
})
control.inBackground(function () {
    while (true) {
        radio.sendNumber(11)
        if (input.runningTime() - sistSettAktiv > 3 * Oppdateringsfrekvens) {
            LinkStatus = false
        }
        basic.pause(Oppdateringsfrekvens)
    }
})
