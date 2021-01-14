//Scene for Menu game
var Menu = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize: function Menu (){
        Phaser.Scene.call(this, { key: 'Menu' });
    },

    preload: function() {
        // Load all the needed resources for the menu.
        this.load.image('menu', './assets/images/menu.png');
    },

    create: function () {
        //add image and button to menu
        this.menu = this.add.image(this.cameras.main.width/2,this.cameras.main.height/2, 'menu').setInteractive()
        .on('pointerdown', () => this.startGame() );   

    },

    startGame: function () {
        // Change the state to the actual game.
        this.scene.start('Game');
    }
})