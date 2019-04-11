var tessel = require('tessel')
var AirTable = require('airtable')
var climatelib = require('climate-si7005')
const led = require('tessel-led')
var climate = climatelib.use(tessel.port['A'])
var env = require('./env.json')

var TIMEOUT = 15 *60*1000

var id = null

var API_KEY = env.AIRTABLE_KEY
var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: API_KEY
});
var base = Airtable.base(env.AIRTABLE_BASE);

function readClimate () {
    resetLEDs()

    climate.readTemperature('f', (err, f) => {
        led.green.hide()

        if (err) {
            console.error('error getting tempF')
            console.error(err)
            led.red.show()
            resetTimeout()
            return
        }

        // tempF = f
        console.log(f)
        writeToAirtable(f)
        // readAmbience()
    })

}

function resetLEDs () {
    led.blue.hide()
    led.green.hide()
    led.red.hide()
}

function reset () {
    resetTimeout()
    id = setTimeout(readClimate, TIMEOUT)
}

function resetTimeout () {
    if (id) {
        clearTimeout(id)
        id = null
    }
}

function writeToAirtable (f) {
    var data = {
        farenheit: f
    }

    base('Table 1').create(data, function(err, record) {
        if (err) {
            led.red.show()
            console.error(err);
            return;
        }
        console.log(record.getId());
        setTimeout(readClimate, TIMEOUT)
    });
}

readClimate()
