//configuration for game
var config = {
    type: Phaser.AUTO,  //Detected auto Phaser.WEBGL, Phaser.CANVAS or Phaser.HEADLESS
    width: 600,
    height: 450,
    dom: {
        createContainer: true
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [ Menu, Game, Game_Over] //scenes of game
};

var game = new Phaser.Game(config);//game instance

game.scene.start('Menu');//Set scene 'Menu' 
