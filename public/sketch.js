/***********************
	A* Search Algorithm
	********************/

// Global variables
const cols = 50		// grid's amount of columns
const rows = 50		// grid's amount of rows
const grid = new Array(cols)
const openSet = new Set()	// The set of currently discovered nodes that are not evaluated yet.
const closedSet = new Set()	// The set of nodes already evaluated
let start	// staring spot
let end	// end spot
let w	// width of each cell of the grid
let h	// height of each cell of the grid
let path	// The road taken


// An educated guess of how far it is between two points
function heuristic(a, b) {
	return dist(a.i, a.j, b.i, b.j)
}


function setup() {
	createCanvas(400, 400)
	console.log('A*')

	// Set grid cell size
	w = width / cols
	h = height / rows

	// Making a 2D array
	for (let i = 0; i < cols; i++) {
		grid[i] = new Array(rows)
	}

	// Filling it with Spots
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = new Spot(i, j)
		}
	}

	// Set neighbors
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].addNeighbors(grid)
		}
	}

	// Set Start and End
	start = grid[0][0]
	end = grid[cols - 1][rows - 1]
	start.is_wall = false
	end.is_wall = false

	// openSet starts with the starting-point only
	openSet.add(start)
}

function draw() {
	// Am I still searching?
	if (openSet.size) {	
		// Best next option
		let best
		openSet.forEach(spot => {
			if (!best || spot.f < best.f) {
				best = spot
			}
		})
		var current = best
		
		// Did I finish?
		if (current === end) {
			noLoop()
			console.log('DONE!')
		}
	
		// Best option moves from openSet to closedSet
		openSet.delete(current)
		closedSet.add(current)
	
		// Check all the neighbors
		const neighbors = current.neighbors
		for (let i = 0; i < neighbors.length; i++) {
			const neighbor = neighbors[i]

			// Valid next spot?
			if (!closedSet.has(neighbor) && !neighbor.is_wall) {
				const tempG = current.g + heuristic(neighbor, current)

				// Is this a better path than before?
				let newPath = false
				if (openSet.has(neighbor)) {
					if (tempG < neighbor.g) {
						neighbor.g = tempG
						newPath = true
					}
				} else {
					neighbor.g = tempG
					newPath = true
					openSet.add(neighbor)
				}

				// Yes, it's a better path
				if (newPath) {
					neighbor.h = heuristic(neighbor, end)
					neighbor.f = neighbor.g + neighbor.h
					neighbor.previous = current
				}
			}
		}
	// Uh oh, no solution
	} else {
		console.log('there\'s no solution')
		noLoop()
		return
	}
	
	// Draw current state of everything
	background(255)

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].show(0)
		}
	}

	// Show every closed spot on RED
	closedSet.forEach(spot => { spot.show(color(255, 0, 0, 50)) })
	// Show every open spot on GREEN
	openSet.forEach(spot => { spot.show(color(0, 255, 0, 50)) })
	
	// Find the path by working backwards
	path = []
	let temp = current
	path.push(temp)
	while (temp.previous) {
		path.push(temp.previous)
		temp = temp.previous
	}

	// Drawing path as continuous line
	noFill()
	stroke(255, 0, 200)
	strokeWeight(w / 2)
	beginShape()
	for (let i = 0; i < path.length; i++) {
		vertex(path[i].i * w + w / 2, path[i].j * h + h / 2)
	}
	endShape();	
}