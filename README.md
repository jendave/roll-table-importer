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
  "results": ["Backpacks or sacks", "Baskets", "Bricks", "Books", "Cloth", "Rope"]
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
