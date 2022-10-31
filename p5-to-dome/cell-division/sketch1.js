// the shader variable
let fisheye;
let baseRes = 512;
let resMultiplier = 1;

let circle = [];
let square = [];
let lemniscate = [];
let morph = [];

let state = false;

function preload(){

fisheye = loadShader('fisheye.vert', 'fisheye.frag');

}

function setup() {
    // shaders require WEBGL mode to work
    canvas = createCanvas(baseRes*resMultiplier,baseRes*resMultiplier, WEBGL);
    sg = createGraphics(baseRes*resMultiplier, baseRes*resMultiplier,P2D)
    fisheye.setUniform('aperture', 180.0);
    //noStroke();
    frameRate(15)
    for (let angle = 0; angle < 361; angle += 9) {
        // Note we are not starting from 0 in order to match the
        // path of a circle.
        let v = p5.Vector.fromAngle(radians(angle - 0));
        
        v.mult(50);
        //v.add(50,0)
        circle.push(v);
        // Let's fill out morph ArrayList with blank PVectors while we are at it
        morph.push(createVector());
      }

      for (let x = -50; x < 50; x += 10) {
        square.push(createVector(x, -50));
      }
      // Right side
      for (let y = -50; y < 50; y += 10) {
        square.push(createVector(50, y));
      }
      // Bottom
      for (let x = 50; x > -50; x -= 10) {
        square.push(createVector(x, 50));
      }
      // Left side
      for (let y = 50; y > -50; y -= 10) {
        square.push(createVector(-50, y));
      }

      //Lemniscate
      let a = 50
      for (let angle = 0; angle <= 360; angle += 9) {
        rads = radians(angle)
        let lx =(a*cos(rads))/(1+pow(sin(rads),2))

        let ly =(a*sin(rads)*cos(rads))/(1+pow(sin(rads),2))

        // Note we are not starting from 0 in order to match the
        // path of a circle.
        let l = createVector(lx, ly);

        console.log(l)
        //l.mult(50);
        lemniscate.push(l);
        // Let's fill out morph ArrayList with blank PVectors while we are at it
        morph.push(createVector());
      }
}

function draw() {
    
    sg.background(26,63,108);
    sg.stroke('yellow')
    for ( i = 0; i < width; i += width/4) {
        sg.line(i, 0, i, height);
    }
    for ( i = 0; i < height; i += height/4) {
        sg.line(0, i, width, i );
    }
      // We will keep how far the vertices are from their target
  let totalDistance = 0;

  // Look at each vertex
  for (let i = 0; i < circle.length; i++) {
    let v1;
    // Are we lerping to the circle or square?
    if (state) {
      v1 = lemniscate[i];
    } else {
      v1 = circle[i];
    }
    // Get the vertex we will draw
    let v2 = morph[i];
    // Lerp to the target
    v2.lerp(v1, 0.1);
    // Check how far we are from target
    totalDistance += p5.Vector.dist(v1, v2);
  }

  // If all the vertices are close, switch shape
  if (totalDistance < 0.1) {
    state = !state;
  }

  // Draw relative to center
  sg.push()
  sg.translate(width / 2, height / 2);

  sg.strokeWeight(1);
  // Draw a polygon that makes up all the vertices
  sg.beginShape();
  sg.fill(255);
  sg.stroke(255);

  morph.forEach(v => {
    sg.vertex(v.x, v.y);
  });
  sg.endShape(CLOSE);
  sg.pop()
    
  //sg.ellipse(width/2,height/2,100);
    shader(fisheye);
    fisheye.setUniform('texture', sg);
    //image(sg, -width/2,-height/2);
  
    // rect gives us some geometry on the screen
    rect(0,0,width, height);
}