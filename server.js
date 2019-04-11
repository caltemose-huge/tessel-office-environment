var tessel = require('tessel')
var http = require('http')
var os = require('os')

var climatelib = require('climate-si7005')
var ambientlib = require('ambient-attx4')
var led = require('tessel-led')

var climate = climatelib.use(tessel.port['A'])
var ambient = ambientlib.use(tessel.port['A']);

var TIMEOUT = 15*1000

var id = null
var tempF = null
var soundLevel = null

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

        tempF = f
        console.log(tempF)
        
        readAmbience()
    })

}

function readAmbience () {
    ambient.getSoundLevel( (err, data) => {
        if (err) {
            console.log(error)
            resetTimeout()
            return
        }
        soundLevel = data.toFixed(8)
        reset()
    })
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

function resetLEDs () {
    led.blue.hide()
    led.green.hide()
    led.red.hide()
}

readClimate()

var interfaces = os.networkInterfaces()
var addresses = []
for(var i in interfaces) {
    for(var j in interfaces[i]) {
        var address = interfaces[i][j]
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address)
        }
    }
}
console.log('addresses', addresses)

var server = http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"})
    res.end("<p style='font-size:2em'>Temperature at Chad's desk: " + tempF + "&deg;F</p>\n")
})

server.listen(8080)
