

// the shader variable

let fisheye;
let baseRes = 512;
let resMultiplier = 2;

var orbiters=[];
var neworbiters = [];
var gravity = 3.0;
var totalMass;
var Trails = [];
var paths = [];
var masses = [];
var xvels = [];
var yvels = [];
var colors = ['#F07B4F','#717FEB','#84ad6a'];
var c=0;
var SolarSystem;

function preload(){

  fisheye = loadShader('fisheye.vert', 'fisheye.frag');
  
  }

function setup(){
  //frameRate(20);
  canvas = createCanvas(baseRes*resMultiplier,baseRes*resMultiplier, WEBGL);
    sg = createGraphics(baseRes*resMultiplier, baseRes*resMultiplier,P2D)
    fisheye.setUniform('aperture', 180.0);
frameRate(25)
    
v1 = 9;
massRatio = 1000;
cursor(CROSS);
 SolarSystem = new GravSystem(orbiters);
colorMode(HSL, 360,100,100)
spawn3Bodies();

//
 }


function spawn3Bodies() {
  for (i = 0;i<3;i++)
 {
   masses[i]=random(10,60);
   //colors[i]=color(random(0,360),0,random(10,80));
   // width/2,2*height/3
   velseed = 1;
   xvels[i] = random(-.2,.2);
   yvels[i] = random(-.2,.2);
   // xvels[2] = -(masses[0]*xvels[0]+masses[1]*xvels[1])/masses[2];
   // yvels[2] = -(masses[0]*yvels[0]+masses[1]*yvels[1])/masses[2];
   orbiters.push(new Orbiter(createVector(random(width/4,3*width/4),random(.6*height,.9*height)),createVector(xvels[i],yvels[i]),createVector(0,0),masses[i], colors[i]));
   paths.push(new Path(colors[i]));
}

}

function draw(){
  sg.background(255);
for (l=0;l<orbiters.length;l++){
  paths[l].update(l);
  paths[l].display();
}
for (i=0;i<orbiters.length;i++){
  orbiters[i].display();
}



  for (var k = 0; k < 2; k++) { // increase the greater than value to increase simulation step rate
      SolarSystem.do_physics(1.0 / 4); // increase the divisor to increase accuracy and decrease simulation speed
  }


  shader(fisheye);
  fisheye.setUniform('texture', sg);
  rect(0,0,width, height);

  if (frameCount%2000 == 0) {
    restartSketch()
  }
}

var Path = function(color_){
    this.points = [];
    this.ticker = 0;
    this.color = color_;
}

Path.prototype.update = function(whichOrb){
  this.ticker++

  if(this.ticker % 3 == 0){
    //console.log(i)
    if(orbiters[whichOrb].position.x>.001){
    this.points.push(new createVector(orbiters[whichOrb].position.x,orbiters[whichOrb].position.y))
  }
  }
}

Path.prototype.display = function(){

sg.noFill();
sg.stroke(this.color);
sg.strokeWeight(3);
sg.beginShape();
for (i=0;i<this.points.length;i++)
  {
    sg.curveVertex(this.points[i].x,this.points[i].y)
  }
  sg.endShape();

}


function COM(){

  m1 = createVector(0,0)

  totalMass=0;


  for(i=0;i<orbiters.length;i++){
    totalMass=totalMass+orbiters[i].mass;
    m1 = p5.Vector.add(m1,p5.Vector.mult(orbiters[i].position,orbiters[i].mass))
  }

  com = p5.Vector.div(m1,totalMass);
  push();
  fill(0)
  stroke(0)
  line(com.x-5,com.y,com.x+5,com.y,)
  line(com.x,com.y-5,com.x,com.y+5,)
  pop();
}




function windowResized() {
    // Resize necessary elements to fit new window size
    resizeCanvas(windowHeight, windowHeight); // width and height system variables updated here
  }


  function restartSketch(){

    for ( i = orbiters.length-1; i >= 0; i--){
      orbiters.splice(i,1);
      paths.splice(i,1);

    // for ( i = Trails.length-1; i >= 0; i--){
    //   Trails.splice(i,1);
    // }

  }
  spawn3Bodies();
    return false;
}

function touchEnded(){

    for ( i = orbiters.length-1; i >= 0; i--){
      orbiters.splice(i,1);
      paths.splice(i,1);

    // for ( i = Trails.length-1; i >= 0; i--){
    //   Trails.splice(i,1);
    // }

  }
  spawn3Bodies();
    return false;
}
