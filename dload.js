const _orig = localStorage.getItem.bind(localStorage);

if (_orig('monkeytype_goals_theme') === 'discord') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap';
  document.head.appendChild(link);

  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#313338',
    zIndex: '999999',
    opacity: '1',
    transition: 'opacity 0.8s ease-out',
  });

  const text = document.createElement('span');
  text.textContent = 'Loading Data...';
  Object.assign(text.style, {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '1.4rem',
    fontWeight: '500',
    color: '#e2b714',
  });

  overlay.appendChild(text);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.addEventListener('transitionend', () => overlay.remove());
  }, 1000);
}
