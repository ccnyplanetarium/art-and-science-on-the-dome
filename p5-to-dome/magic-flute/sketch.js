// in this sketch we're going to send the webcam to the shader, and then invert it's colors

// the shader variable
let fisheye;
let baseRes = 512;
let resMultiplier = 2;


// the camera variable
let cam;
let dx=0;

let StarXPos = []
let StarYPos = []
let starTheta = []
let starImg = []
let darkCloud = []
let cloudTheta = []
let cloudR = []
let lightcloudTheta = []
let lightCloud = []
let lightcloudR = []
let darkCloudSpeeds = []
let lightCloudSpeeds = []
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));



function preload(){
  // load the shader
  fisheye = loadShader('fisheye.vert', 'fisheye.frag');
  starImg[0] = loadImage('img/star1.png');
  starImg[1] = loadImage('img/star2.png');
  starImg[2] = loadImage('img/star3.png');
  starImg[3] = loadImage('img/star4.png');
  starImg[4] = loadImage('img/star5.png');
  queenImg = loadImage('img/queen-moon.png');
  darkCloud[0] = loadImage('img/darkCloud2.png')
  darkCloud[1] = loadImage('img/darkCloud3.png')
  lightCloud[0] = loadImage('img/lightbigcloud.png')

}

function setup() {
  // shaders require WEBGL mode to work
  canvas = createCanvas(baseRes*resMultiplier,baseRes*resMultiplier, WEBGL);
  sg = createGraphics(baseRes*resMultiplier, baseRes*resMultiplier,P2D)
  fisheye.setUniform('aperture', 180.0);
  //noStroke();
  frameRate(15)
  for (i=0;i<15;i++){
    starTheta[i*3] = i*(360/15);
    starTheta[(i*3)+1] = i*(360/15)+5;
    starTheta[(i*3)+2] = i*(360/15)+10;
  }
  for (i=0;i<200;i++){
    cloudTheta[i] = random(0,360);
    cloudR[i] = random(height/3,height/2)
    darkCloudSpeeds[i] = cloudR[i]*.0001*random(-1,5)
    
  }



  for (i=0;i<30;i++){
    lightcloudTheta[i] = random(0,360);
    lightcloudR[i] = random(height/8,height/4)
    lightCloudSpeeds[i] = .03
  }
  theStars = new StarSystem(createVector(width/2, height/2));
  theClouds = new CloudSystem(createVector(width/2, height/2));

  starXpos = range(0, width, 20)
  //starTheta = range(0, 360, 10)
  starR = range(height/4*.5, height/2, 20)
  //cloudR = range(height/4*.5, height/2, 20)
  //cloudR = [height/2.4]
  r = 50;
  for (i=0;i<starTheta.length;i++){
    for (j=0;j<starR.length;j++){
      theStars.addStar(createVector(width/2-starR[j]*cos((radians(starTheta[i]))),height/2-starR[j]*sin(radians(starTheta[i]) ) ), random([0,1,2,3,4]) );
     // theStars.addStar(createVector(width/2,100));

    }
  }

  for (i=0;i<cloudTheta.length;i++){
    for (j=0;j<1;j++){
      theClouds.addCloud(i, cloudTheta[i],cloudR[i], darkCloud[random([0,1])],darkCloudSpeeds[i],60 );
      }
  }

  for (i=0;i<lightcloudTheta.length;i++){
    for (j=0;j<1;j++){
      theClouds.addLightCloud(i, lightcloudTheta[i],lightcloudR[i], lightCloud[0],lightCloudSpeeds[i],200 );
      }
  }
}

function draw() {
  // shader() sets the active shader with our shader
  //canvas.background('red')
  sg.background(26,63,108);

  // sg.stroke('white')
  // for ( i = 0; i < width; i += width/4) {
  //   sg.line(i, 0, i, height);
  // }
  // for ( i = 0; i < height; i += height/4) {
  //   sg.line(0, i, width, i );
  // }
  
  theStars.run();
  theClouds.run();
  sg.imageMode(CENTER);
  sg.image(queenImg,width/2,.8*height,120,120)
  shader(fisheye);
  fisheye.setUniform('texture', sg);
  //image(sg, -width/2,-height/2);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);

}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

class StarSystem {
  constructor(position) {
    this.origin = position.copy();
    this.stars = [];
  }

  addStar(starPos,whichID) {
    this.stars.push(new Star(starPos,whichID));
  }
  addClouds(starTheta) {
    this.stars.push(new Star(starTheta));
  }

  run() {

    for (let star of this.stars) {
      star.run();
    }


  }
}

class Star {
  constructor(position,whichImg) {
    this.position = position.copy();
    this.starImgID = whichImg
  }

  run() {
    this.update();
    this.display();
  }

  // Method to update position
  update() {
    
    
  }

  // Method to display
  display() {
    sg.stroke(200);
    sg.strokeWeight(2);
    sg.fill(127);
    //sg.line(this.position.x-10,this.position.y,this.position.x+10,this.position.y)
    sg.image(starImg[random([0,1,2,3,4])],this.position.x,this.position.y,6,6)
    //sg.ellipse(this.position.x, this.position.y, 6, 6);
  }

}

class CloudSystem {
  constructor(position) {
    this.origin = position.copy();
    this.clouds = [];
  }

  addCloud(cloudPos,theta,r,whichID,speed,size) {
    this.clouds.push(new Cloud(cloudPos,theta,r,whichID,speed,size));
  }
  addLightCloud(cloudPos,theta,r,whichID,speed,size) {
    this.clouds.push(new Cloud(cloudPos,theta,r,whichID,speed,size));
  }

  run() {

    for (let cloud of this.clouds) {
      cloud.run();
    }


  }
}

class Cloud {
  constructor(cloudID,theta,r,whichImg,speed,size) {
    this.position = createVector(width/2-r*cos((radians(cloudTheta[cloudID]))),height/2-r*sin(radians(cloudTheta[cloudID]) ) )
    //this.position = position.copy();
    this.cloudImgID = whichImg
    this.theta = cloudTheta[cloudID]
    this.cloudID = cloudID
    this.size = size
    this.r = r
    this.speed = speed
  }

  run() {
    this.update();
    this.display();
  }

  // Method to update position
  update() {
    this.theta += this.speed
    this.position = createVector(width/2-this.r*cos((radians(this.theta))), height/2-this.r*sin(radians(this.theta) ) )
    
  }

  // Method to display
  display() {
    sg.stroke(200);
    sg.strokeWeight(2);
    sg.fill(127);
    //sg.line(this.position.x-10,this.position.y,this.position.x+10,this.position.y)
    sg.push()
    sg.translate(this.position.x,this.position.y)
    sg.rotate(radians(this.theta+90))
    sg.image(this.cloudImgID,0,0,this.size,this.size)
    sg.pop()
    //sg.ellipse(this.position.x, this.position.y, 6, 6);
  }

}
