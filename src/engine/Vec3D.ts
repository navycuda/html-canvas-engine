import type { Mat4x4 } from "./Mat4x4.js";


export namespace Vec3D{
  export interface Kurz{
    x?:number;
    y?:number;
    z?:number;
  }
  export type Index = (0|1|2);
}
export class Vec3D{
  x:number;
  y:number;
  z:number;
  w:number;

  constructor();
  constructor(v3D:Vec3D);
  constructor(x:number,y:number,z:number);
  constructor(x:number,y:number,z:number,w:number);
  constructor(x?:number|Vec3D,y?:number,z?:number,w?:number){
    if (x instanceof Vec3D){
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      this.w = x.w;
    } else {
      this.x = x ?? 0;
      this.y = y ?? 0;
      this.z = z ?? 0;
      this.w = w ?? 1;
    }
  }

  add({x,y,z}:Vec3D):Vec3D{
    return new Vec3D(
      (this.x + x),
      (this.y + y),
      (this.z + z)
    )
  }
  subtract({x,y,z}:Vec3D):Vec3D{
    return new Vec3D(
      (this.x - x),
      (this.y - y),
      (this.z - z)
    )
  }
  multiplyByVec3D({x,y,z}:Vec3D):Vec3D{
    return new Vec3D(
      (this.x * x),
      (this.y * y),
      (this.z * z)
    )
  }
  multiplyByScalar(s:number):Vec3D{
    return new Vec3D(
      (this.x * s),
      (this.y * s),
      (this.z * s)
    ) 
  }
  multiplyByMatrix({ m }:Mat4x4):Vec3D{
    const { x,y,z,w } = this;
    const v = new Vec3D();

    v.x =     (x * m[0][0]) + (y * m[1][0]) + (z * m[2][0]) + (w * m[3][0]);
    v.y =     (x * m[0][1]) + (y * m[1][1]) + (z * m[2][1]) + (w * m[3][1]);
    v.z =     (x * m[0][2]) + (y * m[1][2]) + (z * m[2][2]) + (w * m[3][2]);
    v.w =     (x * m[0][3]) + (y * m[1][3]) + (z * m[2][3]) + (w * m[3][3])

    return v;
  }
  divideByVec3D({x,y,z}:Vec3D):Vec3D{
    return new Vec3D(
      (this.x / x),
      (this.y / y),
      (this.z / z)
    )
  }
  divideByScalar(s:number):Vec3D{
    return new Vec3D(
      (this.x / s),
      (this.y / s),
      (this.z / s)
    )
  }
  crossProduct({x,y,z}:Vec3D):Vec3D{
    return new Vec3D(
      ((this.y * z) - (this.z * y)),
      ((this.z * x) - (this.x * z)),
      ((this.x * y) - (this.y * x))
    )
  }
  dotProduct({x,y,z}:Vec3D):number{
    return (this.x * x) + (this.y * y) + (this.z * z);
  }
  get length():number{
    return Math.sqrt(this.dotProduct(this));
  }
  normalize():Vec3D{
    const {x,y,z} = this;
    const l = this.length;
    return new Vec3D(
      (x / l),
      (y / l),
      (z / l)
    );
  }
  intersectPlane(planeN:Vec3D, lineStart:Vec3D, lineEnd:Vec3D):Vec3D{
    // this === plane_p
    const plane_n = planeN.normalize();
    const plane_d = -plane_n.dotProduct(this);
    const ad = lineStart.dotProduct(plane_n);
    const bd = lineEnd.dotProduct(plane_n);
    const t = (-plane_d - ad) / (bd - ad);
    const lineStartToEnd = lineEnd.subtract(lineStart);
    const lineToIntersect = lineStartToEnd.multiplyByScalar(t);
    return lineStart.add(lineToIntersect);
  }
}