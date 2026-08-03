let latestAnimEvent = null;

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    latestAnimEvent = req.body;
    return res.status(200).json({ status: 'ok', sent: Date.now() });
  }

  return res.status(200).json(latestAnimEvent || {});
};
