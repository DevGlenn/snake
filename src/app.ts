import * as PIXI from 'pixi.js';
import { Sninki } from "./Sninki";

const app = new PIXI.Application({backgroundColor: 0x00A78D, width: 640, height: 640}); // Creating a new Pixi Application


document.body.appendChild(app.view); // Creating the app view to play the game in

app.loader.add("Files/Snake_Graphics.json") // add the snake spritesheet to the loader
.load(OnLoaded)


let sninki: Sninki;
function OnLoaded(loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>)
{
    // const Snink = new PIXI.Sprite(app.loader.resources["Files/Snake_Graphics.json"].spritesheet!.textures["Snake_Graphics 0.png"]); 
    // app.stage.addChild(Snink);
    sninki = new Sninki(app, new PIXI.Point(32, 32)); // let the snake start in the top left corner of the world
    app.ticker.add(Update); // set the Update loop

}
function Update(deltaTime: number) // set deltatime as a parameter in the update
{
    sninki.Update(deltaTime); // update snake
}
