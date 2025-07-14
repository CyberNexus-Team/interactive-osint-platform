const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/osint-master";
const sessionId = self.crypto.randomUUID();

const generateReportBtn = document.getElementById('generate-report-btn');
const statusDiv = document.getElementById('status');

// BOTTONI E INPUT GENERICI
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

const financelayerBtn = document.getElementById('webint-financelayer-btn');
const financelayerInput = document.getElementById('webint-financelayer-input');

const dnslookupBtn = document.getElementById('webint-dnslookup-btn');
const dnslookupInput = document.getElementById('webint-dnslookup-input');

const googlesearchBtn = document.getElementById('webint-googlesearch-btn');
const googlesearchInput = document.getElementById('webint-googlesearch-input');

const scrapegraphBtn = document.getElementById('scrapegraph-btn');
const scrapegraphSourcesInput = document.getElementById('scrapegraph-sources-input');
const scrapegraphPromptInput = document.getElementById('scrapegraph-prompt-input');
const scrapegraphModelSelect = document.getElementById('scrapegraph-model-select');
const scrapegraphResultDiv = document.getElementById('scrapegraph-result');

// 🔤 ELEMENTI SPECIFICI PER LA TRADUZIONE
const translationBtn = document.getElementById('translation-btn');
const translationTextInput = document.getElementById('translation-text-input'); // Corretto ID dalla textarea
const translationLanguageSelect = document.getElementById('translation-language-select'); // Corretto ID dal select
const translationResultDiv = document.getElementById('translation-result'); // ID del div per il risultato

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
    
    // Attendiamo la risposta JSON ma non la usiamo direttamente qui
    await response.json();

    addStatus(`Risultato per '${target}' salvato. Pronto per la prossima ricerca.`, 'success');
    enableReportButton();

  } catch (error) {
    addStatus(`Errore durante la ricerca per '${target}': ${error.message}`, 'error');
  } finally {
    button.disabled = false;
  }
}

/**
 * 🔤 Nuova funzione dedicata per la traduzione.
 * Gestisce l'invio del testo e della lingua, e visualizza il risultato direttamente sulla pagina.
 */
async function performTranslation() {
  const textToTranslate = translationTextInput.value.trim();
  const targetLang = translationLanguageSelect.value;

  if (!textToTranslate) {
    alert('Per favore, inserisci del testo da tradurre.');
    return;
  }

  clearStatus();
  translationResultDiv.innerText = ''; // Pulisce il risultato precedente
  addStatus(`Traduzione in corso...`, 'loading');

  // Il payload è un oggetto strutturato per contenere sia testo che lingua
  const payload = {
    sessionId,
    action: 'translate_text', // Azione specifica per la traduzione
    data: {
      text: textToTranslate,
      targetLang: targetLang
    },
    timestamp: new Date().toISOString()
  };

  console.log(`📡 Inoltro richiesta di traduzione a: ${N8N_WEBHOOK_URL}`);
  console.log(`📦 Payload:`, JSON.stringify(payload, null, 2));

  translationBtn.disabled = true;

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Errore dal server: ${response.statusText}`);
    
    const result = await response.json();

    // Mostra il testo tradotto ricevuto dal webhook
    if (result.translatedText) {
      translationResultDiv.innerText = result.translatedText;
      addStatus('Traduzione completata con successo.', 'success');
      enableReportButton(); // Abilita il report anche dopo una traduzione
    } else {
      throw new Error("La risposta del server non contiene il testo tradotto.");
    }

  } catch (error) {
    addStatus(`Errore durante la traduzione: ${error.message}`, 'error');
    translationResultDiv.innerText = 'Errore durante la traduzione.';
  } finally {
    translationBtn.disabled = false;
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

  financelayerBtn.addEventListener('click', () => {
    performSearch(financelayerBtn, financelayerInput, 'search_financelayer', financelayerInput.value.trim());
  });

  dnslookupBtn.addEventListener('click', () => {
    performSearch(dnslookupBtn, dnslookupInput, 'search_dnslookup', dnslookupInput.value.trim());
  });

  googlesearchBtn.addEventListener('click', () => {
    performSearch(googlesearchBtn, googlesearchInput, 'search_google', googlesearchInput.value.trim());
  });

  // 🔤 Event listener aggiornato per chiamare la nuova funzione di traduzione
  translationBtn.addEventListener('click', performTranslation);

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

async function performScrapegraph() {
  const sources = scrapegraphSourcesInput.value.trim();
  const prompt = scrapegraphPromptInput.value.trim();
  const model = scrapegraphModelSelect.value;

  if (!sources || !prompt) {
    alert('Per favore, compila sia le fonti che il prompt.');
    return;
  }

  clearStatus();
  scrapegraphResultDiv.innerText = ''; // Pulisce il risultato precedente
  addStatus('Estrazione dati tramite ScrapeGraph-AI in corso...', 'loading');

  const payload = {
    sessionId,
    action: 'scrapegraph_extract',
    data: {
      sources,
      prompt,
      model
    },
    timestamp: new Date().toISOString()
  };

  console.log(`📡 Inoltro richiesta ScrapeGraph-AI a: ${N8N_WEBHOOK_URL}`);
  console.log(`📦 Payload:`, JSON.stringify(payload, null, 2));

  scrapegraphBtn.disabled = true;

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Errore dal server: ${response.statusText}`);
    
    const result = await response.json();

    if (result.output) {
      scrapegraphResultDiv.innerText = result.output;
      addStatus('Estrazione completata con successo.', 'success');
      enableReportButton(); // Abilita il report
    } else {
      throw new Error("La risposta del server non contiene il campo 'output'.");
    }

  } catch (error) {
    addStatus(`Errore durante l'estrazione ScrapeGraph-AI: ${error.message}`, 'error');
    scrapegraphResultDiv.innerText = 'Errore durante l\'estrazione.';
  } finally {
    scrapegraphBtn.disabled = false;
  }
}