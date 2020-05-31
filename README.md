# alibot-mc
Bot for Minecraft. (designed for and tested on 0b0t.org)

[Help](#commands)
[Install](#install)
[Build](#build)
[Run](#run)
[Update](#update)

## Commands
*: Only in public mode.
**: Operator only.

#### help
	help
Sends a link to here.

#### kill
 	kill
Kills the bot. *

#### tpa
	/tpa <bot_name>
Automatically accepts your teleportation request. *

#### tphere
	tphere [user]
Sends you or the specified user a teleportation request. **

#### say
	say <msg>
Makes the bot say something. **

#### coords
	coords
Tells you the bot's coordinates. *

#### discord
	discord
Sends you the Discord link.

#### ping
	ping
Tells you the ping of you or the specified user.

#### mode
	mode [mode**]
Tells you the mode or changes it.

#### random
	random [dice|number <min> <max>]
Random number stuff.

#### sleep
	sleep
Makes the bot sleep. **

#### wakeup
	wakeup
Makes the bot wake up. **

#### parse
	parse <web [url]|file [path]> [random]
Makes the bot load commands from a file. **

#### spam
	spam <web [url]|file [path]> [delay] [random]
Makes the bot load commands from a file and repeat. **

#### stopLoop
	stopLoop <id>
Makes the bot stop a `spam` loop.

## Install
1: Download the latest release for your OS from [here](https://mega.nz/folder/dWpknQIT#QxtqVPco9VGFmQ7LVZz_mg
2: Extract it to somewhere.
3: Start `alibot`.

## Build
You'll need `node` and the `npm` package `pkg` for this. https://nodejs.org

First, clone the repository.
Then, change directory to in it.
After that, run `npm run-script build-[win, linux or macos]`.
Finally, wait until it builds.

## Run
You'll need `node` for this.

First, clone the repository.
Then, change directory to in it.
After that, run `npm i`.
After it finishes, run `node .`.

### Update
If you cloned the repository correctly, you should be able to just run `git pull` to update it.