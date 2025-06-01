# Roll Table Importer

![GitHub all releases](https://img.shields.io/github/downloads/jendave/roll-table-importer/total)
[![Latest Version](https://img.shields.io/github/v/release/jendave/roll-table-importer?display_name=tag&sort=semver&label=Latest%20Version)](https://github.com/jendave/augmented-reality-foundry/releases/latest)
![Foundry Version](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https%3A%2F%2Fraw.githubusercontent.com%2Fjendave%2Froll-table-importer%2Fmain%2Fsrc%2Fmodule.json)
[![License](https://img.shields.io/github/license/jendave/roll-table-importer)](LICENSE)

Create Foundry VTT roll tables from external sources.

## Usage

1. Click `Import Tables` button in Roll Tables tab
2. Copy text of entry you are trying to import
3. Paste in the clipboard text area
4. Click `Okay`
5. Tweak and use imported data

## Support

## Key Features

### Tables

Import tables from external sources, creating quick collections.

Import tables from:

* Create many tables all nested in a folder from [Reddit](https://www.reddit.com/r/BehindTheTables)
* Copy and paste data to be parsed (reddit, entries per line, csv, json, etc.)
* Import text files (new lines are table entries)
* Import CSV files (first column treated as roll hits)
* Import from JSON (a few different structures to suite needs, easy to generate from scripts)

## Have an issue?

Open an issue [here](https://github.com/jendave/roll-table-importer/issues)

Sample data that I have for testing parsers is limited. If you have sample data that is not working, please open an issue and I can add it to my tests and update the parsers.

## Roll Tables

Tables can be imported from a JSON file with a simple structure, a txt file, or through a CSV file. Each method is documented below.

### Reddit

The table tool comes with a text box where you can copy/paste tables from the [Behind the Tables subreddit.](https://www.reddit.com/r/BehindTheTables)

A single table can be created:

```txt
d10 This place is (or was) a...
### Location
A stronghold.
A temple.
A tomb.
A prison.
A mine.
A lair.
A palace.
A storage vault.
A sewer.
A maze.
```

Or multiple tables can be part of a collection, which will be placed in a folder:

```txt
Random Dungeons

d10 This place is (or was) a...
### Location \n Test
A stronghold.
A temple.
A tomb.
A prison.
A mine.
A lair.
A palace.
A storage vault.
A sewer.
A maze.

d12 ...built by...
An ancient dwarvish clan.
An ancient elf prince.
A powerful wizard.
A dark sorceress.
A foreign empire.
An ambitious queen of old.
Prosperous merchants.
A powerful noble family.
Religious zealots.
An ancient race of giants.
A tyrannical king of old.
No one; it's a natural cave.

d12 ...and located...
Beneath a cold mountain.
Beneath a fiery mountain.
Near a well-traveled mountain pass.
Deep within a forest.
Deep within a desert.
Beside the sea.
On an island.
Beneath a bustling city.
Beneath the ruin of an ancient city.
Beneath a well-known castle or monastery.
Beneath a the ruin of an old castle or monastery.
In a place reachable only by magic.

d12 The place is currently occupied by...
A dangerous outlaw.
An elemental lord.
A vampire.
A lich.
A demon.
A devil.
An orc warlord.
A hobgoblin commander.
An aberrant presence.
A witch.
A giant.
A dragon.
```

### JSON

A structure similar to Foundry's interface for tables is valid:

```json
{
  "name": "Goods",
  "formula": "1d12",
  "description": "Equipment",
  "results": [
    { "range": [1, 4], "text": "Backpacks or sacks" },
    { "range": [5, 6], "text": "Baskets" },
    { "range": [7, 8], "text": "Bricks" },
    { "range": [9, 10], "text": "Books" },
    { "range": [11, 12], "text": "Cloth" }
  ]
}
```

Or a simpler structure can be passed and the formula and ranges will be automatically calculated and evenly distributed:

```json
{
  "name": "Goods",
  "description": "Equipment",
  "results": ["Backpacks or sacks", "Baskets", "Bricks", "Books", "Cloth"]
}
```

### Text Files

A .txt file can be used to create a roll table, the importer will just treat each new line as an item in the table. The filename will be used as the table name.

goods.txt :

```txt
### Goods
Backpacks or sacks
Baskets
Bricks
Books
Cloth
Rope
```

### CSVs

A .csv can be used for a roll table. as commas are quite common in text that will appear in roll tables, the pipe is used as the delimiter instead (|) The file name will be used for the table name.

goods.csv

```csv
01-04|Backpacks or sacks
05-06|Baskets
07-08|Bricks
09-10|Books
11-12|Cloth
```

### Dev Environment

#### Dev Foundry Configuration

I recommend setting up a foundry dev environment. This should entail copying your FoundryVTT folder and making a new folder, say `DevFoundryVTT`. Then modify the `dataPath` located in the file `FoundryVTT/Config/options.json` to reflect the new base folder `DevFoundryVTT`. Now when you launch Foundry, you should
have an environment free from your standard game sessions. I recommend removing any extra modules and setting up a clean 'hello world' to test in.

#### Installing this module

Clone the repository to your system, and ensure you have NPM and Node installed and up to date.

To install the dependencies, run the following from the project directory:

```sh
npm i
```

Ensure everything installed and the tests are passing, run:

```sh
npm run test
```

Ensure you can build the project into a distributable package for Foundry:

```sh
npm run build
```

The build command should generate a `dist` repo with the following contents:

```sh
drwxrwxr-x     - ubuntu  8 Feb 20:21   -I  lang
drwxrwxr-x     - ubuntu  8 Feb 20:21   -I  module
.rw-rw-r--  1.0k ubuntu  8 Feb 20:21   -I  module.json
drwxrwxr-x     - ubuntu  8 Feb 20:21   -I  styles
drwxrwxr-x     - ubuntu  8 Feb 20:21   -I  templates
```

You can now symlink this module into you DevFoundry addon repo with the following command. Run the command from the modules directory of your dev foundry installation:

```sh
ln -s <PROJECT-DIR>/dist foundry-vtt-content-parser
```

For example, the command on my system looks like so:

```sh
ln -s ~/mygit/roll-table-importer/dist roll-table-importer
```

You should now be able to view, enable, and use the module from within Foundry.

### Testing Components

Most logic that doesn't directly interface with Foundry is easily testible, and tests should be written for all additional logic.

If you add a function, there should be a test that corresponds.

Tests are located in the `test` directory, place your tests corresponding to the structure for a file you are adding, for example a new parser for bulk markdowns should have tests located at `test/actor/parsers/markDownBulk.test.ts`

To get test input, you can paste your data into the input box for the tool on foundry, open up the 'developer tools', and then copy the data that is logged in the console. This test data can be directly pasted as a string and used to validate any logic that is added.

### FAQ

Q: The project won't let me commit and is throwing errors, whats up?
A: The project uses eslint to validate the code style. Running `npm run lint -- --fix` should fix your issues.

Q: The module isn't showing up in Foundry after I symlink the dist folder.
A: Make sure you can see the dist folder contents in your modules directory, and make sure the name is an exact match. If the directory name doesn't match the module.json it won't show up as a Foundry addon.
