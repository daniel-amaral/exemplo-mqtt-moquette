'use strict'

var express = require('express')

var mqtt = require('mqtt')

var mqttClient = mqtt.connect('mqtt://localhost:1883')

const tempBrokerName = 'trabalho-iot-mqtt-temp'
const humidityBrokerName = 'trabalho-iot-mqtt-humidity'
var temperatureData = []
var humidityData = []

var app = express()
app.use(express.static(__dirname + '/public'));
const port = 3000

mqttClient.on('connect', function(){
	console.log('Connected to broker')
	mqttClient.subscribe(tempBrokerName)
	mqttClient.subscribe(humidityBrokerName)
})

mqttClient.on('message', (topic, message) => {
	var msg = message.toString()
	console.log('Message received from' + topic + ': ', msg)
	switch (topic){
		case tempBrokerName:
			temperatureData.push(msg);
			break;
		case humidityBrokerName:
			humidityData.push(msg);
			break;
	}
})

var path = require('path');

var bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/temperature-data-from-broker', (req, res) => {
	var temperatureData_copy = []
	for (var msg of temperatureData)
		temperatureData_copy.push(msg)
	temperatureData = []
	res.send(temperatureData_copy)
})

app.get('/humidity-data-from-broker', (req, res) => {
	var humidityData_copy = []
	for (var msg of humidityData)
		humidityData_copy.push(msg)
	humidityData = []
	res.send(humidityData_copy)
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/public', 'index.html'))
})

app.listen(port, () => {
	console.log('Application running on http://localhost:%d', port)
})