// Haut de page 3D d'Adopte ton IA (brouillon du 17/11/2026) : le bureau de Dev, rendu en direct.
// L'écran du bureau montre la tâche de chaque étape (mêmes exemples de démonstration que le reste de la page),
// Dev flotte à côté sur son anneau cyan. Le défilement pilote la caméra (moteur commun des maquettes).
import { lancer } from '../moteur/moteur3d.js';

const $ = (s) => document.querySelector(s);
const toile = $('#scene3d');
const W = 1280, H = 740;

// ---------- l'écran : la même application que dans les démonstrations de la page ----------
const C = { fond: '#0f2236', barre: '#0b1a2a', cote: '#12273C', carte: '#1C3A57', filet: '#2A4C6C', texte: '#EEF3F7', doux: '#A9BCCB', cyan: '#34D8FF', creme: '#EADFCC' };
const NAV = ['Accueil', 'Ventes', 'Contacts', 'Relances', 'Travaux', 'Mon IA', '', 'Agenda', 'Devis', 'Factures', 'Stock', 'Réglages'];
const ACTIF = ['Factures', 'Contacts', 'Travaux', 'Travaux', 'Agenda'];
const CHATS = [
  ['Dev, fais la facture de M. Martin pour la pose du carrelage et envoie-la-lui.', 'OK, je m\'en occupe.', 'C\'est fait : facture n° 2026-114 envoyée à M. Martin.'],
  ['Dev, trouve-moi des plombiers à Lyon qui n\'ont pas de site.', 'OK, je cherche.', 'Voilà 5 prospects et le premier message. À toi de valider, j\'en envoie 10 par jour.'],
  ['Dev, regarde la photo que je t\'ai envoyée sur WhatsApp et réponds au client.', 'OK, je la regarde.', 'C\'est fait : j\'ai lu le bon de commande, enregistré le chantier dans ton logiciel et préparé la réponse au client.'],
  [],
  ['Prépare-moi la semaine sur mes réseaux.', 'OK, je m\'en occupe.', 'Semaine programmée : 7 publications, une par jour.'],
];
const police = (t, g = 400) => `${g} ${t}px Figtree, system-ui, sans-serif`;
const titre = (t) => `700 ${t}px Parkinsans, Figtree, sans-serif`;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const lisse = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function lignes(ctx, texte, x, y, larg, haut) {
  const mots = texte.split(' '); let l = '', n = 0;
  for (const m of mots) {
    const t = l ? l + ' ' + m : m;
    if (ctx.measureText(t).width > larg && l) { ctx.fillText(l, x, y + n * haut); n++; l = m; } else l = t;
  }
  if (l) { ctx.fillText(l, x, y + n * haut); n++; }
  return n;
}
function hauteurLignes(ctx, texte, larg) {
  const mots = texte.split(' '); let l = '', n = 0;
  for (const m of mots) { const t = l ? l + ' ' + m : m; if (ctx.measureText(t).width > larg && l) { n++; l = m; } else l = t; }
  return n + (l ? 1 : 0);
}

function cadre(ctx, k) {
  ctx.fillStyle = C.fond; ctx.fillRect(0, 0, W, H);
  // barre de titre
  ctx.fillStyle = C.barre; ctx.fillRect(0, 0, W, 44);
  ctx.fillStyle = C.cyan; ctx.beginPath(); ctx.arc(26, 22, 8, 0, 7); ctx.fill();
  ctx.fillStyle = C.texte; ctx.font = police(17, 600); ctx.textBaseline = 'middle'; ctx.fillText('Adopte ton IA', 44, 23);
  // menu de gauche
  ctx.fillStyle = C.cote; ctx.fillRect(0, 44, 190, H - 44);
  let y = 78;
  for (const n of NAV) {
    if (!n) { ctx.fillStyle = C.doux; ctx.font = police(11, 600); ctx.fillText('MES SECTIONS', 22, y + 4); y += 30; continue; }
    if (n === ACTIF[k]) { ctx.fillStyle = 'rgba(52,216,255,.14)'; rr(ctx, 10, y - 15, 170, 30, 8); ctx.fill(); ctx.fillStyle = C.cyan; } else ctx.fillStyle = C.doux;
    ctx.font = police(15, n === ACTIF[k] ? 600 : 400); ctx.fillText(n, 24, y); y += 36;
  }
}

function chat(ctx, k, t) {
  const x = W - 380, larg = 380;
  ctx.fillStyle = '#0d1e30'; ctx.fillRect(x, 44, larg, H - 44);
  ctx.strokeStyle = C.filet; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, 44); ctx.lineTo(x, H); ctx.stroke();
  const msgs = CHATS[k]; let y = 70;
  const quand = [0.3, 1.3, 6.2];
  ctx.font = police(15);
  msgs.forEach((m, i) => {
    const a = lisse((t - quand[i]) / 0.45); if (a <= 0) return;
    const moi = i === 0, lb = 290;
    const n = hauteurLignes(ctx, m, lb - 28);
    const h = n * 21 + (moi ? 22 : 44);
    const bx = moi ? x + larg - lb - 18 : x + 18;
    ctx.globalAlpha = a;
    ctx.fillStyle = moi ? C.cyan : C.carte; rr(ctx, bx, y + (1 - a) * 12, lb, h, 14); ctx.fill();
    ctx.fillStyle = moi ? '#06202e' : C.texte; ctx.textBaseline = 'top';
    let ty = y + 11 + (1 - a) * 12;
    if (!moi) { ctx.font = police(13, 700); ctx.fillStyle = C.cyan; ctx.fillText('Dev', bx + 14, ty); ty += 22; ctx.fillStyle = C.texte; }
    ctx.font = police(15); lignes(ctx, m, bx + 14, ty, lb - 28, 21);
    ctx.globalAlpha = 1; y += h + 14;
  });
  // champ de saisie
  ctx.fillStyle = C.cote; rr(ctx, x + 16, H - 62, larg - 32, 44, 12); ctx.fill();
  ctx.fillStyle = C.doux; ctx.font = police(14); ctx.textBaseline = 'middle'; ctx.fillText('Écris-moi quelque chose…', x + 32, H - 40);
}

// zone centrale : x de 190 à W-380
const X0 = 214, LC = W - 380 - 214 - 24;
const avance = (t, d, f) => clamp01((t - d) / (f - d));

function facture(ctx, t) {
  ctx.fillStyle = C.texte; ctx.font = titre(22); ctx.textBaseline = 'top'; ctx.fillText('Facture', X0, 64);
  const px = X0, py = 104, pw = LC, ph = H - 128;
  ctx.fillStyle = '#fbfaf7'; rr(ctx, px, py, pw, ph, 10); ctx.fill();
  ctx.fillStyle = '#12273C'; ctx.font = titre(18); ctx.fillText('DUPONT CARRELAGE', px + 26, py + 24);
  const ec = (txt, x, y, d, f, fnt, coul = '#12273C') => { const a = avance(t, d, f); if (!a) return; ctx.font = fnt; ctx.fillStyle = coul; ctx.fillText(txt.slice(0, Math.ceil(txt.length * a)), x, y); };
  ec('FACTURE n° 2026-114', px + pw - 230, py + 26, 1.7, 2.3, police(15, 700));
  ec('M. Martin', px + pw - 230, py + 70, 2.3, 2.6, police(14));
  ec('Transports Martin', px + pw - 230, py + 90, 2.6, 2.9, police(14));
  ec('8 rue des Lilas, 69007 Lyon', px + pw - 230, py + 110, 2.9, 3.3, police(14));
  ctx.fillStyle = '#5b6b7a'; ctx.font = police(13); ctx.fillText('Dupont Carrelage', px + 26, py + 70); ctx.fillText('14 avenue Victor-Hugo', px + 26, py + 90); ctx.fillText('69003 Lyon', px + 26, py + 110);
  const ty = py + 160, cols = [px + 26, px + pw - 290, px + pw - 200, px + pw - 100];
  ctx.fillStyle = '#e9eef2'; ctx.fillRect(px + 16, ty - 8, pw - 32, 30);
  ctx.fillStyle = '#12273C'; ctx.font = police(13, 700);
  ['Description', 'Qté', 'Prix unit.', 'Montant'].forEach((h, i) => ctx.fillText(h, cols[i], ty));
  const L = [['Dépose de l\'ancien carrelage', '25 m²', '12,00 €', '300,00 €'], ['Pose de carrelage grès cérame', '25 m²', '32,00 €', '800,00 €'], ['Joints et plinthes', '1', '150,00 €', '150,00 €']];
  L.forEach((r, j) => r.forEach((c, i) => ec(c, cols[i], ty + 42 + j * 34, 3.4 + j * 0.7, 3.9 + j * 0.7, police(14))));
  ec('Total HT   1 250,00 €', px + pw - 250, ty + 170, 5.6, 6.0, police(16, 700));
  const s = lisse((t - 6.2) / 0.35);
  if (s > 0) {
    ctx.save(); ctx.translate(px + 120, ty + 200); ctx.rotate(-0.12); ctx.scale(1.6 - 0.6 * s, 1.6 - 0.6 * s); ctx.globalAlpha = s;
    ctx.strokeStyle = '#1f9d63'; ctx.lineWidth = 3; rr(ctx, -80, -22, 160, 44, 6); ctx.stroke();
    ctx.fillStyle = '#1f9d63'; ctx.font = police(18, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ENVOYÉE ✓', 0, 1);
    ctx.restore(); ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  }
}

function prospects(ctx, t) {
  ctx.fillStyle = C.texte; ctx.font = titre(22); ctx.textBaseline = 'top'; ctx.fillText('Prospects', X0, 64);
  const P = [['Plomberie Garnier', 'Croix-Rousse', '4,8'], ['Gomes Sanitaire', 'Gerland', '4,9'], ['Rinaldi Plomberie', 'Vaise', '4,5'], ['Eau Services Lyon', 'Monplaisir', '4,7'], ['Perrin Chauffage', 'Part-Dieu', '4,6']];
  const ty = 112, cols = [X0 + 18, X0 + 250, X0 + 420, X0 + 520];
  ctx.fillStyle = C.carte; rr(ctx, X0, ty - 12, LC, 40, 8); ctx.fill();
  ctx.fillStyle = C.doux; ctx.font = police(13, 700);
  ['Entreprise', 'Quartier', 'Note', 'Site'].forEach((h, i) => ctx.fillText(h, cols[i], ty));
  P.forEach((r, j) => {
    const a = lisse((t - 1.6 - j * 0.55) / 0.4); if (!a) return;
    const y = ty + 46 + j * 50;
    ctx.globalAlpha = a; ctx.fillStyle = 'rgba(28,58,87,.55)'; rr(ctx, X0, y - 14 + (1 - a) * 10, LC, 42, 8); ctx.fill();
    ctx.fillStyle = C.texte; ctx.font = police(15, 600); ctx.fillText(r[0], cols[0], y);
    ctx.font = police(15); ctx.fillStyle = C.doux; ctx.fillText(r[1], cols[1], y); ctx.fillText('★ ' + r[2], cols[2], y);
    ctx.fillStyle = '#f4b860'; ctx.fillText('Aucun', cols[3], y); ctx.globalAlpha = 1;
  });
  const a = lisse((t - 5) / 0.5);
  if (a) {
    const y = ty + 46 + 5 * 50 + 6; ctx.globalAlpha = a;
    ctx.fillStyle = C.carte; rr(ctx, X0, y, LC, 120, 12); ctx.fill();
    ctx.fillStyle = C.cyan; ctx.font = police(14, 700); ctx.fillText('Premier message, à Plomberie Garnier', X0 + 18, y + 16);
    const m = 'Bonjour, je crée des sites simples pour les artisans de Lyon. Je peux vous montrer en 10 minutes ce que ça donnerait pour vous ?';
    ctx.fillStyle = C.texte; ctx.font = police(14);
    lignes(ctx, m.slice(0, Math.ceil(m.length * avance(t, 5.3, 7.5))), X0 + 18, y + 44, LC - 36, 20); ctx.globalAlpha = 1;
  }
}

function paperasse(ctx, t) {
  ctx.fillStyle = C.texte; ctx.font = titre(22); ctx.textBaseline = 'top'; ctx.fillText('Nouvelle demande', X0, 64);
  // la photo du bon de commande, à gauche
  const a = lisse((t - 1.4) / 0.5);
  ctx.globalAlpha = a; ctx.save(); ctx.translate(X0 + 90, 300); ctx.rotate(-0.06);
  ctx.fillStyle = '#efe7d6'; ctx.fillRect(-80, -150, 160, 220);
  ctx.fillStyle = '#7b6a55'; ctx.font = police(11, 700); ctx.fillText('BON DE COMMANDE', -66, -134);
  ctx.fillStyle = '#b9ab95'; for (let i = 0; i < 9; i++) ctx.fillRect(-66, -108 + i * 18, 60 + (i * 37) % 70, 5);
  ctx.restore(); ctx.globalAlpha = 1;
  const F = [['Client', 'Boulangerie Lefèvre'], ['Date', '03/11/2026'], ['Objet', 'Carrelage du fournil, 18 m²'], ['Montant', '1 296 € TTC'], ['Demande', 'Pose avant le 20/11']];
  const fx = X0 + 210, fw = LC - 210;
  F.forEach(([lab, val], j) => {
    const y = 112 + j * 74;
    ctx.fillStyle = C.doux; ctx.font = police(13, 600); ctx.fillText(lab, fx, y);
    ctx.fillStyle = C.carte; rr(ctx, fx, y + 22, fw, 40, 8); ctx.fill();
    const p = avance(t, 2.2 + j * 0.8, 2.9 + j * 0.8);
    ctx.fillStyle = C.texte; ctx.font = police(15); ctx.fillText(val.slice(0, Math.ceil(val.length * p)), fx + 14, y + 33);
    if (p > 0 && p < 1) { const w = ctx.measureText(val.slice(0, Math.ceil(val.length * p))).width; ctx.fillStyle = C.cyan; ctx.fillRect(fx + 16 + w, y + 31, 2, 20); }
  });
}

function cao(ctx, t) {
  ctx.fillStyle = C.texte; ctx.font = titre(22); ctx.textBaseline = 'top'; ctx.fillText('Logiciel de CAO', X0, 64);
  const vx = X0, vy = 104, vw = LC, vh = H - 128;
  ctx.fillStyle = '#18222e'; rr(ctx, vx, vy, vw, vh, 10); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(vx, vy, vw, vh); ctx.clip();
  ctx.strokeStyle = 'rgba(169,188,203,.12)'; ctx.lineWidth = 1;
  for (let i = vx; i < vx + vw; i += 28) { ctx.beginPath(); ctx.moveTo(i, vy); ctx.lineTo(i, vy + vh); ctx.stroke(); }
  for (let j = vy; j < vy + vh; j += 28) { ctx.beginPath(); ctx.moveTo(vx, j); ctx.lineTo(vx + vw, j); ctx.stroke(); }
  // support en L (80 x 60 x 8 mm), vue isométrique qui tourne doucement
  const cx = vx + vw / 2, cy = vy + vh / 2 + 30, k = 3.0;
  const ang = 0.6 + Math.max(0, t - 6) * 0.35;
  const P = (x, y, z) => { const c = Math.cos(ang), s = Math.sin(ang); const X = x * c - z * s, Z = x * s + z * c; return [cx + X * k, cy - y * k + Z * k * 0.45]; };
  const prof = 40 * avance(t, 2.4, 3.6);   // l'extrusion
  const prof2 = Math.max(prof, 0.01);
  const L = [[0, 0], [80, 0], [80, 8], [8, 8], [8, 60], [0, 60]];
  const avant = L.map(([x, y]) => P(x - 40, y - 30, -prof2 / 2)), arriere = L.map(([x, y]) => P(x - 40, y - 30, prof2 / 2));
  const trace = avance(t, 1.0, 2.4);
  ctx.strokeStyle = C.cyan; ctx.lineWidth = 2.2; ctx.lineJoin = 'round';
  if (prof > 0.5) {
    ctx.fillStyle = 'rgba(52,216,255,.10)'; ctx.beginPath(); arriere.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.stroke();
    avant.forEach((p, i) => { ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...arriere[i]); ctx.stroke(); });
  }
  ctx.fillStyle = 'rgba(52,216,255,.18)'; ctx.beginPath();
  const nb = Math.max(1, Math.ceil(avant.length * trace));
  avant.slice(0, nb).forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p));
  if (trace >= 1) { ctx.closePath(); ctx.fill(); }
  ctx.stroke();
  // deux trous débouchants de 10 mm dans l'aile horizontale
  const tr = avance(t, 3.9, 4.6);
  if (tr > 0 && prof > 0.5) for (const hx of [-12, 22]) {
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2; const p = P(hx + Math.cos(a) * 5 * tr, -30 + 8, Math.sin(a) * 5 * tr); i ? ctx.lineTo(...p) : ctx.moveTo(...p); }
    ctx.stroke();
  }
  // cotes
  const co = lisse((t - 4.8) / 0.6);
  if (co) {
    ctx.globalAlpha = co; ctx.fillStyle = C.creme; ctx.font = police(14, 700);
    const a1 = P(0, -30 - 9, -prof2 / 2), a2 = P(-40 - 9, 0, -prof2 / 2);
    ctx.fillText('80', a1[0] - 8, a1[1] + 6); ctx.fillText('60', a2[0] - 30, a2[1]);
    ctx.fillText('Ø 10', P(22, -22, 0)[0] + 12, P(22, -22, 0)[1] - 26);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function reseaux(ctx, t) {
  ctx.fillStyle = C.texte; ctx.font = titre(22); ctx.textBaseline = 'top'; ctx.fillText('Ma semaine sur les réseaux', X0, 64);
  const J = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const T = [['Réel', '#34D8FF'], ['Carrousel', '#EADFCC'], ['Image', '#C5B5A0'], ['Réel', '#34D8FF'], ['Carrousel', '#EADFCC'], ['Image', '#C5B5A0'], ['Réel', '#34D8FF']];
  const gap = 10, cw = (LC - gap * 6) / 7, y0 = 112;
  J.forEach((j, i) => {
    const x = X0 + i * (cw + gap);
    ctx.fillStyle = C.doux; ctx.font = police(14, 700); ctx.fillText(j, x + 8, y0);
    ctx.fillStyle = 'rgba(28,58,87,.5)'; rr(ctx, x, y0 + 28, cw, H - y0 - 60, 10); ctx.fill();
    const a = lisse((t - 1.8 - i * 0.45) / 0.4);
    if (!a) return;
    ctx.globalAlpha = a; const py = y0 + 40 + (1 - a) * 20;
    ctx.fillStyle = T[i][1]; rr(ctx, x + 8, py, cw - 16, (cw - 16) * 1.5, 8); ctx.fill();
    ctx.fillStyle = '#0d1d2d'; ctx.font = police(12, 700); ctx.fillText(T[i][0], x + 16, py + 10);
    // petites pastilles : les réseaux où la publication part
    for (let r = 0; r < 3; r++) { ctx.fillStyle = ['#e1306c', '#1877f2', '#ff0050'][r]; ctx.beginPath(); ctx.arc(x + 18 + r * 18, py + (cw - 16) * 1.5 + 22, 6, 0, 7); ctx.fill(); }
    ctx.fillStyle = C.doux; ctx.font = police(12); ctx.fillText('18 h', x + 10, py + (cw - 16) * 1.5 + 40);
    ctx.globalAlpha = 1;
  });
}

const SCENES = [facture, prospects, paperasse, cao, reseaux];
let montre = -1, depuis = 0;
function dessinerEcran(ctx, { temps, etapeLissee }) {
  const k = Math.max(0, Math.min(4, Math.round(etapeLissee)));
  if (k !== montre) { montre = k; depuis = temps; }
  const t = (temps - depuis) % 11;   // chaque démonstration se rejoue toutes les 11 s
  cadre(ctx, k);
  SCENES[k](ctx, t);
  chat(ctx, k, t);
  // fondu au changement d'étape
  const f = 1 - lisse((temps - depuis) / 0.35);
  if (f > 0) { ctx.fillStyle = `rgba(15,34,54,${f})`; ctx.fillRect(190, 44, W - 190, H - 44); }
  return true;
}

// ---------- Dev sur son anneau ----------
// Retour de Youness (17/11) : Dev ne traverse plus le bureau. Il lévite au-dessus du plateau, son anneau sous les pieds,
// et passe lentement d'un côté à l'autre devant l'écran ; à chaque arrêt il présente l'écran de la main qui est du côté de l'écran.
const POSES = ['montre-droite', 'montre-gauche', 'vol-droite', 'vol-gauche'];
let dev = null, M = null;
const CYCLE = 18, ARRET = 6, TRAJET = 3;   // secondes : arrêt à gauche, trajet, arrêt à droite, trajet

function construire({ THREE, scene, racine }) {
  const b = new THREE.Box3().setFromObject(racine.getObjectByName('o_ecran'));
  const plateau = b.min.y;   // le socle de l'écran repose sur le plateau
  const charge = new THREE.TextureLoader();
  const tex = {};
  for (const p of POSES) { const t = charge.load(`images/dev-${p}.webp`); t.colorSpace = THREE.SRGBColorSpace; tex[p] = t; }
  const groupe = new THREE.Group();
  const cx = (b.min.x + b.max.x) / 2, demi = (b.max.x - b.min.x) / 2;
  const z = b.max.z + 0.2;   // devant l'écran, au-dessus du clavier
  groupe.position.set(cx - demi - 0.1, plateau + LEVITE, z);
  scene.add(groupe);
  const plans = [0, 1].map(() => {
    const m = new THREE.MeshBasicMaterial({ map: tex['montre-droite'], transparent: true, depthWrite: false, opacity: 1 });
    const p = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m); p.renderOrder = 5; groupe.add(p); return p;
  });
  // anneau cyan + halo, sous ses pieds : ils suivent Dev partout
  const anneau = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.009, 16, 80), new THREE.MeshBasicMaterial({ color: 0x34d8ff }));
  anneau.rotation.x = Math.PI / 2; anneau.renderOrder = 6; groupe.add(anneau);
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); const d = g.createRadialGradient(64, 64, 10, 64, 64, 64);
  d.addColorStop(0, 'rgba(52,216,255,.55)'); d.addColorStop(0.55, 'rgba(52,216,255,.18)'); d.addColorStop(1, 'rgba(52,216,255,0)');
  g.fillStyle = d; g.fillRect(0, 0, 128, 128);
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.rotation.x = -Math.PI / 2; halo.renderOrder = 4; groupe.add(halo);
  dev = { groupe, plans, anneau, halo, tex, pose: 'montre-droite', fondu: 1, plateau, gauche: cx - demi - 0.1, droite: cx + demi + 0.1 };
  window.__dev = dev;
}
const LEVITE = 0.07;   // hauteur de l'anneau au-dessus du plateau

// où est Dev dans son cycle : position (0 = à gauche de l'écran, 1 = à droite) et pose
function cycle(temps) {
  const t = ((temps - 2.2) % CYCLE + CYCLE) % CYCLE;
  if (temps < 2.2 || t < ARRET) return { u: 0, pose: 'montre-droite' };
  if (t < ARRET + TRAJET) return { u: lisse((t - ARRET) / TRAJET), pose: 'vol-droite' };
  if (t < 2 * ARRET + TRAJET) return { u: 1, pose: 'montre-gauche' };
  return { u: 1 - lisse((t - 2 * ARRET - TRAJET) / TRAJET), pose: 'vol-gauche' };
}

function animerDev({ temps }) {
  if (!dev || !M) return;
  const { u, pose } = cycle(temps);
  const [a, b] = dev.plans;
  if (pose !== dev.pose) { a.material.map = b.material.map; a.material.opacity = 1; b.material.map = dev.tex[pose]; b.material.needsUpdate = true; a.material.needsUpdate = true; dev.pose = pose; dev.fondu = 0; }
  dev.fondu = Math.min(1, dev.fondu + 0.045);
  a.material.opacity = 1 - dev.fondu; b.material.opacity = dev.fondu;
  const img = b.material.map.image;
  const ratio = img && img.width ? img.width / img.height : 1;
  const h = 0.3;
  // flottement lent : tout le groupe (Dev + anneau) monte et descend ensemble, toujours au-dessus du plateau
  const flotte = Math.sin(temps * 1.4) * 0.012;
  const g = dev.groupe.position;
  g.x = dev.gauche + (dev.droite - dev.gauche) * u;
  g.y = dev.plateau + LEVITE + flotte;
  const penche = pose.startsWith('vol') ? Math.sin(Math.PI * u) * 0.025 : 0;   // il monte un peu pendant le trajet
  for (const p of dev.plans) { p.scale.set(h * ratio, h, 1); p.position.y = 0.025 + penche + h / 2; }
  // toujours face à la caméra (rotation autour de la verticale seulement)
  const cam = M.camera.position;
  const ry = Math.atan2(cam.x - g.x, cam.z - g.z);
  for (const p of dev.plans) p.rotation.y = ry;
  dev.groupe.scale.setScalar(Math.max(0.001, lisse((temps - 1.0) / 0.7)));   // Dev arrive après les meubles
  const pul = 1 + Math.sin(temps * 2.4) * 0.05;
  dev.anneau.scale.setScalar(pul); dev.anneau.position.y = 0;
  dev.halo.position.y = -0.002; dev.halo.scale.setScalar(pul);
}

// ---------- plans de caméra (une étape = un plan) ----------
const plans = {
  ordinateur: [
    { pos: [1.55, 1.75, 3.25], cible: [-0.05, 0.92, -0.12] },
    { pos: [0.8, 1.32, 1.85], cible: [0.0, 1.0, -0.18] },
    { pos: [-0.6, 1.35, 2.05], cible: [0.08, 1.0, -0.15] },
    { pos: [0.75, 1.15, 1.2], cible: [-0.02, 1.02, -0.18] },
    { pos: [0.4, 1.42, 2.1], cible: [0.06, 1.0, -0.15] },
  ],
  telephone: [   // reculés le 17/11 (retour de Youness) : l'écran entier, Dev et le bureau restent visibles au-dessus des cartes
    { pos: [1.334, 1.605, 4.429], cible: [-0.04, 0.14, -0.15] },
    { pos: [1.141, 1.834, 3.919], cible: [-0.08, 0.41, -0.15] },
    { pos: [-1.467, 1.764, 3.718], cible: [0.08, 0.41, -0.15] },
    { pos: [0.819, 1.612, 4.143], cible: [-0.04, 0.41, -0.15] },
    { pos: [-0.393, 2.141, 4.177], cible: [0.04, 0.41, -0.15] },
  ],
};

try {
  M = await lancer({
    canvas: toile, base: '../moteur/', glb: 'scene.glb',
    plans, decalage: { ordinateur: 0.25, telephone: 0 }, focale: 34,
    intro: [
      { nom: 'o_bureau', debut: 0.0, hauteur: 0.5, tour: 0.3 },
      { nom: 'o_ecran', debut: 0.35 }, { nom: 'o_clavier', debut: 0.5 }, { nom: 'o_lampe', debut: 0.62 },
      { nom: 'o_plante', debut: 0.74 }, { nom: 'o_carnets', debut: 0.86 }, { nom: 'o_crayons', debut: 0.96 },
    ],
    ecrans: { ecran_moniteur: { largeur: W, hauteur: H, dessiner: dessinerEcran } },
    construire,
    lumieres: ({ THREE, objets }) => {
      // l'écran éclaire un peu le bureau
      const l = new THREE.PointLight(0x7fdcff, 0.6, 1.6); l.position.set(0, 1.0, 0.05); objets.o_ecran?.add(l);
      return [l];
    },
    chaqueImage: animerDev,
    positionSoleil: [1.8, 4.2, 3.2], forceSoleil: 2.0, ambiance: 0.9, exposition: 1.05, ombre: 0.35, zoneOmbre: 2.2,
  });
  // l'écran est une image qui s'allume : pas d'ombre, pas d'éclairage
  const e = M.scene.getObjectByName('ecran_moniteur');
  if (e) { e.material.map.center.set(0.5, 0.5); e.material.map.repeat.set(1, -1); e.material.emissiveMap = e.material.map; e.material.emissive.set(0xffffff); e.material.emissiveIntensity = 0.85; e.material.needsUpdate = true; e.castShadow = false; }
  window.__M = M;
  document.documentElement.classList.add('trois-pret');
} catch (err) {
  console.warn('3D indisponible', err);
  document.documentElement.classList.add('sans-3d');
  window.lancerDemoHaut?.();
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
