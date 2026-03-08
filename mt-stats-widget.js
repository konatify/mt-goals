
// Credentials stored in localStorage only

(function () {
  const LS_USER = 'mt_username';
  const LS_KEY  = 'mt_ape_key';
  const API     = 'https://api.monkeytype.com';

  const style = document.createElement('style');
  style.textContent = `
    #mt-widget {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
      font-family: 'Roboto Mono', monospace;
    }

    #mt-connect-btn {
      background: #2b2d31;
      border: none;
      border-radius: 8px;
      color: rgba(255,255,255,0.45);
      font-family: 'Roboto Mono', monospace;
      font-size: 0.78rem;
      padding: 8px 12px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
      animation: mtFadeIn 0.25s ease;
    }
    #mt-connect-btn:hover {
      background: #35373d;
      color: rgba(255,255,255,0.75);
    }
    #mt-connect-btn svg {
      width: 13px;
      height: 13px;
      flex-shrink: 0;
    }

    #mt-widget-card {
      background: #2b2d31;
      border-radius: 10px;
      padding: 11px 13px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
      max-width: 230px;
      animation: mtFadeIn 0.25s ease;
    }
    #mt-widget-card:hover { background: #35373d; }

    .mt-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      flex-shrink: 0;
      object-fit: cover;
    }
    .mt-avatar-placeholder {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #3a3c42;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.35);
      font-size: 0.9rem;
      font-weight: 500;
    }

    #mt-widget-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }
    #mt-widget-name {
      color: rgba(255,255,255,0.88);
      font-size: 0.82rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #mt-widget-stats {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .mt-stat { display: flex; flex-direction: column; }
    .mt-stat-value {
      color: #e2b714;
      font-size: 0.8rem;
      font-weight: 500;
      line-height: 1.2;
    }
    .mt-stat-label {
      color: rgba(255,255,255,0.3);
      font-size: 0.6rem;
      line-height: 1.2;
    }
    .mt-stat-divider {
      width: 1px;
      height: 20px;
      background: rgba(255,255,255,0.1);
      flex-shrink: 0;
    }
    .mt-no-stats {
      color: rgba(255,255,255,0.3);
      font-size: 0.68rem;
    }

    #mt-widget-disconnect {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      background: #313338;
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.4);
      font-size: 0.55rem;
      transition: background 0.15s, color 0.15s;
      z-index: 10;
      line-height: 1;
      padding: 0;
    }
    #mt-widget:hover #mt-widget-disconnect { display: flex; }
    #mt-widget-disconnect:hover {
      background: #e2b714;
      color: #1a1b1e;
      border-color: #e2b714;
    }

    .mt-pulse {
      background: rgba(255,255,255,0.08) !important;
      border-radius: 3px;
      color: transparent !important;
      animation: mtPulse 1.4s ease infinite;
    }

    #mt-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: mtFadeIn 0.18s ease;
      padding: 20px;
    }
    #mt-modal {
      background: #2b2d31;
      border-radius: 12px;
      padding: 26px 26px 22px;
      width: 100%;
      max-width: 390px;
      font-family: 'Roboto Mono', monospace;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
      animation: mtSlideUp 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    #mt-modal-title {
      color: #fff;
      font-size: 0.95rem;
      font-weight: 500;
    }
    #mt-modal-desc {
      color: rgba(255,255,255,0.4);
      font-size: 0.73rem;
      line-height: 1.65;
      margin-top: -10px;
    }
    #mt-modal-desc a {
      color: #e2b714;
      text-decoration: none;
    }
    #mt-modal-desc a:hover { text-decoration: underline; }

    .mt-field { display: flex; flex-direction: column; gap: 5px; }
    .mt-field label {
      color: rgba(255,255,255,0.45);
      font-size: 0.68rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .mt-field input {
      background: #313338;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 6px;
      color: #fff;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.83rem;
      padding: 9px 11px;
      outline: none;
      transition: border-color 0.15s;
    }
    .mt-field input:focus { border-color: rgba(226,183,20,0.6); }
    .mt-field input::placeholder { color: rgba(255,255,255,0.18); }

    #mt-modal-error {
      color: #f04747;
      font-size: 0.72rem;
      display: none;
      margin-top: -10px;
    }
    #mt-modal-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    #mt-modal-cancel {
      background: none;
      border: none;
      color: rgba(255,255,255,0.35);
      font-family: 'Roboto Mono', monospace;
      font-size: 0.8rem;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background 0.15s, color 0.15s;
    }
    #mt-modal-cancel:hover {
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.65);
    }
    #mt-modal-save {
      background: #e2b714;
      border: none;
      border-radius: 6px;
      color: #1a1b1e;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 18px;
      transition: background 0.15s, opacity 0.15s;
    }
    #mt-modal-save:hover:not(:disabled) { background: #f0c620; }
    #mt-modal-save:disabled { opacity: 0.45; cursor: default; }

    @keyframes mtFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes mtSlideUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes mtPulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.35; }
    }
  `;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.id = 'mt-widget';
  document.body.appendChild(widget);

  async function api(path, apeKey) {
    const headers = apeKey ? { Authorization: `ApeKey ${apeKey}` } : {};
    const res = await fetch(`${API}${path}`, { headers });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(String(res.status));
      err.status = res.status;
      err.body = json;
      throw err;
    }
    return json;
  }

  function makeAvatar(letter) {
    const el = document.createElement('div');
    el.className = 'mt-avatar-placeholder';
    el.textContent = (letter || '?').toUpperCase();
    return el;
  }

  function makeStat(value, label) {
    const wrap = document.createElement('div');
    wrap.className = 'mt-stat';
    const v = document.createElement('div');
    v.className = 'mt-stat-value';
    v.textContent = value;
    const l = document.createElement('div');
    l.className = 'mt-stat-label';
    l.textContent = label;
    wrap.appendChild(v);
    wrap.appendChild(l);
    return wrap;
  }

  function bestWpm(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return Math.round(arr.reduce((best, r) => r.wpm > best ? r.wpm : best, 0));
  }

  function renderConnectBtn(errorMsg) {
    widget.innerHTML = '';
    const btn = document.createElement('button');
    btn.id = 'mt-connect-btn';
    if (errorMsg) {
      btn.style.color = '#f04747';
      btn.textContent = errorMsg;
    } else {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        connect monkeytype`;
    }
    btn.addEventListener('click', openModal);
    widget.appendChild(btn);
  }

  function renderSkeleton(username) {
    widget.innerHTML = '';
    const card = document.createElement('div');
    card.id = 'mt-widget-card';

    const info = document.createElement('div');
    info.id = 'mt-widget-info';

    const name = document.createElement('div');
    name.id = 'mt-widget-name';
    name.className = 'mt-pulse';
    name.textContent = username;
    name.style.minWidth = '60px';

    const statsRow = document.createElement('div');
    statsRow.id = 'mt-widget-stats';

    const s1 = makeStat('000', '15s pb');
    const s2 = makeStat('000', '60s pb');
    s1.querySelector('.mt-stat-value').classList.add('mt-pulse');
    s2.querySelector('.mt-stat-value').classList.add('mt-pulse');

    const div = document.createElement('div');
    div.className = 'mt-stat-divider';

    statsRow.appendChild(s1);
    statsRow.appendChild(div);
    statsRow.appendChild(s2);

    info.appendChild(name);
    info.appendChild(statsRow);
    card.appendChild(makeAvatar(username[0]));
    card.appendChild(info);
    widget.appendChild(card);
  }

  function renderCard(username, pb15, pb60, discordId, discordAvatar) {
    widget.innerHTML = '';

    const card = document.createElement('a');
    card.id = 'mt-widget-card';
    card.href = `https://monkeytype.com/profile/${encodeURIComponent(username)}`;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.title = 'View Monkeytype profile';
    
    let avatarEl;
    if (discordId && discordAvatar) {
      const img = document.createElement('img');
      img.className = 'mt-avatar';
      img.src = `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.png?size=64`;
      img.alt = username;
      img.onerror = () => img.replaceWith(makeAvatar(username[0]));
      avatarEl = img;
    } else {
      avatarEl = makeAvatar(username[0]);
    }

    const info = document.createElement('div');
    info.id = 'mt-widget-info';

    const name = document.createElement('div');
    name.id = 'mt-widget-name';
    name.textContent = username;

    const statsRow = document.createElement('div');
    statsRow.id = 'mt-widget-stats';

    if (pb15 !== null || pb60 !== null) {
      if (pb15 !== null) statsRow.appendChild(makeStat(pb15, '15s pb'));
      if (pb15 !== null && pb60 !== null) {
        const d = document.createElement('div');
        d.className = 'mt-stat-divider';
        statsRow.appendChild(d);
      }
      if (pb60 !== null) statsRow.appendChild(makeStat(pb60, '60s pb'));
    } else {
      const empty = document.createElement('span');
      empty.className = 'mt-no-stats';
      empty.textContent = 'no results yet';
      statsRow.appendChild(empty);
    }

    info.appendChild(name);
    info.appendChild(statsRow);
    card.appendChild(avatarEl);
    card.appendChild(info);

    const disc = document.createElement('button');
    disc.id = 'mt-widget-disconnect';
    disc.title = 'Disconnect';
    disc.textContent = '✕';
    disc.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      localStorage.removeItem(LS_USER);
      localStorage.removeItem(LS_KEY);
      renderConnectBtn();
    });

    widget.appendChild(card);
    widget.appendChild(disc);
  }

  async function loadStats(username, apeKey) {
    renderSkeleton(username);

    try {
      const pbRes = await api('/users/personalBests?mode=time', apeKey);
      const timeData = pbRes?.data?.time ?? {};
      const pb15 = bestWpm(timeData['15']);
      const pb60 = bestWpm(timeData['60']);

      let discordId = null, discordAvatar = null;
      try {
        const profileRes = await api(`/users/${encodeURIComponent(username)}/profile`, apeKey);
        discordId     = profileRes?.data?.discordId     ?? null;
        discordAvatar = profileRes?.data?.discordAvatar ?? null;
      } catch (_) {}

      renderCard(username, pb15, pb60, discordId, discordAvatar);

    } catch (err) {
      const s = err.status;
      localStorage.removeItem(LS_USER);
      localStorage.removeItem(LS_KEY);
      if (s === 471) {
        renderConnectBtn('key not activated — reconnect');
      } else if (s === 470 || s === 472) {
        renderConnectBtn('invalid key — reconnect');
      } else if (s === 401 || s === 403) {
        renderConnectBtn('key expired — reconnect');
      } else {
        localStorage.setItem(LS_USER, username);
        localStorage.setItem(LS_KEY, apeKey);
        renderCard(username, null, null, null, null);
        return;
      }
      setTimeout(renderConnectBtn, 4000);
    }
  }

  function openModal() {
    const overlay = document.createElement('div');
    overlay.id = 'mt-modal-overlay';
    overlay.innerHTML = `
      <div id="mt-modal">
        <div id="mt-modal-title">Connect Monkeytype</div>
        <div id="mt-modal-desc">
          Your credentials are saved only in your browser — never sent to mtgoals.cc.<br><br>
          Get your Ape Key from
          <a href="https://monkeytype.com/account-settings?tab=apeKeys" target="_blank" rel="noopener">
            account settings → Ape Keys
          </a>.
          Make sure the key is <strong style="color:rgba(255,255,255,0.55)">activated</strong> (tick the checkbox next to it).
        </div>
        <div class="mt-field">
          <label>Monkeytype username</label>
          <input id="mt-input-user" type="text" placeholder="your username" autocomplete="off" spellcheck="false"/>
        </div>
        <div class="mt-field">
          <label>Ape Key</label>
          <input id="mt-input-key" type="password" placeholder="paste your Ape Key here" autocomplete="off" spellcheck="false"/>
        </div>
        <div id="mt-modal-error"></div>
        <div id="mt-modal-actions">
          <button id="mt-modal-cancel">cancel</button>
          <button id="mt-modal-save">connect</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const userInput = document.getElementById('mt-input-user');
    const keyInput  = document.getElementById('mt-input-key');
    const saveBtn   = document.getElementById('mt-modal-save');
    const cancelBtn = document.getElementById('mt-modal-cancel');
    const errorEl   = document.getElementById('mt-modal-error');

    userInput.value = localStorage.getItem(LS_USER) || '';
    keyInput.value  = localStorage.getItem(LS_KEY)  || '';
    userInput.focus();

    const close = () => overlay.remove();
    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    const escHandler = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);

    [userInput, keyInput].forEach(inp => {
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') saveBtn.click(); });
    });

    saveBtn.addEventListener('click', async () => {
      const username = userInput.value.trim();
      const apeKey   = keyInput.value.trim();

      errorEl.style.display = 'none';

      if (!username || !apeKey) {
        errorEl.textContent = 'Please fill in both fields.';
        errorEl.style.display = 'block';
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'connecting...';

      try {
        await api('/users/personalBests?mode=time', apeKey);
        localStorage.setItem(LS_USER, username);
        localStorage.setItem(LS_KEY, apeKey);
        close();
        loadStats(username, apeKey);
      } catch (err) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'connect';
        const s = err.status;
        if (s === 471) {
          errorEl.textContent = 'Key is not activated. Tick the checkbox next to it in account settings.';
        } else if (s === 470 || s === 472) {
          errorEl.textContent = 'Invalid Ape Key — double-check you copied it fully.';
        } else if (s === 401 || s === 403) {
          errorEl.textContent = 'Unauthorized. Check your Ape Key and try again.';
        } else {
          errorEl.textContent = `Could not connect (${s ?? 'network error'}). Try again.`;
        }
        errorEl.style.display = 'block';
      }
    });
  }

  const savedUser = localStorage.getItem(LS_USER);
  const savedKey  = localStorage.getItem(LS_KEY);

  if (savedUser && savedKey) {
    loadStats(savedUser, savedKey);
  } else {
    renderConnectBtn();
  }

})();
