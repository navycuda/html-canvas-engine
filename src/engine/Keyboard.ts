export namespace Keyboard{
  export interface Map{
    [key:string]: () => void;
  }
}
export class Keyboard{
  keys: Set<string>;


  constructor(element:HTMLElement){
    this.keys = new Set();
    
    this.setupKeyboardListeners(element);
  }

  private setupKeyboardListeners(element:HTMLElement):void{
    // focus on the canvas when clicked to ensure it can recieve keyboard events
    element.tabIndex = 0;

    element.addEventListener('keydown', (event) => {
      this.keys.add(event.key.toLowerCase());
      event.preventDefault();
    });
    element.addEventListener('keyup', (event) => {
      this.keys.delete(event.key.toLowerCase());
      event.preventDefault();
    });
  }


  useKeyMap(keyMap:Keyboard.Map):void{
    for (const key of this.keys.keys()){
      keyMap[key]?.();
    }
  }

  keysPressed():string{
    return Array.from(this.keys).join(", ");
  }
}