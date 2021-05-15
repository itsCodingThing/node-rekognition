import { connect, kill } from "ngrok";
import nodemon from "nodemon";

connect({
    proto: "http",
    addr: 1729,
    authtoken: "2PfCuvjsFujS7kp3NzoHC_26nqWJxGWgzLfuUhzum31",
})
    .then((url) => {
        console.log(`ngrok tunnel opened at: ${url}`);
        console.log("Open the ngrok dashboard at: https://localhost:4040\n");

        nodemon({
            script: "./server.js",
        })
            .on("start", () => {
                console.log("The application has started");
            })
            .on("restart", (files) => {
                console.group("Application restarted due to:");
                files.forEach((file) => console.log(file));
                console.groupEnd();
            })
            .on("quit", () => {
                console.log("The application has quit, closing ngrok tunnel");
                kill().then(() => process.exit(0));
            });
    })
    .catch((error) => {
        console.error("Error opening ngrok tunnel: ", error);
        process.exitCode = 1;
    });
