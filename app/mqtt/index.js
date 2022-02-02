
const mqtt = require('mqtt')
const { devices } = require('../models')

const host = process.env.MQTT_HOST || 'broker.emqx.io'
const port = process.env.MQTT_PORT || '1883'
const clientId = process.env.MQTT_ID || 'mqttid_1f3a45e'

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  password: process.env.MQTT_USERPASS || 'public',
  reconnectPeriod: 1000,  
})

require('./service')(client)


// function intervalFunc() {
//   devices.findAll()
//     .then(data => {
//       data.forEach(element => {
//         client.publish(element.dataValues.name, JSON.stringify(element.dataValues))
//       });
//     })

// }  
// setInterval(intervalFunc, 10000); 
