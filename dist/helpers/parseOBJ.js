import { Vec3D } from "../engine/Vec3D.js";
export function parseOBJ(objContent) {
    const lines = objContent.split('\n');
    const vertices = [];
    const faces = [];
    for (const line of lines) {
        const trimmed = line.trim();
        // Skip comments and empty lines
        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }
        const parts = trimmed.split(/\s+/);
        const type = parts[0];
        switch (type) {
            case "v": {
                if (parts.length >= 4) {
                    vertices.push(new Vec3D(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])));
                }
                break;
            }
            case 'f': {
                const faceVertices = [];
                for (let i = 1; i < parts.length; i++) {
                    const vertexRef = parts[i];
                    const vertexParts = vertexRef.split('/');
                    const vertexIndex = parseInt(vertexParts[0]) - 1;
                    if (!isNaN(vertexIndex)) {
                        faceVertices.push(vertexIndex);
                    }
                }
                if (faceVertices.length > 0) {
                    faces.push(faceVertices);
                }
                break;
            }
            default: {
                break;
            }
        }
    }
    return { vertices, faces };
}
