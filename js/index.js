var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    parent: 'game',
    scene: {
        preload: preload,
        create: create
    },
    physics: {
        default: "matter",
        matter: {
            // debug: true
        }
    }
};

let ItIs = 0;

const what = [
    { name: 'crate', x: 200, y: 50 },
    { name: 'banana', x: 250, y: 250 },
    { name: 'orange', x: 360, y: 50 },
    { name: 'cherries', x: 400, y: 250},
    { name: 'lipisin', x: 300, y: 50}
]

var game = new Phaser.Game(config);

function preload() {
    this.load.atlas('sheet', 'assets/fruit-sprites.png', 'assets/fruit-sprites.json');
    this.load.json('shapes', 'assets/fruit-shapes.json');
}

function create() {
    var shapes = this.cache.json.get('shapes');

    this.matter.world.setBounds(0, 0, game.config.width, game.config.height);
    this.add.image(0, 0, 'sheet', 'background').setOrigin(0, 0);

    var ground = this.matter.add.sprite(0, 0, 'sheet', 'ground', {shape: shapes.ground});
    ground.setPosition(0 + ground.centerOfMass.x, 0+ground.centerOfMass.y);  
    
    for( i = 0; i < what.length; i++) {
        setupNewObjct( what[i].x, what[i].y, i, this.matter )
    }
 
    function setupNewObjct( x, y,  i, here ) {
        let myObj = here.add.sprite( x, y, 'sheet', what[i].name, {shape: shapes[what[i].name]});
        myObj.setInteractive();
        myObj.on('clicked', clickHandler, this);
    }

    this.input.on('pointerup', function (pointer) {
        setupNewObjct( pointer.x, pointer.y, ItIs, this.matter )
        ItIs = ++ItIs < what.length ? ItIs++ : 0
    }, this);

    this.input.on('gameobjectup', function (pointer, gameObject)
    {
         gameObject.emit('clicked', gameObject);
    }, this);

    function clickHandler (myObj)
    {
        myObj.off('clicked', clickHandler);
        myObj.input.enabled = false;
        myObj.setVisible(false);
    }
}
