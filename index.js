const arg = require("minimist");
const path = require("path");

let config = arg;
let envFile = path.join(__dirname, arg.e || arg.env || ".env");

try { require("dotenv").config({ path: envFile }); } catch { }

try {
	let conf = require(require("path").join(__dirname, "config.json"));
	config.WEBSITE = arg.w || process.env.CONF_WEBSITE || conf.WEBSITE || "http://alibot.ml"; // You probably shouldn't change this.
	config.HOST = arg.h || process.env.CONF_HOST || conf.HOST || "0b0t.org";
	config.USERNAME = arg.u || process.env.CONF_USERNAME || conf.USERNAME || "alibot";
	config.PASSWORD = arg.p || process.env.CONF_PASSWORD || conf.PASSWORD || false;
	config.OP = arg.o || process.env.CONF_OP || conf.OP || "AliFurkan";
	config.MODE = arg.m || process.env.CONF_MODE || conf.MODE || "public";
	config.ACTIVE = arg.a || process.env.CONF_ACTIVE || conf.active || "true";
} catch {
	console.log("This error should NEVER happen. If it did, you edited/deleted 'config.json'. If you didn't, create an Issue. If you did, just use setup.js.");
	process.exit(1);
}


const isVarSet = () => !!(config.HOST && config.USERNAME && config.PASSWORD && config.OP && config.MODE && config.ACTIVE);
if (!isVarSet()) {
	console.log("Run setup.js and try again.");
	process.exit(0);
}
if (config.ACTIVE === "false") {
	process.exit(0);
}

const mineflayer = require("mineflayer");

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

let op = config.OP.split(",");
console.log("Operators: " + op);

let lastkill = Date.now();
let start = Date.now();
let username;

let toSend = [];
setInterval(() => {
	if (toSend.length !== 0 && Date.now() >= start + 15 * 1000) {
		bot.chat(toSend[0]);
		toSend.shift();
	}
}, 1500);

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

let bot;

function init(r) {
	console.log(`[${Date.now()}] Init ${r}`);
	bot = mineflayer.createBot(login);

	toSend = [];

	lastkill = Date.now();
	start = Date.now();

	function main() {
		username = bot.player.username;
		console.log("Spawned. Username: " + username);
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
			console.log(user + " tpa");
			if (op.includes(user) || mode !== "private") {
				send(`/tpy ${user}`);
			} else {
				msg(`Declining! You are not in the operators list and the mode is ${mode}.`, u);
				send(`/tpn ${user}`);
			}
		});
		bot.on("msg", (u, m, t, rm) => {
			m = m.extra[0].text.trim();
			u = m.split(" ")[0];
			if (m.split(": ")[1] === undefined) {
				console.log(`${u} empty message`);
				return false;
			}
			m = m.split(": ")[1];
			console.log(`${u} -> ${m}`);
			let args = m.split(" ");
			args.shift();
			if (m.startsWith("help")) {
				msg(config.WEBSITE || "https://github.com/uAliFurkanY/alibot-mc/", u);
			} else if (m.startsWith("tphere")) {
				if (op.includes(u) || mode === "public") {
					send(`/tpa ` + u);
				} else {
					msg(`Declining! You're not an operator and the mode is ${mode}.`, u);
				}
			} else if (m.startsWith("kill")) {
				op.includes(u) ||
					(Date.now() >= lastkill + 15 * 1000 && mode !== "private")
					? send(`/kill`)
					: msg(
						`Declining! You're not an operator and the mode is ${mode}.`,
						u
					);
			} else if (m.startsWith("op")) {
				if (op.includes(u) && args.length >= 1) {
					op.push(args[0]);
					msg(`Opped ${args[0]}`, u);
				} else {
					msg(op.join(", "), u);
				}
			} else if (m.startsWith("coords")) {
				if (op.includes(u) || mode === "public") {
					msg(`My coords are: ${bot.player.entity.position.x} ${bot.player.entity.position.y} ${bot.player.entity.position.z}.`, u);
				} else {
					msg(`You are not an operator and the mode is ${mode}.`, u);
				}
			} else if (m.startsWith("discord")) {
				msg(`Under construction.`, u);
			} else if (m.startsWith("ping")) {
				if (args.length >= 1) {
					msg(`${args[0]}'s ping is ${bot.players[args[0]].ping}ms.`, u);
				} else {
					msg(`Your ping is ${bot.players[u].ping}ms.`, u);
				}
			} else if (m.startsWith("mode")) {
				if (op.includes(u) && args.length >= 1) {
					msg(`Changing the mode to ${args[0]}.`, u);
					mode = args[0];
				} else {
					msg(`The mode is ${mode}`, u);
				}
			} else if (m.startsWith("reinit")) {
				if (op.includes(u)) {
					init("reinit")
				} else {
					msg(`You are not an operator.`, u);
				}
			} else if (m.startsWith("random")) {
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
			} else if (m.startsWith("say")) {
				if (op.includes(u)) {
					say(args[0]);
				} else {
					msg(`You are not an operator.`, u);
				}
			}
		});
	}
	bot.once("spawn", main);
	bot._client.once("session", () => {
		session = bot._client.session;
		login.session = session;
	});
	bot.once("login", () => console.log("Logged in."));
	bot.once("kick", () => init("Kick"));
	bot.once("end", () => setTimeout(() => init("End"), 10 * 1000));
	bot.once("error", (m) => {
		if (m.message === "Invalid session.") {
			session = false;
			init("Error " + m);
		} else if (
			m.message === "Invalid credentials. Invalid username or password."
		) {
			setTimeout(() => init("Error"), 10 * 60 * 1000);
		}
	});
}
init("First Start");