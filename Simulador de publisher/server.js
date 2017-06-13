'use strict'

var mqtt = require('mqtt')
const mqttUrl = 'mqtt://localhost:1883'
var client = mqtt.connect(mqttUrl)

const temperatureTopic = 'trabalho-iot-mqtt-temp'
const humidityTopic = 'trabalho-iot-mqtt-humidity'

client.on('connect', () => {

	const intervalInSecs = 2

	setInterval(() => {
		var randomTemperature = generateRandom(10, 40).toString()
		var randomHumidity = generateRandom(20, 80).toString()

		client.publish(temperatureTopic, randomTemperature)
		client.publish(humidityTopic, randomHumidity)

		console.log('Temperatura: ' + randomTemperature + '.\tUmidade: ' + randomHumidity)
	}, intervalInSecs * 1000)

})

var generateRandom = function(min, max){
	return Math.random() * (max - min) + min
}