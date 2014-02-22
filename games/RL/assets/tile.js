Game.Tile = function(properties) {
    properties = properties || {};
    // Call the Glyph constructor with our properties
    Game.Glyph.call(this, properties);
    // Set up the properties. We use false by default.
    this._walkable = properties['walkable'] || false;
    this._diggable = properties['diggable'] || false;
    this._blocksLight = (properties['blocksLight'] !== undefined) ?
        properties['blocksLight'] : true;
    this._description = properties['description'] || '';
};
// Make tiles inherit all the functionality from glyphs
Game.Tile.extend(Game.Glyph);

// Standard getters
Game.Tile.prototype.isWalkable = function() {
    return this._walkable;
};
Game.Tile.prototype.isDiggable = function() {
    return this._diggable;
};
Game.Tile.prototype.isBlockingLight = function() {
    return this._blocksLight;
};
Game.Tile.prototype.getDescription = function() {
    return this._description;
};

Game.Tile.nullTile = new Game.Tile({description: '(unknown)'});
Game.Tile.floorTile = new Game.Tile({
    character: '.',
    walkable: true,
    blocksLight: false,
    description: 'A cave floor'
});
Game.Tile.wallTile = new Game.Tile({
    character: '#',
    foreground: 'goldenrod',
    diggable: true,
    description: 'A cave wall'
});
Game.Tile.stairsUpTile = new Game.Tile({
    character: '<',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A stone staircase leading upwards'
});
Game.Tile.stairsDownTile = new Game.Tile({
    character: '>',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A stone staircase leading downwards'
});
Game.Tile.holeToCavernTile = new Game.Tile({
    character: 'O',
    foreground: 'white',
    walkable: true,
    blocksLight: false,
    description: 'A great dark hole in the ground'
});
Game.Tile.waterTile = new Game.Tile({
    character: '~',
    foreground: 'blue',
    walkable: false,
    blocksLight: false,
    description: 'Murky blue water'
});
Game.Tile.shopTile = new Game.Tile({
    character: 'H',
    foreground: 'yellow',
    walkable: true,
    blocksLight: false,
    description: 'A small shop'
});
Game.Tile.solidWall = new Game.Tile({
    character: '#',
    foreground: '#CCCCCC',
    walkable: false,
    diggable: false,
    description: 'A wall used to keep monsters out and goods in'
});
Game.Tile.shopDoor = new Game.Tile({
    character: '+',
    foreground: '#964B00',
    walkable: true,
    diggable: false,
    description: 'A door used to enter and leave the building'
});

// Helper function
Game.getNeighborPositions = function(x, y) {
    var tiles = [];
    // Generate all possible offsets
    for (var dX = -1; dX < 2; dX ++) {
        for (var dY = -1; dY < 2; dY++) {
            // Make sure it isn't the same tile
            if (dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
};