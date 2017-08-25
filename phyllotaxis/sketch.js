/***************
	Phyllotaxis  WIP
	************/
// Global variables
const angle = 137.5		/* divergence angle */
const c = 3		/* scaling parameter */
let n = 0		/* ordering number of a floret, counting outward from the center */
let phi		/* angle between a reference direction and the position vector of the nth floret in a polar coordinate system originating at the center of the capitulum*/
let r		/* distance between the center of the capitulum and the center of the nth floret, given a constant scaling parameter */

const points = []
let start = 0

function setup() {
	createCanvas(600, 600)
	background(0)
	angleMode(DEGREES)
	colorMode(HSB)
}

function draw() {
	translate(width / 2, height / 2)
	rotate(n * 0.3)
	for (var i = 0; i < n; i++) {
		phi = n * angle
		r = c * sqrt(n)
		const x = r * cos(phi)
		const y = r * sin(phi)
		var hu = sin(start + i * 0.5)
		hu = map(hu, -1, 1, 0, 360)
		fill(hu, 255, 255)
		noStroke()
		ellipse(x, y, 4, 4)
	}
	n += 2
	start += 5
}