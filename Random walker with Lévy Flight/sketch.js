/**********************************
	Random walker with Lévy flight
	*******************************/

// Global variables
let pos
let prev

function setup() {
	createCanvas(400, 400)
	background(51)
	pos = createVector(width / 2, height / 2)
	prev = pos.copy()
}

function draw() {
	stroke(255)
	strokeWeight(2)
	line(pos.x, pos.y, prev.x, prev.y)
	prev.set(pos)

	let step = p5.Vector.random2D()

	if (random(1) < 0.01) {
		step.mult(random(25, 100))
	} else {
		step.setMag(2)
	}
	pos.add(step)
}