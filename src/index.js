// DEMO JOKE APP
import generateJoke from './generateJoke';
import './styles/main.scss';
import laughing from './assets/laughing.svg';

const laughImg = document.getElementById('laughImg');
laughImg.src = laughing;

const jokeBtn = document.getElementById('jokeBtn');
jokeBtn.addEventListener('click', generateJoke);

generateJoke();

// === Version Checker ===
const CURRENT_VERSION = process.env.REACT_APP_VERSION;
const POLL_INTERVAL = 1000 * 60 * 5; 

async function checkForNewVersion() {
  try {
    const res = await fetch('/meta.json', { cache: 'no-store' });
    const meta = await res.json();

    if (meta.version !== CURRENT_VERSION) {
      notifyUpdateAvailable();
    }
  } catch (err) {
    console.warn('Could not check app version:', err);
  }
}

function notifyUpdateAvailable() {
  const bar = document.createElement('div');
  bar.style.position = 'fixed';
  bar.style.bottom = '0';
  bar.style.left = '0';
  bar.style.right = '0';
  bar.style.backgroundColor = '#222';
  bar.style.color = '#fff';
  bar.style.padding = '12px';
  bar.style.textAlign = 'center';
  bar.innerHTML = `A new version is available. <button style="margin-left: 10px;">Refresh</button>`;

  bar.querySelector('button').addEventListener('click', () => {
    window.location.reload(true);
  });

  document.body.appendChild(bar);
}

setInterval(checkForNewVersion, POLL_INTERVAL);
