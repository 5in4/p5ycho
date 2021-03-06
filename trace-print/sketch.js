let sketch = function(p) {
  let THE_SEED;
  let border = 800;
  let number_of_particles = 12000;
  let number_of_particle_sets = 6;
  let particle_sets = [];

  let tick = 0;
  let print_time = 5000; // Number of frames until printing result.

  let palette;

  let ndimx = 4200;
  let ndimy = 5900;

  p.setup = function() {
    p.createCanvas(4200, 5900);
    p.background('#fff');
    THE_SEED = p.floor(p.random(65536));
    p.randomSeed(THE_SEED);
    console.log(THE_SEED);

    p.noFill();
    p.stroke(0, 18);
    p.strokeWeight(1);
    p.smooth();

    palette = [p.color(80, 55, 83, 20), p.color(21, 142, 121, 20)];

    for (var j = 0; j < number_of_particle_sets; j++) {
      let ps = [];
      for (var i = 0; i < number_of_particles; i++) {
        let ry = border + p.random(p.height - 2 * border);
        let b = p.map(ry, 0, p.height, 1.5, 0.6) * border;
        let rx = b + p.random(p.width - 2 * b);
        ps.push(
          new Particle(
            //p.randomGaussian(p.width / 2, p.width / 5),
            //border + p.random(p.width - 2 * border),
            //border + p.random(p.height - 2 * border),
            //p.randomGaussian(p.height / 2, p.height / 4),
            rx,
            ry,
            p.random(p.TWO_PI)
          )
        );
      }
      particle_sets.push(ps);
    }
  };

  p.draw = function() {
    particle_sets.forEach(function(particles, index) {
      particles.forEach(function(particle) {
        particle.update(index);
        particle.display(index);
      });
    });
    tick++;
    if (tick == print_time) {
      display_watermark(THE_SEED);
      p.saveCanvas('traceprint_' + THE_SEED, 'jpg');
    }
  };

  p.keyPressed = function() {
    if (p.keyCode === 80) p.saveCanvas('sketch_' + THE_SEED, 'jpg');
  };

  class Particle {
    constructor(x, y, phi) {
      this.pos = p.createVector(x, y);
      this.angle = phi;
      this.val = 0;
      this.altitude = 0;
    }

    update(index) {
      this.pos.x += p.cos(this.angle);
      this.pos.y += p.sin(this.angle);

      let nx = p.map(this.pos.y, 0, ndimy, 3.6, 0.4) * p.map(this.pos.x, 0, ndimx, -2, 2);
      let ny = 1.2 * p.pow(p.map(this.pos.y, 0, ndimy, 3.6, 0.4), 2.1);
      //console.log(nx, ny);

      let n = p.createVector(nx, ny);

      this.altitude = p.noise(n.x + 15.232, n.y + 12.654);
      let nval = this.altitude + 0.06 * (index - number_of_particle_sets / 2);

      this.angle += 1 * p.map(nval, 0, 1, -1, 1);
      this.val = nval;
    }

    display(index) {
      if (this.val > 0.478 && this.val < 0.522) {
        //p.stroke(palette[index % palette.length]);
        //if (index === 2) p.stroke(255, 25, 20, 20);
        //else p.stroke(20, 10);
        p.push();
        p.translate(this.pos.x, this.pos.y + 160 - 160 * this.altitude * p.map(this.pos.y, 0, ndimy, 0.4, 3.4));
        p.rotate(this.angle);
        p.point(0, 0);
        p.pop();
      }
    }
  }

  function display_watermark(num) {
    let dim = 40;
    p.push();
    p.noFill();
    p.stroke(255, 90, 80);
    p.strokeWeight(10);
    p.translate(p.width - 300, p.height - 300);
    for (var i = 15; i >= 0; i--) {
      let powi = p.pow(2, i);
      if (num >= powi) {
        num -= powi;
        p.fill(255, 90, 80);
      }
      p.rect(((15 - i) % 4) * dim, p.floor((15 - i) / 4) * dim, dim, dim);
      p.noFill();
    }
    p.rect(-20, -20, dim * 4 + 40, dim * 4 + 40);
    p.pop();
  }
};
new p5(sketch);
