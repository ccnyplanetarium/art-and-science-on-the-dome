
// Adapted from 
// Daniel Shiffman, Mitosis Coding Challenge and 
// Code for: https://youtu.be/jxGS3fKPKJA

class Cell{
    constructor(position, velocity, r, c) {
        
        this.velocity = velocity.copy();
        this.position = position.copy();
        this.r = r || 10;
        this.lifespan = 255.0;
        this.acceleration = createVector(0, 0);
        this.maxspeed = .3; // Maximum speed
        this.maxforce = .7; // Maximum steering force
        this.r = r || 10;
        this.c = c || color(255, 0, 0, 150);
        
    }

    
  
    
  
    mitosis() {
      //this.pos.x += random(-this.r, this.r);
      let postVel = p5.Vector.random2D();
      postVel.mult(.005)
      postVel.add(this.velocity)
      var cell = new Cell(this.position, postVel, this.r * 1.0, this.c);
      return cell;
    }

    applyForce(force) {
        this.acceleration.add(force);
      }

    separate(cells) {
        let desiredseparation = this.r * 1.0;
        let sum = createVector();
        let count = 0;
        // For every boid in the system, check if it's too close
        for (let i = 0; i < cells.length; i++) {
          let d = p5.Vector.dist(this.position, cells[i].position);
          // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
          if ((d > 0) && (d < desiredseparation)) {
            // Calculate vector pointing away from neighbor
            let diff = p5.Vector.sub(this.position, cells[i].position);
            diff.normalize();
            
            diff.div(d); // Weight by distance
            sum.add(diff);
            count++; // Keep track of how many
          }
        //   else {
        //     sum = createVector(0,0);
        //   }
        //   if (d > desiredseparation) {
        //     // Calculate vector pointing away from neighbor
        //     let diff = p5.Vector.sub(this.position, cells[i].position);
        //     diff.normalize();
        //     diff.div(d); // Weight by distance
        //     sum.mult(.1);
        //     count++; // Keep track of how many
        //   }
        }
        // Average -- divide by how many
        if (count > 0) {
          sum.div(count);
          // Our desired vector is the average scaled to maximum speed
          sum.normalize();
          sum.mult(this.maxspeed);
          // Implement Reynolds: Steering = Desired - Velocity
          let steer = p5.Vector.sub(sum, this.velocity);
          steer.limit(this.maxforce);
          this.applyForce(steer);
        }
      }
    move() {
      //var velocity = p5.Vector.random2D();
      //this.position.add(velocity);
    }
    update() {
        // Update velocity
        this.velocity.add(this.acceleration);
        //this.velocity.add(p5.Vector.random2D());
        //this.velocity.mult(.2)
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelertion to 0 each cycle
        //this.acceleration.mult(0);
      }

    show() {
    sg.push()
      sg.stroke(255);
      sg.fill(this.c);
      
      sg.translate(this.position.x, this.position.y)
      //sg.rotate(.3)
      sg.ellipse(0,0, this.r, this.r)
      sg.pop()
    }
}