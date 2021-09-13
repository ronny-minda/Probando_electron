function r(from, to) {
    return ~~(Math.random() * (to - from + 1) + from);
  }
  function pick() {
    return arguments[r(0, arguments.length - 1)];
  }
  function getChar() {
    return String.fromCharCode(pick(
      r(0x3041, 0x30ff),
      r(0x2000, 0x206f),
      r(0x0020, 0x003f)
    ));
  }
  function loop(fn, delay) {
    let stamp = Date.now();
    function _loop() {
      if (Date.now() - stamp >= delay) {
        fn(); stamp = Date.now();
      }
      requestAnimationFrame(_loop);
    }
    requestAnimationFrame(_loop);
  }
  class Char {
    constructor() {
      this.element = document.createElement('span');
      this.mutate();
    }
    mutate() {
      this.element.textContent = getChar();
    }
  }
  class Trail {
    constructor(list = [], options) {
      this.list = list;
      this.options = Object.assign(
        { size: 10, offset: 0 }, options
      );
      this.body = [];
      this.move();
    }
    traverse(fn) {
      this.body.forEach((n, i) => {
        let last = (i == this.body.length - 1);
        if (n) fn(n, i, last);
      });
    }
    move() {
      this.body = [];
      let { offset, size } = this.options;
      for (let i = 0; i < size; ++i) {
        let item = this.list[offset + i - size + 1];
        this.body.push(item);
      }
      this.options.offset = 
        (offset + 1) % (this.list.length + size - 1);
    }
  }
  class Rain {
    constructor({ target, row }) {
      this.element = document.createElement('p');
      this.build(row);
      if (target) {
        target.appendChild(this.element);
      }
      this.drop();
    }
    build(row = 20) {
      let root = document.createDocumentFragment();
      let chars = [];
      for (let i = 0; i < row; ++i) {
        let c = new Char();
        root.appendChild(c.element);
        chars.push(c);
        if (Math.random() < .5) {
          loop(() => c.mutate(), r(1e3, 5e3));
        }
      }
      this.trail = new Trail(chars, { 
        size: r(10, 30), offset: r(0, 100) 
      });
      this.element.appendChild(root); 
    }
    drop() {
      let trail = this.trail;
      let len = trail.body.length;
      let delay = r(10, 100);
      loop(() => {
        trail.move();
        trail.traverse((c, i, last) => {
          c.element.style = `
            color: hsl(136, 100%, ${85 / len * (i + 1)}%)
          `;
          if (last) {
            c.mutate();
            c.element.style = `
              color: hsl(136, 100%, 85%);
              text-shadow:
                0 0 .5em #fff,
                0 0 .5em currentColor;
            `;
          }
        });
      }, delay);
    }
  }
  
  const main = document.querySelector('main');
  for (let i = 0; i < 50; ++i) {
    new Rain({ target: main, row: 50 });
  }