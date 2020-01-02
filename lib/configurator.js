const Configstore = require("configstore");
const Config = require("../constants/Config");

const { CONFIG_KEYS } = Config;

/**
 * CONFIG SHAPE:
 *
 * {
 *  name: "Luka Modric",
 *  country: {
      name: "Colombia",
      code: "CO",
    },
 *  leagues: {
 *    leagueSlug: {
 *      slug: leagueSlug,
 *      name: leagueName,
 *      team: {
 *        name: teamName,
 *        slug: teamSlug
 *      }
 *    }
 *  }
 *
 *  IN THE FUTURE:
 *  - Add themes
 *  - Language
 *  - Country
 * }
 */

class Configurator {
  constructor() {
    this.config = null;

    this._initialize();
  }

  isConfigured() {
    if (!this.config) return false;

    // Name is required
    if (!this.hasProperty(CONFIG_KEYS.name)) return false;

    // Country is required
    if (!this.hasProperty(CONFIG_KEYS.country)) return false;

    // At least one league object is required
    if (!this.hasProperty(CONFIG_KEYS.leagues)) return false;

    const hasLeagueObject = Object.keys(
      this.getProperty(CONFIG_KEYS.leagues) || {}
    ).reduce((_, leagueKey) => {
      if (!this.hasProperty(`${CONFIG_KEYS.leagues}.${leagueKey}`))
        return false;
      return true;
    }, false);

    return hasLeagueObject;
  }

  hasProperty(key) {
    if (!this.config) return false;
    return this.config.has(key);
  }

  getProperty(key) {
    if (!this.config) return false;
    return this.config.get(key);
  }

  updateConfig(configKey, configValue) {
    if (!this.config) return false;

    this.config.set(configKey, configValue);
    return this.config;
  }

  removeConfig() {
    if (!this.config) return false;

    this.config.clear();
    this._initialize();
    return true;
  }

  showConfig() {
    if (!this.config) return false;
    return this.config.all;
  }

  _initialize() {
    this.config = new Configstore(CONFIG_KEYS.fileName, {});
  }
}

module.exports = {
  Configurator: new Configurator()
};
