import { Queue } from "../utils/queue";
import { delayCallback } from "../utils/helper";

export type TOptions = {
  speed?: number;
};

export type TCallbacks = {
  onChange?: (output: string, cursorPosition: number) => void;
  onBeforeChange?: (output: string, cursorPosition: number) => void;
  onAfterChange?: (output: string, cursorPosition: number) => void;
};

export type TCommand = {
  command: "type" | "backspace" | "arrowLeft" | "arrowRight" | "wait";
  argument: string | number;
  options: TOptions;
  callbacks: TCallbacks;
};

export default class Typer {
  static readonly defaultOptions: TOptions = {
    // The speed of typing in milliseconds per character.
    speed: 100
  };

  static readonly defaultCallbacks: TCallbacks = {
    onChange: () => {},
    onBeforeChange: () => {},
    onAfterChange: () => {}
  };

  private _queue = new Queue<TCommand>();

  private _output: string = "";
  private _cursorPosition: number = 0;
  private _currentOptions: TOptions = {};
  private _currentCallbacks: TCallbacks = {};

  private _isRunning: boolean = false;
  private _isPaused: boolean = false;
  private _isReset: boolean = false;

  constructor(
    private _globalOptions: TOptions = {},
    private _globalCallbacks: TCallbacks = {},
    public commands: TCommand[] = []
  ) {
    this._currentOptions = { ...Typer.defaultOptions, ...this._globalOptions };
    this._currentCallbacks = {
      ...Typer.defaultCallbacks,
      ...this._globalCallbacks
    };
  }

  public get isRunning() {
    return this._isRunning;
  }

  public addCommands(commands: TCommand[]) {
    for (const command of commands) {
      this._queue.push(command);
    }
    return this;
  }

  public clearCommands() {
    this._queue.clear();
    return this;
  }

  public setGlobalOptions(options: TOptions) {
    this._globalOptions = { ...options };
    return this;
  }

  public setGlobalCallbacks(callbacks: TCallbacks) {
    this._globalCallbacks = { ...callbacks };
    return this;
  }

  public reset() {
    this._isRunning ? (this._isReset = true) : this._reset();
    return this;
  }

  public pause() {
    this._isRunning && (this._isPaused = true);
    return this;
  }

  public start() {
    this._isPaused = false;
    this._run();
    return this;
  }

  /**
   * Add a command to the queue with a specified type.
   *
   * @public
   * @param {("type" | "backspace" | "arrowLeft" | "arrowRight" | "wait")} command
   * @param {(string | number)} argument
   * @param {TOptions} [options={}]
   * @param {TCallbacks} [callbacks={}]
   * @returns {this}
   */
  public addCommandWithType(
    command: "type" | "backspace" | "arrowLeft" | "arrowRight" | "wait",
    argument: string | number,
    options: TOptions = {},
    callbacks: TCallbacks = {}
  ) {
    this._queue.push({
      command,
      argument,
      options,
      callbacks
    });
    this._run();
    return this;
  }

  /**
   * Type a string.
   *
   * @public
   * @param {string} input
   * @param {TOptions} [options={}]
   * @param {TCallbacks} [callbacks={}]
   * @returns {this}
   */
  public type(
    input: string,
    options: TOptions = {},
    callbacks: TCallbacks = {}
  ) {
    this.addCommandWithType("type", input, options, callbacks);
    return this;
  }

  /**
   * Delete a specified amount of characters.
   *
   * @public
   * @param {number} counts
   * @param {TOptions} [options={}]
   * @param {TCallbacks} [callbacks={}]
   * @returns {this}
   */
  public backspace(
    counts: number,
    options: TOptions = {},
    callbacks: TCallbacks = {}
  ) {
    this.addCommandWithType("backspace", counts, options, callbacks);
    return this;
  }

  /**
   * Move the cursor to the left.
   *
   * @public
   * @param {number} counts
   * @param {TOptions} [options={}]
   * @param {TCallbacks} [callbacks={}]
   * @returns {this}
   */
  public arrowLeft(
    counts: number,
    options: TOptions = {},
    callbacks: TCallbacks = {}
  ) {
    this.addCommandWithType("arrowLeft", counts, options, callbacks);
    return this;
  }

  /**
   * Move the cursor to the right.
   *
   * @public
   * @param {number} counts
   * @param {TOptions} [options={}]
   * @param {TCallbacks} [callbacks={}]
   * @returns {this}
   */
  public arrowRight(
    counts: number,
    options: TOptions = {},
    callbacks: TCallbacks = {}
  ) {
    this.addCommandWithType("arrowRight", counts, options, callbacks);
    return this;
  }

  /**
   * Wait for a specified amount of time.
   *
   * @public
   * @param {number} milliseconds
   * @param {TOptions} [options={}]
   * @param {TCallbacks} [callbacks={}]
   * @returns {this}
   */
  public wait(
    milliseconds: number,
    options: TOptions = {},
    callbacks: TCallbacks = {}
  ) {
    this.addCommandWithType("wait", milliseconds, options, callbacks);
    return this;
  }

  /**
   * Executes queued commands sequentially, handling pause and reset signals.
   *
   * @private
   * @async
   * @returns {Promise<void>} Resolves when all commands are executed.
   */
  private async _run(): Promise<void> {
    if (this._isRunning) return;

    this._isRunning = true;
    while (!this._queue.isEmpty()) {
      this._isPaused && (await this._pause());

      if (this._isReset) {
        this._reset();
        return;
      }

      const command = this._queue.pop();

      this._currentOptions = {
        ...this._currentOptions,
        ...command.options
      };

      this._currentCallbacks = {
        ...this._currentCallbacks,
        ...command.callbacks
      };

      this._currentCallbacks.onBeforeChange(this._output, this._cursorPosition);

      switch (command.command) {
        case "type":
          await this._type(command.argument as string);
          break;
        case "backspace":
          await this._backspace(command.argument as number);
          break;
        case "arrowLeft":
          await this._arrowLeft(command.argument as number);
          break;
        case "arrowRight":
          await this._arrowRight(command.argument as number);
          break;
        case "wait":
          await this._wait(command.argument as number);
          break;
      }

      this._currentCallbacks.onAfterChange(this._output, this._cursorPosition);
    }
    this._isRunning = false;
  }

  /**
   * Reset the typer.
   *
   * @private
   */
  private _reset() {
    this._isRunning = false;
    this._isPaused = false;
    this._isReset = false;

    this._queue.clear();
    this._output = "";
    this._cursorPosition = 0;
    this._currentCallbacks.onChange(this._output, this._cursorPosition);
  }

  /**
   * Pause the typer.
   *
   * @private
   * @async
   * @returns {*}
   */
  private async _pause() {
    await new Promise<void>((resolve) => {
      const listenStart = () => {
        if (!this._isPaused) {
          resolve();
          return;
        }
        requestAnimationFrame(listenStart);
      };

      listenStart();
    });
  }

  /**
   * Asynchronously simulates typing each character of the input string.
   *
   * @private
   * @async
   * @param {string} input - The input string to type.
   * @returns {Promise<void>} A promise resolving when typing is complete.
   */
  private async _type(input: string) {
    const len = input.length;
    for (let i = 0; i < len; ++i) {
      this._isPaused && (await this._pause());

      if (this._isReset) {
        this._reset();
        return;
      }

      await delayCallback((resolve) => {
        this._typeLetter(input[i]);
        this._currentCallbacks.onChange(this._output, this._cursorPosition);
        resolve();
      }, this._currentOptions.speed);
    }
  }

  /**
   * Normalizes the specified count value based on the length of the output.
   *
   * @private
   * @param {number} counts - The count value to normalize.
   * @returns {number} The normalized count value.
   * @example
   * // Assuming this._output.length is 10
   * const normalizedCount1 = this._normalizeCounts(5);    // returns 5
   * const normalizedCount2 = this._normalizeCounts(15);   // returns 10
   * const normalizedCount3 = this._normalizeCounts(-3);   // returns 8
   */
  private _normalizeCounts(counts: number) {
    counts = Math.min(counts, this._output.length);
    if (counts < 0) {
      counts = this._output.length + counts + 1;
    }
    return counts;
  }

  /**
   * Simulates pressing the backspace key a specified number of times.
   *
   * @private
   * @async
   * @param {number} counts - The number of times to press the backspace key.
   * @returns {Promise<void>} A promise resolving when the backspace operation is complete.
   */
  private async _backspace(counts: number) {
    counts = this._normalizeCounts(counts);

    for (let i = 0; i < counts; ++i) {
      this._isPaused && (await this._pause());

      if (this._isReset) {
        this._reset();
        return;
      }

      await delayCallback((resolve) => {
        this._backspaceLetter();
        this._currentCallbacks.onChange(this._output, this._cursorPosition);
        resolve();
      }, this._currentOptions.speed);
    }
  }

  /**
   * Moves the cursor left by a specified number of positions.
   *
   * @private
   * @async
   * @param {number} counts - The number of positions to move left.
   * @returns {Promise<void>} A promise resolving when the cursor movement is complete.
   */
  private async _arrowLeft(counts: number) {
    counts = this._normalizeCounts(counts);

    for (let i = 0; i < counts; ++i) {
      this._isPaused && (await this._pause());

      if (this._isReset) {
        this._reset();
        return;
      }

      await delayCallback((resolve) => {
        this._arrowLeftLetter();
        this._currentCallbacks.onChange(this._output, this._cursorPosition);
        resolve();
      }, this._currentOptions.speed);
    }
  }

  /**
   * Moves the cursor right by a specified number of positions.
   *
   * @private
   * @async
   * @param {number} counts - The number of positions to move right.
   * @returns {Promise<void>} A promise resolving when the cursor movement is complete.
   */
  private async _arrowRight(counts: number) {
    counts = this._normalizeCounts(counts);

    for (let i = 0; i < counts; ++i) {
      this._isPaused && (await this._pause());

      if (this._isReset) {
        this._reset();
        return;
      }

      await delayCallback((resolve) => {
        this._arrowRightLetter();
        this._currentCallbacks.onChange(this._output, this._cursorPosition);
        resolve();
      }, this._currentOptions.speed);
    }
  }

  /**
   * Pauses execution for a specified duration in milliseconds.
   *
   * @private
   * @async
   * @param {number} milliseconds - The duration to wait in milliseconds.
   * @returns {Promise<void>} A promise resolving after the specified duration.
   */
  private async _wait(milliseconds: number) {
    await delayCallback((resolve) => {
      resolve();

      if (this._isReset) {
        this._reset();
        return;
      }
    }, milliseconds);
  }

  private _typeLetter(letter: string) {
    this._output =
      this._output.slice(0, this._cursorPosition) +
      letter +
      this._output.slice(this._cursorPosition);
    ++this._cursorPosition;
  }

  private _backspaceLetter() {
    this._output =
      this._output.slice(0, this._cursorPosition - 1) +
      this._output.slice(this._cursorPosition);
    --this._cursorPosition;
  }

  private _arrowLeftLetter() {
    this._cursorPosition = Math.max(this._cursorPosition - 1, 0);
  }

  private _arrowRightLetter() {
    this._cursorPosition = Math.min(
      this._cursorPosition + 1,
      this._output.length
    );
  }
}
