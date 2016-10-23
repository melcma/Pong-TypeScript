/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var canvas;
	var ctx;
	var stage;
	var player;
	var enemy;
	var ball;
	var controls;
	var keys = [];
	var playerScore;
	var enemyScore;
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
	var Stage = (function () {
	    function Stage(width, height) {
	        var _this = this;
	        this.width = 0;
	        this.height = 0;
	        this.draw = function () {
	            ctx.fillStyle = 'black';
	            canvas.width = _this.width;
	            canvas.height = _this.height;
	            document.body.appendChild(canvas);
	        };
	        this.width = width;
	        this.height = height;
	    }
	    Object.defineProperty(Stage.prototype, "windowWidth", {
	        get: function () {
	            return this.width;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Stage.prototype, "windowHeight", {
	        get: function () {
	            return this.height;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Stage;
	}());
	var Player = (function () {
	    function Player(width, height, x, y) {
	        var _this = this;
	        this.width = 0;
	        this.height = 0;
	        this.x = 0;
	        this.y = 0;
	        this.speed = 10;
	        this.draw = function () {
	            ctx.save();
	            ctx.fillStyle = 'black';
	            ctx.fillRect(_this.x, _this.y, _this.width, _this.height);
	            ctx.restore();
	        };
	        this.collision = function (y, direction) {
	            if (y - _this.speed * direction < 0) {
	                return false;
	            }
	            if (y + _this.height - _this.speed * direction > stage.windowHeight) {
	                return false;
	            }
	        };
	        this.width = width;
	        this.height = height;
	        this.x = x;
	        this.y = y;
	    }
	    Object.defineProperty(Player.prototype, "xPos", {
	        get: function () {
	            return this.x;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Player.prototype, "yPos", {
	        get: function () {
	            return this.y;
	        },
	        set: function (y) {
	            if (this.collision(this.y, y) !== false) {
	                this.y = this.y - (this.speed * y);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Player;
	}());
	var Ball = (function () {
	    function Ball(width, height, x, y) {
	        var _this = this;
	        this.width = 0;
	        this.height = 0;
	        this.x = 0;
	        this.y = 0;
	        this.speed = 10;
	        this.direction = { x: 0, y: 0 };
	        this.draw = function () {
	            ctx.save();
	            ctx.fillStyle = 'black';
	            ctx.translate(-_this.width / 2, -_this.height / 2);
	            ctx.fillRect(_this.x, _this.y, _this.width, _this.height);
	            ctx.restore();
	        };
	        this.start = function () {
	            _this.speed = 0;
	            setTimeout(function () { return _this.speed = 10; }, 1000);
	            _this.direction['x'] = Math.floor(Math.random() * 2) === 1 ? 1 : -1;
	            _this.direction['y'] = Math.floor(Math.random() * 2) === 1 ? 1 : -1;
	        };
	        this.accelerate = function () {
	            _this.yPos = _this.yPos + _this.direction['y'] * _this.speed;
	            _this.xPos = _this.xPos + _this.direction['x'] * _this.speed;
	            if (_this.collisionBoundaries() === true) {
	                _this.bounce('y');
	            }
	            if (_this.collisionPlayer() === true) {
	                _this.bounce('x');
	            }
	        };
	        this.bounce = function (direction) {
	            _this.direction[direction] = _this.direction[direction] * -1;
	        };
	        this.collisionBoundaries = function () {
	            if (_this.y - _this.speed < 0) {
	                return true;
	            }
	            if (_this.y + _this.speed > stage.windowHeight) {
	                return true;
	            }
	            if (_this.x + _this.speed < 0) {
	                enemyScore.addScore();
	                _this.reset();
	            }
	            if (_this.x + _this.speed > stage.windowWidth) {
	                playerScore.addScore();
	                _this.reset();
	            }
	        };
	        this.collisionPlayer = function () {
	            if (_this.x - _this.speed > player.xPos &&
	                _this.x - _this.speed <= player.xPos + player.width &&
	                _this.y >= player.yPos &&
	                _this.y <= player.yPos + player.height) {
	                return true;
	            }
	            if (_this.x + _this.speed > enemy.xPos &&
	                _this.x + _this.speed <= enemy.xPos + enemy.width &&
	                _this.y >= enemy.yPos &&
	                _this.y <= enemy.yPos + enemy.height) {
	                return true;
	            }
	        };
	        this.reset = function () {
	            _this.x = stage.windowWidth / 2;
	            _this.y = stage.windowHeight / 2;
	            _this.start();
	        };
	        this.width = width;
	        this.height = height;
	        this.x = x;
	        this.y = y;
	    }
	    Object.defineProperty(Ball.prototype, "xPos", {
	        get: function () {
	            return this.x;
	        },
	        set: function (x) {
	            this.x = x;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Ball.prototype, "yPos", {
	        get: function () {
	            return this.y;
	        },
	        set: function (y) {
	            this.y = y;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Ball;
	}());
	var Controls = (function () {
	    function Controls() {
	        this.transition = function () {
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
	        };
	    }
	    return Controls;
	}());
	var Score = (function () {
	    function Score(x, y) {
	        var _this = this;
	        this.score = 0;
	        this.addScore = function () {
	            _this.score++;
	        };
	        this.draw = function () {
	            ctx.save();
	            ctx.font = '48px sans-serif';
	            ctx.fillStyle = 'black';
	            ctx.fillText(String(_this.score), _this.x, _this.y);
	            ctx.restore();
	        };
	        this.x = x;
	        this.y = y;
	    }
	    return Score;
	}());
	window.onload = function () {
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


/***/ }
/******/ ]);