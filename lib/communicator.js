const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

const FIGLET_OPTIONS = {
  logo: { horizontalLayout: "full" }
};

class Communicator {
  // Intro
  intro(hasConfig = false) {
    this._clearTerminal();

    this._say(
      chalk.gray.bgBlack.dim(figlet.textSync("Bola", FIGLET_OPTIONS.logo))
    );

    if (hasConfig) {
      this._say(chalk.gray.bgBlack.dim("Welcome back!\n"));
      this._say(
        chalk.gray.bgBlack.dim(
          "We're just setting up your terminal. Happy footballing!"
        )
      );
    } else {
      this._say(
        chalk.gray.bgBlack.dim(
          "Looks like this is your first time, let's get started!"
        )
      );
    }
  }

  // Config Setup
  onConfigSetupComplete(name, leagueChoice, teamChoice, countryName) {
    this._clearTerminal();

    this._say(
      `Thanks ${name}, your preferences have been successfully saved!\n`
    );
    this._say(
      `From now on we'll use this info to show you the latest ${leagueChoice} standings and ${teamChoice}'s upcoming games. When the time comes we'll show you the same for ${countryName} on the World stage.\n`
    );
    this._say(`You can always update your preferences if things change ;)`);
  }

  /** PRIVATE **/

  _say(words) {
    console.log(words);
  }

  _clearTerminal() {
    clear();
  }
}

module.exports = {
  Communicator: new Communicator()
};
