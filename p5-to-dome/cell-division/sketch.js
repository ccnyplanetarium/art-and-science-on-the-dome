
// Adapted from 
// Daniel Shiffman, Mitosis Coding Challenge and 
// Code for: https://youtu.be/jxGS3fKPKJA


// the shader variable
let fisheye;
let baseRes = 512;
let resMultiplier = 1;


let h;
let mic;
function preload(){

fisheye = loadShader('fisheye.vert', 'fisheye.frag');

}
var cells = [];

function setup() {

  canvas = createCanvas(baseRes*resMultiplier,baseRes*resMultiplier, WEBGL);
    sg = createGraphics(baseRes*resMultiplier, baseRes*resMultiplier,P2D)
    fisheye.setUniform('aperture', 180.0);
    let startPos = createVector(width/2,2*height/3);
    let startVel = createVector(0,0);
    let c = color(30,200);
    //noStroke();
    frameRate(15)
  cells.push(new Cell(startPos,startVel,8,c));
  //cells.push(new Cell());
  //mic = new p5.AudioIn();
  //mic.start();
}

function draw() {
  sg.background(200);

  //let vol = mic.getLevel();
  //h = map(vol, 0, 1, 0, 200);
  //console.log(h)
//   if (h>200){
//     divide()
//   }
  for (var i = 0; i < cells.length; i++) {
   
   cells[i].separate(cells);
   cells[i].update();
   cells[i].show();
    
  }
  if (frameCount%30==0 && cells.length<200){
    divide()
  }
  shader(fisheye);
  fisheye.setUniform('texture', sg);
  //image(sg, -width/2,-height/2);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function divide() {
  for (var i = cells.length - 1; i >= 0; i--) {
    
      cells.push(cells[i].mitosis());
      cells.push(cells[i].mitosis());
      cells.splice(i, 1);
    
  }
}