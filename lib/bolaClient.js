const axios = require("axios");

class BolaClient {
  constructor() {
    this.baseUrl = `http://localhost:3000/`;
  }

  request(path = "", reqMethod = "get") {
    const reqConfig = {
      url: `${this.baseUrl}/${path}`,
      method: reqMethod
    };

    return axios(reqConfig)
      .then(res => res)
      .catch(err => {
        throw err;
      });
  }
}

module.exports = {
  BolaClient: new BolaClient()
};
