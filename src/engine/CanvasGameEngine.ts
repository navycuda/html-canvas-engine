import { Vec3D } from "./Vec3D.js";
import { Triangle } from "./Triangle.js";
import { Mesh } from "./Mesh.js";
import { Mat4x4 } from "./Mat4x4.js";
import { Keyboard } from "./Keyboard.js";

export namespace CanvasGameEngine{

}
export const CONSTANTS = {
  OFFSET:{
    SCREEN: 8
  },
  SCALAR:{
    ROTATION: 0.025
  },
  COLOURS:{
    BLACK: "#000000" as Triangle.Colour,
    BACKGROUND: "#AAAAAA" as Triangle.Colour,
    FORGROUND: "#333333" as Triangle.Colour,
    ORANGE: "#ff8000ff" as Triangle.Colour
  },
  LINE:{
    WIDTH: 2
  }
}
export class CanvasGameEngine{
  private canvas:HTMLCanvasElement;
  private context:CanvasRenderingContext2D;

  private mesh?: Mesh;
  private matProj: Mat4x4;

  private camera: Vec3D;
  private lookDir: Vec3D;
  private yaw: number;

  private keyboard: Keyboard;

  constructor(canvas:HTMLCanvasElement){
    const context = canvas.getContext("2d");
    if (!context) { throw new Error('Unable to create context'); }
    this.canvas = canvas;
    this.context = context;

    const fNear = 0.1;
    const fFar = 1000;
    const fFov = 90;
    const fAspectRatio = this.getAspectRatio();

    this.matProj = Mat4x4.projection(fFov,fAspectRatio,fNear,fFar);

    this.camera = new Vec3D();
    this.lookDir = new Vec3D(0,0,1);
    this.yaw = 0;

    this.keyboard = new Keyboard(this.canvas);
  }

  private getAspectRatio():number{
    const { canvas: { height,width } } = this;
    return (height / width);
  }
  private clear(){
    const { canvas: { width, height }, context } = this;
    context.fillStyle = CONSTANTS.COLOURS.BACKGROUND;
    context.fillRect(0,0,width,height);
  }
  private print(x:number, y: number, colour:Triangle.Colour, message:string):void{
    const { context } = this;
    context.font = "24px serif";
    context.fillStyle = colour;
    context.fillText(message,x,y);
  }
  private drawTriangle(
    x0:number,y0:number,
    x1:number,y1:number,
    x2:number,y2:number,
    colour: string,
    width: number
  ):void{
    const { context } = this;

    context.strokeStyle = colour;
    
    context.beginPath();
    context.moveTo(x0,y0);
    context.lineTo(x1,y1);
    context.lineTo(x2,y2);
    context.closePath();
    context.lineWidth = width;
    context.stroke();
  }
  private fillTriangle(
    x0:number,y0:number,
    x1:number,y1:number,
    x2:number,y2:number,
    colour: string
  ):void{
    const { context } = this;

    context.fillStyle = colour;

    context.beginPath();
    context.moveTo(x0,y0);
    context.lineTo(x1,y1);
    context.lineTo(x2,y2);
    context.closePath();

    context.fill();
  }
  private drawLookLine2D(x0:number,y0:number,x2:number,y1:number,colour?:Triangle.Colour,lineWidth?:number):void{
    const { context } = this;
    context.beginPath();
    context.moveTo(x0,y0);
    context.lineTo((x0+x0),(y0+y1));
    context.strokeStyle = colour ?? CONSTANTS.COLOURS.ORANGE;
    context.lineWidth = lineWidth ?? CONSTANTS.LINE.WIDTH;
    context.stroke();
  }


  setMesh(mesh:Mesh){
    this.mesh = mesh;
  }
  onUserUpdate(fElapsedTime:number):boolean{
    const { mesh, matProj, canvas: { height, width } } = this;
    if (!mesh) { return false; }
    this.clear();

    
    const forward = this.lookDir.multiplyByScalar(2);
    this.keyboard.useKeyMap({
      "arrowdown"   : () => { this.camera.y += 1; },
      "arrowup"     : () => { this.camera.y -= 1; },
      "arrowright"  : () => { this.camera.x += 1; },
      "arrowleft"   : () => { this.camera.x -= 1; },
      "w" : () => { this.camera = this.camera.add(forward); },
      "s" : () => { this.camera = this.camera.subtract(forward); },
      "a" : () => { this.yaw -= 1; },
      "d" : () => { this.yaw += 1; }
    });

    this.print(20,38*2,CONSTANTS.COLOURS.FORGROUND,this.keyboard.keysPressed());

    this.print(20, 38*3, CONSTANTS.COLOURS.FORGROUND, `Camera: ${this.camera.x.toFixed(2)}, ${this.camera.y.toFixed(2)}, ${this.camera.z.toFixed(2)}`);
    this.print(20, 38*4, CONSTANTS.COLOURS.FORGROUND, `LookDir: ${this.lookDir.x.toFixed(2)}, ${this.lookDir.y.toFixed(2)}, ${this.lookDir.z.toFixed(2)}`);
    this.print(20, 38*5, CONSTANTS.COLOURS.FORGROUND, `Yaw: ${this.yaw}`);


    
    // const fTheta = CONSTANTS.SCALAR.ROTATION * fElapsedTime;
    const fTheta = 0;
    const { cos, sin } = Math;
    
    const colourFn = interpolateColorFn(CONSTANTS.COLOURS.FORGROUND,CONSTANTS.COLOURS.BACKGROUND)
    
    // Rotate on Z
    const matRotZ = Mat4x4.rotateZ(fTheta);
    
    // Rotate on X
    const matRotX = Mat4x4.rotateX(fTheta / 2);

    // Translation
    const matTrans = Mat4x4.translate({ z: CONSTANTS.OFFSET.SCREEN });
    
    let matWorld = Mat4x4.identity();
    matWorld = matRotZ.multiplyBy(matRotX);
    matWorld = matWorld.multiplyBy(matTrans);


    // Create "Point At" Matrix for camera
    const up = new Vec3D(0,1,0);
    let target = new Vec3D(0,0,1);
    const cameraRotation = Mat4x4.rotateY(this.yaw);
    this.lookDir = target.multiplyByMatrix(cameraRotation);
    target = this.camera.add(this.lookDir);

    const matCamera = Mat4x4.pointAt(this.camera,target,up);
    const matView = matCamera.quickInverse();


    const lookDir2D = new Vec3D(this.lookDir.x,this.lookDir.y,0).normalize().multiplyByScalar(50);
    const centerX = width / 2;
    const centerY = height / 2;


    // Draw Triangles
    const trianglesToRaster:Triangle[] = [];
    for (const tri of mesh.tris){
      const triProjected = new Triangle();
      const triTransformed = new Triangle();
      const triViewed = new Triangle();

      triTransformed.p[0] = tri.p[0].multiplyByMatrix(matWorld);
      triTransformed.p[1] = tri.p[1].multiplyByMatrix(matWorld);
      triTransformed.p[2] = tri.p[2].multiplyByMatrix(matWorld);



      //#region Simple Culling
      // calculate triange Normal

      const line1 = triTransformed.p[1].subtract(triTransformed.p[0]);
      const line2 = triTransformed.p[2].subtract(triTransformed.p[0]);
      const normal = line1.crossProduct(line2).normalize();
      
      const cameraRay = triTransformed.p[0].subtract(this.camera);
      //#endregion

      //#region Handle Lighting normals and Colour

      // See if the ray is aligned with the normal. Then triangle is visible.
      // What does this exactly mean?
      if (normal.dotProduct(cameraRay) < 0){
        // Handle illumination
        const light_direction = new Vec3D(0,0,-1).normalize();

        // how aligned are the light direction and the triangle surface normal

        const lightDotProduct = Math.max(0.1, light_direction.dotProduct(normal));


        
        // Scale into view, we moved the normalising into cartesian space
        // out of the matrix.vector cuntion from the previous videos, so
        // do this manually.
        const offsetView = new Vec3D(1,1,0);
        const h = (height / 2);
        const w = (width / 2);
        for (let i = 0 as Vec3D.Index; i < 3; i++){
          // Convert World Space --> View Space
          triViewed.p[i] = triTransformed.p[i].multiplyByMatrix(matView);
          // Project trianges from 3D to 2D
          triProjected.p[i] = triViewed.p[i].multiplyByMatrix(matProj);
          triProjected.p[i] = triProjected.p[i].divideByScalar(triProjected.p[i].w);
          triProjected.p[i] = triProjected.p[i].add(offsetView);
          triProjected.p[i].x *= w; 
          triProjected.p[i].y *= h;
        }
        triProjected.colour = colourFn(lightDotProduct);

  
        // Store triangle for sorting
        trianglesToRaster.push(triProjected);
      }

    } // for (const tri of mesh.tris)


    // Sort the triangles
    trianglesToRaster.sort((t1,t2) => {
      const z1 = t1.averageZ();
      const z2 = t2.averageZ();

      return z2 - z1;
    })

    for (const triangle of trianglesToRaster){
      // Rasterize triangle
      const { p, colour } = triangle

      this.fillTriangle(
        p[0].x,p[0].y,
        p[1].x,p[1].y,
        p[2].x,p[2].y,
        colour
      );
      // Draw the triange wireframes
      // this.drawTriangle(
      //   p[0].x,p[0].y,
      //   p[1].x,p[1].y,
      //   p[2].x,p[2].y,
      //   CONSTANTS.COLOURS.BLACK,
      //   2
      // );
    }

    const triangleCount = trianglesToRaster.length.toLocaleString();

    this.print(20,38,CONSTANTS.COLOURS.FORGROUND,`Rasterized Triangles: ${triangleCount}`);

    this.drawLookLine2D(centerX,centerY,lookDir2D.x,lookDir2D.y);


    return true;
  }



} // class CanvasGameEngine








function hexToRgb(hex:Triangle.Colour):{r:number,g:number,b:number} {
  const n = parseInt(hex.replace(/^#/,''),16);

  return {
    r: (n >> 16) & 0xFF,
    g: (n >> 8 ) & 0xFF,
    b: n & 0xFF
  }
}
function rgbToHex(r:number,g:number,b:number):Triangle.Colour{
  const toHex = (v:number) => (v.toString(16).padStart(2,'0'));

  const _r = toHex(Math.max(0, Math.min(0xFF, Math.round(r))));
  const _g = toHex(Math.max(0, Math.min(0xFF, Math.round(g))));
  const _b = toHex(Math.max(0, Math.min(0xFF, Math.round(b))));

  return `#${_r}${_g}${_b}`;
}
function interpolateColorFn(
  startColour: Triangle.Colour,
  endColour: Triangle.Colour,
):(intensity:number)=>Triangle.Colour {

  const startRgb = hexToRgb(startColour);
  const endRgb = hexToRgb(endColour);



  return (intensity)=>{
    const clampedIntensity = Math.max(0, Math.min(1,intensity));
    const r = startRgb.r + (endRgb.r - startRgb.r) * clampedIntensity;
    const g = startRgb.g + (endRgb.g - startRgb.g) * clampedIntensity;
    const b = startRgb.b + (endRgb.b - startRgb.b) * clampedIntensity;
    return rgbToHex(r,g,b);
  };
}