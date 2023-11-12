import { ICodeEvalOutput } from '../@types/codeEditor';
import script from '../workerScript';

//https://www.meziantou.net/executing-untrusted-javascript-code-in-a-browser.htm

/**
 * CodeEvaluator is a class that evaluates the code sent by the main thread
 * It initializes a web worker and sends the code to evaluate to the worker
 */
export class CodeEvaluator {
  private output: ICodeEvalOutput = {
    logs: '',
    result: '',
    error: '',
  };

  private worker: Worker | null = null;
  private getWorker() {
    if (this.worker === null) {
      const code = script.toString();
      const blob = new Blob(['(' + code + ')()'], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);

      this.worker = new Worker(url);
    }

    return this.worker;
  }

  public killWorker() {
    this.worker?.terminate();
    this.worker = null;
  }

  // set 10 seconds timeout by default
  public evalAsync(script: string, timeout = 10000): Promise<ICodeEvalOutput> {
    const worker = this.getWorker();

    return new Promise((resolve, reject) => {
      // Handle timeout
      const timeoutHandler = setTimeout(() => {
        this.killWorker();
        reject('timeout after ' + timeout + 'ms');
      }, timeout);

      // Send the script to eval to the worker
      worker.postMessage([script]);

      // Handle result
      worker.onmessage = (e) => {
        if (e?.data?.log) {
          this.output.logs += e?.data?.log + '\n';
        } else {
          const result = JSON.stringify(e.data);
          if (result === undefined) {
            this.output.result = 'undefined';
          } else {
            this.output.result = result;
          }
          clearTimeout(timeoutHandler);
          resolve(this.output);
        }
      };

      worker.onerror = (e) => {
        this.output.error = JSON.stringify(e.message);
        clearTimeout(timeoutHandler);
        reject(this.output);
      };
    });
  }
}
