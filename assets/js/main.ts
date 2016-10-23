let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let stage: Stage;
let player: Player;
let enemy: Player;
let ball: Ball;
let controls: Controls;
let keys: Array<number> = [];
let playerScore: Score;
let enemyScore: Score;

// create game objects
function update() {

	requestAnimationFrame(update);

	// draw objects
	stage.draw();
	player.draw();
	enemy.draw();
	ball.draw();
	ball.accelerate();
	controls.transition();
	playerScore.draw();
	enemyScore.draw();

}

class Stage {

	private width: number = 0;
	private height: number = 0;

	constructor(width: number, height: number) {

		this.width = width;
		this.height = height;

	}

	public draw = (): void => {

		ctx.fillStyle = 'black';
		canvas.width = this.width;
		canvas.height = this.height;
		document.body.appendChild(canvas);

	};

	get windowWidth() {

		return this.width;

	}

	get windowHeight() {

		return this.height;

	}

}

class Player {

	public width: number = 0;
	public height: number = 0;
	private x: number = 0;
	private y: number = 0;
	private speed = 10;

	constructor(width: number, height: number, x: number, y: number) {

		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;

	}

	public draw = (): void => {

		ctx.save();

		ctx.fillStyle = 'black';
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.restore();

	};

	private collision = (y: number, direction: number): boolean => {

		if (y - this.speed * direction < 0) {

			return false;

		}

		if (y + this.height - this.speed * direction > stage.windowHeight) {

			return false;

		}

	};

	get xPos() {
		return this.x;
	}

	get yPos() {
		return this.y;
	}

	set yPos(y: number) {

		if (this.collision(this.y, y) !== false) {

			this.y = this.y - (this.speed * y);

		}

	}

}

class Ball {

	private width: number = 0;
	private height: number = 0;
	private x: number = 0;
	private y: number = 0;
	private speed: number = 10;
	private direction: Object = {x: 0, y: 0};

	constructor(width: number, height: number, x: number, y: number) {

		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;

	}

	public draw = (): void => {

		ctx.save();

		ctx.fillStyle = 'black';
		ctx.translate(-this.width / 2, -this.height / 2);
		ctx.fillRect(this.x, this.y, this.width, this.height);

		ctx.restore();

	};

	public start = (): void => {

		this.speed = 0;
		setTimeout(() => this.speed = 10, 1000);

		this.direction['x'] = Math.floor(Math.random() * 2) === 1 ? 1 : -1;
		this.direction['y'] = Math.floor(Math.random() * 2) === 1 ? 1 : -1;

	};

	public accelerate = (): void => {

		this.yPos = this.yPos + this.direction['y'] * this.speed;
		this.xPos = this.xPos + this.direction['x'] * this.speed;

		if (this.collisionBoundaries() === true) {

			this.bounce('y');

		}

		if (this.collisionPlayer() === true) {

			this.bounce('x');

		}

	};

	private bounce = (direction: string): void => {

		this.direction[direction] = this.direction[direction] * -1;

	};

	private collisionBoundaries = (): boolean => {

		if (this.y - this.speed < 0) {

			return true;

		}

		if (this.y + this.speed > stage.windowHeight) {

			return true;

		}

		if (this.x + this.speed < 0) {

			enemyScore.addScore();
			this.reset();

		}

		if (this.x + this.speed > stage.windowWidth) {

			playerScore.addScore();
			this.reset();

		}

	};

	private collisionPlayer = (): boolean => {

		if (this.x - this.speed > player.xPos &&
			this.x - this.speed <= player.xPos + player.width &&
			this.y >= player.yPos &&
			this.y <= player.yPos + player.height) {

			return true;

		}

		if (this.x + this.speed > enemy.xPos &&
			this.x + this.speed <= enemy.xPos + enemy.width &&
			this.y >= enemy.yPos &&
			this.y <= enemy.yPos + enemy.height) {

			return true;

		}

	};

	private reset = (): void => {

		this.x = stage.windowWidth / 2;
		this.y = stage.windowHeight / 2;
		this.start();

	};

	get xPos() {

		return this.x;

	}

	set xPos(x: number) {

		this.x = x;

	}

	get yPos() {

		return this.y;

	}

	set yPos(y: number) {

		this.y = y;

	}

}

class Controls {

	public transition = (): void => {

		if (keys.indexOf(87) !== -1) {
			player.yPos = 1;
		}
		if (keys.indexOf(83) !== -1) {
			player.yPos = -1;
		}
		if (keys.indexOf(38) !== -1) {
			enemy.yPos = 1;
		}
		if (keys.indexOf(40) !== -1) {
			enemy.yPos = -1;
		}

	}

}

class Score {

	public score: number = 0;
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public addScore = (): void => {

		this.score++;

	};

	public draw = (): void => {

		ctx.save();

		ctx.font = '48px sans-serif';
		ctx.fillStyle = 'black';
		ctx.fillText(String(this.score), this.x, this.y);

		ctx.restore();

	};

}

window.onload = () => {

	canvas = document.createElement('canvas');
	ctx = canvas.getContext('2d');

	stage = new Stage(window.innerWidth, window.innerHeight);
	player = new Player(20, 200, stage.windowWidth * 0.1, stage.windowHeight / 2);
	enemy = new Player(20, 200, stage.windowWidth * (1 - 0.1), stage.windowHeight / 2);
	ball = new Ball(20, 20, stage.windowWidth / 2, stage.windowHeight / 2);
	controls = new Controls();
	playerScore = new Score(stage.windowWidth * 0.3, stage.windowHeight * 0.1);
	enemyScore = new Score(stage.windowWidth * (1 - 0.3), stage.windowHeight * 0.1);

	// bind events

	window.addEventListener('keydown', function (e) {

		if (keys.indexOf(e.keyCode) === -1) {

			keys.push(e.keyCode);

		}
	});

	window.addEventListener('keyup', function (e) {

		keys.splice(keys.indexOf(e.keyCode), 1);

	});

	ball.start();
	update();
};
