# super-typer.js

`super-typer.js` is a JavaScript library that allows you to create a typing effect on your website.

## Table of Contents

- [Installation](#installation)
  - [Installing from CDN](#installing-from-cdn)
  - [Installing from NPM](#installing-from-npm)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
- [Typer API](#typer-api)
  - [Constructor](#constructor)
    - [Global Options](#global-options)
    - [Global Callbacks](#global-callbacks)
    - [Commands](#commands)
  - [Properties](#properties)
    - [isRunning](#isrunning)
    - [isPaused](#ispaused)
  - [Methods](#methods)
    - [setGlobalOptions(options)](#setglobaloptionsoptions)
    - [setGlobalCallbacks(callbacks)](#setglobalcallbackscallbacks)
    - [addCommand(command)](#addcommandcommand)
    - [addCommands(commands)](#addcommandscommands)
    - [clearCommands()](#clearcommands)
    - [start()](#start)
    - [pause()](#pause)
    - [reset()](#reset)
    - [type(text, options, callbacks)](#typetext-options-callbacks)
    - [backspace(count, options, callbacks)](#backspacecount-options-callbacks)
    - [arrowLeft(count, options, callbacks)](#arrowleftcount-options-callbacks)
    - [arrowRight(count, options, callbacks)](#arrowrightcount-options-callbacks)
    - [wait(time, options, callbacks)](#waittime-options-callbacks)


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

## Typer API

### Constructor

The constructor of `Typer` accepts three arguments, the [global options](#global-options) object, the [global callbacks](#global-callbacks) object, and the [commands](#commands) array, for example:

```js
new Typer(/* global options */, /* global callbacks */, /* commands */);
```

#### Global Options

The `global options` object is used to configure the `Typer` instance, it accepts the following properties:

```js
{
  // The speed of the typing effect in milliseconds, default value is 100.
  speed: 100
}
```

#### Global Callbacks

The `global callbacks` object is used to configure the callbacks of the `Typer` instance, it accepts the following properties:

```js
{
  // The onChange function is called every time when the text changes.
  // The "text" argument is the current text, and the "cursorPosition" argument is the current cursor position in the text.
  onChange: (text, cursorPosition) => {},
  // The onBeforeChange function is called before the text changes.
  onBeforeChange: (text, cursorPosition) => {},
  // The onAfterChange function is called after the text changes.
  onAfterChange: (text, cursorPosition) => {},
}
```

#### Commands

The `commands` array is a list of commands that will be executed by the `Typer` instance. A command is an object that has four properties, for example:

```js
{
  // The "command" property is the command which will be executed.
  // The "type" command is used to type text.
  // The available commands for the command are: "type", "backspace", "arrowLeft", "arrowRight", and "wait".
  command: "type",

  // The "argument" property is command's argument.
  argument: "Hello!",

  // The "options" property is the same as the constructor's "global options" argument and will override it.
  options: {
    speed: 80
  },

  // The "callbacks" property is the same as the constructor's "global callbacks" argument and will override it.
  callbacks: {
    onChange: (text, cursorPosition) => {},
    onBeforeChange: (text, cursorPosition) => {},
    onAfterChange: (text, cursorPosition) => {},
  }
}
```

### Properties

#### `isRunning`

The `isRunning` property is a getter that returns a boolean value indicating whether the `Typer` instance is running or not.

#### `isPaused`

The `isPaused` property is a getter that returns a boolean value indicating whether the `Typer` instance is paused or not.

### Methods

#### `setGlobalOptions(options)`

The `setGlobalOptions` method is used to set the `global options` of the `Typer` instance.

#### `setGlobalCallbacks(callbacks)`

The `setGlobalCallbacks` method is used to set the `global callbacks` of the `Typer` instance.

#### `addCommand(command)`

The `addCommand` method is used to add a command to the `Typer` instance, it accepts a command as an argument.

#### `addCommands(commands)`

The `addCommands` method is used to add commands to the `Typer` instance, it accepts an array of commands as an argument.

#### `clearCommands()`

The `clearCommands` method is used to clear all commands from the `Typer` instance.

#### `start()`

The `start` method is used to start the execution of the commands.

#### `pause()`

The `pause` method is used to pause the execution of the commands.

#### `reset()`

The `reset` method is used to stop execution and clear the all commands.

#### `type(text, options, callbacks)`

The `type` method simulates text input, it is used to add a `type` command and start the execution of the commands. It accepts three arguments, following is the description of each argument:

- `text`: The content to be typed.
- `options`: The options of this command, it will override the `global options`.
- `callbacks`: The callbacks of this command, it will override the `global callbacks`.

#### `backspace(count, options, callbacks)`

The `backspace` method simulates a backspace keypress, it is used to add a `backspace` command and start the execution of the commands. It accepts three arguments, following is the description of each argument:

- `count`: The number of characters to delete, if the value is negative, the text will be delete (all characters length + count + 1) characters. For example, with the text **"Hello!"** and a value of `-1`, the result is **"Hello"**. If the value is `-2`, the text becomes **"Hello"**. Thus, a value of `-1` is equivalent to deleting the entire text.
- `options`: The options of this command, it will override the [Global Options](#global-options).
- `callbacks`: The callbacks of this command, it will override the [Global Callbacks](#global-callbacks).

#### `arrowLeft(count, options, callbacks)`

The `arrowLeft` method simulates a left arrow keypress, it is used to add a `arrowLeft` command and start the execution of the commands. It accepts three arguments, and same as the `backspace` method, following is the description of each argument:

- `count`: The number of characters to delete, if the value is negative, the text will be delete (all characters length + count + 1) characters. For example, with the text **"Hello!"** and a value of `-1`, the result is **"Hello"**. If the value is `-2`, the text becomes **"Hello"**. Thus, a value of `-1` is equivalent to deleting the entire text.
- `options`: The options of this command, it will override the [Global Options](#global-options).
- `callbacks`: The callbacks of this command, it will override the [Global Callbacks](#global-callbacks).

#### `arrowRight(count, options, callbacks)`

The `arrowRight` method simulates a right arrow keypress, it is used to add a `arrowRight` command and start the execution of the commands. It accepts three arguments, and same as the `backspace` method, following is the description of each argument:

- `count`: The number of characters to delete, if the value is negative, the text will be delete (all characters length + count + 1) characters. For example, with the text **"Hello!"** and a value of `-1`, the result is **"Hello"**. If the value is `-2`, the text becomes **"Hello"**. Thus, a value of `-1` is equivalent to deleting the entire text.
- `options`: The options of this command, it will override the [Global Options](#global-options).
- `callbacks`: The callbacks of this command, it will override the [Global Callbacks](#global-callbacks).


#### `wait(time, options, callbacks)`
The `wait` method is used to add a `wait` command and start the execution of the commands. It accepts one argument, following is the description of each argument:

- `time`: The time to wait in milliseconds.
- `options`: The options of this command, it will override the [Global Options](#global-options).
- `callbacks`: The callbacks of this command, it will override the [Global Callbacks](#global-callbacks).


## License
[MIT](https://github.com/wujue0115/super-typer/blob/main/LICENSE)