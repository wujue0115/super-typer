# super-typer.js

`super-typer.js` is a JavaScript library that allows you to create a typing effect on your website.

## Installation

### Installing from CDN

In the CDN installation selection, you have the choice between the Global or ES Module import methods.

#### Using the Global Build

The Global import method is as follows:

```html
<html>
  <head>
    ...
    <script src="https://unpkg.com/super-typer/dist/super-typer.global.js"></script>
    ...
  </head>
  <body>
    ...
  </body>
</html>
```

#### Using the ES Module Build

The ES Module import method is as follows:

```html
<html>
  <head>
    ...
  </head>
  <body>
    ...
    <script type="module">
      import Typer from "https://unpkg.com/super-typer/dist/super-typer.esm.js";
    </script>
  </body>
</html>
```

### Installing from NPM

You can install `super-typer` using package managers like npm, yarn, or pnpm.

#### npm
```bash
npm install super-typer
```
#### yarn
```bash
yarn add super-typer
```
#### pnpm
```bash
pnpm install super-typer
```

## Usage

`super-typer.js` is very easy to use and has a very simple API.

### Basic Usage

The basic usage of `super-typer.js` is as follows:

```js
// Create a new instance of Typer.
const superTyper = new Typer(
  { 
    // The speed of the typing effect in milliseconds.
    speed: 100
  },
  {
    // The onChange function is called every time when the text changes.
    onChange: (text) => {
      console.log(text);
    },
  }
);

const commands = [
  {
    // The "command" property is the command which will be executed.
    // The "type" command is used to type text.
    command: "type",

    // The "argument" property is command's argument.
    argument: "Hello!",
  },
  {
    // The "backspace" command is used to delete text.
    // It's like pressing the backspace key.
    command: "backspace",
  
    // The "backspace" command accepts a number as an argument,
    // which is the number of characters to delete.
    //
    // A `-1` value means that the whole text will be deleted.
    argument: -1,
  }
];

// Add commands to the Typer instance.
superTyper.addCommands(commands);
// Start to type.
superTyper.start();
```

## License
[MIT](https://github.com/wujue0115/super-typer/blob/main/LICENSE)