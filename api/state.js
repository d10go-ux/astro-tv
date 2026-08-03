module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const STORE_URL = 'https://kvdb.io/Wf8X8ZgJ8jZ7Xp6J9q8Z2k/astrotv_state';

  try {
    const response = await fetch(STORE_URL);
    if (response.ok) {
      const state = await response.json();
      return res.status(200).json(state);
    }
  } catch (e) {}

  return res.status(200).json({ status: 'ok' });
};
