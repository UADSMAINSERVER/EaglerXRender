import express from "express";
import { WebSocketServer } from "ws";
import net from "net";

const app = express();
const PORT = process.env.PORT || 8080;

// Your FalixNodes server
const MC_HOST = "rendereagler.falixsrv.me";
const MC_PORT = 28195;

const server = app.listen(PORT, () => {
  console.log(`Eaglercraft WS proxy running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Eaglercraft client connected");

  const mc = net.connect(MC_PORT, MC_HOST);

  ws.on("message", (msg) => mc.write(msg));
  mc.on("data", (data) => ws.send(data));

  const endBoth = () => { ws.close(); mc.end(); };
  ws.on("close", endBoth);
  ws.on("error", endBoth);
  mc.on("close", endBoth);
  mc.on("error", endBoth);
});
