import bolt from "@slack/bolt";
import express from "express";

const { App, LogLevel } = bolt;
const expressApp = express();

const app = new App({
    appToken: process.env.APP_TOKEN,
    token: process.env.OAUTH_ACCESS_TOKEN,
    logLevel: LogLevel.DEBUG,
    socketMode: true,
});

expressApp.get("/", (req, res) => {
    res.send("Sparky is running!!!!!!!!!!!!!!!!!!!!!");
});

app.message(/:(wave|waving):/, async ({ message, say }) => {
    await say(`Hello, <@${message.user}>`);
});

(async () => {
    await app.start();
    const server = expressApp.listen(process.env.PORT || 3000);

    console.log("⚡️ Bolt app started!");

    ["SIGINT", "SIGTERM"].forEach((signal) => {
        process.on(signal, () => {
            server.close();
            app.stop();

            process.exit(0);
        });
    });
})();
