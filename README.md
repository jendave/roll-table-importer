# Roll Table Importer

![GitHub all releases](https://img.shields.io/github/downloads/jendave/roll-table-importer/total)
[![Latest Version](https://img.shields.io/github/v/release/jendave/roll-table-importer?display_name=tag&sort=semver&label=Latest%20Version)](https://github.com/jendave/augmented-reality-foundry/releases/latest)
![Foundry Version](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https%3A%2F%2Fraw.githubusercontent.com%2Fjendave%2Froll-table-importer%2Fmain%2Fsrc%2Fmodule.json)
[![License](https://img.shields.io/github/license/jendave/roll-table-importer)](LICENSE)

## WARNING - Roll Table Compatibility

* When Roll Tables are put into Compendiums -
  * Roll tables created/edited on v13 *are not* compatible with v12.
  * Roll tables created/edited on v12 are compatible with v13.

## Features and Notes

The `Roll Table Importer` module can create Foundry VTT roll tables from various kinds of text files.

* Copy and paste data to be parsed (text, CSV, JSON).
* Import text, CSV and JSON files.
* Create tables with descriptions and ranges.
* Create several tables all nested in a folder from text.

## Usage

![Screenshot](https://github.com/jendave/roll-table-importer/blob/main/docs/screenshot_dialog.jpg?raw=true)

1. Click `Import Tables` button in the `Rollable Tables` tab in the sidebar.
2. Enter text of roll table via clipboard or choose a file using the file-picker
   1. Copy text you are trying to import and paste into the clipboard text area
   2. Or use file icon to choose a file.
3. Click `Okay`
4. Roll table will appear in the `Rollable Tables` tab.

## Roll Table Formats

Tables can be imported from a JSON file, a txt file, or a CSV file. Each method is documented below.

### Text File

A .txt file can be used to create a roll table. The filename will be used as the `table name`. The importer will just treat each new line as an item in the table.

The roll table importer tool comes with a text box where you can copy/paste tables. The first line will be used as the `table name`. The `description` field must be marked with `###` at the beginning of the line. Newlines must be marked with `\n` as shown in the examples.

Die-type (such as d6 or d100) and ranges can be specified. If the ranges are not stated, the importer will determine the table ranges based on the number of items in the table.

The [Behind the Tables subreddit](https://www.reddit.com/r/BehindTheTables) is a good source for random tables in plain-text format.

A simple single table can be created - Example from a file. Name of the table is the filename:

`goods.txt`:

```txt
Backpacks or sacks
Baskets
Bricks
Books
Cloth
Rope
```

`Table Name`, `Description` and `Ranges` can also be added.

```txt
d100 This place is...
### Type of Location \n Has the location fallen into disrepair?
1-10 A stronghold.
11-20 A temple.
21-35 A tomb.
36-40 A prison.
41-55 A mine.
55-70 A lair.
71-75 A palace.
76-80 A storage vault.
81-90 A sewer.
91-100 A maze.
```

Or multiple tables can be part of a collection, which will be placed in a folder:

```txt
Random Dungeons

d12 The place is currently occupied by...
### Location is filled with enemies \n Roll multiple times on this table
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

d12 This place is located...
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

For JSON, both files and pasted text can be used by the importer.

The [Foundry VTT Tables Repository](https://github.com/foundry-vtt-community/tables) is a good source for random tables in JSON format.

A structure similar to Foundry's interface for tables is valid.

```json
{
  "name": "Goods",
  "formula": "1d12",
  "description": "List of equipment \n Non-magical",
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

### CSV

Text in CSV format can be used for a roll table. The pipe (|) symbol is used as the delimiter since commas are common in tables. For a .csv file, the file name will be used for the `table name`. If the csv text was pasted into the dialog, the table will named "CSV Imported Table". The CSV importer cannot use the `table name` nor `description` fields.

`goods.csv`

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
