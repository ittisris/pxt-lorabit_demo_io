input.onButtonPressed(Button.AB, function () {
    loraBit.reset()
    loraBit.param_OTAA(
    "0008420454B8BE23",
    "70B3D57ED00219AA",
    "10D33F399DB357CDE2BF02599222E28D"
    )
    loraBit.join(loraBit_freq_Plan.AS923)
    basic.showString("join lorabit_demo_002")
    basic.clearScreen()
})
loraBit.whenReceived(function () {
    if (loraBit.nacknowledged()) {
        basic.showIcon(IconNames.No)
    } else {
        sos = false
        if (loraBit.getReceivedPort() == 99) {
            cayenneLPP.lpp_update(loraBit.getReceivedPayload())
            result = ["010000FF", "010064FF"].indexOf(loraBit.getReceivedPayload())
            if (result >= 0) {
                basic.showNumber(result)
            } else {
                basic.showIcon(IconNames.Chessboard)
            }
            basic.pause(200)
        }
    }
    basic.clearScreen()
})
input.onButtonPressed(Button.A, function () {
    basic.showArrow(ArrowNames.West)
    interval = input.runningTime()
    basic.clearScreen()
})
input.onPinPressed(TouchPin.P0, function () {
    basic.showArrow(ArrowNames.SouthWest)
    sos = true
})
input.onGesture(Gesture.Shake, function () {
    basic.showIcon(IconNames.Surprised)
    sos = true
})
let result = 0
let interval = 0
let sos = false
led.setBrightness(20)
basic.showIcon(IconNames.Happy)
sos = false
interval = input.runningTime()
loraBit.Verbose(Verbose_Mode.On)
cayenneLPP.add_digital(LPP_Direction.Output_Port, DigitalPin.P1)
cayenneLPP.add_analog(LPP_Direction.Input_Port, AnalogPin.P2)
cayenneLPP.add_sensor(LPP_Bit_Sensor.Temperature)
cayenneLPP.add_sensor(LPP_Bit_Sensor.Light)
cayenneLPP.add_sensor(LPP_Bit_Sensor.LED_Brightness)
loraBit.param_Config(
5,
7,
loraBit_ADR.On
)
basic.clearScreen()
basic.forever(function () {
    while (!(loraBit.available())) {
        basic.pause(100)
    }
    if (sos) {
        loraBit.sendPacket(loraBit_Confirmed.Confirmed, 191, loraBit.packHexString("SOS"))
        images.createImage(`
            . . . . #
            . . . . #
            . . . # #
            . . # # #
            # # # # #
            `).scrollImage(1, 50)
        loraBit.sleep()
    } else {
        if (input.runningTime() > interval) {
            interval = input.runningTime() + 60000
            loraBit.sendPacket(loraBit_Confirmed.Uncomfirmed, 99, cayenneLPP.lpp_upload())
            loraBit.sleep()
        }
    }
})
