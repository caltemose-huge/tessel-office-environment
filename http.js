var tessel = require('tessel')
var request = require('request')
request('http://10.40.64.24:3003', (err, res, body) => {
  if (err) console.log(err)  
  if (body) console.log(body)
})