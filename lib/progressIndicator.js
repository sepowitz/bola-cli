const { Spinner } = require("clui");

class ProgressIndicator {
  constructor(loadingString) {
    this.progress = new Spinner(loadingString);
  }

  start() {
    this.progress.start();
  }

  stop(withDelay) {
    if (withDelay) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.progress.stop();
          resolve(true);
        }, withDelay);
      })
    } else {
      this.progress.stop();
      return true;
    }
  }
}

module.exports = {
  ProgressIndicator
};