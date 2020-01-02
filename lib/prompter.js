const clear = require("clear");
const { Select, Input, AutoComplete } = require("enquirer");

class Prompter {
  /** CONFIG GENERATION **/
  whatShouldWeCallYou() {
    const input = new Input({
      name: "name",
      message: "What should we call you?",
      initial: "Paul Pogba" // TODO: generate random footballer name
    });

    return input
      .run()
      .then(res => res)
      .catch(() => {
        return {
          error: true,
          message: "Could not get your name"
        };
      });
  }

  whatCountryDoYouSupport(countries) {
    const autoComplete = new AutoComplete({
      name: "country",
      message: "What country do you support?",
      limit: 4,
      choices: countries
    });

    return autoComplete
      .run()
      .then(res => {
        return res;
      })
      .catch(() => {
        return {
          error: true,
          message: "Could not get country."
        };
      });
  }

  whatIsYourFavoriteLeague(leagues) {
    const select = new Select({
      name: "league",
      message: "Which competition do you follow?",
      choices: leagues
    });

    return select
      .run()
      .then(res => res)
      .catch(() => {
        return {
          error: true,
          message: "Could not get league."
        };
      });
  }

  whatTeamDoYouSupport(teams) {
    const select = new Select({
      name: "team",
      message: "Which team do you support?",
      choices: teams
    });

    return select
      .run()
      .then(res => res)
      .catch(() => {
        return {
          error: true,
          message: "Could not get team."
        };
      });
  }

  mainMenu() {
    const select = new Select({
      name: "mainMenu",
      message: "Main Menu:",
      choices: [
        "Show full standings",
        "Show all upcoming matches\n",
        "Update preferences",
        "Quit"
      ]
    });

    return select
      .run()
      .then(res => res)
      .catch(() => {
        return {
          error: true,
          message: "Could not understand selection."
        };
      });
  }
}

module.exports = {
  Prompter: new Prompter()
};
