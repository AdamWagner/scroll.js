class Scroll {
  constructor() {
    this.element = document.scrollingElement
    this.amt = 70
    this.fastFactor = 3
    this.animation = null
  }
  down(repeat) {
    this.animate('down', this.amt, repeat)
  }
  up(repeat) {
    this.animate('up', this.amt, repeat)
  }
  right(repeat) {
    this.animate('right', this.amt, repeat)
  }
  left(repeat) {
    this.animate('left', this.amt, repeat)
  }
  pageDown(repeat) {
    this.animate('down', (this.amt * this.fastFactor), repeat)
  }
  pageUp(repeat) {
    this.animate('up', (this.amt * this.fastFactor), repeat)
  }
  top() {
    this.animate('up', this.element.scrollTop)
  }
  bottom() {
    this.animate('down', this.element.scrollHeight - this.element.scrollTop)
  }
  static directions = {
    down:  { key: 'scrollTop', signum: 1 },
    up:    { key: 'scrollTop', signum: -1 },
    left:  { key: 'scrollLeft', signum: -1 },
    right: { key: 'scrollLeft', signum: 1 },
  }
  // Saka Key – https://key.saka.io
  //
  // Scrolls the selected element smoothly.  Works around the quirks of keydown events.
  // The first time a key is pressed (and held), a keydown event is fired immediately.
  // After that, there is a delay before the second keydown event is fired.
  // The third and all subsequent keydown events fire in rapid succession.
  // event.repeat is false for the first keydown event, but true for all others.
  // The delay (70 and 700) are carefully selected to keep scrolling smooth, but
  // prevent unexpected scrolling after the user has released the scroll key.
  // Relying on keyup events exclusively to stop scrolling is unreliable.
  //
  // https://github.com/lusakasa/saka-key/tree/master/src/modes/command/client/commands/scroll
  //
  // Engineering
  // ‾‾‾‾‾‾‾‾‾‾‾
  // Decision:
  // – Start smooth scrolling animation on key-down and end smooth scrolling animation on key-up.
  // Motivation:
  // – Smooth scrolling is surprisingly tricky to get “just right”.
  // – My early attempts all resulted in scrolling for a fraction of a second, then a tiny pause, then smooth scrolling as you’d expect.
  // – I learned that, calling cancelAnimationFrame was a bad idea.
  // – I tried a timeout based solution.
  //
  // https://github.com/lusakasa/saka-key/blob/master/notes/engineering.md
  animate(dir, amt, repeat) {
    const { key, signum } = Scroll.directions[dir];
    const longThrow = amt > window.innerHeight;
    const friction = longThrow
      ? Math.log(Math.pow(amt,2))
      : Math.log(amt);
    const animation = () => this.element[key] += (amt / friction) * signum;
    // Cancel potential animation being proceeded
    cancelAnimationFrame(this.animation)
    let start = null
    const delay = repeat ? (amt - friction) : (amt / 0.14) - friction
    const step = (timeStamp) => {
      if (start === null) {
        start = timeStamp
      }
      const progress = timeStamp - start
      animation()
      if (progress <= delay) {
        this.animation = requestAnimationFrame(step)
      } else {
        this.animation = null
      }
    }
    requestAnimationFrame(step)
    // End smooth scrolling animation on key-up.
    const onKeyUp = (_event) => {
      cancelAnimationFrame(this.animation)
    }
    if (! (repeat || longThrow) ) {
      this.element.addEventListener('keyup', onKeyUp, { once: true })
    }
  }
}
