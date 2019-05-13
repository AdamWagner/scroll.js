# Scroll

> An utility for scrolling web pages.

## Usage

Example with [Modal]:

``` javascript
const scroll = new Scroll

modal.map('Command', ['j'], (event) => scroll.down(event.repeat), 'Scroll down')
modal.map('Command', ['k'], (event) => scroll.up(event.repeat), 'Scroll up')
```

More examples at [Create a keyboard interface to the web].

[Modal]: https://github.com/alexherbo2/modal.js
[Create a keyboard interface to the web]: https://alexherbo2.github.io/blog/chrome/create-a-keyboard-interface-to-the-web/