function Vehicle(x, y) {
	this.position = createVector(random(width), random(height))
	this.target = createVector(x, y)
	this.velocity = p5.Vector.random2D()
	this.acceleration = createVector()
	this.size = 8
	this.maxspeed = 10
	this.maxforce = 1
}

Vehicle.prototype.behaviors = function() {
	const arrive = this.arrive(this.target)
	const mouse = createVector(mouseX, mouseY)
	const flee = this.flee(mouse)

	arrive.mult(1)
	flee.mult(5)

	this.applyForce(arrive, flee)
}

Vehicle.prototype.applyForce = function(...forces) {
	forces.map(force => {
		this.acceleration.add(force)
	})
}

Vehicle.prototype.update = function() {
	this.position.add(this.velocity)
	this.velocity.add(this.acceleration)
	this.acceleration.mult(0)
}

Vehicle.prototype.show = function() {
	stroke(255)
	strokeWeight(this.size)
	fill(255,153,51)
	point(this.position.x, this.position.y)
}

Vehicle.prototype.arrive = function(target) {
	const desired = p5.Vector.sub(target, this.position)
	const distance = desired.mag()
	let speed = this.maxspeed
	if (distance < 100) {
		speed = map(distance, 0, 100, 0, this.maxspeed)
	}
	desired.setMag(speed)
	const steer = p5.Vector.sub(desired, this.velocity)
	steer.limit(this.maxforce)
	return steer
}

Vehicle.prototype.flee = function(target) {
	const desired = p5.Vector.sub(target, this.position)
	const distance = desired.mag()
	if (distance < 50) {
		desired.setMag(this.maxspeed)
		desired.mult(-1)
		const steer = p5.Vector.sub(desired, this.velocity)
		steer.limit(this.maxforce)
		return steer
	} else {
		return createVector(0, 0)
	}
}