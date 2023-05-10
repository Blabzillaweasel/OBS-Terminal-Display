const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = {
  controller: null,
  display: null,
};

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'register') {
      clients[data.role] = ws;
      console.log(`${data.role} registered`);
    } else if (data.type === 'text') {
      console.log('Received text:', data.text);

      if (clients.display) {
        clients.display.send(JSON.stringify({ type: 'text', text: data.text }));
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');

    for (const role in clients) {
      if (clients[role] === ws) {
        clients[role] = null;
        console.log(`${role} unregistered`);
      }
    }
  });
});

console.log('WebSocket server listening on ws://localhost:8080');
