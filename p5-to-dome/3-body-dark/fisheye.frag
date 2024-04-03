// Adapted from https://github.com/nature-of-code/The-Nature-of-Code-Cosmos-Edition/tree/master/dome/fisheye_shader
// which  the following acknowledgement:

// Inspired by the "Angular Fisheye à la Bourke" sketch from
// Jonathan Cremieux, as shown in the OpenProcessing website:
// http://openprocessing.org/visuals/?visualID=12140
// Using the inverse transform of the angular fisheye as
// explained in Paul Bourke's website:
// http://paulbourke.net/miscellaneous/domefisheye/fisheye/

precision mediump float;
precision mediump int;


// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D texture;


// lets grab texcoords just for fun

uniform mat4 texMatrix;

varying vec4 vertColor;

uniform float aperture;

const float PI = 3.1415926535;

void main() {


  float apertureHalf = 0.5 * aperture * (PI / 180.0);

  // This factor adjusts the coordinates in the case that
  // the aperture angle is less than 180 degrees, in which
  // case the area displayed is not the entire half-sphere.
  //float maxFactor = sin(apertureHalf);
  float maxFactor = 1.0;
  // The st factor takes into account the situation when non-pot
  // textures are not supported, so that the maximum texture
  // coordinate to cover the entire image might not be 1.
  vec2 stFactor = vec2(1.0 / abs(texMatrix[0][0]), 1.0 / abs(texMatrix[1][1]));
  //vec2 pos = (2.0 * vTexCoord.st * stFactor - 1.0);
  vec2 pos = (2.0 * vTexCoord.st - 1.0);
  //vec2 pos = vTexCoord.st;
  vec2 uv = vTexCoord;
  float l = length(pos);
  if (l > 1.0) {
    gl_FragColor = vec4(.5, .5, 0.5, 1.0);
  } else {
    float x = maxFactor * pos.x;
    float y = maxFactor * pos.y;

    float n = length(vec2(x, y));

    float z = sqrt(1.0 - n * n);

    float r = atan(n, z) / PI;

    float phi = atan(y, x);

    float u = 1.0-(r * cos(phi) + 0.5);
    float v = 1.0-(r * sin(phi) + 0.5);

    vec4 tex = texture2D(texture,  vec2(u,v));

    gl_FragColor = tex;

    //gl_FragColor = texture2D(texture,);
  }


}
