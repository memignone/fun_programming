/*********************************
	L-system - Lindenmayer system
	wiki: https://en.wikipedia.org/wiki/L-system
	******************************/
// Global variables
let angle
const axiom = 'F'
let sentence = axiom
let len = 100
const rules = []
rules[0] = {
	a: 'F',
	b: 'FF+[+F-F-F]-[-F+F+F]'
  }


function generate() {
	len *= 0.5
	let nextSentence = ''
	for (let i = 0; i < sentence.length; i++) {
		const current = sentence.charAt(i)
		let found = false
		for (let j = 0; j < rules.length; j++) {
			if (current === rules[j].a) {
				found = true
				nextSentence += rules[j].b
				break
			}
		}
		if (!found) {
			nextSentence += current
		}
	}
	sentence = nextSentence
	createP(sentence)
	turtle()
}


function turtle() {
	background(0)
	resetMatrix()
	translate(width / 2, height)
	stroke(255, 100)
	for (let i = 0; i < sentence.length; i++) {
		const current = sentence.charAt(i)

		if (current == 'F') {
			line(0, 0, 0, -len)
			translate(0, -len)
		} else if (current == '+') {
			rotate(angle)
		} else if (current == '-') {
			rotate(-angle)
		} else if (current == '[') {
			push()
		} else if (current == ']') {
			pop()
		}
	}
}


function setup() {
	createCanvas(400, 400)
	background(0)
	angle = radians(25)
	createP(axiom)
	turtle()
	const button = createButton('generate')
	button.mousePressed(generate)
}

/*
	Example 1: Algae
	Lindenmayer's original L-system for modelling the growth of algae.

	variables : A B
	constants : none
	axiom  : A
	rules  : (A → AB), (B → A)

const axiom = 'A'
rules[0] = {
	a: 'A',
	b: 'AB'
}
rules[1] = {
	a: 'B',
	b: 'A'
}
*/
/*
	Example 7: Fractal plant

    variables : X F
    constants : + − [ ]
    start  : X
    rules  : (X → F[−X][X]F[−X]+FX), (F → FF)
	angle  : 25°

const axiom = 'X'
rules[0] = {
	a: 'X',
	b: 'F[−X][X]F[−X]+FX'
}
rules[1] = {
	a: 'F',
	b: 'FF'
}

if (current == 'F') {
	line(0, 0, 0, -len)
	translate(0, -len)
} else if (current == "+") {
	rotate(-angle)
} else if (current == "-") {
	rotate(angle)
} else if (current == "[") {
	push()
} else if (current == "]") {
	pop()
}
*/