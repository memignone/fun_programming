// CONSTANTS
const MUTATION_RATE = 0.1	// Arbitrary mutation rate.
const CANVAS_LIMIT = 25	// Boundaries limit within the canvas borders


// Autonomous agent that looks for food in order to live on
class Agent {
	constructor(pos_x, pos_y, dna) {
		this.acceleration = createVector(0, 0)
		this.dna = {}
		this.health = 1.0	// Health range: [0, 1]
		this.maxspeed = 5
		this.maxforce = 0.5
		this.position = createVector(pos_x, pos_y)
		this.size = 4
		this.velocity = createVector(random(-2, 2), random(-2, 2))
		
		// DNA initialization
		if (!dna) { // If no DNA object is passed as an argument, make one randomly
			this.dna.food_attraction = random(-2, 2)
			this.dna.poison_attraction = random(-2, 2)
			this.dna.food_perception = random(10, 100)
			this.dna.poison_perception = random(10, 100)
		} else {
			this.dna = dna	// Just cloning
		
			if (random(1) < MUTATION_RATE) {	// Mutation
				// Adjust steering force weights
				this.dna.food_attraction += random(-0.2, 0.2)
				this.dna.poison_attraction += random(-0.2, 0.2)

				// Adjust perception radius
				// Constrain the result to prevent the value goind below 0 or over 100
				this.dna.food_perception = constrain(this.dna.food_perception + random(-10, 10), 0, 100)
				this.dna.poison_perception = constrain(this.dna.poison_perception + random(-10, 10), 0, 100)
			}
		}
	}

	applyBehaviours(good, bad) {	// Handler of multiple behaviours
		const steerG = this.eat(good, 0.06, this.dna.food_perception)	// food, healt increment
		const steerB = this.eat(bad, -0.5, this.dna.poison_perception)	// poison, healt decrement
	
		// Weightning forces based on vehicle's DNA
		steerG.mult(this.dna.food_attraction)
		steerB.mult(this.dna.poison_attraction)
	
		this.applyForce(steerG, steerB)
	}

	applyForce(...forces) {	// Modify agent's acceleration for every steering force
		// We could add MASS here, since: acceleration = mass * force
		forces.map(force => this.acceleration.add(force))
	}

	boundaries() {
		let desired
	
		if (this.position.x < CANVAS_LIMIT) {
			desired = createVector(this.maxspeed, this.velocity.y)
		} else if (this.position.x > width - CANVAS_LIMIT) {
			desired = createVector(-this.maxspeed, this.velocity.y)
		}
		if (this.position.y < CANVAS_LIMIT) {
			desired = createVector(this.velocity.x, this.maxspeed)
		} else if (this.position.y > height - CANVAS_LIMIT) {
			desired = createVector(this.velocity.x, -this.maxspeed)
		}
		
		if (desired) {
			desired.normalize()
			desired.mult(this.maxspeed)
			const steer = p5.Vector.sub(desired, this.velocity)
			steer.limit(this.maxforce)
			this.applyForce(steer)
		}
	}

	clone() {	// Clones the agent
		return new Agent(random(width), random(height), this.dna)
	}

	eat(eatable, h_delta, perception) {	// h_delta is amount the health increments/decrements
		let minimum_distance = Infinity	// Let's start with a huge minimum_distance number
		let closest
		eatable.forEach(piece => {
			const distance = p5.Vector.dist(piece, this.position)	// going through all the food pieces finding our which one is the closest one
			// if an agent stumbles upon food or poison even by chance or because it's cheasing it, he's gonna eat that piece
			if (distance < this.maxspeed) {	// I use maxspeed correspondent value to prevent agent "jumping" the food/poison piece
				eatable.delete(piece)
				this.health += h_delta
			} else if (distance < minimum_distance && distance < perception) {	// this is going to be true only if distance is also within my agent's perception of Food/Poison
				minimum_distance = distance	// The new minimum_distance
				closest = piece		// The closest item form the set is now this piece of food
			}	
		})
		if (closest) {
			return this.seek(closest)
		}
		return createVector(0, 0)
	}

	is_dead() {	// Determines if an agent is dead
		return (this.health < 0)
	}

	reproduce() {	// Spawns a new agent based on the parent's DNA
		// Chaches for an agent to reproduce itself are determined by probability and health status
		if (random(1) < 0.001 && this.health > 0.5) {
			return new Agent(this.position.x, this.position.y, this.dna)
		}
	}

	seek(target) {	// A method that calculates a steering force towards a target
		const desired = p5.Vector.sub(target, this.position)	// A vector pointing from this object's position to the target
		desired.setMag(this.maxspeed)	// Scale to maximum speed
		const steer = p5.Vector.sub(desired, this.velocity)	// Steering = Desired minus velocity
		steer.limit(this.maxforce)	// Limit to maximum steering force
		return steer
	}

	show(show_debug_info) {	// Draws a triangle rotated in the direction of velocity
		const angle = this.velocity.heading() + HALF_PI	// https://p5js.org/reference/#/p5.Vector/heading

		// Color based on health
		const colour = lerpColor(color('red'), color('green'), this.health)	// https://p5js.org/reference/#/p5/lerpColor
		const alphy = lerp(50, 100, this.health)	// https://p5js.org/reference/#/p5/lerp

		fill(colour)
		noStroke()
		strokeWeight(1)
		push()
		translate(this.position.x, this.position.y)
		rotate(angle)
		beginShape()
		vertex(0, -this.size * 2)
		vertex(-this.size, this.size * 2)
		vertex(this.size, this.size * 2)
		endShape(CLOSE)
		if (show_debug_info) {	// Draws the lines and circles to see the DNA of the agent
			noFill()
			strokeWeight(4)
			stroke(0, 255, 0, alphy)
			line(0, 0, 0, -this.dna.food_attraction * 15)	// visulaizing FOOD Steer force for this vehicle
			ellipse(0, 0, this.dna.food_perception * 2)		// visulaizing FOOD perception range
			strokeWeight(2)
			stroke(255, 0, 0, alphy)
			line(0, 0, 0, -this.dna.poison_attraction * 15)		// visulaizing POISON Steer force for this vehicle
			ellipse(0, 0, this.dna.poison_perception * 2)	// visulaizing POISON perception range
		}
		pop()
	}

	update() {	// Method to update agent's location		
		this.velocity.add(this.acceleration)	// Update velocity
		this.velocity.limit(this.maxspeed)	// Limit speed
		this.position.add(this.velocity)
		this.acceleration.mult(0)	// Reset acceleration to 0 each cycle
		this.health -= 0.002	// Slowly die unless you eat
	}
}