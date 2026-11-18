// Haut de page 3D d'AMD Project Maroc (brouillon du 17/11/2026) : un bureau en bois, un ordinateur et un téléphone.
// Les deux écrans montrent ce qu'on installe, étape par étape : les vrais films des sites d'exemple, les réseaux
// (planning du mois + réel), puis les automatisations (devis à l'en-tête + rappels WhatsApp). Exemples de démonstration.
import { lancer } from '../moteur/moteur3d.js?v=ch2';

const toile = document.querySelector('#scene3d');
const OW = 1152, OH = 720;      // écran de l'ordinateur (même format que les films de sites)
const TW = 480, TH = 1038;      // écran du téléphone
const film = new URLSearchParams(location.search).has('film');
const C = { nuit: '#0B1726', nuit2: '#12273C', nuit3: '#1A3550', cyan: '#34D8FF', creme: '#F4EDE2', doux: '#A9B8C7', gris: '#4A5A6A', vert: '#1FA855', bulle: '#D9FDD3', papier: '#FFFDF8' };
const police = (t, g = 400) => `${g} ${t}px Figtree, system-ui, sans-serif`;
const titre = (t) => `700 ${t}px Parkinsans, Figtree, sans-serif`;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const lisse = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function lignes(ctx, texte, x, y, larg, haut) {
  const mots = texte.split(' '); let l = '', n = 0;
  for (const m of mots) { const t = l ? l + ' ' + m : m; if (ctx.measureText(t).width > larg && l) { ctx.fillText(l, x, y + n * haut); n++; l = m; } else l = t; }
  if (l) { ctx.fillText(l, x, y + n * haut); n++; }
  return n;
}
function nbLignes(ctx, texte, larg) {
  const mots = texte.split(' '); let l = '', n = 0;
  for (const m of mots) { const t = l ? l + ' ' + m : m; if (ctx.measureText(t).width > larg && l) { n++; l = m; } else l = t; }
  return n + (l ? 1 : 0);
}

// ---------- les films des sites d'exemple ----------
const FILMS = {};
function filmDe(nom) {
  if (FILMS[nom]) return FILMS[nom];
  const v = document.createElement('video');
  v.src = `videos/${nom}.mp4`; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
  v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
  const affiche = new Image(); affiche.src = `images/${nom}.webp`;
  FILMS[nom] = { v, affiche, t0: null };
  return FILMS[nom];
}
let actifs = new Set();
function jouer(noms) {
  const voulu = new Set(noms);
  for (const [nom, f] of Object.entries(FILMS)) if (!voulu.has(nom) && !f.v.paused) f.v.pause();
  for (const nom of voulu) { const f = filmDe(nom); if (!film && f.v.paused) f.v.play().catch(() => {}); }
  actifs = voulu;
}
// dessine un film « en couverture » dans un rectangle ; en mode film, le temps du film suit l'horloge de la scène
function dessinerFilm(ctx, nom, x, y, w, h, temps) {
  const f = filmDe(nom), v = f.v;
  if (film && v.readyState >= 1 && v.duration) {
    if (f.t0 === null) f.t0 = temps;
    const cible = (temps - f.t0) % v.duration;
    if (Math.abs(v.currentTime - cible) > 0.04) v.currentTime = cible;
  }
  const src = v.readyState >= 2 ? v : (f.affiche.complete && f.affiche.naturalWidth ? f.affiche : null);
  if (!src) { ctx.fillStyle = '#000'; ctx.fillRect(x, y, w, h); return; }
  const sw = src.videoWidth || src.naturalWidth, sh = src.videoHeight || src.naturalHeight;
  const e = Math.max(w / sw, h / sh), dw = sw * e, dh = sh * e;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.drawImage(src, x + (w - dw) / 2, y, dw, dh);   // calé en haut, comme dans la page
  ctx.restore();
}
const image = (nom) => filmDe(nom).affiche;

// ---------- étape 2 : réseaux sociaux ----------
function planning(ctx, t) {
  ctx.fillStyle = '#F6F1E8'; ctx.fillRect(0, 0, OW, OH);
  ctx.fillStyle = C.nuit2; ctx.fillRect(0, 0, OW, 64);
  ctx.fillStyle = C.creme; ctx.font = titre(26); ctx.textBaseline = 'middle'; ctx.fillText('Planning du mois', 34, 33);
  ctx.fillStyle = C.doux; ctx.font = police(17); ctx.fillText('Facebook · Instagram', 270, 34);
  // bouton « valider » qui se valide au bout de 6 s
  const ok = t > 6.2;
  rr(ctx, OW - 214, 14, 180, 38, 10); ctx.fillStyle = ok ? C.vert : C.cyan; ctx.fill();
  ctx.fillStyle = ok ? '#fff' : C.nuit; ctx.font = police(17, 700); ctx.textAlign = 'center'; ctx.fillText(ok ? 'Validé ✓' : 'Valider le mois', OW - 124, 34); ctx.textAlign = 'left';
  const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const gx = 34, gy = 100, cw = (OW - 68) / 7, ch = 118;
  ctx.font = police(15, 700); ctx.fillStyle = C.gris;
  jours.forEach((j, i) => ctx.fillText(j, gx + i * cw + 10, gy - 16));
  const posts = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26];      // 12 publications (formule Présence)
  const genres = ['Réel', 'Photo', 'Carrousel'];
  const vignettes = ['maquette-traiteur', 'maquette-salle-telephone', 'maquette-decorateur-telephone', 'maquette-plombier'];
  for (let d = 0; d < 28; d++) {
    const c = d % 7, l = Math.floor(d / 7), x = gx + c * cw, y = gy + l * ch;
    rr(ctx, x + 4, y + 4, cw - 8, ch - 8, 10); ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.strokeStyle = 'rgba(11,23,38,.08)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = C.gris; ctx.font = police(14, 600); ctx.fillText(String(d + 1), x + 14, y + 22);
    const k = posts.indexOf(d + 1);
    if (k < 0) continue;
    const a = lisse((t - 0.3 - k * 0.38) / 0.4);
    if (a <= 0) continue;
    ctx.globalAlpha = a;
    const img = image(vignettes[k % 4]);
    const vx = x + 12, vy = y + 34, vw = cw - 24, vh = ch - 50;
    ctx.save(); rr(ctx, vx, vy, vw, vh, 8); ctx.clip();
    if (img.complete && img.naturalWidth) { const e = vw / img.naturalWidth; ctx.drawImage(img, vx, vy - (k % 3) * 20, vw, img.naturalHeight * e); }
    else { ctx.fillStyle = C.nuit3; ctx.fillRect(vx, vy, vw, vh); }
    ctx.restore();
    rr(ctx, vx + 6, vy + 6, 78, 22, 11); ctx.fillStyle = 'rgba(11,23,38,.78)'; ctx.fill();
    ctx.fillStyle = C.cyan; ctx.font = police(12, 700); ctx.fillText(genres[k % 3], vx + 14, vy + 18);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = C.gris; ctx.font = police(15); ctx.textBaseline = 'alphabetic';
  ctx.fillText('12 publications ce mois-ci · exemple de démonstration', gx + 6, OH - 26);
}

function reel(ctx, t, temps) {
  const nom = Math.floor(t / 9) % 2 ? 'maquette-plombier' : 'maquette-traiteur';
  dessinerFilm(ctx, nom, 0, 0, TW, TH, temps);
  const g = ctx.createLinearGradient(0, TH * 0.55, 0, TH); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.72)');
  ctx.fillStyle = g; ctx.fillRect(0, TH * 0.55, TW, TH * 0.45);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 0, TW, 74);
  ctx.fillStyle = '#fff'; ctx.font = police(24, 700); ctx.textBaseline = 'middle'; ctx.fillText('Réels', 24, 40);
  // colonne d'actions
  const bat = 1 + Math.max(0, Math.sin(t * 3)) * 0.12;
  [['♥', 0], ['💬', 1], ['➤', 2]].forEach(([s, i]) => {
    const y = TH - 400 + i * 92;
    ctx.beginPath(); ctx.arc(TW - 48, y, 30 * (i === 0 ? bat : 1), 0, 7); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fill();
    ctx.fillStyle = i === 0 ? '#FF4D6D' : '#fff'; ctx.font = police(28, 700); ctx.textAlign = 'center'; ctx.fillText(s, TW - 48, y + 2); ctx.textAlign = 'left';
  });
  ctx.beginPath(); ctx.arc(46, TH - 150, 22, 0, 7); ctx.fillStyle = C.cyan; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = police(21, 700); ctx.fillText('votre.commerce', 80, TH - 150);
  ctx.font = police(19); ctx.fillStyle = 'rgba(255,255,255,.9)';
  lignes(ctx, nom === 'maquette-traiteur' ? 'Nos plateaux de la semaine, à commander sur WhatsApp.' : 'Intervention rapide à Tanger, appelez-nous.', 24, TH - 100, TW - 120, 26);
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.font = police(15); ctx.fillText('Exemple de démonstration', 24, TH - 34);
}

// ---------- étape 3 : automatisations ----------
function devis(ctx, t) {
  ctx.fillStyle = '#E9E3D8'; ctx.fillRect(0, 0, OW, OH);
  const px = 236, py = 30, pw = 680, ph = OH - 60;
  ctx.fillStyle = 'rgba(11,23,38,.12)'; rr(ctx, px + 6, py + 8, pw, ph, 6); ctx.fill();
  ctx.fillStyle = C.papier; rr(ctx, px, py, pw, ph, 6); ctx.fill();
  // en-tête du commerce
  rr(ctx, px + 36, py + 34, 64, 64, 14); ctx.fillStyle = C.nuit2; ctx.fill();
  ctx.fillStyle = C.cyan; ctx.font = titre(30); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('V', px + 68, py + 67); ctx.textAlign = 'left';
  ctx.fillStyle = C.nuit; ctx.font = titre(24); ctx.fillText('Votre commerce', px + 118, py + 52);
  ctx.fillStyle = C.gris; ctx.font = police(15); ctx.fillText('Tanger · ICE 000000000000000 · IF 00000000', px + 118, py + 82);
  ctx.textAlign = 'right'; ctx.fillStyle = C.nuit; ctx.font = titre(26); ctx.fillText('DEVIS', px + pw - 36, py + 52);
  ctx.font = police(16, 600); ctx.fillStyle = '#086C8C'; ctx.fillText('N° D-2026-031', px + pw - 36, py + 82); ctx.textAlign = 'left';
  ctx.strokeStyle = 'rgba(11,23,38,.12)'; ctx.beginPath(); ctx.moveTo(px + 36, py + 122); ctx.lineTo(px + pw - 36, py + 122); ctx.stroke();
  ctx.fillStyle = C.gris; ctx.font = police(15, 700);
  ctx.fillText('Désignation', px + 36, py + 152); ctx.textAlign = 'right'; ctx.fillText('Qté', px + pw - 200, py + 152); ctx.fillText('Montant', px + pw - 36, py + 152); ctx.textAlign = 'left';
  const L = ['Prestation principale', 'Fournitures', 'Déplacement', 'Finitions'];
  L.forEach((txt, i) => {
    const a = lisse((t - 0.4 - i * 0.55) / 0.4); if (a <= 0) return;
    const y = py + 196 + i * 52; ctx.globalAlpha = a;
    ctx.fillStyle = C.nuit; ctx.font = police(18); ctx.fillText(txt, px + 36, y);
    ctx.textAlign = 'right'; ctx.fillText('1', px + pw - 200, y); ctx.textAlign = 'left';
    rr(ctx, px + pw - 146, y - 10, 110, 20, 10); ctx.fillStyle = 'rgba(11,23,38,.1)'; ctx.fill();
    ctx.globalAlpha = 1;
  });
  const at = lisse((t - 3.0) / 0.5);
  if (at > 0) {
    ctx.globalAlpha = at;
    ctx.strokeStyle = 'rgba(11,23,38,.12)'; ctx.beginPath(); ctx.moveTo(px + pw - 330, py + 418); ctx.lineTo(px + pw - 36, py + 418); ctx.stroke();
    [['Total HT', 0], ['TVA', 1], ['Total TTC', 2]].forEach(([n, i]) => {
      const y = py + 452 + i * 36;
      ctx.fillStyle = i === 2 ? C.nuit : C.gris; ctx.font = police(17, i === 2 ? 700 : 400); ctx.fillText(n, px + pw - 330, y);
      rr(ctx, px + pw - 146, y - 10, 110, 20, 10); ctx.fillStyle = i === 2 ? 'rgba(8,108,140,.22)' : 'rgba(11,23,38,.1)'; ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  // tampon « PDF prêt » puis envoi sur WhatsApp
  const st = lisse((t - 4.4) / 0.35);
  if (st > 0) {
    ctx.save(); ctx.translate(px + 160, py + 470); ctx.rotate(-0.12); ctx.scale(1.4 - 0.4 * st, 1.4 - 0.4 * st); ctx.globalAlpha = st;
    ctx.strokeStyle = '#086C8C'; ctx.lineWidth = 4; rr(ctx, -96, -30, 192, 60, 10); ctx.stroke();
    ctx.fillStyle = '#086C8C'; ctx.font = titre(26); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('PDF prêt', 0, 2); ctx.restore();
    ctx.textAlign = 'left';
  }
  const wa = lisse((t - 5.6) / 0.4);
  if (wa > 0) {
    const y = OH - 84 + (1 - wa) * 40; ctx.globalAlpha = wa;
    rr(ctx, OW / 2 - 200, y, 400, 54, 27); ctx.fillStyle = C.vert; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = police(19, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Envoyé au client sur WhatsApp ✓', OW / 2, y + 28); ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }
  ctx.textBaseline = 'alphabetic'; ctx.fillStyle = C.gris; ctx.font = police(14); ctx.fillText('Exemple de démonstration', 24, OH - 18);
}

const MSG = [
  { moi: true, txt: 'Bonjour, petit rappel : votre rendez-vous est demain à 10 h. À demain !', note: 'Rappel envoyé la veille' },
  { moi: false, txt: 'Merci, c\'est noté.' },
  { moi: true, txt: 'Bonjour, avez-vous pu regarder le devis envoyé lundi ?', note: 'Relance du devis' },
  { moi: true, doc: 'Devis D-2026-031.pdf' },
  { moi: false, txt: 'Oui, c\'est bon pour moi.' },
];
function whatsapp(ctx, t) {
  ctx.fillStyle = '#EFE7DD'; ctx.fillRect(0, 0, TW, TH);
  ctx.fillStyle = '#075E54'; ctx.fillRect(0, 0, TW, 104);
  ctx.beginPath(); ctx.arc(52, 62, 24, 0, 7); ctx.fillStyle = '#C9D6DF'; ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = police(22, 700); ctx.textBaseline = 'middle'; ctx.fillText('Client', 90, 54);
  ctx.font = police(15); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillText('Exemple de démonstration', 90, 80);
  let y = 140;
  MSG.forEach((m, i) => {
    const a = lisse((t - 0.4 - i * 1.3) / 0.35); if (a <= 0) return;
    ctx.globalAlpha = a;
    if (m.note) { ctx.fillStyle = 'rgba(11,23,38,.55)'; ctx.font = police(14, 600); ctx.textAlign = 'center'; ctx.fillText(m.note, TW / 2, y + 8); ctx.textAlign = 'left'; y += 30; }
    ctx.font = police(19);
    const larg = 300, nl = m.doc ? 1 : nbLignes(ctx, m.txt, larg), h = m.doc ? 74 : nl * 27 + 26;
    const bw = m.doc ? 330 : Math.min(larg, Math.max(...m.txt.split(' ').map(() => 0), ctx.measureText(m.txt).width)) + 30;
    const x = m.moi ? TW - bw - 18 : 18;
    rr(ctx, x, y + (1 - a) * 14, bw, h, 14); ctx.fillStyle = m.moi ? C.bulle : '#fff'; ctx.fill();
    ctx.fillStyle = '#111B21';
    if (m.doc) {
      rr(ctx, x + 12, y + 12, 40, 50, 6); ctx.fillStyle = '#E53935'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = police(13, 700); ctx.textAlign = 'center'; ctx.fillText('PDF', x + 32, y + 38); ctx.textAlign = 'left';
      ctx.fillStyle = '#111B21'; ctx.font = police(17, 600); ctx.fillText(m.doc, x + 64, y + 38);
    } else { ctx.textBaseline = 'top'; lignes(ctx, m.txt, x + 15, y + 13, larg, 27); ctx.textBaseline = 'middle'; }
    if (m.moi) { ctx.fillStyle = '#53BDEB'; ctx.font = police(14, 700); ctx.fillText('✓✓', x + bw - 32, y + h - 12); }
    y += h + 14; ctx.globalAlpha = 1;
  });
  ctx.fillStyle = '#fff'; rr(ctx, 14, TH - 74, TW - 92, 56, 28); ctx.fill();
  ctx.fillStyle = '#8696A0'; ctx.font = police(18); ctx.fillText('Message', 40, TH - 45);
  ctx.beginPath(); ctx.arc(TW - 44, TH - 46, 28, 0, 7); ctx.fillStyle = '#00A884'; ctx.fill();
}

// ---------- ce que montre chaque écran, étape par étape ----------
// Étape 0 : les écrans font défiler nos derniers sites, l'un après l'autre, en glissant (visible dès l'ouverture).
const SITES0 = ['padel', 'cuisine', 'ecole', 'salle'];
const D0 = 6, GLISSE = 0.7;
let montre = -1, depuis = 0, site0 = -1, choix0 = 0;
function etapeDe(etapeLissee, temps) {
  const k = Math.max(0, Math.min(3, Math.round(etapeLissee)));
  if (k !== montre) {
    montre = k; depuis = temps; site0 = -1;
    if (k) jouer([[], ['maquette-decorateur-ordinateur', 'maquette-decorateur-telephone'], ['maquette-traiteur', 'maquette-plombier'], []][k]);
  }
  return k;
}
// quel site est à l'écran à l'étape 0, et où en est le glissement
function siteDe(temps) {
  const t = temps - depuis + choix0 * D0;
  const i = Math.floor(t / D0) % SITES0.length, f = t % D0;
  if (i !== site0) {
    site0 = i;
    const prec = SITES0[(i + SITES0.length - 1) % SITES0.length], cur = SITES0[i];
    jouer([`maquette-${cur}-ordinateur`, `maquette-${cur}-telephone`, `maquette-${prec}-ordinateur`, `maquette-${prec}-telephone`]);
    filmDe(`maquette-${cur}-ordinateur`).v.currentTime = 0; filmDe(`maquette-${cur}-telephone`).v.currentTime = 0;
    dispatchEvent(new CustomEvent('site-ecran', { detail: { i, duree: D0 } }));
  }
  return { cur: SITES0[i], prec: SITES0[(i + SITES0.length - 1) % SITES0.length], g: lisse(f / GLISSE), premier: temps - depuis < D0 && !choix0 };
}
addEventListener('site-choisi', (e) => { choix0 = e.detail; montre = -1; });
function defile(ctx, w, h, temps, format) {
  const { cur, prec, g, premier } = siteDe(temps);
  if (g < 1 && !premier) {
    dessinerFilm(ctx, `maquette-${prec}-${format}`, -w * g, 0, w, h, temps);
    dessinerFilm(ctx, `maquette-${cur}-${format}`, w * (1 - g), 0, w, h, temps);
  } else dessinerFilm(ctx, `maquette-${cur}-${format}`, 0, 0, w, h, temps);
}
function fondu(ctx, w, h, temps) {
  const f = 1 - lisse((temps - depuis) / 0.4);
  if (f > 0) { ctx.fillStyle = `rgba(11,23,38,${f})`; ctx.fillRect(0, 0, w, h); }
}
function ecranOrdi(ctx, { temps, etapeLissee }) {
  const k = etapeDe(etapeLissee, temps), t = temps - depuis;
  if (k === 0) defile(ctx, OW, OH, temps, 'ordinateur');
  else if (k === 1) dessinerFilm(ctx, 'maquette-decorateur-ordinateur', 0, 0, OW, OH, temps);
  else if (k === 2) planning(ctx, t % 12);
  else devis(ctx, t % 11);
  fondu(ctx, OW, OH, temps);
  return true;
}
function ecranTel(ctx, { temps, etapeLissee }) {
  const k = etapeDe(etapeLissee, temps), t = temps - depuis;
  if (k === 0) defile(ctx, TW, TH, temps, 'telephone');
  else if (k === 1) dessinerFilm(ctx, 'maquette-decorateur-telephone', 0, 0, TW, TH, temps);
  else if (k === 2) reel(ctx, t % 18, temps);
  else whatsapp(ctx, t % 11);
  fondu(ctx, TW, TH, temps);
  return true;
}

// ---------- plans de caméra (une étape = un plan) ----------
const plans = {
  ordinateur: [
    { pos: [1.3, 1.38, 2.78], cible: [0.1, 0.76, -0.04] },
    { pos: [0.5, 1.02, 1.55], cible: [0.27, 0.8, -0.06] },
    { pos: [1.12, 1.0, 1.3], cible: [0.32, 0.84, -0.05] },
    { pos: [-0.12, 1.02, 1.5], cible: [0.27, 0.8, -0.06] },
  ],
  telephone: [   // téléphone : le bureau entier en haut, la carte en dessous, rien ne le cache
    { pos: [1.25, 2.1, 5.1], cible: [0.03, -0.42, -0.1] },
    { pos: [0.45, 1.55, 3.9], cible: [0.2, 0.22, -0.05] },
    { pos: [0.78, 1.45, 3.45], cible: [0.3, 0.28, 0.0] },
    { pos: [-0.1, 1.55, 3.9], cible: [0.2, 0.22, -0.05] },
  ],
};

window.__plans = plans;
let M = null;
try {
  M = await lancer({
    canvas: toile, base: '../moteur/', glb: 'scene.glb',
    plans, decalage: { ordinateur: 0.24, telephone: 0 }, focale: 34,
    intro: [
      { nom: 'o_bureau', debut: 0.0, hauteur: 0.5, tour: 0.3 },
      { nom: 'o_ecran', debut: 0.35 }, { nom: 'o_telephone', debut: 0.5 }, { nom: 'o_clavier', debut: 0.6 },
      { nom: 'o_lampe', debut: 0.72 }, { nom: 'o_plante', debut: 0.84 }, { nom: 'o_carnets', debut: 0.94 }, { nom: 'o_crayons', debut: 1.02 },
    ],
    ecrans: {
      ecran_moniteur: { largeur: OW, hauteur: OH, dessiner: ecranOrdi },
      ecran_telephone: { largeur: TW, hauteur: TH, dessiner: ecranTel },
    },
    lumieres: ({ THREE, objets }) => {
      const l = new THREE.PointLight(0x9fe6ff, 0.5, 1.6); l.position.set(0, 0.9, 0.05); objets.o_ecran?.add(l);
      return [l];
    },
    positionSoleil: [1.8, 4.2, 3.2], forceSoleil: 2.0, ambiance: 0.9, exposition: 1.05, ombre: 0.32, zoneOmbre: 2.2,
  });
  // les écrans sont des images qui s'allument : pas d'ombre, pas d'éclairage (texture retournée à l'export)
  for (const nom of ['ecran_moniteur', 'ecran_telephone']) {
    const e = M.scene.getObjectByName(nom);
    if (!e) continue;
    e.material.map.center.set(0.5, 0.5); e.material.map.repeat.set(1, -1);
    e.material.emissiveMap = e.material.map; e.material.emissive.set(0xffffff); e.material.emissiveIntensity = 0.94;
    e.material.color.set(0x000000); e.material.toneMapped = false;   // couleurs exactes du contenu, sans délavé
    e.material.needsUpdate = true; e.castShadow = false;
  }
  window.__M = M;
  document.documentElement.classList.add('trois-pret');
} catch (err) {
  console.warn('3D indisponible', err);
  document.documentElement.classList.add('sans-3d');
}

// le défilement pilote la caméra : étape continue entre les centres des étapes
const etapes = [...document.querySelectorAll('.etape3d[data-etape]')];
function suivre() {
  const y = scrollY + innerHeight / 2; let p = 0;
  for (let i = 0; i < etapes.length; i++) {
    const r = etapes[i].getBoundingClientRect(), c = r.top + scrollY + r.height / 2;
    if (y >= c) p = i;
    const s = etapes[i + 1];
    if (s && y >= c) { const r2 = s.getBoundingClientRect(), c2 = r2.top + scrollY + r2.height / 2; if (y < c2) p = i + (y - c) / (c2 - c); }
  }
  M?.allerA(p);
  etapes.forEach((e, i) => e.classList.toggle('active', Math.round(p) === i));
}
addEventListener('scroll', suivre, { passive: true });
addEventListener('resize', suivre);
suivre();
