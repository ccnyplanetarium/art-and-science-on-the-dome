import codeanticode.syphon.*;

import ddf.minim.*;
import ddf.minim.analysis.*;

Minim minim;
AudioInput in;

FFT fft;
float[] buffer;
int bsize = 512;
float circW;
SyphonServer server;

PShader fisheye;
PGraphics canvas;
boolean useFishEye = true;





int scale=1;

void setup() {
  
size(1200, 1200, P2D);  
  canvas = createGraphics(width, height, P2D); 
  fisheye = loadShader("FishEye.glsl");
  fisheye.set("aperture", 180.0);
  canvas.colorMode(HSB, 100);
  // Create an Input stream which is routed into the Amplitude analyzer

  minim = new Minim(this);
  
  // use the getLineIn method of the Minim object to get an AudioInput
  in = minim.getLineIn();
  fft = new FFT(1024, 44100 );
  server = new SyphonServer(this, "Planetarium server");
println(fft.specSize());
}      

void draw() { 
  canvas.beginDraw();
  canvas.background(0);
  canvas.stroke(100,250,250);
  //canvas.strokeWeight(4);
  scale=int(map(in.left.level(), 0, 0.01, 100, 150));
  canvas.colorMode(HSB, 100);
    //canvas.noStroke();
    
    //canvas.fill(255,0,150);
    // We draw an ellispe coupled to the audio analysis
    //canvas.ellipse(width/2, height/1.5, 1*scale, 1*scale);
     canvas.fill(0,100,100);

  for(int i = 0; i < in.bufferSize() - 1; i++)
  {
    for(int j=0;j<1;j++)
    {
    //canvas.line( i, height/2+(j*50) + in.left.get(i)*50, i+1, height/2 +(j*50) + in.left.get(i+1)*50 );
    canvas.line( i, height/2+100 + in.right.get(i)*100, i+1, height/2+100 + in.right.get(i+1)*100 );
    }
  }
        

  fft.forward(in.left);
  
  //for(int i = 0; i < fft.specSize(); i++)
  //{
  //  // draw the line for frequency band i, scaling it up a bit so we can see it
  //  canvas.line( width/2-200+i*4, height-200, width/2-200+i*4, height-200 - fft.getBand(i)*12 );
  //}
  canvas.noStroke();
  for(int i = 0; i < fft.specSize()/2; i++)
  {
    // draw the line for frequency band i, scaling it up a bit so we can see it
    circW = 10+fft.getBand(i)*12;
    canvas.fill(map(i, 1, 513/2, 1, 360),256,256);
    float a = i;
    //canvas.ellipse( width/2-300+i*3, height-700*sin(a), circW, circW);
    canvas.ellipse( width/2,height-i*15, circW, circW);
  }
  canvas.endDraw(); 
  
    if (useFishEye == true) {
    shader(fisheye);
  } 
  image(canvas, 0, 0, width, height);
  
  server.sendScreen();
}
