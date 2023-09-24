import { ICodeEvalOutput } from '../interfaces';
import script from '../workerScript';

//https://www.meziantou.net/executing-untrusted-javascript-code-in-a-browser.htm
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
      const handle = setTimeout(() => {
        this.killWorker();
        reject('timeout');
      }, timeout);

      // Send the script to eval to the worker
      worker.postMessage([script]);

      // Handle result
      worker.onmessage = (e) => {
        if (e?.data?.log) {
          this.output.logs += e?.data?.log + '\n';
        } else {
          this.output.result = JSON.stringify(e.data);
          clearTimeout(handle);
          resolve(this.output);
        }
      };

      worker.onerror = (e) => {
        this.output.error = JSON.stringify(e.message);
        clearTimeout(handle);
        reject(this.output);
      };
    });
  }
}
