# Roll Table Importer

![GitHub all releases](https://img.shields.io/github/downloads/jendave/roll-table-importer/total)
[![Latest Version](https://img.shields.io/github/v/release/jendave/roll-table-importer?display_name=tag&sort=semver&label=Latest%20Version)](https://github.com/jendave/augmented-reality-foundry/releases/latest)
![Foundry Version](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https%3A%2F%2Fraw.githubusercontent.com%2Fjendave%2Froll-table-importer%2Fmain%2Fsrc%2Fmodule.json)
[![License](https://img.shields.io/github/license/jendave/roll-table-importer)](LICENSE)

## Features and Notes

The `Roll Table Importer` module can create Foundry VTT roll tables from various kinds of text files.

Import tables from:

* Create many tables all nested in a folder from text.
* Copy and paste data to be parsed (text, CSV, JSON).
* Import text, CSV and JSON files.

## Usage

![Screenshot](https://github.com/jendave/roll-table-importer/blob/main/docs/screenshot_dialog.jpg?raw=true)

1. Click `Import Tables` button in Roll Tables tab in the sidebar.
2. Enter text of roll table via clipboard or file chooser dialog
   1. Copy text of entry you are trying to import and paste into the clipboard text area
   2. Or use file icon to choose a file.
3. Click `Okay`
4. Roll table will appear in the Roll table sidebar

## Roll Table Formats

Tables can be imported from a JSON file, a txt file, or through a CSV file. Each method is documented below.

### Reddit

The table tool comes with a text box where you can copy/paste tables from the [Behind the Tables subreddit.](https://www.reddit.com/r/BehindTheTables)

A single table can be created:

```txt
d10 This place is a...
### Type of Location \n Has the location falled into disrepair?
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

d100 Six
### Six Planetary Orbits \n Secondline \n Third line
1-16   1st
17-32  2nd
33-49  3rd
50-66  4th
67-83  5th
84-100 6th
```

Or multiple tables can be part of a collection, which will be placed in a folder:

```txt
Random Dungeons

d12 The place is currently occupied by...
### Location is filled with enemies \n Roll multiple times
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

d12 This place was built by...
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
```

### JSON

A structure similar to Foundry's interface for tables is valid:

```json
{
  "name": "Goods",
  "formula": "1d12",
  "description": "List of equipment \n Second Line",
  "results": [
    { "range": [1, 4], "text": "Backpacks or sacks" },
    { "range": [5, 6], "text": "Baskets" },
    { "range": [7, 8], "text": "Bricks" },
    { "range": [9, 10], "text": "Books" },
    { "range": [11, 11], "text": "Cloth" },
    { "range": [12, 12], "text": "Rope" }
  ]
}
```

Or a simpler structure can be passed and the formula and ranges will be automatically calculated and evenly distributed:

```json
{
  "name": "Goods",
  "description": "List of equipment \n Non-magical",
  "results": [ "Backpacks or sacks", "Baskets", "Bricks", "Books", "Cloth", "Rope" ]
}
```

### Text Files

A .txt file can be used to create a roll table, the importer will just treat each new line as an item in the table. The filename will be used as the table name.

goods.txt :

```txt
### List of equipment
Backpacks or sacks
Baskets
Bricks
Books
Cloth
Rope
```

### CSVs

A .csv can be used for a roll table. As commas are quite common in text that will appear in roll tables, the pipe is used as the delimiter instead (|). The file name will be used for the table name. A .csv file cannot use the description field.

goods.csv

```csv
01-04|Backpacks or sacks
05-06|Baskets
07-08|Bricks
09-10|Books
11|Cloth
12|Rope
```

## Support

For questions, feature requests or bug reports, please open an [issue](https://github.com/jendave/token-note-hover/issues).

[Pull requests](https://github.com/jendave/token-note-hover/pulls) are welcome. Please include a reason for the request or create an issue before starting one.

## Contact

* [Ironsworn/Starforged Discord Server - FoundryVTT Channel](https://discord.com/channels/437120373436186625/867434336201605160) (jendave)
* [FoundryVTT Discord Server - Module Discussion Channel](https://discord.com/channels/170995199584108546/513918036919713802) (jendave)
* [VOID Affiliate Network Discord Server - Game Hacks Channel](https://discord.com/channels/1222986351272787990/1222986351792619687) (jendave)
* [GitHub Repository](https://github.com/jendave/augmented-reality-foundry)
* [Itch.io](https://jendave.itch.io/)

## Credits

Module by David Hudson and licensed for use under the [MIT license](https://opensource.org/license/mit/).

This project is based on [foundryvtt-importer](https://github.com/EthanJWright/foundryvtt-importer) by [Ethan J Wright](https://github.com/EthanJWright).

## FoundryVTT Modules and Other Resources

Please check out my other modules and resources for Ironsworn, Ironsworn: Starforged and other systems.

### [FoundryVTT](https://foundryvtt.com/community/david-hudson/packages) Modules

* [Starforged Custom Compendiums](https://foundryvtt.com/packages/starforged-custom-oracles)
* [Starsmith Compendiums for Ironsworn: Starforged](https://foundryvtt.com/packages/starsmith-expanded-oracles)
* [Ironsmith Expanded Oracles for Ironsworn](https://foundryvtt.com/packages/ironsmith-expanded-oracles)
* [Augmented Reality Cyberpunk City Kit](https://foundryvtt.com/packages/augmented-reality-foundry)
* [Token Note Hover](https://github.com/jendave/token-note-hover)
* [Token Action HUD Ironsworn](https://foundryvtt.com/packages/token-action-hud-ironsworn)
* [VOID 1680 AM for FoundryVTT](https://foundryvtt.com/packages/void-1680-am)
* [Ancient Wonders](https://foundryvtt.com/packages/ancient-wonders)

### [Itch.io](https://jendave.itch.io/) Resources

* [The City on the Breeze - Cyberpunk-inspired Oracle arrays](https://jendave.itch.io/the-city-on-the-breeze)
* [I'll Be Home for Life Day! - Star Wars Life Day Oracle](https://jendave.itch.io/ill-be-home-for-life-day)
* [Critical Success Oracles](https://jendave.itch.io/critical-success-oracles)
* [I Owe My Soul to the Company Planet Oracles](https://jendave.itch.io/i-owe-my-soul-to-the-company-planet)
* [Creature Rank Generator](https://jendave.itch.io/creature-rank-generator)
