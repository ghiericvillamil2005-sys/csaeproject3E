const fs = require("fs");
const path = require("path");

const noticesPath = path.join(__dirname, "notices.json");

function readNotices() {
    if (!fs.existsSync(noticesPath)) return [];

    try {
        const data = fs.readFileSync(noticesPath, "utf8");
        const notices = data.trim() ? JSON.parse(data) : [];
        return Array.isArray(notices) ? notices : [];
    } catch (error) {
        console.error("Unable to read notices.json:", error.message);
        return null;
    }
}

function writeNotices(notices) {
    fs.writeFileSync(noticesPath, JSON.stringify(notices, null, 2) + "\n", "utf8");
}

const [command, title, message] = process.argv.slice(2);

if (command === "list") {
    const notices = readNotices();
    if (notices !== null) {
        notices.forEach(notice =>
            console.log(`${notice.id}. ${notice.title}: ${notice.message}`)
        );
    }
} else if (command === "add") {
    if (!title || !message) {
        console.log('Usage: node cli.js add "Title" "Message"');
    } else {
        const notices = readNotices();
        if (notices !== null) {
            const nextId = notices.reduce(
                (highest, notice) => Math.max(highest, Number(notice.id) || 0),
                0
            ) + 1;

            notices.push({ id: nextId, title, message });
            writeNotices(notices);
            console.log(`Added notice ${nextId}.`);
        }
    }
} else {
    console.log("Commands: list | add \"Title\" \"Message\"");
}
