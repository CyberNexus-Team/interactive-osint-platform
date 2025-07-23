const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/osint-master";
const sessionId = self.crypto.randomUUID();

const generateReportBtn = document.getElementById('generate-report-btn');
const statusDiv = document.getElementById('status');

// 🔍 WEBINT
const ipinfoBtn           = document.getElementById('webint-ipinfo-btn');
const ipinfoInput         = document.getElementById('webint-ipinfo-input');
const ipstackBtn          = document.getElementById('webint-ipstack-btn');
const ipstackInput        = document.getElementById('webint-ipstack-input');
const ipapiBtn            = document.getElementById('webint-ipapi-btn');
const ipapiInput          = document.getElementById('webint-ipapi-input');
const opencageBtn         = document.getElementById('webint-opencage-btn');
const opencageInput       = document.getElementById('webint-opencage-input');
const mediastackBtn       = document.getElementById('webint-mediastack-btn');
const mediastackInput     = document.getElementById('webint-mediastack-input');
const screenshotlayerBtn  = document.getElementById('webint-screenshotlayer-btn');
const screenshotlayerInput= document.getElementById('webint-screenshotlayer-input');
const financelayerBtn     = document.getElementById('webint-financelayer-btn');
const financelayerInput   = document.getElementById('webint-financelayer-input');
const dnslookupBtn        = document.getElementById('webint-dnslookup-btn');
const dnslookupInput      = document.getElementById('webint-dnslookup-input');
const googlesearchBtn     = document.getElementById('webint-googlesearch-btn');
const googlesearchInput   = document.getElementById('webint-googlesearch-input');

// 🧠 ScrapeGraph-AI
const scrapegraphBtn           = document.getElementById('webint-scrapegraph-btn');
const scrapegraphSourcesInput  = document.getElementById('webint-scrapegraph-source-input');
const scrapegraphPromptInput   = document.getElementById('webint-scrapegraph-prompt-input');
const scrapegraphModelSelect   = document.getElementById('webint-scrapegraph-model-select');

// 🛡️ THREAT INTELLIGENCE
const tiAbuseBtn         = document.getElementById('ti-abuseipdb-btn');
const tiAbuseInput       = document.getElementById('ti-abuseipdb-input');
const tiAlienvaultBtn    = document.getElementById('ti-alienvault-btn');
const tiAlienvaultInput  = document.getElementById('ti-alienvault-input');
const tiMalshareBtn      = document.getElementById('ti-malshare-btn');
const tiMalshareInput    = document.getElementById('ti-malshare-input');
const tiUrlscanBtn       = document.getElementById('ti-urlscan-btn');
const tiUrlscanInput     = document.getElementById('ti-urlscan-input');
const tiHostBtn          = document.getElementById('ti-host-btn');
const tiHostInput        = document.getElementById('ti-host-input');
const tiIp2locBtn        = document.getElementById('ti-ip2location-btn');
const tiIp2locInput      = document.getElementById('ti-ip2location-input');
const tiIplocateBtn      = document.getElementById('ti-iplocate-btn');
const tiIplocateInput    = document.getElementById('ti-iplocate-input');
const tiVirusTotalBtn    = document.getElementById('ti-virusTotal-btn');
const tiVirusTotalInput  = document.getElementById('ti-virusTotal-input');
const tiIpGeoBtn         = document.getElementById('ti-ipgeolocation-btn');
const tiIpGeoInput       = document.getElementById('ti-ipgeolocation-input');
const tiFinlightBtn      = document.getElementById('ti-finlight-btn');
const tiFinlightInput    = document.getElementById('ti-finlight-input');

// 🌍 GEOINT
const aviationstackBtn   = document.getElementById('aviation-stack-btn');
const aviationstackInput = document.getElementById('aviation-stack-input');
const weatherstackBtn    = document.getElementById('weather-stack-btn');
const weatherstackInput  = document.getElementById('weather-stack-input');
const positionstackBtn   = document.getElementById('position-stack-btn');
const positionstackInput = document.getElementById('position-stack-input');
const geographyapiBtn    = document.getElementById('geography-api-btn');
const geographyapiInput  = document.getElementById('geography-api-input');

// 👤 HUMINT
const opencorporatesBtn         = document.getElementById('humint-opencorporates-btn');
const opencorporatesInput       = document.getElementById('humint-opencorporates-input');
const numberVerificationBtn     = document.getElementById('humint-number-verification-btn');
const numberVerificationInput   = document.getElementById('humint-number-verification-input');
const emailVerificationBtn      = document.getElementById('humint-email-verification-btn');
const emailVerificationInput    = document.getElementById('humint-email-verification-input');
const vatValidationBtn          = document.getElementById('humint-vat-validation-btn');
const vatValidationInput        = document.getElementById('humint-vat-validation-input');
const bankDataBtn               = document.getElementById('humint-bank-data-btn');
const bankDataInput             = document.getElementById('humint-bank-data-input');

// 👥 ENRICHMENT & INTELLIGENCE
const intelWikipediaBtn         = document.getElementById('intel-wikipedia-btn');
const intelWikipediaInput       = document.getElementById('intel-wikipedia-input');
const intelClearbitBtn          = document.getElementById('intel-clearbit-btn');
const intelClearbitInput        = document.getElementById('intel-clearbit-input');
const intelOpenbrisBtn          = document.getElementById('intel-openbris-btn');
const intelOpenbrisInput        = document.getElementById('intel-openbris-input');
const intelVeriphoneBtn         = document.getElementById('intel-veriphone-btn');
const intelVeriphoneInput       = document.getElementById('intel-veriphone-input');
const intelHunterVerifierBtn    = document.getElementById('intel-hunter-verifier-btn');
const intelHunterVerifierInput  = document.getElementById('intel-hunter-verifier-input');
const intelHunterFinderBtn      = document.getElementById('intel-hunter-finder-btn');
const intelHunterFinderDomain   = document.getElementById('intel-hunter-finder-domain-input');
const intelHunterFinderFirst    = document.getElementById('intel-hunter-finder-first-input');
const intelHunterFinderLast     = document.getElementById('intel-hunter-finder-last-input');
const intelHunterCompanyBtn     = document.getElementById('intel-hunter-company-btn');
const intelHunterCompanyInput   = document.getElementById('intel-hunter-company-input');
const intelHunterPersonBtn      = document.getElementById('intel-hunter-person-btn');
const intelHunterPersonInput    = document.getElementById('intel-hunter-person-input');

// ——— BASICS ———
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
  newMessage.classList.add(`status-${type}`);
  statusDiv.appendChild(newMessage);
  statusDiv.scrollTop = statusDiv.scrollHeight;
  const emojis = { loading: '⏳', success: '✅', error: '❌', default: 'ℹ️' };
  console[type === 'error' ? 'error' : 'log'](`${emojis[type] || emojis.default} ${message}`);
}

function enableReportButton() {
  if (generateReportBtn.disabled) {
    generateReportBtn.disabled = false;
    console.log('📄 "Genera Report" abilitato.');
  }
}

async function performSearch(button, action, target) {
  if (!target) {
    alert('Per favore, inserisci un valore nel campo.');
    return;
  }
  clearStatus();
  addStatus(`Esecuzione '${action}' per '${target}'...`, 'loading');
  button.disabled = true;
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, action, data: target, timestamp: new Date().toISOString() })
    });
    if (!res.ok) throw new Error(res.statusText);
    await res.json();
    addStatus(`Risultato '${target}' salvato.`, 'success');
    enableReportButton();
  } catch (err) {
    addStatus(`Errore: ${err.message}`, 'error');
  } finally {
    button.disabled = false;
  }
}

async function performScrapegraph() {
  const sources = scrapegraphSourcesInput.value.trim();
  const prompt  = scrapegraphPromptInput.value.trim();
  const model   = scrapegraphModelSelect.value;
  if (!sources || !prompt) {
    alert('Compila sia fonti che prompt.');
    return;
  }
  clearStatus();
  addStatus('Esecuzione ScrapeGraph-AI...', 'loading');
  scrapegraphBtn.disabled = true;
  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, action: 'scrapegraph_extract', data: { sources, prompt, model }, timestamp: new Date().toISOString() })
    });
    if (!res.ok) throw new Error(res.statusText);
    const result = await res.json();
    if (!result.output) throw new Error("Nessun 'output' ricevuto");
    addStatus('Estrazione completata.', 'success');
    console.log(result.output);
    enableReportButton();
  } catch (err) {
    addStatus(`Errore ScrapeGraph: ${err.message}`, 'error');
  } finally {
    scrapegraphBtn.disabled = false;
  }
}

function detectGeographyAction(val) {
  return /^[A-Z]{2}$/i.test(val) ? 'search_geographyapi_country' : 'search_geographyapi_city';
}

// ——— EVENT LISTENERS ———
function setupEventListeners() {
  // WEBINT
  ipinfoBtn    .addEventListener('click', () => performSearch(ipinfoBtn, 'search_ipinfo',        ipinfoInput.value.trim()));
  ipstackBtn   .addEventListener('click', () => performSearch(ipstackBtn,'search_ipstack',       ipstackInput.value.trim()));
  ipapiBtn     .addEventListener('click', () => performSearch(ipapiBtn,  'search_ipapi',         ipapiInput.value.trim()));
  opencageBtn  .addEventListener('click', () => performSearch(opencageBtn,'search_opencage',      opencageInput.value.trim()));
  mediastackBtn.addEventListener('click', () => performSearch(mediastackBtn,'search_mediastack',  mediastackInput.value.trim()));
  screenshotlayerBtn.addEventListener('click', () => performSearch(screenshotlayerBtn,'search_screenshotlayer', screenshotlayerInput.value.trim()));
  financelayerBtn.addEventListener('click', () => performSearch(financelayerBtn,'search_financelayer',   financelayerInput.value.trim()));
  dnslookupBtn.addEventListener('click', () => performSearch(dnslookupBtn,'search_dnslookup',       dnslookupInput.value.trim()));
  googlesearchBtn.addEventListener('click', () => performSearch(googlesearchBtn,'search_google',        googlesearchInput.value.trim()));

  // ScrapeGraph-AI
  scrapegraphBtn.addEventListener('click', performScrapegraph);

  // THREAT INTELLIGENCE
  tiAbuseBtn   .addEventListener('click', () => performSearch(tiAbuseBtn,   'search_abuseipdb',            tiAbuseInput.value.trim()));
  tiAlienvaultBtn.addEventListener('click', () => performSearch(tiAlienvaultBtn,'search_alienvault',         tiAlienvaultInput.value.trim()));
  tiMalshareBtn.addEventListener('click', () => performSearch(tiMalshareBtn,'search_malshare',             tiMalshareInput.value.trim()));
  tiUrlscanBtn .addEventListener('click', () => performSearch(tiUrlscanBtn,'search_urlscan',               tiUrlscanInput.value.trim()));
  tiHostBtn    .addEventListener('click', () => performSearch(tiHostBtn,   'search_hostio',                tiHostInput.value.trim()));
  tiIp2locBtn  .addEventListener('click', () => performSearch(tiIp2locBtn,'search_ip2location',          tiIp2locInput.value.trim()));
  tiIplocateBtn.addEventListener('click', () => performSearch(tiIplocateBtn,'search_iplocate',            tiIplocateInput.value.trim()));
  tiVirusTotalBtn.addEventListener('click', () => performSearch(tiVirusTotalBtn,'search_virustotal',        tiVirusTotalInput.value.trim()));
  tiIpGeoBtn   .addEventListener('click', () => performSearch(tiIpGeoBtn,  'search_ipgeolocation',        tiIpGeoInput.value.trim()));
  tiFinlightBtn.addEventListener('click', () => performSearch(tiFinlightBtn,'search_finlight_disabled',    tiFinlightInput.value.trim()));

  // GEOINT
  aviationstackBtn.addEventListener('click', () => performSearch(aviationstackBtn,'search_aviationstack', aviationstackInput.value.trim()));
  weatherstackBtn .addEventListener('click', () => performSearch(weatherstackBtn, 'search_weatherstack',  weatherstackInput.value.trim()));
  positionstackBtn.addEventListener('click', () => performSearch(positionstackBtn,'search_positionstack', positionstackInput.value.trim()));
  geographyapiBtn .addEventListener('click', () => {
    const v = geographyapiInput.value.trim();
    performSearch(geographyapiBtn, detectGeographyAction(v), v);
  });

  // HUMINT
  opencorporatesBtn.addEventListener('click', () =>
    performSearch(opencorporatesBtn, 'search_opencorporates', opencorporatesInput.value.trim())
  );
  numberVerificationBtn.addEventListener('click', () =>
    performSearch(numberVerificationBtn, 'search_number_verification', numberVerificationInput.value.trim())
  );
  emailVerificationBtn.addEventListener('click', () =>
    performSearch(emailVerificationBtn, 'search_email_verification', emailVerificationInput.value.trim())
  );
  vatValidationBtn.addEventListener('click', () =>
    performSearch(vatValidationBtn, 'search_vat_validation', vatValidationInput.value.trim())
  );
  bankDataBtn.addEventListener('click', () =>
    performSearch(bankDataBtn, 'search_bank_data', bankDataInput.value.trim())
  );

  // ENRICHMENT & INTELLIGENCE
  intelWikipediaBtn.addEventListener('click', () =>
    performSearch(intelWikipediaBtn, 'search_wikipedia', intelWikipediaInput.value.trim())
  );
  intelClearbitBtn.addEventListener('click', () =>
    performSearch(intelClearbitBtn, 'search_clearbit_autocomplete', intelClearbitInput.value.trim())
  );
  intelOpenbrisBtn.addEventListener('click', () =>
    performSearch(intelOpenbrisBtn, 'search_openbris', intelOpenbrisInput.value.trim())
  );
  intelVeriphoneBtn.addEventListener('click', () =>
    performSearch(intelVeriphoneBtn, 'search_veriphone', intelVeriphoneInput.value.trim())
  );
  intelHunterVerifierBtn.addEventListener('click', () =>
    performSearch(intelHunterVerifierBtn, 'search_hunter_email_verifier', intelHunterVerifierInput.value.trim())
  );
  intelHunterFinderBtn.addEventListener('click', () => {
    const domain = intelHunterFinderDomain.value.trim();
    const first  = intelHunterFinderFirst.value.trim();
    const last   = intelHunterFinderLast.value.trim();
    if (!domain || !first || !last) {
      alert('Compila dominio, nome e cognome per Hunter Finder.');
      return;
    }
    clearStatus();
    addStatus(`Ricerca Hunter Finder per ${first}@${domain}...`, 'loading');
    intelHunterFinderBtn.disabled = true;
    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, action: 'search_hunter_email_finder', data: { domain, first_name: first, last_name: last }, timestamp: new Date().toISOString() })
    })
    .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
    .then(() => { addStatus('Hunter Finder completato.', 'success'); enableReportButton(); })
    .catch(e => addStatus(`Errore: ${e.message}`, 'error'))
    .finally(() => intelHunterFinderBtn.disabled = false);
  });
  
  intelHunterCompanyBtn.addEventListener('click', () =>
    performSearch(intelHunterCompanyBtn, 'search_hunter_company_enrichment', intelHunterCompanyInput.value.trim())
  );
  intelHunterPersonBtn.addEventListener('click', () =>
    performSearch(intelHunterPersonBtn, 'search_hunter_person_enrichment', intelHunterPersonInput.value.trim())
  );

  // GENERATE REPORT
  generateReportBtn.addEventListener('click', async () => {
    clearStatus();
    addStatus('Generazione report in corso...', 'loading');
    generateReportBtn.disabled = true;
    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action: 'generate_report', timestamp: new Date().toISOString() })
      });
      if (!res.ok) throw new Error(res.statusText);
      const result = await res.json();
      addStatus('Report generato!', 'success');
      if (result.reportUrl) window.open(result.reportUrl, '_blank');
    } catch (err) {
      addStatus(`Errore report: ${err.message}`, 'error');
    } finally {
      generateReportBtn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSession();
  setupEventListeners();
});
