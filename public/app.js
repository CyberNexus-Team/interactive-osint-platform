const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/osint-master";
const sessionId = self.crypto.randomUUID();

const generateReportBtn = document.getElementById('generate-report-btn');
const statusDiv = document.getElementById('status');

// BOTTONI E INPUT
const ipinfoBtn = document.getElementById('webint-ipinfo-btn');
const ipinfoInput = document.getElementById('webint-ipinfo-input');

const ipstackBtn = document.getElementById('webint-ipstack-btn');
const ipstackInput = document.getElementById('webint-ipstack-input');

const ipapiBtn = document.getElementById('webint-ipapi-btn');
const ipapiInput = document.getElementById('webint-ipapi-input');

const opencageBtn = document.getElementById('webint-opencage-btn');
const opencageInput = document.getElementById('webint-opencage-input');

const mediastackBtn = document.getElementById('webint-mediastack-btn');
const mediastackInput = document.getElementById('webint-mediastack-input');

const screenshotlayerBtn = document.getElementById('webint-screenshotlayer-btn');
const screenshotlayerInput = document.getElementById('webint-screenshotlayer-input');

function initSession() {
  clearStatus();
  addStatus(`ID Sessione: ${sessionId}`, 'default');
}

function clearStatus() {
  statusDiv.innerHTML = '';
  console.clear();
}

function addStatus(message, type = 'default') {
  const newMessage = document.createElement('div');
  newMessage.innerText = message;
  if (type) newMessage.classList.add(`status-${type}`);
  statusDiv.appendChild(newMessage);
  statusDiv.scrollTop = statusDiv.scrollHeight;

  const emojis = { loading: '⏳', success: '✅', error: '❌', default: 'ℹ️' };
  const prefix = emojis[type] || emojis.default;

  if (type === 'error') {
    console.error(`${prefix} ${message}`);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

function enableReportButton() {
  if (generateReportBtn.disabled) {
    generateReportBtn.disabled = false;
    console.log('📄 Bottone "Genera Report" abilitato.');
  }
}

async function performSearch(button, input, action, target) {
  if (!target) {
    alert('Per favore, inserisci un valore nel campo di ricerca.');
    return;
  }

  clearStatus();
  addStatus(`Ricerca per '${target}' con azione '${action}' in corso...`, 'loading');

  console.log(`📡 Inoltro richiesta a: ${N8N_WEBHOOK_URL}`);
  console.log(`📦 Payload:`, JSON.stringify({
    sessionId,
    action,
    data: target,
    timestamp: new Date().toISOString()
  }, null, 2));

  button.disabled = true;

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        action,
        data: target,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error(`Errore dal server: ${response.statusText}`);
    await response.json();

    addStatus(`Risultato per '${target}' salvato. Pronto per la prossima ricerca.`, 'success');
    enableReportButton();

  } catch (error) {
    addStatus(`Errore durante la ricerca per '${target}': ${error.message}`, 'error');
  } finally {
    button.disabled = false;
  }
}

function setupEventListeners() {
  ipinfoBtn.addEventListener('click', () => {
    performSearch(ipinfoBtn, ipinfoInput, 'search_ipinfo', ipinfoInput.value.trim());
  });

  ipstackBtn.addEventListener('click', () => {
    performSearch(ipstackBtn, ipstackInput, 'search_ipstack', ipstackInput.value.trim());
  });

  ipapiBtn.addEventListener('click', () => {
    performSearch(ipapiBtn, ipapiInput, 'search_ipapi', ipapiInput.value.trim());
  });

  opencageBtn.addEventListener('click', () => {
    performSearch(opencageBtn, opencageInput, 'search_opencage', opencageInput.value.trim());
  });

  mediastackBtn.addEventListener('click', () => {
    performSearch(mediastackBtn, mediastackInput, 'search_mediastack', mediastackInput.value.trim());
  });

  screenshotlayerBtn.addEventListener('click', () => {
    performSearch(screenshotlayerBtn, screenshotlayerInput, 'search_screenshotlayer', screenshotlayerInput.value.trim());
  });

  generateReportBtn.addEventListener('click', async () => {
    clearStatus();
    addStatus('Generazione report in corso...', 'loading');
    generateReportBtn.disabled = true;

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'generate_report',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error(`Errore dal server: ${response.statusText}`);
      const result = await response.json();

      addStatus('Report generato con successo!', 'success');

      if (result.reportUrl) {
        console.log(`📄 Report URL: ${result.reportUrl}`);
        window.open(result.reportUrl, '_blank');
      }

    } catch (error) {
      addStatus(`Errore nella generazione del report: ${error.message}`, 'error');
    } finally {
      generateReportBtn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSession();
  setupEventListeners();
});
