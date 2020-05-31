const arg = require("minimist");
const path = require("path");
const fs = require("fs");
const request = require("request");

let config = arg;
let envFile = path.join(__dirname, arg.e || arg.env || ".env");
let delays = [[0 * 1000, 5 * 1000, 5 * 60 * 1000, 0.5 * 1000], [5 * 1000, 10 * 1000, 10 * 60 * 1000, 1.5 * 1000], [10 * 1000, 20 * 1000, 20 * 60 * 1000, 2.5 * 1000], [20 * 1000, 40 * 1000, 40 * 60 * 1000, 5 * 1000], [5 * 1000, 15 * 1000, 30 * 60 * 1000, 2 * 1000]];

try { require("dotenv").config({ path: envFile }); } catch { }

try {
	let conf = require(require("path").join(__dirname, "config.json"));
	config.WEBSITE = arg.w || process.env.CONF_WEBSITE || conf.WEBSITE || "https://github.com/uAliFurkanY/alibot-mc/"; // You probably shouldn't change this.
	config.HOST = arg.h || process.env.CONF_HOST || conf.HOST || "0b0t.org";
	config.USERNAME = arg.u || process.env.CONF_USERNAME || conf.USERNAME || "alibot";
	config.PASSWORD = arg.p || process.env.CONF_PASSWORD || conf.PASSWORD || false;
	config.OP = arg.o || process.env.CONF_OP || conf.OP || "AliFurkan";
	config.MODE = arg.m || process.env.CONF_MODE || conf.MODE || "public";
	config.ACTIVE = arg.a || process.env.CONF_ACTIVE || conf.ACTIVE || "true";
	config.DELAYS = delays[arg.d || process.env.CONF_DELAYS || conf.DELAYS || 1];
} catch (e) {
	log("This error should NEVER happen. If it did, you edited/deleted 'config.json'. If you didn't, create an Issue. If you did, just use setup.js.");
	log("Also provide this: ");
	console.log(e);
	process.exit(1);
}


const isVarSet = () => !!(config.HOST && config.USERNAME && config.PASSWORD && config.OP && config.MODE && config.ACTIVE && config.DELAYS);
if (!isVarSet()) {
	console.error("Run setup.js and try again.");
	process.exit(0);
}
if (config.ACTIVE === "false") {
	process.exit(0);
}

const mineflayer = require("mineflayer");
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const readline = require('readline');
const Vec3 = require("vec3");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


let op = config.OP.split(",");
log("Operators: " + op);

let lastkill = Date.now();
let start = Date.now();
let username;

let toSend = [];
let intervals = [
	setInterval(() => {
		if (toSend.length !== 0 && spawned) {
			bot.chat(toSend[0]);
			log(toSend[0], true);
			toSend.shift();
		}
	}, config.DELAYS[3])
];
let intervalNames = [
	"0: MAIN MESSAGE LOOP"
];

let session = false;

let login = {
	host: config.HOST,
	username: config.USERNAME,
	password: config.PASSWORD,
	session: session,
};

let version = "0.0.1";
let mode = config.MODE;
let firstchat = true;
let spawned = false;

let bot;

function isValidHttpUrl(string) {
	let url;

	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}

	return url.protocol === "http:" || url.protocol === "https:";
}

function log(message, sent = false, date = new Date(Date.now())) {
	console.log(`<${date.getHours()}:${date.getMinutes()}> ${sent ? "[SENT] " : " "} ${message}`);
}

function send(msg = "/help") {
	toSend.push(msg);
}

function msg(msg, u) {
	send(`/msg ${u} ${msg}`);
}

function randStr(length) {
	let result = "";
	let characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function goToSleep(u) {
	const bed = bot.findBlock({
		matching: block => bot.isABed(block)
	})
	if (bed) {
		bot.sleep(bed, (err) => {
			if (err) {
				msg(`I can't sleep: ${err.message}`, u);
			} else {

			}
		})
	} else {
		msg(`No nearby bed`, u);
	}
}

function wakeUp(u) {
	bot.wake((err) => {
		if (err) {
			msg(`I can't wake up: ${err.message}`, u);
		} else {

		}
	})
}

function init(r) {
	spawned = false;
	log(`[${Date.now()}] Init ${r}`);
	bot = mineflayer.createBot(login);
	navigatePlugin(bot);

	toSend = [];

	lastkill = Date.now();
	start = Date.now();

	function main() {
		spawned = true;
		username = bot.player.username;
		op.push(username);
		log("Spawned. Username: " + username);
		// send(`/msg " + op[0] + " Logged in.");
		// bot.on("", (u, m, t, rm) => {});
		bot.chatAddPattern(
			/^[a-zA-Z0-9_]{3,16} wants to teleport to you\.$/,
			"tpa",
			"received tpa"
		);
		bot.chatAddPattern(
			/^[a-zA-Z0-9_]{3,16} whispers: /,
			"msg",
			"received msg"
		);
		bot.on("tpa", (u, m, t, rm) => {
			let user = m.extra[0].text;
			log(user + " tpa");
			if (op.includes(user) || mode !== "private") {
				send(`/tpy ${user}`);
			} else {
				msg(`You are not an operator and the mode is ${mode}.`, user);
			}
		});
		bot.on("msg", (u, m, t, rm) => {
			m = m.extra[0].text.trim();
			u = m.split(" ")[0];
			if (m.split(": ")[1] === undefined) {
				log(`${u} empty message`);
				return false;
			}
			m = m.split(": ");
			m.shift();
			m = m.join(": ");
			log(`${u} -> ${m}`);
			let args = m.split(" ");
			args.shift();
			let oldm = m;
			m = m.split(" ")[0];
			handleCommand(m, u, args, oldm);
		});

	}
	bot.once("spawn", main);
	bot._client.once("session", () => {
		session = bot._client.session;
		login.session = session;
	});
	bot.once("login", () => log("Logged in."));
	bot.once("kick", () => setTimeout(() => init("Kick"), config.DELAYS[0]));
	bot.once("end", () => { console.log("Got 'end'!"); setTimeout(() => init("End"), config.DELAYS[1]); });
	bot.once("error", (m) => {
		if (m.message === "Invalid session.") {
			session = false;
			init("Error " + m);
		} else if (
			m.message === "Invalid credentials. Invalid username or password."
		) {
			setTimeout(() => init("Error"), config.DELAYS[2]);
		}
	});
	bot.on('sleep', () => {
		log(`SLEEPING`);
	})
	bot.on('wake', () => {
		log(`WOKE UP`);
	})
}

function handleCommand(m, u, args, rm = "") {
	switch (m) {
		case "help":
			msg(config.WEBSITE || "https://github.com/uAliFurkanY/alibot-mc/", u);
			break;
		case "kill":
			if (op.includes(u) ||
				(Date.now() >= lastkill + 15 * 1000 && mode !== "private")) {
				send(`/kill`);
			} else {
				msg(`Declining! You're not an operator and the mode is ${mode}.`, u);
			}
			break;
		case "tphere":
			if (op.includes(u) || mode === "public") {
				args.length === 1 ? send(`/tpa ${args[0]}`) : send(`/tpa ${u}`);
			} else {
				msg(`Declining! You're not an operator and the mode is ${mode}.`, u);
			}
			break;
		case "say":
			if (op.includes(u)) {
				send(rm.substr(4));
			} else {
				msg(`You are not an operator.`, u);
			}
			break;
		case "op":
			if (op.includes(u) && args.length >= 1) {
				op.push(args[0]);
				msg(`Opped ${args[0]}`, u);
			} else {
				msg(op.join(", "), u);
			}
			break;
		case "coords":
			if (op.includes(u) || mode !== "private") {
				msg(`My coords are: ${bot.player.entity.position.x} ${bot.player.entity.position.y} ${bot.player.entity.position.z}.`, u);
			} else {
				msg(`You are not an operator and the mode is ${mode}.`, u);
			}
			break;
		case "discord":
			msg(`https://discord.gg/gr8y8hY`, u);
			break;
		case "ping":
			if (args.length >= 1) {
				msg(`${args[0]}'s ping is ${bot.players[args[0]].ping}ms.`, u);
			} else {
				msg(`Your ping is ${bot.players[u].ping}ms.`, u);
			}
			break;
		case "mode":
			if (op.includes(u) && args.length >= 1) {
				msg(`Changing the mode to ${args[0]}.`, u);
				mode = args[0];
			} else {
				msg(`The mode is ${mode}`, u);
			}
			break;
		case "reinit":
			if (op.includes(u)) {
				init("reinit")
			} else {
				msg(`You are not an operator.`, u);
			}
			break;
		case "random":
			if (args.length === 0) {
				msg(`Usage: random [dice|number <min> <max>]`, u);
			} else if (args[0] === "number") {
				if (args.length >= 4) {
					if (parseInt(args[1]) !== NaN && parseInt(args[2]) !== NaN) {
						let nums = [parseInt(args[1]), parseInt(args[2])];
						if (nums[1] > nums[0]) {
							msg(`Your random number is ${Math.floor(Math.random() * (nums[1] - nums[0] + 1)) + 1}.`, u);
						} else {
							msg(`Minimum is larger than maximum.`, u);
						}
					} else {
						msg(`You did not provide a number.`, u);
					}
				} else {
					msg(`Usage: random [dice|number <min> <max>]`, u);
				}
			} else if (args[0] === "dice") {
				msg(`You rolled ${Math.floor(Math.random() * (6 - 1 + 1)) + 1}.`, u);
			}
			break;
		case "sleep":
			op.includes(u) ? goToSleep(u) : false;
			break;
		case "wakeup":
			op.includes(u) ? wakeUp(u) : false;
			break;
		case "parse":
			parse(u, args, false, 0, (args[2] == "true" ? true : false) || false);
			break;
		case "spam":
			parse(u, args, true, parseInt(args[2]) || 0, (args[3] == "true" ? true : false) || false);
			break;
		case "stopLoop":
			if (op.includes(u)) {
				clearInterval(intervals[(parseInt(args[0]) || 1)]);
				intervalNames[intervals[(parseInt(args[0]) || 1)]] += " (stopped)";
			} else {
				msg(`You are not an operator.`, u);
			}
			break;
		case "listLoop":
			msg(`Current Intervals: ${intervalNames.join(", ")}`, u);
			break;
		case "goto":
			if (op.includes(u) || mode === "public") {
				let coords = [parseInt(args[0]) || 0, parseInt(args[1]) || 0, parseInt(args[2]) || 0];
				msg(`Going to: ${coords.join(" ")}.`, u);
				try { bot.navigate.to(new Vec3(coords[0], coords[1], coords[2])); } catch (e) {
					msg(`An error occured. See: ${e.message}.`, u);
				}
			} else {
				msg(`You are not an operator and the mode is ${mode}.`, u);
			}
			break;
		case "cancelGoto":
			if (op.includes(u) || mode === "public") {
				msg(`OK. Stopping...`, u);
				try { bot.navigate.stop(); } catch (e) {
					msg(`An error occured. See: ${e.message}.`, u);
				}
			} else {
				msg(`You are not an operator and the mode is ${mode}.`, u);
			}
			break;
	}
}

function parse(u, args, loop = false, delay = 0, random = false) {
	if (op.includes(u)) {
		if (args[0] === "web" || args[0] === "file") {
			if (args[1]) {
				if (args[0] === "file") {
					let output = "";
					if (fs.existsSync(args[1])) {
						output = loadArray(fs.readFileSync(args[1]).toString().split("\n"), loop, delay, random, u) || "No output."
					} else if (fs.existsSync(path.join(__dirname, args[1]))) {
						output = loadArray(fs.readFileSync(path.join(__dirname, args[1])).toString().split("\n"), loop, delay, random, u) || "No output.";
					} else {
						return msg(`Specified file doesn't exist.`, u);
					}
					msg(`Done: ${output}`, u);
					log(output);
				}
				else if (args[0] === "web") {
					if (isValidHttpUrl(args[1])) {
						request(args[1], (e, r, b) => {
							let output = "";
							if (e) {
								console.log(e);
								output = e.message;
							}
							loadArray(b.toString().split("\n"), loop, delay, random, u);
							msg(`Done: ${output}`, u);
							log(output);
						});
					} else {
						msg(`This isn't a valid HTTP URL.`, u);
					}
				}
			} else {
				msg(`No file/url specified.`);
			}
		} else {
			msg(`Mode should be either 'web' or 'file'.`, u);
		}
	} else {
		msg(`You are not an operator.`, u);
	}
}

function loadArray(commands = [], loop, delay, random, u) {
	try {
		if (loop) {
			let date = new Date(Date.now());
			let i = 0;
			let interval = setInterval(() => {
				log("Spam: " + i);
				let m = commands[i % commands.length];
				m = m.trim();
				if (random) {
					m += ` (${randStr("8")})`;
				}
				u = u || username;
				if (m.length === 0) {
					log(`${u} empty message`);
					return false;
				}
				log(`${u} -> ${m}`);
				let args = m.split(" ");
				args.shift();
				let rm = m;
				m = m.split(" ")[0];
				handleCommand(m, u, args, rm);
				i++;
			}, delay);
			intervals.push(interval);
			intervalNames.push(`${intervals.length - 1}: <${date.getHours()}:${date.getMinutes()}> ${u}`);
			return intervals.length - 1;
		} else {
			return commands.map(m => {
				m = m.trim();
				if (random) {
					m += ` (${randStr("8")})`;
				}
				u = u || username;
				if (m.length === 0) {
					log(`${u} empty message`);
					return false;
				}
				log(`${u} -> ${m}`);
				let args = m.split(" ");
				args.shift();
				let rm = m;
				m = m.split(" ")[0];
				handleCommand(m, u, args, rm);
			}).length + " command(s) ran.";
		}
	} catch (e) {
		return e.message;
	}
}

init("First Start");

try {
	rl.on("line", (m) => {
		if (spawned) {
			m = m.trim();
			let u = username;
			if (m.length === 0) {
				log(`${u} empty message`);
				return false;
			}
			log(`${u} -> ${m}`);
			let args = m.split(" ");
			args.shift();
			let rm = m;
			m = m.split(" ")[0];
			handleCommand(m, u, args, rm);
		}
	});
} catch { }