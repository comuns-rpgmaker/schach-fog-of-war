precision mediump float;

varying vec2 vPosition;
uniform vec3 uTint;
uniform vec2 uMapSize;
uniform sampler2D darkness;

float darknessAt(vec2 p) {
    return texture2D(darkness, p).r;
}

mat4 cubicMatrix = mat4(
    1.0, -4.0,  6.0, -3.0,
    0.0,  1.0, -4.0,  3.0,
    0.0,  0.0,  1.0, -1.0,
    0.0,  0.0,  0.0,  6.0
);

vec4 cubic(float x) {
    vec3 n = vec3(1.0, 2.0, 3.0) - x;
    vec3 s = n * n * n;
    return cubicMatrix * vec4(s, 1.0) * (1.0 / 6.0);
}

float intensity(vec2 position) {
    position -= 0.5;
    vec2 fxy = fract(position);
    position -= fxy;
    vec4 xcubic = cubic(fxy.x);
    vec4 ycubic = cubic(fxy.y);
    vec4 c = position.xxyy + vec2(-0.5, 1.5).xyxy;
    vec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);
    vec4 offset = c + vec4(xcubic.yw, ycubic.yw) / s;
    offset *= (1.0 / uMapSize).xxyy;
    float q0 = darknessAt(offset.xz);
    float q1 = darknessAt(offset.yz);
    float q2 = darknessAt(offset.xw);
    float q3 = darknessAt(offset.yw);
    vec2 t = s.xz / (s.xz + s.yw);
    float a = mix(q3, q2, t.x);
    float b = mix(q1, q0, t.x);
    return mix(a, b, t.y);
}

void main(void) {
    float alpha = intensity(vPosition);
    gl_FragColor = vec4(uTint, 1) * alpha;
}
