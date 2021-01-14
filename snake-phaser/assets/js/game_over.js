//variable to game over logic
var textEntry;

//Scene Game Over
var Game_Over = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Game_Over() {
        Phaser.Scene.call(this, { key: 'Game_Over' });
    },

    preload: function () {
        // load all the needed resources for the Game Over.
        this.load.image('gameover', './assets/images/gameover.png');
        this.load.image('try_again','./assets/images/try_again.png');
        this.load.image('register_score','./assets/images/register_score.png');
    },


    create: function () {

        //Add background
        this.gameover = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'gameover');

        //Add button for restart game
        this.try_again = this.add.image(80, 360, 'try_again').setInteractive()
            .on('pointerdown', () => this.startGame());   
        
        //Add button for register score
        this.register_score = this.add.image(515, 360, 'register_score').setInteractive()
            .on('pointerdown', () => this.registerScore());     

        //Last Score Info.
        this.add.text(235, 175, "LAST SCORE", { font: "bold 16px sans-serif", fill: "#46c0f9", align: "center" });
        this.add.text(350, 173, score.toString(), { font: "bold 20px sans-serif", fill: "#fff", align: "center" });

        //text indicating the name entry
        this.add.text(150, 200, 'ENTER YOUR NAME:', { font: "bold 16px sans-serif", fill: '#70F81F', align: "center" });

        //Name entry
        textEntry = this.add.text(320, 200, '', { font: "bold 16px sans-serif", fill: "#fff", align: "center" });

        //Name entry logic
        this.input.keyboard.on('keydown', function (event) {

            if (event.keyCode === 8 && textEntry.text.length > 0) {
                textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
            }
            else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
                textEntry.text += event.key;
            }

        });

    },

    //Change a Gama scene
    startGame: function () {
        this.scene.start('Game');
    },

    //This method performs the http request to register the user and the score
    registerScore: function(){
        let data = {
            nickname:textEntry.text,
            score:score
        };

        fetch("http://localhost:8000/api/players/", {
            mode:'no-cors',
            method: "POST", 
            body: JSON.stringify(data)
          }).then(res => {
            console.log("Request complete! response:", res);
          });
        this.scene.start('Menu');
    }

});

