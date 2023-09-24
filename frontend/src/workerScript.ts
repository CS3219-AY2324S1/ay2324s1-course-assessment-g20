/**
 * This is the script that will be executed in the worker thread. It mainly does the following:
 *  - Secure the worker thread by removing access to unsafe objects
 *  - Wrap console.log, console.warn, console.error, console.info to postMessage to the main thread
 *  - Execute the code sent by the main thread
 */
export default function script() {
  // below are the safe objects that can be accessed from the worker
  const safeObjects = [
    'self',
    'onmessage',
    'postMessage',
    '__proto__',
    '__defineGetter__',
    '__defineSetter__',
    '__lookupGetter__',
    '__lookupSetter__',
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'eval',
    'Array',
    'Boolean',
    'Date',
    'Function',
    'Object',
    'String',
    'undefined',
    'Infinity',
    'isFinite',
    'isNaN',
    'Math',
    'NaN',
    'Number',
    'parseFloat',
    'parseInt',
    'RegExp',
    'console',
    'JSON',
    'Error',
    'Map',
    'Set',
    'WeakMap',
    'WeakSet',
    'Proxy',
    'Reflect',
    // ...
  ];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  function secure(item: any, prop: string) {
    if (safeObjects.indexOf(prop) < 0) {
      const descriptor = Object.getOwnPropertyDescriptor(item, prop);
      if (descriptor && descriptor.configurable) {
        Object.defineProperty(item, prop, {
          get: () => {
            throw new Error(`Security Exception: cannot access ${prop}`);
          },
          configurable: false,
        });
      } else {
        if (typeof item.prop === 'function') {
          item.prop = () => {
            throw new Error(`Security Exception: cannot access ${prop}`);
          };
        } else {
          delete item.prop;
        }
      }
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  [self].forEach((item: any) => {
    while (item) {
      Object.getOwnPropertyNames(item).forEach((prop) => {
        secure(item, prop);
      });

      item = Object.getPrototypeOf(item);
    }
  });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const consoleWrapperFunc = (...args: any[]) => {
    self.postMessage({ log: args.map((arg) => JSON.stringify(arg)).join(' ') });
  };
  self.console = {
    ...self.console,
    log: consoleWrapperFunc,
    warn: consoleWrapperFunc,
    error: consoleWrapperFunc,
    info: consoleWrapperFunc,
  };

  self.onmessage = (e) => {
    const data: string = e.data[0];
    let workerResult = null;
    (() => {
      e = null!;
      workerResult = eval(data);
    })();

    self.postMessage(workerResult);
  };
}
