# alibot-mc
Bot for Minecraft. (designed for and tested on 0b0t.org)

[Help](#commands)
[Install](#install)

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

#### Windows
Install node.js from [this link](https://nodejs.org/)

Install git from [this link](https://git-scm.com)

Open `cmd`

Change directory to your Desktop or where you want to create a folder and install it in it. (`cd [location]`)

Write these commands in order:
```bat
git clone https://github.com/uAliFurkanY/alibot-mc.git
cd alibot-mc
npm i
node setup.js
start
```
Now, it should work!

#### GNU/Linux
You will need the "git" version control tools.

On Fedora-based systems, do "yum install git".

On Debian-based ones install the "git-core" package.

Then run "git --version".  If that says it's older than
version 1.4.4, then you'd do well to get a newer version.

At worst, just download the latest stable release from
https://git-scm.com/ and build from source.

Also, "Node.js".

On Fedora-based systems, do "yum install node".

On Debian-based ones install the "node" package.

Then run "node -v". If that says it's older than version 10.x.x, then you'd do well to get a newer version.

At worst, just download the latest package from https://nodejs.org and install it.

Now, open your terminal. Go in a directory that you wish to clone the repository into.

Then, run these commands in order:
```sh
git clone https://github.com/uAliFurkanY/alibot-mc.git
cd alibot-mc
npm i
node setup.js
./start.sh
```
Now, it should work!