//variable to game logic
var snake, apple, apple_red, block, squareSize, score, speed,
    updateDelay, direction, new_direction,
    addNew, decline, addApple_red, addBlock, cursors, scoreTextValue, speedTextValue, textStyle_Key, textStyle_Value;

//Scene Game
var Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:function Game() {
            Phaser.Scene.call(this, { key: 'Game' });
    },

    preload: function () {
        //load all the needed resources for the game.
        this.load.image('snake', './assets/images/snake.png');
        this.load.image('apple', './assets/images/apple-green.png');
        this.load.image('apple_red', './assets/images/apple.png');
        this.load.image('block', './assets/images/block.png');
        this.load.image('game', './assets/images/game.png');
    },

    create: function () {

        //initialization of variables
        snake = [];                     // containing the parts of our snake
        apple = {};                     // An object for the apple green
        apple_red = [];                 // An array for the apple red
        block = [];                     // An array for blocks
        squareSize = 15;                // The length of a side of the squares. Our image is 15x15 pixels.
        score = 0;                      // Game score.
        speed = 0;                      // Game speed.
        updateDelay = 0;                // A variable for control over update rates.
        direction = 'right';            // The direction of our snake.
        new_direction = null;           // A buffer to store the new direction into.
        addNew = false;                 // A variable used when an apple green has been eaten.
        decline = false;                // A variable used when an apple red has been eaten.
        addApple_red = -1;              // variable used as a flag for decline score
        addBlock = -1;                  // variable used as a flag for add new block

        // Set up a Phaser controller for keyboard input.
        cursors = this.input.keyboard.createCursorKeys();

        //Set background image
        this.game = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'game')

        // Generate the initial snake stack. Our snake will be 3 elements long.
        for (var i = 0; i < 3; i++) {
            snake[i] = this.add.sprite(150 + i * squareSize + 7.5, 150 + 7.5, 'snake');  // Parameters are (X coordinate, Y coordinate, image)
        }

        // Genereate the first apple green.
        this.generateApple();

        // Add Text to top of game.
        textStyle_Key = { font: "bold 14px sans-serif", fill: "#70F81F", align: "center" };
        textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };

        // Score.
        this.add.text(30, 10, "SCORE", textStyle_Key);
        scoreTextValue = this.add.text(90, 8, score.toString(), textStyle_Value);

        // Speed.
        this.add.text(500, 10, "SPEED", textStyle_Key);
        speedTextValue = this.add.text(558, 8, speed.toString(), textStyle_Value);

    },

    update: function () {

        // Handle arrow key presses, while not allowing illegal direction changes that will kill the player.
        if (cursors.right.isDown && direction != 'left') {
            new_direction = 'right';
        }
        else if (cursors.left.isDown && direction != 'right') {
            new_direction = 'left';
        }
        else if (cursors.up.isDown && direction != 'down') {
            new_direction = 'up';
        }
        else if (cursors.down.isDown && direction != 'up') {
            new_direction = 'down';
        }

        // A formula to calculate game speed based on the score.
        // The higher the score, the higher the game speed, with a maximum of 10;
        speed = Math.min(10, Math.floor(score / 5));

        // Update speed value on game screen.
        speedTextValue.text = '' + speed;

        // Since the update function of Phaser has an update rate of around 60 FPS,
        // we need to slow that down make the game playable.

        // Increase a counter on every update call.
        updateDelay++;

        // Do game stuff only if the counter is aliquot to (10 - the game speed).
        // The higher the speed, the more frequently this is fulfilled,
        // making the snake move faster.
        if (updateDelay % (10 - speed) == 0) {
            // Snake movement
            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(),
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;

            // If a new direction has been chosen from the keyboard, make it the direction of the snake now.
            if (new_direction) {
                direction = new_direction;
                new_direction = null;
            }

            // Change the last cell's coordinates relative to the head of the snake, according to the direction.
            if (direction == 'right') {

                lastCell.x = firstCell.x + 15;
                lastCell.y = firstCell.y;
            }
            else if (direction == 'left') {
                lastCell.x = firstCell.x - 15;
                lastCell.y = firstCell.y;
            }
            else if (direction == 'up') {
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 15;
            }
            else if (direction == 'down') {
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 15;
            }

            // Place the last cell in the front of the stack.
            // Mark it as the first cell.
            snake.push(lastCell);
            firstCell = lastCell;

            // Increase length of snake if an apple had been eaten.
            // Create a block in the back of the snake with the old position of the previous last block (it has moved now along with the rest of the snake).
            if (addNew) {
                snake.unshift(this.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }

            // Generate apple red when score is multiple of five
            if (score % 5 == 0 && score > 0 && score != addApple_red) {
                this.generateAppleRed();
                addApple_red = score;
            }

            // Generate block when score is multiple of 10
            if (score % 10 == 0 && score > 0 && score != addBlock) {
                this.generateBlock();
                addBlock = score;
            }

            // Check for block collision. Parameter is the head of the snake.
            this.blockCollision(firstCell);

            // Check for apple green collision. Parameter is the head of the snake.
            this.appleCollision(firstCell);

            // Check for apple red collision. Parameter is the head of the snake.
            this.appleRedCollision(firstCell);

            // Check for collision with self. Parameter is the head of the snake.
            this.selfCollision(firstCell);

            // Check with collision with wall. Parameter is the head of the snake.
            this.wallCollision(firstCell);
        }


    },

    generateApple: function () {
    
        var stop = false;

        // Search for a valid position on the grid
        while (!stop) {
            var randomX = Math.floor(Math.random() * 39) * squareSize,
                randomY = Math.floor(Math.random() * 29) * squareSize;

            if ((randomX + 7.5 + 15) < 585 && (randomY + 7.5 + 45) < 435 && this.positionTrue("apple", randomX + 7.5 + 15, randomY + 7.5 + 45)) {
                apple = this.add.sprite(randomX + 7.5 + 15, randomY + 7.5 + 45, 'apple'); // Add a new apple red.
                stop = true;
            }
        }

    },

    generateAppleRed: function () {

        var stop = false;

        // Search for a valid position on the grid
        while (!stop) {
            var randomX = Math.floor(Math.random() * 39) * squareSize,
                randomY = Math.floor(Math.random() * 29) * squareSize;

            if ((randomX + 7.5 + 15) < 585 && (randomY + 7.5 + 45) < 435 && this.positionTrue("apple_red", randomX + 7.5 + 15, randomY + 7.5 + 45)) {
                apple_red.unshift(this.add.sprite(randomX + 7.5 + 15, randomY + 7.5 + 45, 'apple_red')); // Add a new apple green.
                stop = true;
            }
        }

    },

    generateBlock: function () {

        var stop = false;

        // Search for a valid position on the grid
        while (!stop) {
            var randomX = Math.floor(Math.random() * 39) * squareSize,
                randomY = Math.floor(Math.random() * 29) * squareSize;

            if ((randomX + 30) < 585 && (randomY + 60) < 435 && this.positionTrue("block", randomX + 30, randomY + 60)) {
                block.unshift(this.add.sprite(randomX + 30, randomY + 60, 'block')); // Add a new block
                stop = true;
            }
        }

    },

    // This method validates if the position of the new object is valid and it is not over an existing one
    positionTrue: function (objectType, x, y) {

        if (objectType == "apple") {
            apple_red.forEach(function (element) {
                if (element.x == x && element.y == y) {
                    return false;
                }
            })
            snake.forEach(function (element) {
                if (element.x == x && element.y == y) {
                    return false;
                }
            })
            block.forEach(function (element) {

                if ((x == element.x - 7.5 && y == element.y - 7.5)
                    || (x == element.x - 7.5 && y == element.y - 7.5)
                    || (x == element.x + 7.5 && y == element.y - 7.5)
                    || (x == element.x - 7.5 && y == element.y + 7.5)
                    || (x == element.x + 7.5 && y == element.y + 7.5)) {

                    return false;
                }

            })
            return true;
        }

        if (objectType == "apple_red") {
            if (apple.x == x && apple.y == y) {
                return false;
            }
            snake.forEach(function (element) {
                if (element.x == x && element.y == y) {
                    return false;
                }
            })
            block.forEach(function (element) {

                if ((x == element.x - 7.5 && y == element.y - 7.5)
                    || (x == element.x - 7.5 && y == element.y - 7.5)
                    || (x == element.x + 7.5 && y == element.y - 7.5)
                    || (x == element.x - 7.5 && y == element.y + 7.5)
                    || (x == element.x + 7.5 && y == element.y + 7.5)) {

                    return false;
                }

            })
            return true;
        }

        if (objectType == "block") {

            if ((apple.x == x - 7.5 && apple.y == y - 7.5)
                || (apple.x == x - 7.5 && apple.y == y - 7.5)
                || (apple.x == x + 7.5 && apple.y == y - 7.5)
                || (apple.x == x - 7.5 && apple.y == y + 7.5)
                || (apple.x == x + 7.5 && apple.y == y + 7.5)) {

                return false;
            }

            apple_red.forEach(function (element) {

                if ((x == element.x - 7.5 && y == element.y - 7.5)
                    || (x == element.x - 7.5 && y == element.y - 7.5)
                    || (x == element.x + 7.5 && y == element.y - 7.5)
                    || (x == element.x - 7.5 && y == element.y + 7.5)
                    || (x == element.x + 7.5 && y == element.y + 7.5)) {

                    return false;
                }

            })

            snake.forEach(function (element) {

                if ((x == element.x - 7.5 && y == element.y - 7.5)
                    || (x == element.x - 7.5 && y == element.y - 7.5)
                    || (x == element.x + 7.5 && y == element.y - 7.5)
                    || (x == element.x - 7.5 && y == element.y + 7.5)
                    || (x == element.x + 7.5 && y == element.y + 7.5)) {

                    return false;
                }

            })

            return true;
        }
    },

    appleCollision: function (head) {

        // Check if head of the snake is overlapping the apple green.
        if (head.x == apple.x && head.y == apple.y) {

            // Next time the snake moves, a new block will be added to its length.
            addNew = true;

            // Destroy the old apple.
            apple.destroy();

            // Make a new one.
            this.generateApple();

            // Increase score.
            score ++;

            // Refresh scoreboard.
            scoreTextValue.text = score.toString();
        }

    },

    appleRedCollision: function (head) {

        // Check if head of the snake is overlapping the apple red.
        apple_red.forEach(function (element, i) {

            if (element.x == head.x && element.y == head.y) {

                //Destroy apple red
                apple_red[i].destroy();
                apple_red.splice(i, 1);

                //subtract score
                score = score - 2;

                //Destroy two snake block
                snake.shift().destroy();
                snake.shift().destroy();

                // Refresh scoreboard.
                scoreTextValue.text = score.toString();

            }

        }, this)

    },

    blockCollision: function (head) {
        // Check if head of the snake is overlapping the block
        block.forEach(function (element) {
            if (head.x >= (element.x - 15) && head.x <= (element.x + 15)) {
                if (head.y >= (element.y - 15) && head.y <= (element.y + 15)) {
                    // If so, go to game over screen.
                    this.scene.start('Game_Over');
                }
            }
        }, this)
    },

    selfCollision: function (head) {

        // Check if head of the snake overlaps with any part of the snake.
        for (var i = 0; i < snake.length - 1; i++) {
            if (head.x == snake[i].x && head.y == snake[i].y) {
                // If so, go to game over screen.
                this.scene.start('Game_Over');
            }
        }

    },

    wallCollision: function (head) {

        // Check if the head of the snake is in the boundaries of the game field.
        if (head.x >= 585 || head.x < 15 || head.y >= 435 || head.y < 45) {
            // If it's not in, we've hit a wall. Go to game over screen.
            this.scene.start('Game_Over');
        }

    }

});