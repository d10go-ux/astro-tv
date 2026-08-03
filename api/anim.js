module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ANIM_STORE_URL = 'https://kvdb.io/Wf8X8ZgJ8jZ7Xp6J9q8Z2k/astrotv_anim';

  if (req.method === 'POST') {
    let data = req.body;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) {}
    }

    try {
      await fetch(ANIM_STORE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {}

    return res.status(200).json({ status: 'ok', sent: Date.now() });
  }

  try {
    const response = await fetch(ANIM_STORE_URL);
    if (response.ok) {
      const animEvent = await response.json();
      return res.status(200).json(animEvent);
    }
  } catch (e) {}

  return res.status(200).json({ status: 'ok' });
};
