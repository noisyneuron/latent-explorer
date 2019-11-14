
let dcgan;
let z = [];
let butts = [];
let INC_AMT = 0.01;
let bRandomize, bInvert, bSelectAll, bDeselectAll, bInput;

function preload() {
    dcgan = ml5.DCGAN('model/simpsons20k/manifest.json');
}

function setup() {
    createCanvas(1500, 600);
    textAlign(CENTER,CENTER);
    let xo = 600;
    let yo = 200;
    for(let i=0; i<128; i++) {
      let x = 50 * (i%16);
      let y = 50 * Math.floor(i/16);
      butts.push(new Button(x+xo, y+yo, 50, 50, i, Math.random()));
    }

    bRandomize = createButton('randomize');
    bRandomize.position(1200, 0);
    bRandomize.size(100, 100);
    bRandomize.mousePressed(randomize);

    bInvert = createButton('invert selection');
    bInvert.position(1300, 0);
    bInvert.size(100, 100);
    bInvert.mousePressed(invert);

    bSelectAll = createButton('select all');
    bSelectAll.position(1200, 100);
    bSelectAll.size(100, 100);
    bSelectAll.mousePressed(selectAll2);

    bDeselectAll = createButton('deselect all');
    bDeselectAll.position(1300, 100);
    bDeselectAll.size(100, 100);
    bDeselectAll.mousePressed(deselectAll);

    let pDelta = createP('........delta........');
    pDelta.position(1100, 135);
    pDelta.size(100, 50);

    bInput = createInput('0.01');
    bInput.position(1100, 150);
    bInput.size(100, 50);
    bInput.input(changeInc);

    textSize(32);
    text("~~~~~ latent explorer ~~~~~", 850, 100);
    textSize(12);
    generate();
}


function generate() {
    for (let i = 0; i < 128; i++) {
      z[i] = map(butts[i].getVal(), 0, 1, -1, 1);
    }
    dcgan.generate(displayImage, z);
}

function displayImage(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    image(result.image, 0, 0, 600, 600);
}


function draw() {
  for(let i=0; i<128; i++) {
    butts[i].draw();
  }
}

function mouseClicked() {
  for(let i=0; i<128; i++) {
    if(butts[i].inBounds(mouseX,mouseY)) {
      butts[i].press();
    }
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    for(let i=0; i<128; i++) {
      if(butts[i].isPressed()) {
        butts[i].decrease();
      }
    }
    generate();
  } else if (keyCode === UP_ARROW) {
    for(let i=0; i<128; i++) {
      if(butts[i].isPressed()) {
        butts[i].increase();
      }
    }
    generate();
  }
}

function randomize() {
  butts.forEach( (x) => {
    x.setVal(Math.random());
  });
  generate();
}
function selectAll2() {
  for(let i=0; i<128; i++) {
    if( !butts[i].isPressed() ) {
      butts[i].press();
    }
  }
}
function deselectAll() {
  for(let i=0; i<128; i++) {
    if(butts[i].isPressed()) {
      butts[i].press();
    }
  }
}
function invert() {
  butts.forEach( (x) => {
    x.press();
  });
}

function changeInc() {
  INC_AMT = parseFloat(this.value());
}

function Button(_x, _y, _w, _h, _idx, _val) {
  let pressed = false,
      idx = _idx,
      val = _val,
      w = _w, h=_h, x=_x, y=_y;
  this.setVal = (v) => { val = v; }
  this.getVal = () => { return val; }
  this.isPressed = () => { return pressed; }
  this.press = () => { pressed = !pressed;}
  this.increase = () => { val += INC_AMT; val = constrain(val, 0, 1);}
  this.decrease = () => { val -= INC_AMT; val = constrain(val, 0, 1);}
  this.inBounds = (mx,my) => {return (mx >= x && mx <= x+w && my >= y && my <= y+h) };
  this.draw = () => {

    fill(255);
    noStroke();
    rect(x,y,w,h);

    fill(180);
    noStroke();
    rect(x, y+(1-val)*h, w, val*h);

    fill(40,0,205);
    noStroke();
    text(String(idx), x+0.5*w, y+0.5*h);

    if(pressed) {
      noFill();
      stroke(255,0,0);
      strokeWeight(4);
      rect(x+2, y+2, w-4, h-4);
    } else {
      noFill();
      stroke(0);
      strokeWeight(2);
      rect(x+1, y+1, w-2, h-2);
    }
  }
}
