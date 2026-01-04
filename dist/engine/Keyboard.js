export class Keyboard {
    keys;
    constructor(element) {
        this.keys = new Set();
        this.setupKeyboardListeners(element);
    }
    setupKeyboardListeners(element) {
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
    useKeyMap(keyMap) {
        for (const key of this.keys.keys()) {
            keyMap[key]?.();
        }
    }
    keysPressed() {
        return Array.from(this.keys).join(", ");
    }
}
