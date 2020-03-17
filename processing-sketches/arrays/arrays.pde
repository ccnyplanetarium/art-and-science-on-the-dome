import codeanticode.syphon.*;

SyphonServer server;

PShader fisheye;
PGraphics canvas;
boolean useFishEye = true;

float[][] distances;
float maxDistance;
int spacer;

void setup() {
  size(1200, 1200, P2D);  
  canvas = createGraphics(width, height, P2D); 
  fisheye = loadShader("FishEye.glsl");
  fisheye.set("aperture", 180.0);
  server = new SyphonServer(this, "Planetarium server");
  
  maxDistance = dist(width/2, height/2, width, height);
  distances = new float[width][height];
  for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
      float distance = dist(width/2, height/2, x, y);
      distances[x][y] = distance/maxDistance * 255;
    }
  }
  spacer = 10;
  noLoop();
}

void draw() { 
  
  canvas.beginDraw();
  canvas.colorMode(HSB, 100);
  canvas.background(0, 0, 0);
  canvas.noStroke();
  
  for (int y = 0; y < height; y += spacer) {
    for (int x = 0; x < width; x += spacer) {
      canvas.fill(100*y/height, 100, 100);
      canvas.ellipse(x + spacer/2, y + spacer/2,5,5);
    }
  }
  canvas.endDraw(); 

  if (useFishEye == true) {
    shader(fisheye);
  } 

  image(canvas, 0, 0, width, height);
  server.sendScreen();
}
