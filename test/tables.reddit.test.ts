import {
  hasDieNumber,
  isRedditCollection,
  parseRedditCollection,
  parseWeightedTable,
} from '../src/module/table/reddit';
import { hasWeights } from '../src/module/table/lineManipulators';

describe('hasDieNumber', () => {
  it('should return true for a string with a die number', () => {
    expect(hasDieNumber('d100 Weather Elements')).toBe(true);
  });
  it('should return true for air currents string', () => {
    expect(hasDieNumber('d100 Air Currents')).toBe(true);
  });
  it('should return false for a string without a die number', () => {
    expect(hasDieNumber('Weather Elements')).toBe(false);
  });
});

describe('hasWeights', () => {
  it('should return true if the element has weights', () => {
    const item = '\n06-10. breeze, slight, damp.';
    expect(hasWeights(item)).toBe(true);
  });
});

describe('parseRedditTable', () => {
  it('should parse a single table', () => {
    const table =
      'd10 The castle sits...\n\n    Atop a mountain.\n\n    On a hill overlooking a wide plain.\n\n    At the fork of a river.\n\n    On a narrow, rocky peninsula.\n\n    Above a seaside cliff.\n\n    On a hill overlooking a river valley.\n\n    On a hill rising out of a swamp.\n\n    On a hill overlooking a forest.\n\n    Astride a desert oasis or natural spring.\n\n    On a ridge overlooking a frozen plain.';
    const parsed = parseWeightedTable(table);
    expect(parsed.results).toHaveLength(10);
    expect(parsed.name).toBe('The castle sits...');
    expect(parsed.formula).toBe('1d10');
  });
  it('should use table weights if provided', () => {
    const table =
      'd100 Air Currents\n01-05. breeze, slight.\n06-10. breeze, slight, damp.\n11-12. breeze, gusting.\n13-18. cold current.\n19-20. downdraft, slight.\n21-22. downdraft, strong.\n23-69. still.\n70-75. still, very chill.\n76-85. still, warm (or hot).\n86-87. updraft, slight.\n88-89. updraft, strong.\n90-93. wind, strong.\n94-95. wind, strong, gusting.\n96-100. wind, strong, moaning.';
    const parsed = parseWeightedTable(table);
    expect(parsed.results).toHaveLength(14);
    expect(parsed.results[0].range).toEqual([1, 5]);
    expect(parsed.results[parsed.results.length - 1].range).toEqual([96, 100]);
    expect(parsed.formula).toBe('1d100');
    expect(parsed.name).toBe('Air Currents');
  });
  it('should handle weird ranges that arnt at the start', () => {
    const table =
      'd100 General features\n\n    arrow, broken.\n    02-04. ashes.\n    05-06. bones.\n\n    bottle, broken.\n\n    chain, corroded.\n\n    club, splintered.\n    10-19. cobwebs.';
    const parsed = parseWeightedTable(table);
    expect(parsed.results).toHaveLength(7);
  });
});

describe('parseRedditCollection', () => {
  it('should parse a collection of tables', () => {
    const table =
      "Random Castle: To the keep!...\n\nd10 The castle sits...\n\n    Atop a mountain.\n\n    On a hill overlooking a wide plain.\n\n    At the fork of a river.\n\n    On a narrow, rocky peninsula.\n\n    Above a seaside cliff.\n\n    On a hill overlooking a river valley.\n\n    On a hill rising out of a swamp.\n\n    On a hill overlooking a forest.\n\n    Astride a desert oasis or natural spring.\n\n    On a ridge overlooking a frozen plain.\n\nd12 The castle was built by...\n\n    A wise king or queen.\n\n    An ambitious lord or lady.\n\n    An evil tyrant.\n\n    A mighty warrior or warlord.\n\n    A retired adventurer.\n\n    A celebrated war hero.\n\n    An unscrupulous king or queen.\n\n    A vain lord or lady.\n\n    A powerful witch or wizard.\n\n    A beloved sovereign.\n\n    A prosperous merchant.\n\n    A member of an ancient noble house.\n\nd4 The castle was built...\n\n    In a past age.\n\n    Hundreds of years ago.\n\n    A few decades ago.\n\n    Within the past decade.\n\nd6 Currently, the castle’s condition is...\n\n    Perfect; upkeep has been fastidious.\n\n    Good; it been well-maintained.\n\n    Decent; there are only a few cracks in the walls, but the place can withstand a siege.\n\n    Fair; the castle has seen better days.\n\n    Poor; the walls and towers are in dire need of repairs.\n\n    Decrepit; the place is practically a ruin.\n\nd12 Presently, the castle is occupied by...\n\n    A member of the royal family.\n\n    An ambitious lord or lady.\n\n    An evil tyrant.\n\n    An elderly lord or lady.\n\n    A brash, young lord or lady.\n\n    A mercenary company.\n\n    A fearsome warlord or retired sellsword.\n\n    A wealthy merchant.\n\n    A retired pirate or thief.\n\n    A former adventurer.\n\n    An absentee noble lord.\n\n    The crown, but the king or queen rarely stays here.\n\nd12 The position or territory is worth defending because...\n\n    Grains grow well on the surrounding land.\n\n    The nearby mines are rich in ores or gems.\n\n    The surrounding land is excellent for grazing livestock.\n\n    Fruit trees grow on the surrounding land.\n\n    The nearby pass is the easiest way to cross the mountains.\n\n    The nearby harbor is important for trade.\n\n    The nearby river is important for trade.\n\n    The nearby source of freshwater is precious is in this region.\n\n    The wild lands beyond are full of threats.\n\n    The surrounding lands are part of a long-standing territorial dispute.\n\n    The surrounding land is held sacred.\n\n    The nearby lands are home to a rare herb, tree, or creature that has magical uses.\n\nd10 The castle’s outer defenses include...\n\n    Very high stone walls.\n\n    Incredibly thick stone walls.\n\n    A series of curtain walls and gatehouses.\n\n    A treacherous climb to reach the castle walls.\n\n    A moat filled with putrescent water.\n\n    A moat filled with thick, boot-sucking mud.\n\n    A moat filled with sharp spikes.\n\n    A moat that is home to one or more dangerous aquatic beasts.\n\n    An immense barbican.\n\n    A narrow footbridge to reach the postern.\n\nd6 The inner keep’s defenses include...\n\n    Hundreds of arrow slits.\n\n    One of the world's largest dual-portcullis gates.\n\n    A winding climb to reach the entrance.\n\n    Several covered parapets with murder holes under which intruders must pass.\n\n    A wide courtyard surrounded by flanking towers in the curtain wall.\n\n    An unusual or hidden means of entry.\n\nd8 The castle can be held effectively by as few as...\n\n    5 soldiers and 20 archers.\n\n    20 soldiers, 5 knights, and 20 archers.\n\n    50 soldiers, 10 knights, and 40 archers.\n\n    20 knights, 20 archers, and 5 warmages.\n\n    100 soldiers, 50 archers, and 5 warmages.\n\n    100 soldiers, 20 knights, and 50 archers.\n\n    200 soldiers, 50 knights, and 100 archers.\n\n    200 soldiers, 100 knights, and 200 archers.\n\nd6 In addition to its garrison, the castle can hold foodstores to withstand a three-month siege for up to...\n\n    50 people.\n\n    100 people.\n\n    200 people.\n\n    500 people.\n\n    1,000 people.\n\n    2,000 people.\n\nd12 The castle is known for...\n\n    Withstanding a grueling, lengthy siege.\n\n    Suffering an immense conflagration.\n\n    Changing hands several times over the course of the same war.\n\n    Bringing ill-fortune to those who hold it.\n\n    Being haunted by a former occupant.\n\n    Never falling in a siege.\n\n    Welcoming travelers seeking refuge.\n\n    Turning away travelers seeking refuge.\n\n    Its unusual architectural style.\n\n    Its beautiful, historic tapestries.\n\n    Its breathtakingly beautiful chapel.\n\n    The quality of its meals.\n\nd12 What is rumored to be hidden in the castle?\n\n    An underground tunnel that can serve as a last-gasp escape route.\n\n    The weapon of a long-dead hero.\n\n    The preserved head of an ancient villain.\n\n    A long-lost religious artifact.\n\n    A missing lord or lady.\n\n    A book of vile curses.\n\n    A book of dark and ancient secrets.\n\n    A cursed treasure hoard.\n\n    The last bottle of famous vintage of wine.\n\n    A lost work of a celebrated artist.\n\n    The crypt of an ancient sovereign.\n\n    An unhatched dragon egg.\n\nd20 Rooms: This chamber is...\n\n    An antechamber or waiting room.\n\n    An armory.\n\n    An aviary, dovecote, owlery, or rookery.\n\n    A banquet hall.\n\n    The barracks.\n\n    A bath or privy.\n\n    A bedroom (d3): 1. simple; 2. comfortable; 3. luxurious.\n\n    A chapel or shrine.\n\n    A crypt.\n\n    An intimate or informal dining room.\n\n    A dressing room.\n\n    A gallery (d6): 1. armor and weaponry; 2. paintings; 3. sculptures; 4. tapestries; 5. hunting trophies; 6. trophies of war.\n\n    A guardroom.\n\n    A kennel, menagerie, or stable.\n\n    The kitchen.\n\n    A library or study.\n\n    A pantry.\n\n    Store room for mundane supplies or a cistern for drinking water.\n\n    The throne room.\n\n    A treasure vault (likely hidden and/or protected by traps).\n\nd20 Features: You notice...\n\n    An armchair flanked by two sconces.\n\n    A large armoire or buffet cabinet.\n\n    A bench with a cusion.\n\n    A brazier.\n\n    A candelabrum on a large table.\n\n    A plain chair beside a window.\n\n    A heavy wooden chest.\n\n    A chest of drawers with a blanket on top.\n\n    A desk with some quills and parchment.\n\n    A fireplace with a mantle.\n\n    A fireplace with a small pile of wood.\n\n    A fresco with a padded chair beneath it.\n\n    Portrait of a noble.\n\n    A painting of a landscape or seascape.\n\n    A bust on a pedestal.\n\n    A shelf containing books or knick knacks.\n\n    A low table in front of a small sofa.\n\n    A large table beneath a chandelier.\n\n    An ornate tapestry.\n\n    A small wall basin and font.\n\nENCOUNTERS\n\nd10 Under siege: You come upon...\n\n    A squad of archers hustling up a stair.\n\n    A patrol of guards brandishing weapons.\n\n    A guard shouting instructions.\n\n    A knight hurrying to the stables.\n\n    A servant cowering in a hiding place.\n\n    A curious child peaking out a window.\n\n    A servant kneeling in prayer.\n\n    A noble hastily penning a letter.\n\n    A squire aiding a knight with his armor.\n\n    A healer checking over his potions.\n\nd10 In peace: You come upon...\n\n    The huntsman cleaning a recent kill.\n\n    The kennelmaster leading a leashed dog.\n\n    The horsemaster instructing a young rider.\n\n    The armorer scolding an apprentice.\n\n    A maid fussing over her lady’s dress.\n\n    The tutor or sage lost in a book.\n\n    The chaplain whispering with a maid.\n\n    A maid polishing an ornamental shield.\n\n    A servant carrying a tray of food.\n\n    Several archers practicing in the yard.";
    const parsed = parseRedditCollection(table);
    expect(parsed.collection).toHaveLength(16);
    expect(parsed.name).toEqual('Random Castle: To the keep!...');
    expect(parsed.collection[0].name).toEqual('The castle sits...');
  });

  it('should parse a large collection with multiple table types', () => {
    const table =
      'Random Dungeon Dressing\n\nd100 Air Currents\n01-05. breeze, slight.\n06-10. breeze, slight, damp.\n11-12. breeze, gusting.\n13-18. cold current.\n19-20. downdraft, slight.\n21-22. downdraft, strong.\n23-69. still.\n70-75. still, very chill.\n76-85. still, warm (or hot).\n86-87. updraft, slight.\n88-89. updraft, strong.\n90-93. wind, strong.\n94-95. wind, strong, gusting.\n96-100. wind, strong, moaning.\n\nd100 Odors\n01-03. acrid smell.\n04-05. chlorine smell.\n06-39. dank, mouldy smell.\n40-49. earthy smell.\n50-57. manure smell.\n58-61. metallic smell.\n62-65. ozone smell.\n66-70. putrid smell.\n71-75. rotting vegetation smell.\n76-77. salty, wet smell.\n78-82. smoky smell.\n83-89. stale, fetid smell.\n90-95. sulphurous smell.\n96-100. urine smell.\n\nd100 Air\n01-70. clear.\n71-80. foggy (or steamy).\n81-88. foggy near floor (or steamy).\n89-90. hazy (dust).\n91-100. misted.\n\nd100 General features\n\n    arrow, broken.\n    02-04. ashes.\n    05-06. bones.\n\n    bottle, broken.\n\n    chain, corroded.\n\n    club, splintered.\n    10-19. cobwebs.\n\n    coin, copper (bent).\n    21-22. cracks, ceiling.\n    23-24. cracks, floor.\n    25-26. cracks, wall.\n\n    dagger hilt.\n    28-29. dampness, ceiling.\n    30-33. dampness, wall.\n    34-40. dripping.\n\n    dried blood.\n    42-44. dung.\n    45-49. dust.\n\n    flask, cracked.\n\n    food scraps.\n\n    fungi, common.\n    53-55. guano.\n\n    hair/fur bits.\n\n    hammer head, cracked.\n\n    helmet, badly dented.\n\n    iron bar, bent, rusted.\n\n    javelin head, blunt.\n\n    leather boot.\n    62-64. leaves (dry) & twigs.\n    65-68. mold (common).\n\n    pick handle.\n\n    pole, broken.\n\n    pottery shards.\n    72-73. rags.\n\n    rope, rotten.\n    75-76. rubble & dirt.\n\n    sack, torn.\n\n    slimy coating, ceiling.\n\n    slimy coating, floor.\n\n    slimy coating, wall.\n\n    spike, rusted.\n    82-83. sticks.\n\n    stones, small.\n\n    straw.\n\n    sword blade, broken.\n\n    teeth/fangs, scattered.\n    88-89. torch stub.\n    90-91. wall scratchings.\n    92-93. water, small puddle.\n    94-95. water, large puddle.\n\n    water, trickle.\n\n    wax blob (candle stub).\n    98-100. wood pieces, rotting.\n\nd100 Unexplained Sounds and Weird Noises\n01-05. bang, slam.\n06. bellow(ing).\n07. bong.\n08. buzzing.\n09-10. chanting.\n11. chiming.\n12. chirping.\n13. clanking.\n14. clashing.\n15. clicking.\n16. coughing.\n17-18. creaking.\n19. drumming.\n20-23. footsteps (ahead).\n24-26. footsteps (approaching).\n27-29. footsteps (behind).\n30-31. footsteps (receding).\n32-33. footsteps (side).\n34-35. giggling (faint).\n36. gong.\n37-39. grating.\n40-41. groaning.\n42. grunting.\n43-44. hissing.\n45. hooting.\n46. horn/trumpet sounding.\n47. howling.\n48. humming.\n49. jingling.\n50-53. knocking.\n54-55. laughter.\n56-57. moaning.\n58-60. murmuring.\n61. music.\n62. rattling.\n63. ringing.\n64. roar(ing).\n65-68. rustling.\n69-72. scratching/scrabbling.\n73-74. scream(ing).\n75-77. scuttling.\n78. shuffling.\n79-80. slithering.\n81. snapping.\n82. sneezing.\n83. sobbing.\n84. splashing.\n85. splintering.\n86-87. squeaking.\n88. squealing.\n89-90. tapping.\n91-92. thud.\n93-94. thumping.\n95. tinkling.\n96. twanging.\n97. whining.\n98. whispering.\n99-100. whistling.\n\nd100 Furnishing and Appointments, General\n\n    altar.\n\n    armchair.\n\n    armoire.\n\n    arross.\n\n    bag.\n\n    barrel.\n    07-08. bed.\n\n    bench.\n\n    blanket.\n\n    box (large).\n\n    brazier & charcoal.\n\n    bucket.\n\n    buffet.\n\n    bunks.\n\n    butt (large barrel).\n\n    cabinet.\n\n    candelabrum.\n\n    carpet (large).\n\n    cask.\n\n    chandelier.\n\n    charcoal.\n    23-24. chair.\n\n    chair, padded.\n\n    chair, padded, arm.\n\n    chest, large.\n\n    chest, medium.\n\n    chest of drawers.\n\n    closet (wardrobe).\n\n    coal.\n    32-33. couch.\n\n    crate.\n\n    cresset.\n\n    cupboard.\n\n    cushion.\n\n    dias.\n\n    desk.\n    40-42. fireplace & wood.\n\n    fireplace with mantle.\n\n    firkin.\n\n    fountain.\n\n    fresco.\n\n    grindstone.\n\n    hamper.\n\n    hassock.\n\n    hogshead.\n\n    idol (large).\n\n    keg.\n\n    loom.\n\n    mat.\n\n    mattress.\n\n    pail.\n\n    painting.\n    58-60. pallet.\n\n    pedestal.\n    62-64. pegs.\n\n    pillow.\n\n    pipe (large cask).\n\n    quilt.\n    68-70. rug(small/medium).\n\n    rushes.\n\n    sack.\n\n    sconce, wall.\n\n    screen.\n\n    sheet.\n    76-77. shelf.\n\n    shrine.\n\n    sideboard.\n\n    sofa.\n\n    staff, normal.\n\n    stand.\n\n    statue.\n\n    stool, high.\n\n    stool, normal.\n\n    table, large.\n\n    table, long.\n\n    table, low.\n\n    table, round.\n\n    table, small.\n\n    table, trestle.\n\n    tapestry.\n\n    throne.\n\n    trunk.\n\n    tub.\n\n    tun.\n\n    urn.\n\n    wall basin and font.\n\n    wood billets.\n\n    workbench.\n\nd100 Religious Articles and Furnishings\n01-05. altar.\n06-08. bell(s).\n09-11. brazier(s).\n12. candleabra.\n13-14. candles.\n15. candlesticks.\n16. cassocks.\n17. chime(s).\n18-19. cloth (altar).\n20-23. columns/pillars.\n24. curtain/tapestry.\n25. drum.\n26-27. font.\n28-29. gong.\n30-35. holy/unholy symbol(s).\n36-37. holy/unholy writings.\n38-43. idol(s).\n44-48. incense burner(s).\n49. kneeling bench.\n50-53. lamp(s).\n54. lectern.\n55. mosaics.\n56-58. offertory container.\n59. paintings/frescoes.\n60-61. pews.\n62. pipes (musical).\n63. prayer rug.\n64. pulpit.\n65. rail.\n66-67. robes.\n68-69. sanctuary.\n70-71. screen.\n72-76. shrine.\n77. side chair(s).\n78-79. stand.\n80-82. statues(s).\n83. throne.\n84-85. thurible.\n86-88. tripod.\n89-90. vestry.\n91-97. vestments.\n98-99. votive light.\n100. whistle.\n\nd100 Torture Chamber Furnishings\n01-02. bastinadoes.\n03. bell (huge).\n04-06. bench.\n07-10. boots (iron).\n11-15. branding irons.\n16-20. brazier.\n21-22. cage.\n23-26. chains.\n27. chair with straps.\n28. clamps.\n29-31. cressets.\n32. fetters.\n33-35. fire pit.\n36. grill.\n37-38. hooks.\n39-43. iron maiden.\n44. knives.\n45. manacles.\n46. oubliette.\n47-48. oil (barrel of).\n49-50. pillory.\n51-54. pincers.\n55-56. pliers.\n57-58. pot (huge).\n59-66. rack.\n67-68. ropes.\n69. stocks.\n70-71. stool.\n72-75. strappado.\n76-78. straw.\n79-80. table.\n81. thongs.\n82-85. thumb screws.\n86-88. torches.\n89-90. "U" rack.\n91. vice.\n92-93. well.\n94-96. wheel.\n97-100. whips.\n\nd100 Magic-User Furnishings\n01-03. alembic.\n04-05. balance & weights.\n06-09. beaker.\n10. bellows.\n11. bladder.\n12-13. bottle.\n14-16. book.\n17. bowl.\n18. box.\n19-22. brazier.\n23. cage.\n24-25. cauldron.\n26. candle.\n27. candlestick.\n28. carafe.\n29-30. chalk.\n31. crucible.\n32. cruet.\n33. crystal ball.\n34. decanter.\n35. desk.\n36. dish.\n37-38. flask.\n39. funnel.\n40. furnace.\n41-44. herbs.\n45. horn.\n46. hourglass.\n47-48. jar.\n49. jug.\n50. kettle.\n51. ladle.\n52. lamp.\n53. lens (concave, convex, etc...).\n54. magic circle.\n55. mortar & pestle.\n56. pan.\n57-58. parchment.\n59. pentacle.\n60. pentagram.\n61. phial.\n62. pipette.\n63. pot.\n64. prism.\n65. quill.\n66-68. retort.\n69. rod, mixing/stirring.\n70-71. scroll.\n72. scroll tube.\n73. sheet.\n74. skin.\n75. skull.\n76. spatula.\n77. spoon, measuring.\n78. stand.\n79. stool.\n80. stuffed animal.\n81. tank (container).\n82. tongs.\n83. tripod.\n84. tube (container).\n85-86. tube (piping).\n87. tweezers.\n88-90. vial.\n91. waterclock.\n92. wire.\n93-100. workbench.\n\nd100 General Description of Container Contents\n01-03. ash.\n04-06. bark.\n07-09. bone.\n10-14. chunks.\n15-17. cinders.\n18-22. crystals.\n23-26. dust.\n27-28. fibers.\n29-31. gelatin.\n32-33. globes.\n34-37. grains.\n38-40. greasy.\n41-43. husks.\n44-48. leaves.\n49-56. liquid.\n57-58. lump(s).\n59-61. oily.\n62-65. paste.\n66-68. pellets.\n69-81. powder.\n82-83. semi-liquid.\n84-85. skin/hide.\n86-87. splinters.\n88-89. stalks.\n90-92. strands.\n93-95. strips.\n96-100. viscous.\n\nd100 Miscellaneous Utensils and Personal Items\n\n    awl.\n\n    bandages.\n\n    basin.\n    04-05. basket.\n\n    beater.\n\n    book.\n    08-09. bottle.\n\n    bowl.\n\n    box (small).\n    12-13. brush.\n\n    candle.\n\n    candle snuffer.\n\n    candlestick.\n\n    cane (walking stick).\n\n    case.\n\n    casket (small).\n\n    chopper.\n\n    coffer.\n\n    cologne.\n\n    comb.\n\n    cup.\n\n    decanter.\n\n    dipper.\n\n    dish.\n\n    earspoon.\n\n    ewer.\n\n    flagon.\n\n    flask.\n\n    food.\n\n    fork.\n\n    grater.\n\n    grinder.\n\n    hourglass.\n\n    jack (container).\n\n    jar.\n\n    jug.\n\n    kettle.\n\n    knife.\n\n    knucklebones.\n\n    ladle.\n    44-45. lamp/lantern.\n\n    masher.\n\n    mirror.\n\n    mug.\n\n    needle(s).\n\n    oil, cooking (or fuel).\n\n    oil fuel.\n\n    oil, scented.\n\n    pan.\n\n    parchment.\n\n    pitcher.\n\n    pipe, musical.\n\n    pipe, smoking.\n\n    plate.\n\n    platter.\n\n    pot.\n\n    pouch.\n\n    puff.\n\n    quill.\n\n    razor.\n\n    rope.\n\n    salve.\n\n    saucer.\n\n    scraper.\n\n    scroll.\n\n    shaker.\n\n    sifter.\n\n    soap.\n\n    spigot.\n\n    spoon.\n\n    stopper.\n\n    statuette/figurine.\n\n    strainer.\n\n    tankard.\n\n    thongs.\n\n    thread.\n    81-84. tinderbox (with flint & steel).\n    85-86. towel.\n\n    tray.\n\n    trivet.\n\n    tureen.\n    90-91. twine.\n\n    unguent.\n\n    vase.\n\n    vial.\n\n    wallet.\n\n    washcloth.\n\n    whetstone.\n\n    wig.\n\n    wool.\n\n    yarn.\n\nd100 Clothing and Footwear\n01-02. apron.\n03-04. belt.\n05. blouse.\n06-08. boots.\n09. buskins.\n10-11. cap.\n12-13. cape.\n14-16. cloak.\n17-18. coat.\n19. coif.\n20. doublet.\n21-22. dress.\n23-24. frock/pinafore.\n25-26. gauntlets.\n27-28. girdle.\n29. gloves.\n30-31. gown.\n32-34. hat.\n35. habit.\n36-39. hood.\n40-41. hose.\n42-43. jerkin.\n44. jupon.\n45-46. kerchief.\n47-48. kirtle.\n49-50. leggings.\n51-54. linen (drawers).\n55-58. linen (undershirt).\n59. mantle.\n60. pantaloons.\n61-62. petticoat.\n63-66. pouch/purse.\n67-70. robe.\n71-74. sandals.\n75-76. scarf.\n77. shawl.\n78-79. shift.\n80-83. slippers.\n84-86. smock.\n87-89. stockings.\n90. surcoat.\n91. toga.\n92-94. trousers.\n95-96. tunic.\n97. veil.\n98. vest.\n99. wallet.\n100. wrapper.';
    const parsed = parseRedditCollection(table);
    expect(parsed.collection[0].name).toBe('Air Currents');
  });
});

describe('isRedditColleciton', () => {
  it('should return true for a valid collection', () => {
    const table =
      "Random Castle: To the keep!...\n\nd10 The castle sits...\n\n    Atop a mountain.\n\n    On a hill overlooking a wide plain.\n\n    At the fork of a river.\n\n    On a narrow, rocky peninsula.\n\n    Above a seaside cliff.\n\n    On a hill overlooking a river valley.\n\n    On a hill rising out of a swamp.\n\n    On a hill overlooking a forest.\n\n    Astride a desert oasis or natural spring.\n\n    On a ridge overlooking a frozen plain.\n\nd12 The castle was built by...\n\n    A wise king or queen.\n\n    An ambitious lord or lady.\n\n    An evil tyrant.\n\n    A mighty warrior or warlord.\n\n    A retired adventurer.\n\n    A celebrated war hero.\n\n    An unscrupulous king or queen.\n\n    A vain lord or lady.\n\n    A powerful witch or wizard.\n\n    A beloved sovereign.\n\n    A prosperous merchant.\n\n    A member of an ancient noble house.\n\nd4 The castle was built...\n\n    In a past age.\n\n    Hundreds of years ago.\n\n    A few decades ago.\n\n    Within the past decade.\n\nd6 Currently, the castle’s condition is...\n\n    Perfect; upkeep has been fastidious.\n\n    Good; it been well-maintained.\n\n    Decent; there are only a few cracks in the walls, but the place can withstand a siege.\n\n    Fair; the castle has seen better days.\n\n    Poor; the walls and towers are in dire need of repairs.\n\n    Decrepit; the place is practically a ruin.\n\nd12 Presently, the castle is occupied by...\n\n    A member of the royal family.\n\n    An ambitious lord or lady.\n\n    An evil tyrant.\n\n    An elderly lord or lady.\n\n    A brash, young lord or lady.\n\n    A mercenary company.\n\n    A fearsome warlord or retired sellsword.\n\n    A wealthy merchant.\n\n    A retired pirate or thief.\n\n    A former adventurer.\n\n    An absentee noble lord.\n\n    The crown, but the king or queen rarely stays here.\n\nd12 The position or territory is worth defending because...\n\n    Grains grow well on the surrounding land.\n\n    The nearby mines are rich in ores or gems.\n\n    The surrounding land is excellent for grazing livestock.\n\n    Fruit trees grow on the surrounding land.\n\n    The nearby pass is the easiest way to cross the mountains.\n\n    The nearby harbor is important for trade.\n\n    The nearby river is important for trade.\n\n    The nearby source of freshwater is precious is in this region.\n\n    The wild lands beyond are full of threats.\n\n    The surrounding lands are part of a long-standing territorial dispute.\n\n    The surrounding land is held sacred.\n\n    The nearby lands are home to a rare herb, tree, or creature that has magical uses.\n\nd10 The castle’s outer defenses include...\n\n    Very high stone walls.\n\n    Incredibly thick stone walls.\n\n    A series of curtain walls and gatehouses.\n\n    A treacherous climb to reach the castle walls.\n\n    A moat filled with putrescent water.\n\n    A moat filled with thick, boot-sucking mud.\n\n    A moat filled with sharp spikes.\n\n    A moat that is home to one or more dangerous aquatic beasts.\n\n    An immense barbican.\n\n    A narrow footbridge to reach the postern.\n\nd6 The inner keep’s defenses include...\n\n    Hundreds of arrow slits.\n\n    One of the world's largest dual-portcullis gates.\n\n    A winding climb to reach the entrance.\n\n    Several covered parapets with murder holes under which intruders must pass.\n\n    A wide courtyard surrounded by flanking towers in the curtain wall.\n\n    An unusual or hidden means of entry.\n\nd8 The castle can be held effectively by as few as...\n\n    5 soldiers and 20 archers.\n\n    20 soldiers, 5 knights, and 20 archers.\n\n    50 soldiers, 10 knights, and 40 archers.\n\n    20 knights, 20 archers, and 5 warmages.\n\n    100 soldiers, 50 archers, and 5 warmages.\n\n    100 soldiers, 20 knights, and 50 archers.\n\n    200 soldiers, 50 knights, and 100 archers.\n\n    200 soldiers, 100 knights, and 200 archers.\n\nd6 In addition to its garrison, the castle can hold foodstores to withstand a three-month siege for up to...\n\n    50 people.\n\n    100 people.\n\n    200 people.\n\n    500 people.\n\n    1,000 people.\n\n    2,000 people.\n\nd12 The castle is known for...\n\n    Withstanding a grueling, lengthy siege.\n\n    Suffering an immense conflagration.\n\n    Changing hands several times over the course of the same war.\n\n    Bringing ill-fortune to those who hold it.\n\n    Being haunted by a former occupant.\n\n    Never falling in a siege.\n\n    Welcoming travelers seeking refuge.\n\n    Turning away travelers seeking refuge.\n\n    Its unusual architectural style.\n\n    Its beautiful, historic tapestries.\n\n    Its breathtakingly beautiful chapel.\n\n    The quality of its meals.\n\nd12 What is rumored to be hidden in the castle?\n\n    An underground tunnel that can serve as a last-gasp escape route.\n\n    The weapon of a long-dead hero.\n\n    The preserved head of an ancient villain.\n\n    A long-lost religious artifact.\n\n    A missing lord or lady.\n\n    A book of vile curses.\n\n    A book of dark and ancient secrets.\n\n    A cursed treasure hoard.\n\n    The last bottle of famous vintage of wine.\n\n    A lost work of a celebrated artist.\n\n    The crypt of an ancient sovereign.\n\n    An unhatched dragon egg.\n\nd20 Rooms: This chamber is...\n\n    An antechamber or waiting room.\n\n    An armory.\n\n    An aviary, dovecote, owlery, or rookery.\n\n    A banquet hall.\n\n    The barracks.\n\n    A bath or privy.\n\n    A bedroom (d3): 1. simple; 2. comfortable; 3. luxurious.\n\n    A chapel or shrine.\n\n    A crypt.\n\n    An intimate or informal dining room.\n\n    A dressing room.\n\n    A gallery (d6): 1. armor and weaponry; 2. paintings; 3. sculptures; 4. tapestries; 5. hunting trophies; 6. trophies of war.\n\n    A guardroom.\n\n    A kennel, menagerie, or stable.\n\n    The kitchen.\n\n    A library or study.\n\n    A pantry.\n\n    Store room for mundane supplies or a cistern for drinking water.\n\n    The throne room.\n\n    A treasure vault (likely hidden and/or protected by traps).\n\nd20 Features: You notice...\n\n    An armchair flanked by two sconces.\n\n    A large armoire or buffet cabinet.\n\n    A bench with a cusion.\n\n    A brazier.\n\n    A candelabrum on a large table.\n\n    A plain chair beside a window.\n\n    A heavy wooden chest.\n\n    A chest of drawers with a blanket on top.\n\n    A desk with some quills and parchment.\n\n    A fireplace with a mantle.\n\n    A fireplace with a small pile of wood.\n\n    A fresco with a padded chair beneath it.\n\n    Portrait of a noble.\n\n    A painting of a landscape or seascape.\n\n    A bust on a pedestal.\n\n    A shelf containing books or knick knacks.\n\n    A low table in front of a small sofa.\n\n    A large table beneath a chandelier.\n\n    An ornate tapestry.\n\n    A small wall basin and font.\n\nENCOUNTERS\n\nd10 Under siege: You come upon...\n\n    A squad of archers hustling up a stair.\n\n    A patrol of guards brandishing weapons.\n\n    A guard shouting instructions.\n\n    A knight hurrying to the stables.\n\n    A servant cowering in a hiding place.\n\n    A curious child peaking out a window.\n\n    A servant kneeling in prayer.\n\n    A noble hastily penning a letter.\n\n    A squire aiding a knight with his armor.\n\n    A healer checking over his potions.\n\nd10 In peace: You come upon...\n\n    The huntsman cleaning a recent kill.\n\n    The kennelmaster leading a leashed dog.\n\n    The horsemaster instructing a young rider.\n\n    The armorer scolding an apprentice.\n\n    A maid fussing over her lady’s dress.\n\n    The tutor or sage lost in a book.\n\n    The chaplain whispering with a maid.\n\n    A maid polishing an ornamental shield.\n\n    A servant carrying a tray of food.\n\n    Several archers practicing in the yard.";
    expect(isRedditCollection(table)).toBe(true);
  });

  it('should return false for a single table', () => {
    const table =
      "Random Castle: To the keep!...\n\nd10 The castle sits...\n\n    Atop a mountain.\n\n    On a hill overlooking a wide plain.\n\n    At the fork of a river.\n\n    On a narrow, rocky peninsula.\n\n    Above a seaside cliff.\n\n    On a hill overlooking a river valley.\n\n    On a hill rising out of a swamp.\n\n    On a hill overlooking a forest.\n\n    Astride a desert oasis or natural spring.\n\n    On a ridge overlooking a frozen plain.\n\nd12 The castle was built by...\n\n    A wise king or queen.\n\n    An ambitious lord or lady.\n\n    An evil tyrant.\n\n    A mighty warrior or warlord.\n\n    A retired adventurer.\n\n    A celebrated war hero.\n\n    An unscrupulous king or queen.\n\n    A vain lord or lady.\n\n    A powerful witch or wizard.\n\n    A beloved sovereign.\n\n    A prosperous merchant.\n\n    A member of an ancient noble house.\n\nd4 The castle was built...\n\n    In a past age.\n\n    Hundreds of years ago.\n\n    A few decades ago.\n\n    Within the past decade.\n\nd6 Currently, the castle’s condition is...\n\n    Perfect; upkeep has been fastidious.\n\n    Good; it been well-maintained.\n\n    Decent; there are only a few cracks in the walls, but the place can withstand a siege.\n\n    Fair; the castle has seen better days.\n\n    Poor; the walls and towers are in dire need of repairs.\n\n    Decrepit; the place is practically a ruin.\n\nd12 Presently, the castle is occupied by...\n\n    A member of the royal family.\n\n    An ambitious lord or lady.\n\n    An evil tyrant.\n\n    An elderly lord or lady.\n\n    A brash, young lord or lady.\n\n    A mercenary company.\n\n    A fearsome warlord or retired sellsword.\n\n    A wealthy merchant.\n\n    A retired pirate or thief.\n\n    A former adventurer.\n\n    An absentee noble lord.\n\n    The crown, but the king or queen rarely stays here.\n\nd12 The position or territory is worth defending because...\n\n    Grains grow well on the surrounding land.\n\n    The nearby mines are rich in ores or gems.\n\n    The surrounding land is excellent for grazing livestock.\n\n    Fruit trees grow on the surrounding land.\n\n    The nearby pass is the easiest way to cross the mountains.\n\n    The nearby harbor is important for trade.\n\n    The nearby river is important for trade.\n\n    The nearby source of freshwater is precious is in this region.\n\n    The wild lands beyond are full of threats.\n\n    The surrounding lands are part of a long-standing territorial dispute.\n\n    The surrounding land is held sacred.\n\n    The nearby lands are home to a rare herb, tree, or creature that has magical uses.\n\nd10 The castle’s outer defenses include...\n\n    Very high stone walls.\n\n    Incredibly thick stone walls.\n\n    A series of curtain walls and gatehouses.\n\n    A treacherous climb to reach the castle walls.\n\n    A moat filled with putrescent water.\n\n    A moat filled with thick, boot-sucking mud.\n\n    A moat filled with sharp spikes.\n\n    A moat that is home to one or more dangerous aquatic beasts.\n\n    An immense barbican.\n\n    A narrow footbridge to reach the postern.\n\nd6 The inner keep’s defenses include...\n\n    Hundreds of arrow slits.\n\n    One of the world's largest dual-portcullis gates.\n\n    A winding climb to reach the entrance.\n\n    Several covered parapets with murder holes under which intruders must pass.\n\n    A wide courtyard surrounded by flanking towers in the curtain wall.\n\n    An unusual or hidden means of entry.\n\nd8 The castle can be held effectively by as few as...\n\n    5 soldiers and 20 archers.\n\n    20 soldiers, 5 knights, and 20 archers.\n\n    50 soldiers, 10 knights, and 40 archers.\n\n    20 knights, 20 archers, and 5 warmages.\n\n    100 soldiers, 50 archers, and 5 warmages.\n\n    100 soldiers, 20 knights, and 50 archers.\n\n    200 soldiers, 50 knights, and 100 archers.\n\n    200 soldiers, 100 knights, and 200 archers.\n\nd6 In addition to its garrison, the castle can hold foodstores to withstand a three-month siege for up to...\n\n    50 people.\n\n    100 people.\n\n    200 people.\n\n    500 people.\n\n    1,000 people.\n\n    2,000 people.\n\nd12 The castle is known for...\n\n    Withstanding a grueling, lengthy siege.\n\n    Suffering an immense conflagration.\n\n    Changing hands several times over the course of the same war.\n\n    Bringing ill-fortune to those who hold it.\n\n    Being haunted by a former occupant.\n\n    Never falling in a siege.\n\n    Welcoming travelers seeking refuge.\n\n    Turning away travelers seeking refuge.\n\n    Its unusual architectural style.\n\n    Its beautiful, historic tapestries.\n\n    Its breathtakingly beautiful chapel.\n\n    The quality of its meals.\n\nd12 What is rumored to be hidden in the castle?\n\n    An underground tunnel that can serve as a last-gasp escape route.\n\n    The weapon of a long-dead hero.\n\n    The preserved head of an ancient villain.\n\n    A long-lost religious artifact.\n\n    A missing lord or lady.\n\n    A book of vile curses.\n\n    A book of dark and ancient secrets.\n\n    A cursed treasure hoard.\n\n    The last bottle of famous vintage of wine.\n\n    A lost work of a celebrated artist.\n\n    The crypt of an ancient sovereign.\n\n    An unhatched dragon egg.\n\nd20 Rooms: This chamber is...\n\n    An antechamber or waiting room.\n\n    An armory.\n\n    An aviary, dovecote, owlery, or rookery.\n\n    A banquet hall.\n\n    The barracks.\n\n    A bath or privy.\n\n    A bedroom (d3): 1. simple; 2. comfortable; 3. luxurious.\n\n    A chapel or shrine.\n\n    A crypt.\n\n    An intimate or informal dining room.\n\n    A dressing room.\n\n    A gallery (d6): 1. armor and weaponry; 2. paintings; 3. sculptures; 4. tapestries; 5. hunting trophies; 6. trophies of war.\n\n    A guardroom.\n\n    A kennel, menagerie, or stable.\n\n    The kitchen.\n\n    A library or study.\n\n    A pantry.\n\n    Store room for mundane supplies or a cistern for drinking water.\n\n    The throne room.\n\n    A treasure vault (likely hidden and/or protected by traps).\n\nd20 Features: You notice...\n\n    An armchair flanked by two sconces.\n\n    A large armoire or buffet cabinet.\n\n    A bench with a cusion.\n\n    A brazier.\n\n    A candelabrum on a large table.\n\n    A plain chair beside a window.\n\n    A heavy wooden chest.\n\n    A chest of drawers with a blanket on top.\n\n    A desk with some quills and parchment.\n\n    A fireplace with a mantle.\n\n    A fireplace with a small pile of wood.\n\n    A fresco with a padded chair beneath it.\n\n    Portrait of a noble.\n\n    A painting of a landscape or seascape.\n\n    A bust on a pedestal.\n\n    A shelf containing books or knick knacks.\n\n    A low table in front of a small sofa.\n\n    A large table beneath a chandelier.\n\n    An ornate tapestry.\n\n    A small wall basin and font.\n\nENCOUNTERS\n\nd10 Under siege: You come upon...\n\n    A squad of archers hustling up a stair.\n\n    A patrol of guards brandishing weapons.\n\n    A guard shouting instructions.\n\n    A knight hurrying to the stables.\n\n    A servant cowering in a hiding place.\n\n    A curious child peaking out a window.\n\n    A servant kneeling in prayer.\n\n    A noble hastily penning a letter.\n\n    A squire aiding a knight with his armor.\n\n    A healer checking over his potions.\n\nd10 In peace: You come upon...\n\n    The huntsman cleaning a recent kill.\n\n    The kennelmaster leading a leashed dog.\n\n    The horsemaster instructing a young rider.\n\n    The armorer scolding an apprentice.\n\n    A maid fussing over her lady’s dress.\n\n    The tutor or sage lost in a book.\n\n    The chaplain whispering with a maid.\n\n    A maid polishing an ornamental shield.\n\n    A servant carrying a tray of food.\n\n    Several archers practicing in the yard.";
    expect(isRedditCollection(table)).toBe(true);
  });
});
