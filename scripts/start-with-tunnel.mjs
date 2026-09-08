import { spawn } from "node:child_process";

const port = process.env.PORT ?? "4173";
const children = new Set();
let stopping = false;

function start(command, args) {
  const child = spawn(command, args, {
    env: process.env,
    stdio: "inherit",
  });

  children.add(child);
  child.on("error", (error) => {
    console.error(`Could not start ${command}: ${error.message}`);
    stop(1);
  });
  child.on("exit", (code, signal) => {
    children.delete(child);
    if (stopping) return;

    const reason = signal ? `signal ${signal}` : `code ${code ?? 1}`;
    console.error(`${command} stopped with ${reason}.`);
    stop(code ?? 1);
  });

  return child;
}

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;

  for (const child of children) {
    child.kill("SIGTERM");
  }

  const forceExit = setTimeout(() => {
    for (const child of children) child.kill("SIGKILL");
    process.exit(exitCode);
  }, 3_000);
  forceExit.unref();

  Promise.all(
    [...children].map(
      (child) => new Promise((resolve) => child.once("exit", resolve)),
    ),
  ).then(() => process.exit(exitCode));
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

start(process.execPath, ["server.mjs"]);
start("cloudflared", [
  "tunnel",
  "--protocol",
  "http2",
  "--url",
  `http://127.0.0.1:${port}`,
]);
