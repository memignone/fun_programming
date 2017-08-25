/********************
	Lorenz Attractor
	not tested in 3D
	*****************/

// Initial values
let x = 0.1
let y = 0
let z = 0
const dt = 0.01

// Lorenz's original values
const sigma = 10
const ro = 28
const beta = 8.0 / 3.0

const points = []

function setup() {
	createCanvas(800, 600)
	colorMode(HSB)
	background(0)
}

function draw() {
	const dx = (sigma * (y - x)) * dt
	const dy = (x * (ro - z) - y) * dt
	const dz = (x * y - beta * z) * dt
	x = x + dx
	y = y + dy
 	z = z + dz

	points.push(createVector(x, y, z))

	translate(width / 2, height / 2, 0)
	scale(3)
	noFill()
	
	let hu = 0
	beginShape()
	points.map(p => {
		stroke(hu % 256, 255, 255)
		vertex(p.x, p.y)
		hu += 0.1
	})
	endShape()
}