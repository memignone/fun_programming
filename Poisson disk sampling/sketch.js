/******************************************************
	Fast Poisson Disk Sampling in Arbitrary Dimensions
	paper: https://www.cs.ubc.ca/%7Erbridson/docs/bridson-siggraph07-poissondisk.pdf
	**************************************************/

// Global variables
const n = 2		// Dimension
const r = 4		// Minimum distance between samples
const k = 30 	// Limit of samples to choose before rejection
const grid = []
const w = r / Math.sqrt(n)	// Cell size
const active = []	// Active list
let cols, rows
const ordered = []


function setup() {
	createCanvas(400, 400)
	background(0)
	strokeWeight(4)
  	colorMode(HSB)

	// STEP 0
	cols = floor(width / w)
	rows = floor(height / w)
	for (var i = 0; i < cols * rows; i++) {
		grid[i] = undefined
	}

	// STEP 1
	const x = random(width)
	const y = random(height)
	const initial = createVector(x, y) // Initial sample
	const m = floor(x / w)
	const n = floor(y / w)
	grid[m + n * cols] = initial
	active.push(initial)
}

function draw() {
	background(0)
	// noLoop()
	
	// STEP 2
	for (let total = 0; total < 25; total++) { // Show 25 per frame
		if (active.length > 0) {
			const randIndex = floor(random(active.length))
			const pos = active[randIndex]
			for (let n = 0; n < k; n++) {
				const sample = p5.Vector.random2D()
				const magnitude = random(r, 2 * r)
				sample.setMag(magnitude)
				sample.add(pos)
				
				const col = floor(sample.x / w)
				const row = floor(sample.y / w)

				if (col > -1 && col < cols && row > -1 && row < rows && !grid[col + row * cols]) {
					let ok = true
					for (let i = -1; i <= 1; i++) {
						for (var j = -1; j <= 1; j++) {
							const index = (col + i) + (row + j) * cols
							const neighbor = grid[index]
							if (neighbor) {
								const distance = p5.Vector.dist(sample, neighbor)
								if (distance < r) {
									ok = false
								}
							}
						}
					}
					if (ok) {
						found = true
						grid[col + row * cols] = sample
						active.push(sample)
						ordered.push(sample)
						break
					}
				}
			}
			if (!found) {
				active.splice(randIndex, 1)
			}
		}
	}
	
	ordered.map(sample => {
		if (sample) {
			stroke((sample.x + sample.y) % 360, 100, 100)
			strokeWeight(r * 0.5)
			ellipse(sample.x, sample.y, 2)
		}
	})

	// active.map(sample => {
	// 	stroke('red')
	// 	strokeWeight(1)
	// 	ellipse(sample.x, sample.y, 2)
	// })
}