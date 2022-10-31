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
let bigCloud = []
let bigCloudTheta = []
let bigCloudR = []
let bigCloudSpeeds = []

let puffyCloud = []
let puffyCloudTheta = []
let puffyCloudR = []
let puffyCloudSpeeds = []

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
  starImg[0] = loadImage('img/MozartMagicFlute-star1.png');
  starImg[1] = loadImage('img/MozartMagicFlute-star2.png');
  starImg[2] = loadImage('img/MozartMagicFlute-star3.png');
  starImg[3] = loadImage('img/MozartMagicFlute-star4.png');
  starImg[4] = loadImage('img/MozartMagicFlute-star5.png');
  queenImg = loadImage('img/queen-moon.png');
  darkCloud[0] = loadImage('img/MozartMagicFlutedarkcloud1.png')
  darkCloud[1] = loadImage('img/MozartMagicFlutedarkcloud2.png')
  darkCloud[2] = loadImage('img/MozartMagicFlutedarkcloud3.png')
  darkCloud[3] = loadImage('img/MozartMagicFlutedarkcloud4.png')
  darkCloud[4] = loadImage('img/MozartMagicFlutedarkcloud5.png')
  lightCloud[0] = loadImage('img/MozartMagicFlute-lightcloud1.png')
  lightCloud[1] = loadImage('img/MozartMagicFlute-lightcloud2.png')
  lightCloud[2] = loadImage('img/MozartMagicFlute-lightcloud3.png')
  lightCloud[3] = loadImage('img/MozartMagicFlute-lightcloud4.png')
  lightCloud[4] = loadImage('img/MozartMagicFlute-lightcloud5.png')
  bigCloud[0] = loadImage('img/MozartMagicFlute-a70bigcloud1.png')
  bigCloud[1] = loadImage('img/MozartMagicFlute-a70bigcloud2.png')
  bigCloud[2] = loadImage('img/MozartMagicFlute-a70bigcloud3.png')
  bigCloud[3] = loadImage('img/MozartMagicFlute-a70bigcloud4.png')
  puffyCloud[0] = loadImage('img/MozartMagicFlute-puffyCloud1.png')
  puffyCloud[1] = loadImage('img/MozartMagicFlute-puffyCloud2.png')
  puffyCloud[2] = loadImage('img/MozartMagicFlute-puffyCloud3.png')
  puffyCloud[3] = loadImage('img/MozartMagicFlute-puffyCloud4.png')
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



  for (i=0;i<100;i++){
    lightcloudTheta[i] = random(230,300);
    lightcloudR[i] = random(.3*height,.4*height)
    lightCloudSpeeds[i] = 0.0
  }

  for (i=0;i<100;i++){
    bigCloudTheta[i] = random(0,360);
    bigCloudR[i] = random(.3*height,.4*height)
    bigCloudSpeeds[i] = .03
  }

  for (i=0;i<30;i++){
    puffyCloudTheta[i] = random(0,360);
    puffyCloudR[i] = random(.1*height,.3*height)
    puffyCloudSpeeds[i] = .02
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
      theClouds.addDarkCloud(i, cloudTheta[i],cloudR[i], darkCloud[random([0,1,2,3,4])],darkCloudSpeeds[i],60 );
      }
  }

  for (i=0;i<puffyCloudTheta.length;i++){
    for (j=0;j<1;j++){
      theClouds.addCloud(i, puffyCloudTheta[i],puffyCloudR[i], puffyCloud[random([0,1,2,3])],puffyCloudSpeeds[i],150 );
      }
  }
  for (i=0;i<bigCloudTheta.length;i++){
    for (j=0;j<1;j++){
      theClouds.addCloud(i, bigCloudTheta[i],bigCloudR[i], bigCloud[random([0,1,2,3])],bigCloudSpeeds[i],100 );
      }
  }
  for (i=0;i<lightcloudTheta.length;i++){
    for (j=0;j<1;j++){
      theClouds.addCloud(i, lightcloudTheta[i],lightcloudR[i], lightCloud[random([0,1,2,3,4])],lightCloudSpeeds[i],40 );
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
    sg.image(starImg[random([0,1,2,3,4])],this.position.x,this.position.y,8,8)
    //sg.ellipse(this.position.x, this.position.y, 6, 6);
  }

}

class CloudSystem {
  constructor(position) {
    this.origin = position.copy();
    this.clouds = [];
  }

  addDarkCloud(cloudPos,theta,r,whichID,speed,size) {
    this.clouds.push(new Cloud(cloudPos,theta,r,whichID,speed,size));
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
    this.position = createVector(width/2-r*cos((radians(theta[cloudID]))),height/2-r*sin(radians(theta[cloudID]) ) )
    //this.position = position.copy();
    this.cloudImgID = whichImg
    this.theta = theta
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
