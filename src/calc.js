// calc.js — funzioni di calcolo "pure" (senza toccare la pagina HTML).
//
// Tenere i calcoli separati dall'interfaccia ha due vantaggi:
//  1. il codice è più facile da leggere;
//  2. possiamo testare i calcoli con Node.js (vedi la cartella test/).
//
// In italiano: "voto" = il voto dell'esame (18–30), "CFU" = i crediti
// dell'esame, "media ponderata" = la media pesata sui crediti.

// Voto minimo e massimo ammessi in un esame universitario italiano.
const VOTO_MIN = 18;
const VOTO_MAX = 30;

/**
 * Controlla che un esame sia valido.
 * @param {{voto:number, cfu:number}} esame
 * @returns {string[]} elenco di errori (array vuoto se l'esame è valido)
 */
function validaEsame(esame) {
  const errori = [];
  if (!Number.isFinite(esame.voto) || esame.voto < VOTO_MIN || esame.voto > VOTO_MAX) {
    errori.push(`Il voto deve essere un numero tra ${VOTO_MIN} e ${VOTO_MAX}.`);
  }
  if (!Number.isFinite(esame.cfu) || esame.cfu <= 0) {
    errori.push('I CFU devono essere un numero maggiore di zero.');
  }
  return errori;
}

/**
 * Somma dei CFU di tutti gli esami.
 * @param {Array<{cfu:number}>} esami
 * @returns {number}
 */
function totaleCfu(esami) {
  return esami.reduce((somma, e) => somma + e.cfu, 0);
}

/**
 * Media ponderata sui CFU: Σ(voto × CFU) / Σ(CFU).
 * È la media "ufficiale" usata dalle università italiane.
 * @param {Array<{voto:number, cfu:number}>} esami
 * @returns {number|null} la media, oppure null se non ci sono CFU
 */
function mediaPonderata(esami) {
  const cfu = totaleCfu(esami);
  if (cfu <= 0) return null;
  const sommaPesata = esami.reduce((somma, e) => somma + e.voto * e.cfu, 0);
  return sommaPesata / cfu;
}

/**
 * Media aritmetica semplice: Σ(voto) / numero di esami.
 * @param {Array<{voto:number}>} esami
 * @returns {number|null} la media, oppure null se non ci sono esami
 */
function mediaAritmetica(esami) {
  if (esami.length === 0) return null;
  const somma = esami.reduce((s, e) => s + e.voto, 0);
  return somma / esami.length;
}

/**
 * Stima del voto di laurea di partenza in base 110.
 * Formula: media × 110 / 30. È solo la base: non include i punti
 * della tesi, della carriera o delle lodi (che variano da ateneo ad ateneo).
 * @param {number|null} media la media ponderata
 * @returns {number|null}
 */
function votoDiLaurea(media) {
  if (media === null || !Number.isFinite(media)) return null;
  return (media * 110) / 30;
}

/**
 * Conta quante "30 e lode" sono presenti.
 * @param {Array<{lode:boolean}>} esami
 * @returns {number}
 */
function numeroLodi(esami) {
  return esami.filter((e) => e.lode).length;
}

// Esporta le funzioni per i test con Node.js.
// Nel browser la variabile `module` non esiste, quindi questo blocco viene
// semplicemente ignorato.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VOTO_MIN,
    VOTO_MAX,
    validaEsame,
    totaleCfu,
    mediaPonderata,
    mediaAritmetica,
    votoDiLaurea,
    numeroLodi,
  };
}
