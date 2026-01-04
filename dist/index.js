import { CanvasGameEngine } from "./engine/CanvasGameEngine.js";
import { Mesh } from "./engine/Mesh.js";
import handleError from "./helpers/handleError.js";
import { objFiles } from "./objFiles.js";
const WIDTH = 1200;
const HEIGHT = 1024;
const canvasContainer = document.getElementById("canvas_container");
if (!canvasContainer) {
    handleError("Unable to find the canvas_container");
}
const numberOfCanvases = 1;
const canvasEngines = [];
for (let i = 0; i < numberOfCanvases; i++) {
    const newCanvas = document.createElement("canvas");
    newCanvas.width = WIDTH;
    newCanvas.height = HEIGHT;
    newCanvas.id = `canvas_${i}`;
    canvasContainer.appendChild(newCanvas);
    canvasEngines.push(new CanvasGameEngine(newCanvas));
}
const selectedObject = objFiles.triangle_Chicken;
let animated = true;
fetch(selectedObject.filepath)
    .then(objFile => objFile.text())
    .then(objFile => {
    // console.log(objFile);
    const mesh = Mesh.from(objFile);
    console.log(mesh);
    canvasEngines[0].setMesh(mesh);
    let frameNumber = 1;
    const renderFrame = () => {
        for (const canvasEngine of canvasEngines) {
            canvasEngine.onUserUpdate(frameNumber);
        }
        frameNumber++;
        window.requestAnimationFrame(renderFrame);
    };
    window.requestAnimationFrame(renderFrame);
});
