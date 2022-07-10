precision mediump float;

varying vec2 vPosition;
uniform vec3 uTint;
uniform vec2 uMapSize;
uniform sampler2D darkness;

float darknessAt(vec2 p) {
    return texture2D(darkness, p).r;
}

void main(void) {
    float alpha = darknessAt(vPosition / uMapSize);
    gl_FragColor = vec4(uTint, 1) * alpha;
}
