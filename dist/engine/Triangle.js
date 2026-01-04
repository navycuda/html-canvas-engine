import { Vec3D } from "./Vec3D.js";
import { CONSTANTS } from "./CanvasGameEngine.js";
export class Triangle {
    p;
    colour;
    constructor(p) {
        this.p = p ?? [new Vec3D(), new Vec3D(), new Vec3D()];
        this.colour = CONSTANTS.COLOURS.BACKGROUND;
    }
    clone() {
        const newTriangle = new Triangle();
        newTriangle.p = this.p.map(v => new Vec3D(v));
        return newTriangle;
    }
    averageZ() {
        let sum = 0;
        for (const { z } of this.p) {
            sum += z;
        }
        return sum / 3;
    }
}
