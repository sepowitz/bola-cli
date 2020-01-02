const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const Clui = require("clui");
const { Select } = require("enquirer");
const { table, getBorderCharacters } = require("table");
const client = require("./lib/bolaClient");
const communicator = require("./lib/communicator");
const configurator = require("./lib/configurator");
const prompter = require("./lib/prompter");
const progressIndicator = require("./lib/progressIndicator");
const Config = require("./constants/Config.js");
const Countries = require("./constants/Countries");

const BolaClient = client.BolaClient;
const Communicator = communicator.Communicator;
const Configurator = configurator.Configurator;
const Prompter = prompter.Prompter;
const ProgressIndicator = progressIndicator.ProgressIndicator;

const { CONFIG_KEYS } = Config;
// Results
const showStandings = async (leagueSlug, leagueName) => {
  const Spinner = Clui.Spinner;
  const progress = new Spinner(`Fetching table for ${leagueName}...`);

  progress.start();
  const { data } = await getStandings(leagueSlug);

  if (data && data.length) {
    progress.stop();
    let dataMap = data.reduce((acc, d) => {
      let dataValuesArr = d.cells.map(c => c.value);
      dataValuesArr.pop();
      acc.push(dataValuesArr);
      return acc;
    }, []);

    return table(dataMap.slice(0, 8), {
      columnDefault: {
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0
      }
    });
  }
};

// Requests
const getAllCompetitions = () => BolaClient.request("/competitions");
const getAllTeams = () => BolaClient.request("/teams");

const getStandings = league => BolaClient.request(`/standings/${league}`);

const run = async () => {
  const hasConfig = Configurator.isConfigured();

  // Configurator.removeConfig(); // REMOVE AFTER TESTING

  // Render Intro
  Communicator.intro(hasConfig);

  // Setup Configuration
  if (!hasConfig) {
    // Get Name
    const nameProgress = new ProgressIndicator("Saving your name...");
    const name = await Prompter.whatShouldWeCallYou();
    if (name && name.length) {
      nameProgress.start();
      Configurator.updateConfig(CONFIG_KEYS.name, name);

      if (Configurator.hasProperty(CONFIG_KEYS.name)) {
        await nameProgress.stop(1000);
        // Get Country
        const countryProgress = new ProgressIndicator(
          "Saving country selection..."
        );
        const countryNames = Countries.map(c => c.name);
        const country = await Prompter.whatCountryDoYouSupport(countryNames);

        const selectedCountry = Countries.find(c => c.name === country);
        countryProgress.start();
        Configurator.updateConfig(CONFIG_KEYS.country, selectedCountry);

        if (Configurator.hasProperty(CONFIG_KEYS.country)) {
          // Get League
          const leagues = await getAllCompetitions();
          countryProgress.stop();

          const leagueProgress = new ProgressIndicator(
            "Saving league selection..."
          );
          const leaguesData = leagues.data;
          const leagueNames = leaguesData.map(c => c.value);
          const league = await Prompter.whatIsYourFavoriteLeague(leagueNames);

          leagueProgress.start();
          const selectedLeague = leaguesData.find(l => l.value === league);

          Configurator.updateConfig(
            `${CONFIG_KEYS.leagues}.${selectedLeague.value}`,
            {
              name: selectedLeague.value,
              slug: selectedLeague.slug
            }
          );

          if (Configurator.hasProperty(CONFIG_KEYS.leagues)) {
            // Get team
            const teams = await getAllTeams();
            const teamProgress = new ProgressIndicator(
              "Saving team selection..."
            );

            const teamsData = teams.data;
            const teamsForLeague = teamsData.find(
              c => c.competition_name === selectedLeague.value
            ).teams;
            const teamsForLeagueNames = teamsForLeague.map(
              team => team.team_name
            );

            leagueProgress.stop();
            const team = await Prompter.whatTeamDoYouSupport(
              teamsForLeagueNames
            );

            teamProgress.start();
            const selectedTeam = teamsForLeague.find(t => t.team_name === team);
            const leagueConfig = Configurator.getProperty(
              `${CONFIG_KEYS.leagues}.${selectedLeague.value}`
            );
            Configurator.updateConfig(
              `${CONFIG_KEYS.leagues}.${selectedLeague.value}`,
              {
                ...leagueConfig,
                team: selectedTeam
              }
            );

            if (Configurator.isConfigured()) {
              teamProgress.stop(1000);

              Communicator.onConfigSetupComplete(
                name,
                leagueConfig.name,
                selectedTeam.team_name,
                selectedCountry.name
              );
            }
          }
        }
      }
    }
  }

  const leaguesConfig = Configurator.getProperty(CONFIG_KEYS.leagues);
  const leagueName = Object.keys(leaguesConfig)[0];
  const leagueInfo = leaguesConfig[leagueName];

  const standings = await showStandings(leagueInfo.slug, leagueInfo.name);
  console.log(table([[standings, "hellloooo"]]));
  Prompter.mainMenu();

  // Already configured

  // chooseCompetitionPrompt();

  // Show options

  // try {
  //   const standings = await _getStandings("presdfdsfgsdgeague");
  //   console.log(standings);
  // } catch (err) {
  //   console.log(`ERROR `);
  // }

  // const standings = _getStandings("presdfdsfgsdgeague").then(res =>
  //   console.log(res)
  // );
};

// Run program
run();
