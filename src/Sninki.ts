import * as PIXI from 'pixi.js';

export class Sninki // Make sure the other scripts can access this
{
    sninkiBodyParts: PIXI.Sprite[]; // Define Class Variable as Sprites
    app: PIXI.Application;
    sninkiTextureParts: PIXI.Texture[];
    keys: { w: boolean; s: boolean; a: boolean; d: boolean; };
    head: { rotation: number; sprite: PIXI.Sprite; };
    graphics: PIXI.Graphics;
    timer: number;

    constructor(app: PIXI.Application, spawnPos: PIXI.Point) { // allocate everything in here at the start of the game "basically start function"
        this.app = app;

        this.sninkiBodyParts = [];     // Create the Array for the sprites
        this.sninkiTextureParts = [];
        this.LoadTexturesParts();

        this.head = { rotation: 0, sprite: new PIXI.Sprite(this.sninkiTextureParts[1]) }; // set the starting sprite to the "1" sprite in the spritesheet
        this.head.sprite.anchor.set(0.5, 0.5); // set the origin of the head sprite
        this.head.sprite.position.set(spawnPos.x, spawnPos.y) // set the head sprites start position
        this.app.stage.addChild(this.head.sprite); // add the head sprite to the game

        this.AddBodySprite();
        this.AddBodySprite();
        this.AddBodySprite();
        this.AddBodySprite();

        this.graphics = new PIXI.Graphics(); // make sure we can create gizmos
        this.app.stage.addChild(this.graphics); // add the gizmos when we've created them

        this.keys = { w: false, s: false, a: false, d: false }; // get the keys we want to press
        this.timer = 0;

        document.addEventListener('keydown', (e) => {// created a switch case for when you press a key

            switch (e.keyCode) {
                case 65: this.keys.a = true; break;
                case 87: this.keys.w = true; break;
                case 68: this.keys.d = true; break;
                case 83: this.keys.s = true; break;
            }
        })
        document.addEventListener('keyup', (e) => {

            switch (e.keyCode) { // created a switch case for when you release a key
                case 65: this.keys.a = false; break;
                case 87: this.keys.w = false; break;
                case 68: this.keys.d = false; break;
                case 83: this.keys.s = false; break;
            }
        })
    }

    LoadTexturesParts() {
        let sninkiTextures = this.app.loader.resources["Files/Snake_Graphics.json"].spritesheet!.textures // Make sure I dont have to type this every time

        for (const key in sninkiTextures) // create a forin loop to loop through the spritesheet
        {
            if (Object.prototype.hasOwnProperty.call(sninkiTextures, key)) {
                this.sninkiTextureParts.push(sninkiTextures[key]); // make selecting the texture I want easier by putting it in an array

            }
        }
    }

    Update(deltaTime: number) { // creating a update function, basically a ticker
        //#region Controls
        if (this.keys.w == true) { // whenever we press "key" rotate the head if the snake to the corresponding angle
            if (this.head.sprite.angle != 180 - 90) {
                this.head.sprite.angle = 0 - 90;
            }

        }
        if (this.keys.a == true) {
            if (this.head.sprite.angle != 90 - 90) {
                this.head.sprite.angle = -90 - 90;
            }
        }
        if (this.keys.s == true) {
            if (this.head.sprite.angle != 0 - 90) {
                this.head.sprite.angle = 180 - 90;
            }
        }
        if (this.keys.d == true) {
            if (this.head.sprite.angle != -90 - 90) {
                this.head.sprite.angle = 90 - 90;
            }
        }
        //#endregion



        this.timer += deltaTime; // created a timer that works with my deltatime

        if (this.timer >= 50) { // now the snake moves with increments so a grid is simulated
            for (let i = this.sninkiBodyParts.length - 1; i >= 0; i--) { // reverse this for loop
                if (i == 0) {
                    this.sninkiBodyParts[i].position = this.head.sprite.position; // change the position of the body parts according to the heads position
                    this.sninkiBodyParts[i].rotation = this.head.sprite.rotation; // change the rotation of the body parts according to the heads rotation
                }
                else {
                    this.sninkiBodyParts[i].position = this.sninkiBodyParts[i - 1].position;
                    this.sninkiBodyParts[i].rotation = this.sninkiBodyParts[i - 1].rotation;
                }

            }

            let x = Math.cos(this.head.sprite.rotation) // calculate the forward of the head sprite
            let y = Math.sin(this.head.sprite.rotation)
            this.head.sprite.position.x += x * 64; // add the forward to the position
            this.head.sprite.position.y += y * 64;


            for (let j = 0; j < this.sninkiBodyParts.length; j++) {
                if (j == 0) {
                    if (this.head.sprite.position.x == this.sninkiBodyParts[j + 1].position.x || this.head.sprite.position.y == this.sninkiBodyParts[j + 1].position.y) {
                        this.sninkiBodyParts[j].texture = this.sninkiTextureParts[9];
                    }
                    else {
                        this.sninkiBodyParts[j].texture = this.sninkiTextureParts[13];
                    }
                    continue;
                }
                if (j == this.sninkiBodyParts.length - 1) {
                    this.sninkiBodyParts[j].texture = this.sninkiTextureParts[6]; // change the last body part "so the first in the array" to be the tail
                }
                else if (this.sninkiBodyParts[j - 1].position.x == this.sninkiBodyParts[j + 1].position.x || this.sninkiBodyParts[j - 1].position.y == this.sninkiBodyParts[j + 1].position.y) {
                    this.sninkiBodyParts[j].texture = this.sninkiTextureParts[9];
                }
                else {
                    this.sninkiBodyParts[j].texture = this.sninkiTextureParts[13]; // whenever you turn, change the body part after the head to the corresponding turn body part
                }
            }

            this.graphics.clear();
            this.graphics.beginFill(0x008000);
            for (let o = 0; o < this.sninkiBodyParts.length; o++) { 
                this.graphics.drawRect(this.sninkiBodyParts[o].position.x - 32, this.sninkiBodyParts[o].position.y - 32, 64, 64) 
                // draw the body as cubes because this asignment is imposible to wrap your head around if you've never done anything like this
            }
            this.graphics.endFill();

            this.graphics.beginFill(0x006400);
            this.graphics.drawRect(this.head.sprite.position.x - 32, this.head.sprite.position.y - 32, 64, 64) // draw the head as a cube, same reason
            this.graphics.endFill();
            this.timer = 0; // reset the timer
        }
    }
    AddBodySprite() {

        let body = new PIXI.Sprite(this.sninkiTextureParts[9]) // create the body part sprite
        this.app.stage.addChild(body); // add the body to the game
        this.sninkiBodyParts.push(body); // push the body to the array
        body.anchor.set(0.5)
        body.position.set(1000, 1000)
    }

    Lerp(startLerp: number, endLerp: number, interpolate: number) { // never used but I wanted to be cool and let it stay here anyway
        return interpolate * (endLerp - startLerp) + startLerp;
    }
}