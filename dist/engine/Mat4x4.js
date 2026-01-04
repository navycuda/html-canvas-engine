export class Mat4x4 {
    m = Array.from({ length: 4 }, () => Array(4).fill(0));
    multiplyBy({ m: mm }) {
        const { m } = this;
        const matrix = new Mat4x4();
        for (let c = 0; c < 4; c++) {
            for (let r = 0; r < 4; r++) {
                matrix.m[r][c] = ((m[r][0] * mm[0][c]) +
                    (m[r][1] * mm[1][c]) +
                    (m[r][2] * mm[2][c]) +
                    (m[r][3] * mm[3][c]));
            }
        }
        return matrix;
    }
    quickInverse() {
        const { m } = this;
        const matrix = new Mat4x4();
        matrix.m[0][0] = m[0][0];
        matrix.m[0][1] = m[1][0];
        matrix.m[0][2] = m[2][0];
        matrix.m[0][3] = 0;
        matrix.m[1][0] = m[0][1];
        matrix.m[1][1] = m[1][1];
        matrix.m[1][2] = m[2][1];
        matrix.m[1][3] = 0;
        matrix.m[2][0] = m[0][2];
        matrix.m[2][1] = m[1][2];
        matrix.m[2][2] = m[2][2];
        matrix.m[2][3] = 0;
        matrix.m[3][0] = -(m[3][0] * matrix.m[0][0] + m[3][1] * matrix.m[1][0] + m[3][2] * matrix.m[2][0]);
        matrix.m[3][1] = -(m[3][0] * matrix.m[0][1] + m[3][1] * matrix.m[1][1] + m[3][2] * matrix.m[2][1]);
        matrix.m[3][2] = -(m[3][0] * matrix.m[0][2] + m[3][1] * matrix.m[1][2] + m[3][2] * matrix.m[2][2]);
        return matrix;
    }
    static rotateX(angleRad) {
        const matrix = new Mat4x4();
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        matrix.m[0][0] = 1;
        matrix.m[1][1] = cos;
        matrix.m[1][2] = sin;
        matrix.m[2][1] = -sin;
        matrix.m[2][2] = cos;
        matrix.m[3][3] = 1;
        return matrix;
    }
    static rotateY(angleRad) {
        const matrix = new Mat4x4();
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        matrix.m[0][0] = cos;
        matrix.m[0][2] = sin;
        matrix.m[2][0] = -sin;
        matrix.m[1][1] = 1;
        matrix.m[2][2] = cos;
        matrix.m[3][3] = 1;
        return matrix;
    }
    static rotateZ(angleRad) {
        const matrix = new Mat4x4();
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        matrix.m[0][0] = cos;
        matrix.m[0][1] = sin;
        matrix.m[1][0] = -sin;
        matrix.m[1][1] = cos;
        matrix.m[2][2] = 1;
        matrix.m[3][3] = 1;
        return matrix;
    }
    static rotate({ x, y, z }, type = "rad") {
        const matrix = Mat4x4.identity();
        return matrix;
    }
    static translate({ x, y, z }) {
        const matrix = Mat4x4.identity();
        matrix.m[3][0] = x ?? 0;
        matrix.m[3][1] = y ?? 0;
        matrix.m[3][2] = z ?? 0;
        return matrix;
    }
    static identity() {
        const matrix = new Mat4x4();
        matrix.m[0][0] = 1;
        matrix.m[1][1] = 1;
        matrix.m[2][2] = 1;
        matrix.m[3][3] = 1;
        return matrix;
    }
    static projection(fovDegrees, aspectRatio, near, far) {
        const matrix = new Mat4x4();
        const fovRad = toRadian(fovDegrees);
        const { m } = matrix;
        m[0][0] = aspectRatio * fovRad;
        m[1][1] = fovRad;
        m[2][2] = far / (far - near);
        m[3][2] = (-far * near) / (far - near);
        m[2][3] = 1;
        m[3][3] = 0;
        return matrix;
    }
    static pointAt(pos, target, up) {
        // Calculate new forward direction
        const newForward = target.subtract(pos).normalize();
        // Calculate new up direction
        const a = newForward.multiplyByScalar(up.dotProduct(newForward));
        const newUp = up.subtract(a).normalize();
        // Calculate new right direction
        const newRight = newUp.crossProduct(newForward);
        // Construct Dimensions and Translation Matrix;
        const matrix = new Mat4x4();
        const { m } = matrix;
        m[0][0] = newRight.x;
        m[0][1] = newRight.y;
        m[0][2] = newRight.z;
        m[0][3] = 0;
        m[1][0] = newUp.x;
        m[1][1] = newUp.y;
        m[1][2] = newUp.z;
        m[1][3] = 0;
        m[2][0] = newForward.x;
        m[2][1] = newForward.y;
        m[2][2] = newForward.z;
        m[2][3] = 0;
        m[3][0] = pos.x;
        m[3][1] = pos.y;
        m[3][2] = pos.z;
        m[3][3] = 1;
        return matrix;
    }
}
const degree = Math.PI / 180;
const radian = 180 / Math.PI;
/** ## toRadian
 * ---
 *
 * Convert degrees to radians
 */
export function toRadian(a) { return a * degree; }
/** ## toDegree
 * ---
 *
 * Convert radians to degrees
 */
export function toDegree(a) { return a * radian; }
