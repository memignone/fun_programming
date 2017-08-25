// An object to describe a spot in the grid
function Spot(i, j) {    
	// Location in the grid
	this.i = i
	this.j = j

	// f, g, and h values for A*
	this.f = 0	// f(x) = g(x) + h(x)
	this.g = 0	// The cost of getting from the start node to that node.
	this.h = 0	// Result of the heuristic that estimates the cost of the cheapest path from n to the goal.

	// Neighbors
	this.neighbors = []

	// Where did I come from?
	this.previous = undefined

	// Am I a wall?
	this.is_wall = random(1) < 0.4
}

// Display me
Spot.prototype.show = function(color) {
	if (this.is_wall) {
		fill(0)
		noStroke()
		ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2)
	} else if (color) {
		fill(color)
		rect(this.i * w, this.j * h, w, h)
	}
}
    
// Figure out who my neighbors are
Spot.prototype.addNeighbors = function(grid) {
	let i = this.i
	let j = this.j
	if (i < cols - 1) {
		this.neighbors.push(grid[i + 1][j])
	}
	if (i > 0) {
		this.neighbors.push(grid[i - 1][j])
	}
	if (j < rows - 1) {
		this.neighbors.push(grid[i][j + 1])
	}
	if (j > 0) {
		this.neighbors.push(grid[i][j - 1])
	}
	if (i > 0 && j > 0) {
		this.neighbors.push(grid[i - 1][j - 1])
	}
	if (i < cols - 1 && j > 0) {
		this.neighbors.push(grid[i + 1][j - 1])
	}
	if (i > 0 && j < rows - 1) {
		this.neighbors.push(grid[i - 1][j + 1])
	}
	if (i < cols - 1 && j < rows - 1) {
		this.neighbors.push(grid[i + 1][j + 1])
	}
}