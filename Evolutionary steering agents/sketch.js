/********************************
	Evolutionary steering agents
	****************************/

// Global variables
const agents = new Set()
const food = new Set()
const poison = new Set()

const initial_pieces = {
	'agents': 10,
	'food': 40,
	'poison': 20
}

// Information variables
let timer
let nextTimer = 0
let lonRecord = 0	// Record longevity
let tamagotchiMode = false	// Manual control of the world
let debug_mode = false	// Display agent's DNA values
let genCount = 0	// Current generation number
const CANVAS_REDUCTION = 0.97


function setup() {
	console.log('Creating scenario...')
	createCanvas(windowWidth * CANVAS_REDUCTION, windowHeight * CANVAS_REDUCTION)

	// Creation of the starting generation of agents
	for (let i = 0; i < initial_pieces.agents; i++) {
		agents.add(new Agent(random(width), random(height)))
	}

	// Creation of the starting set of food pieces
	for (let i = 0; i < initial_pieces.food; i++) {
		// TODO: place the food pieces on an image's bright spots would be a cool implementation
		food.add(createVector(random(width), random(height)))
	}

	// Creation of the starting set of poison pieces
	for (var i = 0; i < initial_pieces.poison; i++) {
		// TODO: place the poison pieces on an image's dark spots would be a cool implementation
		poison.add(createVector(random(width), random(height)))
	}
	
	genCount += 1
	console.log("Generation: " + genCount)
}


function draw() {
	background(51)
	timer = round(millis() / 1000) - nextTimer	// Timer update
	
	if (!tamagotchiMode) {	// Randomly spawn more food and poison
		if (random(1) < 0.10) { //10% probability to drop more food
			food.add(createVector(random(width), random(height)))
		}

		if (random(1) < 0.01) { //1% probability to drop more poison
			poison.add(createVector(random(width), random(height)))
		}
	}

	food.forEach(piece => {	// Draws the food
		noStroke()
		fill('green')
		ellipse(piece.x, piece.y, 6, 6)
	})

	poison.forEach(piece => {	// Draws the poison
		noStroke()
		fill('red')
		ellipse(piece.x, piece.y, 6, 6)
	})

	agents.forEach(agent => {
		agent.applyBehaviours(food, poison)
		agent.boundaries()
		agent.update()
		agent.show(debug_mode)

		// Reproduction
		const child = agent.reproduce()
		if (child) {
			agents.add(child)
		}

		// Death
		if (agent.is_dead()) {
			food.add(createVector(agent.position.x, agent.position.y))	// Spawn a piece of food where an agent died
			agents.delete(agent)

			if (agents.size < 1) {	// When the last agent has died, a new generation will spawn
				regenerate(agent)
			}
		}
	})

	// Display information on canvas
	fill('gray')
	text("Press CTRL to toggle debug mode on/off - MousePress inside Canvas to spawn new agents", 10, 30)
	if (!tamagotchiMode) {
		fill('gray')
		text("Press ALT to enter 'tamagotchi mode'" , 10, 50)
	} else {
		fill('white')
		text("MousePress + 'F' to spawn food - MousePress + 'P' to spawn poison. Press ALT to exit 'Tamagotchi mode'", 10, 50)
	}
	fill('white')
	text("Generation number: " + genCount, 10, 70)
	text("Longevity score: " + timer, 10, 90)
	if (genCount > 1) {
		fill('gray')
		text("Longevity record: " + lonRecord, 10, 110)
	}
}


function mousePressed() {	// P5js function that runs every time the mouse is pressed
	if (tamagotchiMode && keyIsPressed === true && key === 'f') { // f
		food.add(createVector(mouseX, mouseY))
		console.log("Piece of food spawned.")
	} else if (tamagotchiMode && keyIsPressed === true && key === 'p') { // p
		poison.add(createVector(mouseX, mouseY))
		console.log("Piece of poison spawned.")
	} else {
		agents.add(new Agent(mouseX, mouseY))
		console.log("Agent spawned.")
	}
}


function keyPressed() {	// P5js function that runs every time a key is pressed
	if (keyCode == CONTROL) {
		debug_mode = !debug_mode
		console.log('Debug mode: '+ debug_mode)
	} else if (keyCode == ALT) {
		tamagotchiMode = !tamagotchiMode
		console.log('Tamagotchi mode: '+ tamagotchiMode)
	}
}


function regenerate(champion) {
	console.log("Spawning a new generation of agents...")
	if (lonRecord < timer) {
		lonRecord = timer	// New longevity record
	}
	nextTimer += timer
	
	// The new generation agents will be all the last generation champion's clones
	for (n = 0; n < initial_pieces.agents; n++) {
		agents.add(champion.clone())
	}
	/* // if we want we could reset all poison/food pieces positions
	console.log("Resetting world");
	food.delete(0, food.length-1);
	poison.delete(0, poison.length-1);
	for (var i = 0; i < foodPieces; i++) {
		food.add(createVector(random(width), random(height)));
	}
	for (var i = 0; i < poisonPieces; i++) {
		poison.add(createVector(random(width), random(height)));
	}
	*/
	genCount += 1
	console.log("Generation: " + genCount)
}