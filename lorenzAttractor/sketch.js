/********************
	Lorenz Attractor  NOT WORKING
	*****************/

// Initial values
x = 0.1
y = 0
z = 0

// Lorenz's original values
sigma = 10
ro = 28
beta = 8.0 / 3.0

// Save drawn point 
points = new Array()

function setup() {
	createCanvas(800, 600, WEBGL)
	colorMode(HSB)
}

function draw() {
	dt = 0.01
	dx = (sigma * (y - x)) * dt
	dy = (x * (ro - z) - y) * dt
	dz = (x * y - beta * z) * dt
	x = x + dx
	y = y + dy
 	z = z + dz

	points.push(createVector(x, y, z))

	background(0)
	translate(width / 2, height / 2, 0)
	scale(5)
	stroke(255)
	//noFill()
	//ellipse(x, y, z, 2)
	// hu = 0
	// beginShape()
	points.map(v => {
		ellipse(v.x, v.y, v.z)
	})
	// for (v in points) {
	// 	stroke(hu, 255, 255)
		// vertex(v.x, v.y, v.z)
	// 	hu += 0.1
	// 	if (hu > 255) {
	// 		hu = 0
	// 	}
	// }
	// endShape()
}