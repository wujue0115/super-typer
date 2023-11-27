export class Queue<T> {
  private items: T[] = [];

  public push(item: T) {
    this.items.push(item);
  }

  public pop() {
    return this.items.shift();
  }

  public isEmpty() {
    return this.items.length === 0;
  }

  public get length() {
    return this.items.length;
  }

  public clear() {
    this.items = [];
  }

  public get front() {
    return this.items[0];
  }

  public get back() {
    return this.items[this.items.length - 1];
  }
}
