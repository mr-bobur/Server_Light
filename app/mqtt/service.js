const { devices } = require("../models")


module.exports = client => {
    const topic = '/nodejs/mqtt'
    var a = 0
    client.on('connect', () => {
        console.log('Connected')
        client.subscribe([topic], () => {
            console.log(`Subscribe to topic '${topic}'`)
        })
        client.subscribe('topics1', () => {
            console.log(`Subscribe to topic '${topic}'`)
        })
     })

    client.on('message', (topic, payload) => {
        console.log('Received Message:', topic, payload.toString())
        if (topic == "topics1") {
            a = Number(payload)
        }
    })

    return client;
}
