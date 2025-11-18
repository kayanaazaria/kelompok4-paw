// Simple SSE notification stream manager
const clients = new Set();

function subscribe(res, userId) {
  // send initial headers
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  const client = { res, userId };
  clients.add(client);

  // heartbeat
  const interval = setInterval(() => {
    try {
      res.write(`: heartbeat\n\n`);
    } catch (e) {}
  }, 15000);

  // return unsubscribe function
  return () => {
    clearInterval(interval);
    clients.delete(client);
  };
}

function broadcast(notification) {
  // notification must include recipient (user id) and message
  clients.forEach((client) => {
    try {
      // Only send to matching recipient
      if (!notification.recipient) return;
      if (client.userId && client.userId.toString() !== notification.recipient.toString()) return;
      client.res.write(`event: notification\n`);
      client.res.write(`data: ${JSON.stringify(notification)}\n\n`);
    } catch (e) {
      // ignore per-client errors
    }
  });
}

module.exports = { subscribe, broadcast };
