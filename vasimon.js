(function(e) {
  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');
  const screen = {width: 256, height: 224};
  const pixelCount = screen.width * screen.height;
  const pixelData = context.createImageData(screen.width, screen.height);
  const sprites = {
    invader1: new Sprite([
      0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
      0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0,
      0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1,
      1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1,
      0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0,
    ], 11, 8),
  }

  function Bullet(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  function Invader(sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
  }

  function Sprite(data, width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(data);
    this.pixelCount = this.width * this.height;
  }

  function createDefaultContext() {
    const canvas = document.createElement('canvas');
    canvas.width = screen.width;
    canvas.height = screen.height;
    return canvas.getContext('2d');
  }

  function setPixel(value, x, y) {
    const index = (y * screen.width + x);
    const offset = index * 4;

    if (value) {
      const r = colorMap.data[offset];
      const g = colorMap.data[offset + 1];
      const b = colorMap.data[offset + 2];
      pixelData.data[offset] = r;
      pixelData.data[offset + 1] = g;
      pixelData.data[offset + 2] = b;
      pixelData.data[offset + 3] = 255;
    } else {
      pixelData.data[offset + 3] = 0;
    }
  }

  function setSprite(sprite, x, y) {
    for (let index = 0; index < sprite.pixelCount; index++) {
      const value = sprite.data[index];

      // Sprite coordinate
      const sx = parseInt(index % sprite.width);
      const sy = parseInt(index / sprite.width);

      // Relative coordinate
      const rx = x + sx;
      const ry = y + sy;

      setPixel(value, rx, ry);
    }
  }

  const state = {
    direction: 1
  };

  // Prepare gradient
  const gradientContext = createDefaultContext();
  const gradient = gradientContext.createLinearGradient(
    0, 0, 0, screen.height
  );

  gradient.addColorStop(0, "green");
  gradient.addColorStop(0.25, "cyan");
  gradient.addColorStop(0.75, "deeppink");
  gradient.addColorStop(1.0, "yellow");
  

  gradientContext.fillStyle = gradient;
  gradientContext.fillRect(0, 0, screen.width, screen.height);

  const colorMap = gradientContext.getImageData(
    0, 0, screen.width, screen.height
  );

  const invaders = [];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 15; x++) {
      invaders.push(
        new Invader(sprites.invader1, x * 14 + 24, y * 15 + 20)
      );
    }
  }

  context.imageSmoothingEnabled = false;
  //setSprite(sprites.invader1, 0, 0);
  
  function tick() {
    pixelData.data.fill(0);
    invaders.forEach(i => {
      setSprite(i.sprite, i.x, i.y);
    });
    context.putImageData(pixelData, 0, 0);

    invaders.forEach(i => {
      i.y += 1;
    });

    setTimeout(tick, 25);
  }

  tick();
   
})();