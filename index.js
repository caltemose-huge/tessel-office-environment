'use strict';

// Import the interface to Tessel hardware
const tessel = require('tessel');
const climatelib = require('climate-si7005')
const led = require('tessel-led')
const climate = climatelib.use(tessel.port['A'])
let id = null

function readClimate () {
  const temps = {}
  resetLEDs()

  climate.readTemperature((err, tempC) => {
    led.green.hide()

    if (err) {
      console.error('error getting tempC')
      console.error(err)
      led.red.show()
      return
    }

    temps.c = tempC

    climate.readTemperature('f', (err, tempF) => {
      led.green.hide()

      if (err) {
        console.error('error getting tempF')
        console.error(err)
        led.red.show()
        return
      }

      temps.f = tempF
      report(temps)
    })
  })

}

function resetLEDs () {
  led.blue.hide()
  led.green.hide()
  led.red.hide()
}

function report(temps) {
  console.log('Celsius:', temps.c)
  console.log('Farenheit:', temps.f)
}

readClimate()