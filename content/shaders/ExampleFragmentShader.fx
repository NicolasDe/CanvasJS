precision mediump float;
uniform vec2 resolution;
varying vec2 UV;

void main(void)
{
	gl_FragColor = vec4(UV.x / resolution.x, UV.y / resolution.y, 0.0, 1.0);
}