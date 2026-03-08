(function () {
  const LS_USER = 'mt_username';
  const LS_KEY  = 'mt_ape_key';
  const API      = 'https://api.monkeytype.com';

  const style = document.createElement('style');
  style.textContent = `
    /* ── Widget card ── */
    #mt-widget {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
      font-family: 'Roboto Mono', monospace;
    }

    #mt-widget-card {
      background: #2b2d31;
      border-radius: 10px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 11px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s, box-shadow 0.2s;
      box-shadow: 0 2px 12px rgba(0,0,0,0.35);
      max-width: 220px;
      animation: mtFadeIn 0.25s ease;
    }
    #mt-widget-card:hover {
      background: #35373d;
      box-shadow: 0 4px 20px rgba(0,0,0,0.45);
    }

    #mt-widget-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      background: #3a3c42;
    }

    #mt-widget-avatar-placeholder {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #3a3c42;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.3);
      font-size: 1rem;
      user-select: none;
    }

    #mt-widget-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    #mt-widget-name {
      color: rgba(255,255,255,0.9);
      font-size: 0.82rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #mt-widget-stats {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mt-stat {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .mt-stat-value {
      color: #e2b714;
      font-size: 0.82rem;
      font-weight: 500;
      line-height: 1.2;
    }

    .mt-stat-label {
      color: rgba(255,255,255,0.35);
      font-size: 0.62rem;
      line-height: 1.2;
    }

    .mt-stat-divider {
      width: 1px;
      height: 22px;
      background: rgba(255,255,255,0.1);
      flex-shrink: 0;
    }

    #mt-widget-disconnect {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #313338;
      border: 1px solid rgba(255,255,255,0.12);
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.4);
      font-size: 0.6rem;
      transition: background 0.15s, color 0.15s;
      z-index: 10;
      line-height: 1;
    }
    #mt-widget:hover #mt-widget-disconnect {
      display: flex;
    }
    #mt-widget-disconnect:hover {
      background: #e2b714;
      color: #1a1b1e;
      border-color: #e2b714;
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
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
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

    #mt-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
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
      padding: 28px 28px 24px;
      width: 100%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      font-family: 'Roboto Mono', monospace;
      box-shadow: 0 8px 40px rgba(0,0,0,0.6);
      animation: mtSlideUp 0.22s ease;
    }

    #mt-modal-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    #mt-modal-title {
      color: #fff;
      font-size: 1rem;
      font-weight: 500;
    }

    #mt-modal-desc {
      color: rgba(255,255,255,0.45);
      font-size: 0.75rem;
      line-height: 1.6;
    }

    #mt-modal-desc a {
      color: #e2b714;
      text-decoration: none;
    }
    #mt-modal-desc a:hover {
      text-decoration: underline;
    }

    .mt-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .mt-field label {
      color: rgba(255,255,255,0.55);
      font-size: 0.72rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .mt-field input {
      background: #313338;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      color: #fff;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.85rem;
      padding: 10px 12px;
      outline: none;
      transition: border-color 0.15s;
    }
    .mt-field input:focus {
      border-color: #e2b714;
    }
    .mt-field input::placeholder {
      color: rgba(255,255,255,0.2);
    }

    #mt-modal-error {
      color: #f04747;
      font-size: 0.75rem;
      display: none;
      margin-top: -8px;
    }

    #mt-modal-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    #mt-modal-cancel {
      background: none;
      border: none;
      color: rgba(255,255,255,0.4);
      font-family: 'Roboto Mono', monospace;
      font-size: 0.82rem;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background 0.15s, color 0.15s;
    }
    #mt-modal-cancel:hover {
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.7);
    }

    #mt-modal-save {
      background: #e2b714;
      border: none;
      border-radius: 6px;
      color: #1a1b1e;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 18px;
      transition: background 0.15s, opacity 0.15s;
    }
    #mt-modal-save:hover {
      background: #f0c620;
    }
    #mt-modal-save:disabled {
      opacity: 0.5;
      cursor: default;
    }

    #mt-widget-card.mt-loading #mt-widget-name,
    #mt-widget-card.mt-loading .mt-stat-value {
      background: rgba(255,255,255,0.08);
      border-radius: 3px;
      color: transparent;
      animation: mtPulse 1.4s ease infinite;
    }
    #mt-widget-card.mt-loading #mt-widget-name { width: 80px; }
    #mt-widget-card.mt-loading .mt-stat-value  { width: 36px; }

    @keyframes mtFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes mtSlideUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes mtPulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.id = 'mt-widget';
  document.body.appendChild(widget);

  async function fetchAPI(path, apeKey) {
    const res = await fetch(`${API}${path}`, {
      headers: { Authorization: `ApeKey ${apeKey}` }
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  }

  function renderConnectBtn() {
    widget.innerHTML = '';
    const btn = document.createElement('button');
    btn.id = 'mt-connect-btn';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor"/>
      </svg>
      connect monkeytype`;
    btn.addEventListener('click', openModal);
    widget.appendChild(btn);
  }

  function renderCard(username, pb15, pb60, avatarUrl) {
    widget.innerHTML = '';

    const profileUrl = `https://monkeytype.com/profile/${encodeURIComponent(username)}`;

    const card = document.createElement('a');
    card.id = 'mt-widget-card';
    card.href = profileUrl;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.title = 'View Monkeytype profile';

    let avatarEl;
    if (avatarUrl) {
      avatarEl = document.createElement('img');
      avatarEl.id = 'mt-widget-avatar';
      avatarEl.src = avatarUrl;
      avatarEl.alt = username;
      avatarEl.onerror = () => avatarEl.replaceWith(makeAvatarPlaceholder(username));
    } else {
      avatarEl = makeAvatarPlaceholder(username);
    }

    const info = document.createElement('div');
    info.id = 'mt-widget-info';

    const name = document.createElement('div');
    name.id = 'mt-widget-name';
    name.textContent = username;

    const stats = document.createElement('div');
    stats.id = 'mt-widget-stats';

    if (pb15 !== null) stats.appendChild(makeStat(Math.round(pb15), '15s pb'));
    if (pb15 !== null && pb60 !== null) {
      const div = document.createElement('div');
      div.className = 'mt-stat-divider';
      stats.appendChild(div);
    }
    if (pb60 !== null) stats.appendChild(makeStat(Math.round(pb60), '60s pb'));
    if (pb15 === null && pb60 === null) {
      const empty = document.createElement('span');
      empty.className = 'mt-stat-label';
      empty.textContent = 'no results yet';
      stats.appendChild(empty);
    }

    info.appendChild(name);
    info.appendChild(stats);
    card.appendChild(avatarEl);
    card.appendChild(info);

    const disc = document.createElement('button');
    disc.id = 'mt-widget-disconnect';
    disc.title = 'Disconnect';
    disc.textContent = '✕';
    disc.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      disconnect();
    });

    widget.appendChild(card);
    widget.appendChild(disc);
    widget.style.position = 'fixed';
  }

  function makeAvatarPlaceholder(username) {
    const el = document.createElement('div');
    el.id = 'mt-widget-avatar-placeholder';
    el.textContent = (username[0] || '?').toUpperCase();
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

  function renderLoadingSkeleton(username) {
    widget.innerHTML = '';

    const card = document.createElement('div');
    card.id = 'mt-widget-card';
    card.className = 'mt-loading';

    const placeholder = makeAvatarPlaceholder(username);

    const info = document.createElement('div');
    info.id = 'mt-widget-info';

    const name = document.createElement('div');
    name.id = 'mt-widget-name';
    name.textContent = username;

    const stats = document.createElement('div');
    stats.id = 'mt-widget-stats';
    stats.appendChild(makeStat('000', '15s pb'));
    const divider = document.createElement('div');
    divider.className = 'mt-stat-divider';
    stats.appendChild(divider);
    stats.appendChild(makeStat('000', '60s pb'));

    info.appendChild(name);
    info.appendChild(stats);
    card.appendChild(placeholder);
    card.appendChild(info);
    widget.appendChild(card);
  }

  async function loadAndRender(username, apeKey) {
    renderLoadingSkeleton(username);

    try {
      const pbData = await fetchAPI('/users/personalBests?mode=time', apeKey);
      const pbs = pbData?.data;

      let pb15 = null, pb60 = null;

      if (pbs?.time) {
        const get = (arr) => arr?.reduce((best, r) => r.wpm > (best?.wpm ?? 0) ? r : best, null)?.wpm ?? null;
        pb15 = get(pbs.time['15']);
        pb60 = get(pbs.time['60']);
      }

      let avatarUrl = null;
      try {
        const profileData = await fetchAPI(`/users/${encodeURIComponent(username)}/profile`, apeKey);
        avatarUrl = profileData?.data?.inventory?.background ?? null;
        avatarUrl = profileData?.data?.profilePictureUrl ?? null;
      } catch (_) {}

      renderCard(username, pb15, pb60, avatarUrl);
    } catch (err) {
      if (err.message === '401' || err.message === '403') {
        disconnect(true);
      } else {
        renderCard(username, null, null, null);
      }
    }
  }

  function openModal() {
    const overlay = document.createElement('div');
    overlay.id = 'mt-modal-overlay';

    overlay.innerHTML = `
      <div id="mt-modal">
        <div id="mt-modal-header">
          <div id="mt-modal-title">Connect Monkeytype</div>
          <div id="mt-modal-desc">
            Your username and Ape Key are stored only in your browser — never sent to our servers.<br><br>
            Get your Ape Key from
            <a href="https://monkeytype.com/settings#apeKeys" target="_blank" rel="noopener">
              monkeytype.com/settings → Ape Keys
            </a>.
          </div>
        </div>
        <div class="mt-field">
          <label>Monkeytype Username</label>
          <input id="mt-input-user" type="text" placeholder="your username" autocomplete="off" spellcheck="false"/>
        </div>
        <div class="mt-field">
          <label>Ape Key</label>
          <input id="mt-input-key" type="password" placeholder="MT_APE_KEY_..." autocomplete="off" spellcheck="false"/>
        </div>
        <div id="mt-modal-error"></div>
        <div id="mt-modal-actions">
          <button id="mt-modal-cancel">Cancel</button>
          <button id="mt-modal-save">Connect</button>
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

    function closeModal() { overlay.remove(); }

    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', onEsc); }
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
      saveBtn.textContent = 'Connecting...';

      try {
        await fetchAPI('/users/personalBests?mode=time', apeKey);
        localStorage.setItem(LS_USER, username);
        localStorage.setItem(LS_KEY, apeKey);
        closeModal();
        loadAndRender(username, apeKey);
      } catch (err) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Connect';
        if (err.message === '401' || err.message === '403') {
          errorEl.textContent = 'Invalid Ape Key. Check your Monkeytype settings.';
        } else {
          errorEl.textContent = 'Could not connect. Check your username and try again.';
        }
        errorEl.style.display = 'block';
      }
    });
  }

  function disconnect(invalidKey = false) {
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_KEY);
    renderConnectBtn();
    if (invalidKey) {
      const btn = document.getElementById('mt-connect-btn');
      if (btn) {
        btn.style.color = '#f04747';
        btn.textContent = 'key expired — reconnect';
        setTimeout(() => renderConnectBtn(), 3000);
      }
    }
  }

  function init() {
    const username = localStorage.getItem(LS_USER);
    const apeKey   = localStorage.getItem(LS_KEY);

    if (username && apeKey) {
      loadAndRender(username, apeKey);
    } else {
      renderConnectBtn();
    }
  }

  init();
})();
