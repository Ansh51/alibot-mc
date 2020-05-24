const rl = require("readline-sync");
const fs = require("fs");
let host, user, pass, op, mode, active;
host = rl.question("Enter the server that the bot will run on: ");
user = rl.question("Enter the MC account email/username: ");
pass = rl.question("Enter the MC account password: ", {
	hideEchoBack: true
});
op = rl.question("Enter the operators of the bot separated by ',': ");
let modes = ["public", "private"];
mode = modes[rl.keyInSelect(modes, "Select the mode: ")] || "public";
active = rl.keyInYNStrict("Should it be active? ") ? "true" : "false";
console.clear();
console.log("Server: " + host);
console.log("User: " + user);
console.log("Password: " + pass);
console.log("Operators: " + op);
console.log("Mode: " + mode);
console.log("Active: " + active);
if(rl.keyInYNStrict("Is this ok? ")) {
	console.clear();
	fs.writeFileSync("config.json", JSON.stringify({
		HOST: host,
		USERNAME: user,
		PASSWORD: pass,
		OP: op,
		MODE: mode,
		ACTIVE: active
	}));
	rl.keyInPause("File created. You now can run the program.");
} else {
	rl.keyInPause("OK. Cancelling...");
}
