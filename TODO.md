==================== phase 1 ========================
TODO

Simi:

x Tabs for divs (herbs, processing, compost, info?, projects?)
? Map: colors, dude, hq, compost
x Images for compost (heap, barrel, silo)
Tea icon
x Worker Strategy
Concept: Tutorial, Infobox, Tooltip, Explore
? fit layout to screen
? BG Kulisse
Fix the pngs, color wrong
? border top, left, right
Start page
Add tooltips divs
Style progress bars
? Videos between phases, intro?
Story:
    Project descriptions
Release:
    Tea, Tea cups, Tea bags, Infusions, ...
    NAME of the GAME
    Logo

Oli:

Bottom border
x Clean code:
    x slow update
    x refactor render text in engine subclasses
    x only render necessary text in tick
x change map color gradient (config option)
x collecting efficiency
x slider: collector <-> fertilizer
x base collecting (no fertilizer) more
x strategies smaller
x fullscreen
x Processors not auto-clicking
x Map scaling
x No compost on headquarters, water, other compost, ...
x Don't lose compost on map bigger
x Projects location responsive
? Compost as cursor, when placing
X Worker Strategy: More logical (arrows, home, smart)
x Where is the garden / size
x nEGATIVE tEABAGS, GARDEN SIZE
? Greenhouse Tech sometimes not visible
x weird layout composts, price/spacer

Release:
    clean code
    options
    beta phase, feedback
    long-term planning
    communication
    Money
    Save teste

Balance last quarter of phase 1:
    Processing efficiency

NO

info box
? Autocompost

==================== phase 2 ========================

GRAPHICS:
focus-project-box design: costum box, progressbar border and color/style

tooltips & tutorial

Simi:
    Layout overhaul 1
        Box placement
            Worker box placement (left or middle)
        Focus (resource), out of box, in teabag box, new box, ... ?
            Maybe combine cult-bonus & focus ??
        Focus box (more mystical?)
            What is it? Meditation, Focus ritual, ceremony, ...
            Generator vs Converter design
            Progress bar?

    Different colors for the three resources/cult-bonuses:
        Similar to 3rd phase: fire, nature, water
        focus (blue), farming (green), processing (red, rusty, fire)

    Worker icon
    Tab icons for all left boxes
    Better design of cult-bonus
    Color scheme
    ? Monk Tab

Oli:
    x Fix Meditation
    buyable, error message: e.g. "Not enough workers"
    Functional save
    Remove buttons when not possible (or message): +- on workers

    x Monks / Cultists / Followers
        x New worker category (like farmers & processors)
        ? No minus
        x Generate meditation points / focus actions
            x More monks
                x Faster meditation point generation
                x Reach higher thresholds
            x Shown as a charging bar, with (multiple) thresholds
                x How many thresholds? Number of monks
            x Different focus projects require more meditation points
                x More expensive focus projects give much more resources
            x Focus projects use up (all the?) meditation points
            ? Free workers = Shitty monks
            ? Old school meditation also generates new school meditation points

    Rework focus project generation

Balance:
    Invent & Polish story
    Project order -> Balance
    Simpler introduction to focus projects
        beginning only focus generator, only 1
        no cult-bonuses in beginning
        introduce cult-bonus one after other

    ? project "tea-ceremony" gives 1 extra worker

    Meditation has to be possible, or cancelable, or ...

## CHANGES

Allgemein:
- reload page crates "new", feritlized garden
- use class="clickable" for elements, which can be clicked for consistent design
- grey out buttons, which are not possible to click (not enough teabags)
- change colors for meditation to fit the color scheme (when color scheme is fix)
- change colors for garden to fit the color scheme (when color scheme is fix)

==== Phase 1 ====
OK worker left/right strategy earlier 40Tb
OK Gardening is fun -> increase garden size
OK order projects after price?
OK bigger compost upgrade too expensive?
OK statistics not worth that much (50)
OK smart is gamechanger (more expensive?)
OK Processing Efficiency cheaper?
OK price of silo != written price
- more processors possible
- new teabag-boost at the end of phase 1
- (farmer efficiency boost?)
- greenhouse technology is grindy (pricejump big)

==== Phase 2 ====
OK Focus: alway one generator
- Focus: possibility to create new cards