/***********************
	Steering text paths
	*******************/
// Global variables
let font
let vehicles = []

function preload() {
	font = loadFont('AvenirNextLTPro-Demi.otf')
}

function setup() {
	createCanvas(600, 300)

	let points = font.textToPoints('Steer', 55, 200, 192, {
		sampleFactor: 0.25
	})

	points.map(point => {
		newVehicle = new Vehicle(point.x, point.y)
		vehicles.push(newVehicle)
	})
}

function draw() {
	background(51,153,255)
	vehicles.map(v => {
		v.behaviors()
		v.update()
		v.show()
	})
}