// app.js — collega la pagina HTML alle funzioni di calcolo (calc.js).
//
// Questo file si occupa di:
//  - aggiungere e rimuovere gli esami nella tabella;
//  - salvare i dati nel browser (localStorage), così non si perdono;
//  - aggiornare i risultati quando qualcosa cambia.
//
// Le funzioni di calcolo (mediaPonderata, votoDiLaurea, ...) arrivano da
// calc.js, che viene caricato PRIMA di questo file dentro index.html.

(function () {
  'use strict';

  // Chiave con cui salviamo i dati nel browser.
  const CHIAVE_SALVATAGGIO = 'media-universitaria:esami';

  // Stato dell'applicazione: la lista degli esami inseriti.
  let esami = [];
  // Contatore per dare un id univoco a ogni esame.
  let prossimoId = 1;

  // --- Riferimenti agli elementi della pagina ---
  const corpoTabella = document.getElementById('corpo-tabella');
  const bottoneAggiungi = document.getElementById('aggiungi');
  const bottoneAzzera = document.getElementById('azzera');

  // --- Salvataggio / caricamento dal browser ---

  function salva() {
    localStorage.setItem(CHIAVE_SALVATAGGIO, JSON.stringify(esami));
  }

  function carica() {
    const dati = localStorage.getItem(CHIAVE_SALVATAGGIO);
    if (!dati) return false;
    try {
      const lista = JSON.parse(dati);
      if (Array.isArray(lista) && lista.length > 0) {
        esami = lista;
        prossimoId = Math.max(...esami.map((e) => e.id)) + 1;
        return true;
      }
    } catch (err) {
      console.warn('Dati salvati non validi: li ignoro.', err);
    }
    return false;
  }

  // --- Operazioni sugli esami ---

  function aggiungiEsame(datiIniziali) {
    const nuovo = Object.assign(
      { id: prossimoId++, nome: '', voto: 30, cfu: 6, lode: false },
      datiIniziali
    );
    esami.push(nuovo);
    salva();
    renderTabella();
    aggiornaRisultati();
  }

  function rimuoviEsame(id) {
    esami = esami.filter((e) => e.id !== id);
    salva();
    renderTabella();
    aggiornaRisultati();
  }

  function azzeraTutto() {
    if (!confirm('Vuoi davvero cancellare tutti gli esami?')) return;
    esami = [];
    salva();
    renderTabella();
    aggiornaRisultati();
  }

  // --- Disegno della tabella ---

  function renderTabella() {
    corpoTabella.innerHTML = '';
    for (const esame of esami) {
      corpoTabella.appendChild(creaRiga(esame));
    }
  }

  // Crea una riga <tr> della tabella per un singolo esame.
  function creaRiga(esame) {
    const riga = document.createElement('tr');

    // Colonna: nome dell'esame
    const inputNome = document.createElement('input');
    inputNome.type = 'text';
    inputNome.placeholder = 'Es. Analisi Matematica I';
    inputNome.value = esame.nome;
    inputNome.addEventListener('input', () => {
      esame.nome = inputNome.value;
      salva();
    });

    // Colonna: voto (18–30)
    const inputVoto = document.createElement('input');
    inputVoto.type = 'number';
    inputVoto.min = '18';
    inputVoto.max = '30';
    inputVoto.value = esame.voto;
    inputVoto.disabled = esame.lode; // se c'è la lode, il voto è bloccato a 30
    inputVoto.addEventListener('input', () => {
      esame.voto = Number(inputVoto.value);
      salva();
      aggiornaRisultati();
    });

    // Colonna: CFU (crediti)
    const inputCfu = document.createElement('input');
    inputCfu.type = 'number';
    inputCfu.min = '1';
    inputCfu.value = esame.cfu;
    inputCfu.addEventListener('input', () => {
      esame.cfu = Number(inputCfu.value);
      salva();
      aggiornaRisultati();
    });

    // Colonna: lode (30 e lode)
    const inputLode = document.createElement('input');
    inputLode.type = 'checkbox';
    inputLode.checked = esame.lode;
    inputLode.addEventListener('change', () => {
      esame.lode = inputLode.checked;
      if (esame.lode) {
        esame.voto = 30;
        inputVoto.value = 30;
      }
      inputVoto.disabled = esame.lode;
      salva();
      aggiornaRisultati();
    });

    // Colonna: bottone per rimuovere l'esame
    const bottoneRimuovi = document.createElement('button');
    bottoneRimuovi.type = 'button';
    bottoneRimuovi.className = 'rimuovi';
    bottoneRimuovi.textContent = '✕';
    bottoneRimuovi.title = 'Rimuovi esame';
    bottoneRimuovi.addEventListener('click', () => rimuoviEsame(esame.id));

    // Mettiamo ogni input dentro la sua cella <td>.
    riga.appendChild(cella(inputNome));
    riga.appendChild(cella(inputVoto));
    riga.appendChild(cella(inputCfu));
    riga.appendChild(cella(inputLode, 'col-lode'));
    riga.appendChild(cella(bottoneRimuovi, 'col-azioni'));
    return riga;
  }

  // Piccola scorciatoia: crea una cella <td> con dentro un elemento.
  function cella(elemento, classe) {
    const td = document.createElement('td');
    if (classe) td.className = classe;
    td.appendChild(elemento);
    return td;
  }

  // --- Calcolo e visualizzazione dei risultati ---

  function aggiornaRisultati() {
    // Per i calcoli teniamo solo gli esami compilati correttamente.
    const validi = esami.filter((e) => validaEsame(e).length === 0);

    const ponderata = mediaPonderata(validi);
    const aritmetica = mediaAritmetica(validi);
    const laurea = votoDiLaurea(ponderata);

    mostra('media-ponderata', ponderata === null ? '—' : ponderata.toFixed(2));
    mostra('media-aritmetica', aritmetica === null ? '—' : aritmetica.toFixed(2));
    mostra('voto-laurea', laurea === null ? '—' : Math.round(laurea) + '/110');
    mostra('totale-cfu', totaleCfu(validi));
    mostra('numero-esami', validi.length);
    mostra('numero-lodi', numeroLodi(validi));
  }

  function mostra(id, valore) {
    document.getElementById(id).textContent = valore;
  }

  // --- Avvio dell'applicazione ---

  bottoneAggiungi.addEventListener('click', () => aggiungiEsame());
  bottoneAzzera.addEventListener('click', azzeraTutto);

  if (carica()) {
    // Ci sono dati salvati: li mostriamo.
    renderTabella();
    aggiornaRisultati();
  } else {
    // Primo avvio: inseriamo qualche esame di esempio per far capire come funziona.
    aggiungiEsame({ nome: 'Analisi Matematica I', voto: 27, cfu: 9, lode: false });
    aggiungiEsame({ nome: 'Programmazione', voto: 30, cfu: 12, lode: true });
    aggiungiEsame({ nome: 'Laboratorio I', voto: 28, cfu: 6, lode: false });
  }
})();
