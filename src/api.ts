// api.js
async function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function request(url, options, retries = 3, delayMs = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        if (res.status >= 500 && attempt < retries) {
          await delay(delayMs * attempt);
          continue;
        }
        throw new Error(`Server error ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      if (attempt < retries) {
        await delay(delayMs * attempt);
      } else throw e;
    }
  }
}

export async function createSession() {
  return request("/api/session", { method: "POST" });
}

export async function joinSession(sessionKey) {
  return request(`/api/session/${sessionKey}`);
}

export async function sendShips(sessionKey, ships) {
  return request(`/api/session/${sessionKey}/ships`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ships }),
  });
}

export async function makeMove(sessionKey, x, y) {
  return request(`/api/session/${sessionKey}/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ x, y }),
  });
}
