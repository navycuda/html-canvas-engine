import { Vec3D } from "./Vec3D.js";
import { CONSTANTS } from "./CanvasGameEngine.js";

export namespace Triangle{
  export type Colour = `#${string}`;
  export type Vec3Ds = [ Vec3D, Vec3D, Vec3D ];
}
export class Triangle{
  p: Triangle.Vec3Ds;
  colour: Triangle.Colour;

  constructor();
  constructor(points?:Triangle.Vec3Ds)
  constructor(p?:Triangle.Vec3Ds){
    this.p = p ?? [ new Vec3D(), new Vec3D(), new Vec3D() ];
    this.colour = CONSTANTS.COLOURS.BACKGROUND;
  }

  clone():Triangle{
    const newTriangle = new Triangle();
    newTriangle.p = this.p.map(v => new Vec3D(v)) as Triangle.Vec3Ds;
    return newTriangle;
  }

  averageZ():number{
    let sum = 0;
    for (const { z } of this.p){
      sum += z;
    }
    return sum / 3;
  }
}