const store = new Map();

function get(key) {
  const item = store.get(key);
  if (!item) return null;

  const { value, expiresAt } = item;
  if (expiresAt && Date.now() > expiresAt) {
    store.delete(key);
    return null;
  }
  return value;
}

function set(key, value, ttlMs) {
  const expiresAt = ttlMs ? Date.now() + ttlMs : null;
  store.set(key, { value, expiresAt });
}

module.exports = { get, set };
