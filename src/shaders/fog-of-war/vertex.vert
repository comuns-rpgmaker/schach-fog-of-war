precision mediump float;

attribute vec2 aVertexPosition;
uniform mat3 uProjectionMatrix;
uniform vec2 uGridSize;

varying vec2 vPosition;

void main() {
    vec3 position = uProjectionMatrix * vec3(aVertexPosition * uGridSize, 1.0);
    gl_Position = vec4(position, 1.0);
    vPosition = aVertexPosition;
}
