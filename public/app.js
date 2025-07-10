const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/osint-master";
const sessionId = self.crypto.randomUUID();

const generateReportBtn = document.getElementById('generate-report-btn');
const statusDiv = document.getElementById('status');
const ipinfoBtn = document.getElementById('webint-ipinfo-btn');
const ipinfoInput = document.getElementById('webint-ipinfo-input');
const ipstackBtn = document.getElementById('webint-ipstack-btn');
const ipstackInput = document.getElementById('webint-ipstack-input');

function initSession() {
  clearStatus();
  addStatus(`ID Sessione: ${sessionId}`);
}

function clearStatus() {
  statusDiv.innerHTML = '';
  console.clear();
}

function addStatus(message, type = '') {
  const newMessage = document.createElement('div');
  newMessage.innerText = message;
  if (type) newMessage.classList.add(`status-${type}`);
  statusDiv.appendChild(newMessage);
  statusDiv.scrollTop = statusDiv.scrollHeight;

  // Log in console con emoji
  if (type === 'loading') {
    console.log(`⏳ ${message}`);
  } else if (type === 'success') {
    console.log(`✅ ${message}`);
  } else if (type === 'error') {
    console.error(`❌ ${message}`);
  } else {
    console.log(message);
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

  clearStatus(); // 🧹 Pulisce solo all'inizio di una nuova ricerca

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

  generateReportBtn.addEventListener('click', async () => {
    clearStatus(); // 🧹 Pulisce solo quando parte la generazione report
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
