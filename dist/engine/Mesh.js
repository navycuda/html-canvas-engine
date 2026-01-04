import { parseOBJ } from "../helpers/parseOBJ.js";
import { Triangle } from "./Triangle.js";
export class Mesh {
    tris = [];
    static from(objectFile) {
        const mesh = new Mesh();
        const parsedObj = parseOBJ(objectFile);
        const { vertices, faces } = parsedObj;
        for (const face of faces) {
            const triange = new Triangle();
            for (let i = 0; i < triange.p.length; i++) {
                triange.p[i] = vertices[face[i]];
            }
            mesh.tris.push(triange);
        }
        return mesh;
    }
}
