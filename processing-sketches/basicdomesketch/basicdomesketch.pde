import codeanticode.syphon.*;

SyphonServer server;

PShader fisheye;
PGraphics canvas;
boolean useFishEye = true;

void setup() {
  size(1200, 1200, P2D);  
  canvas = createGraphics(width, height, P2D); 
  fisheye = loadShader("FishEye.glsl");
  fisheye.set("aperture", 180.0);
  server = new SyphonServer(this, "Planetarium server");
}

void draw() { 
  
  canvas.beginDraw();
  canvas.background(0);
  canvas.fill(255, 219, 88);
  canvas.ellipse(width/2, height*.66, 100, 100);
  canvas.endDraw(); 

  if (useFishEye == true) {
    shader(fisheye);
  } 

  image(canvas, 0, 0, width, height);
  server.sendScreen();
}
