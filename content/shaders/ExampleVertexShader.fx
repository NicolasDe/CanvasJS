attribute vec2 coordinates;
varying vec2 UV;

void main(void)
{
	UV = coordinates;
	gl_Position = vec4(coordinates, 0.0, 1.0);
}