// Terrain de padel bâti en code (architecture géométrique) — maquette « salle de padel », 17/11/2026.
// Unités : mètres réels × ECH (terrain réglementaire 20 × 10 m ramené à 4 × 2).
// Objets racines « o_* » : chacun entre à son tour (moteur3d.js, liste intro de la page).
export const ECH = 0.2;

function toile(l, h, dessin) {
  const c = document.createElement('canvas'); c.width = l; c.height = h;
  dessin(c.getContext('2d'), l, h); return c;
}

export async function construire({ THREE, racine, loader }) {
  const tex = (c, rep = [1, 1], srgb = true) => {
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); t.anisotropy = 8; return t;
  };
  const groupe = (nom) => { const g = new THREE.Group(); g.name = nom; racine.add(g); return g; };
  const m = (x) => x * ECH;

  // ---------- gazon bleu à grain, lignes peintes dans la texture ----------
  const gazonC = toile(2048, 1024, (g, L, H) => {
    g.fillStyle = '#1b5fd0'; g.fillRect(0, 0, L, H);
    for (let i = 0; i < 90000; i++) {              // fibres
      const v = Math.random(); g.fillStyle = v < 0.5 ? `rgba(9,40,120,${0.25 * Math.random()})` : `rgba(90,150,255,${0.22 * Math.random()})`;
      g.fillRect(Math.random() * L, Math.random() * H, 1.5, 2.5);
    }
    g.fillStyle = '#f2f5ef';
    const px = L / 20, ep = 0.05 * px;
    const ligne = (x0, y0, x1, y1) => g.fillRect(x0 * px - ep / 2, y0 * px - ep / 2, (x1 - x0) * px + ep, (y1 - y0) * px + ep);
    ligne(0, 0, 20, 0); ligne(0, 10, 20, 10); ligne(0, 0, 0, 10); ligne(20, 0, 20, 10);
    ligne(3.05, 0, 3.05, 10); ligne(16.95, 0, 16.95, 10); ligne(3.05, 5, 16.95, 5);
  });
  const reliefC = toile(512, 512, (g, L, H) => { g.fillStyle = '#808080'; g.fillRect(0, 0, L, H);
    for (let i = 0; i < 40000; i++) { const v = 90 + Math.random() * 120 | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(Math.random() * L, Math.random() * H, 1, 2); } });
  const gazon = groupe('o_gazon');
  const dalle = new THREE.Mesh(new THREE.BoxGeometry(m(21.2), m(0.12), m(11.2)), new THREE.MeshStandardMaterial({ color: 0x9aa3a8, roughness: 0.9 }));
  dalle.position.y = m(0.06) - m(0.12); gazon.add(dalle);
  const tapis = new THREE.Mesh(new THREE.PlaneGeometry(m(20), m(10)), new THREE.MeshStandardMaterial({ map: tex(gazonC), bumpMap: tex(reliefC, [12, 6], false), bumpScale: 1.2, roughness: 0.85 }));
  tapis.rotation.x = -Math.PI / 2; tapis.position.y = 0.001; tapis.receiveShadow = true; gazon.add(tapis);

  // ---------- matériaux ----------
  const metal = new THREE.MeshStandardMaterial({ color: 0x0d1720, roughness: 0.38, metalness: 0.85 });
  const verre = new THREE.MeshPhysicalMaterial({ color: 0xd8f3f0, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.22, envMapIntensity: 1.6, side: THREE.DoubleSide, depthWrite: false, clearcoat: 1 });
  const grilleC = toile(256, 256, (g, L, H) => { g.strokeStyle = '#fff'; g.lineWidth = 9; g.beginPath();
    g.moveTo(0, H / 2); g.lineTo(L / 2, 0); g.lineTo(L, H / 2); g.lineTo(L / 2, H); g.closePath(); g.stroke(); });
  const grille = (l, h) => new THREE.MeshStandardMaterial({ color: 0x111a22, alphaMap: tex(grilleC, [l / 0.06, h / 0.06], false), alphaTest: 0.4, transparent: false, side: THREE.DoubleSide, roughness: 0.4, metalness: 0.7 });

  const panneau = (parent, mat, l, h, x, y, z, rotY = 0) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(m(l), m(h)), mat); p.position.set(m(x), m(y), m(z)); p.rotation.y = rotY; p.castShadow = mat !== verre; parent.add(p); return p;
  };
  const poteau = (parent, x, z, h) => { const b = new THREE.Mesh(new THREE.BoxGeometry(m(0.08), m(h), m(0.08)), metal); b.position.set(m(x), m(h / 2), m(z)); b.castShadow = true; parent.add(b); };
  const lisse = (parent, x0, z0, x1, z1, y) => { const l = Math.hypot(x1 - x0, z1 - z0); const b = new THREE.Mesh(new THREE.BoxGeometry(m(l), m(0.06), m(0.06)), metal);
    b.position.set(m((x0 + x1) / 2), m(y), m((z0 + z1) / 2)); b.rotation.y = -Math.atan2(z1 - z0, x1 - x0); parent.add(b); };

  // ---------- fonds : vitres 3 m + grillage 1 m ----------
  for (const [nom, sx] of [['o_fond_est', 1], ['o_fond_ouest', -1]]) {
    const g = groupe(nom);
    panneau(g, verre, 10, 3, 10 * sx, 1.5, 0, Math.PI / 2);
    panneau(g, grille(10, 1), 10, 1, 10 * sx, 3.5, 0, Math.PI / 2);
    for (const sz of [1, -1]) { panneau(g, verre, 2, 3, (10 - 1) * sx, 1.5, 5 * sz); panneau(g, verre, 2, 1, (10 - 1) * sx, 3.5, 5 * sz); }   // retours vitrés
    for (let z = -5; z <= 5.01; z += 2.5) poteau(g, 10 * sx, z, 4);
    poteau(g, 8 * sx, 5, 4); poteau(g, 8 * sx, -5, 4);
    lisse(g, 10 * sx, -5, 10 * sx, 5, 4); lisse(g, 10 * sx, 5, 8 * sx, 5, 4); lisse(g, 10 * sx, -5, 8 * sx, -5, 4);
  }
  // ---------- côtés : grillage 3 m entre les retours vitrés ----------
  for (const [nom, sz] of [['o_cote_nord', 1], ['o_cote_sud', -1]]) {
    const g = groupe(nom);
    panneau(g, grille(16, 3), 16, 3, 0, 1.5, 5 * sz);
    for (let x = -6; x <= 6.01; x += 2) poteau(g, x, 5 * sz, 3);
    lisse(g, -8, 5 * sz, 8, 5 * sz, 3);
  }

  // ---------- filet ----------
  const filet = groupe('o_filet');
  const filetC = toile(128, 128, (g, L, H) => { g.strokeStyle = '#fff'; g.lineWidth = 10; g.strokeRect(0, 0, L, H); });
  const toileFilet = new THREE.Mesh(new THREE.PlaneGeometry(m(10), m(0.88)), new THREE.MeshStandardMaterial({ color: 0x15202a, alphaMap: tex(filetC, [10 / 0.045, 0.88 / 0.045], false), alphaTest: 0.35, side: THREE.DoubleSide }));
  toileFilet.rotation.y = Math.PI / 2; toileFilet.position.y = m(0.47); filet.add(toileFilet);
  const ruban = new THREE.Mesh(new THREE.BoxGeometry(m(0.05), m(0.06), m(10)), new THREE.MeshStandardMaterial({ color: 0xf4f6f0, roughness: 0.6 })); ruban.position.y = m(0.9); filet.add(ruban);
  for (const sz of [1, -1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(m(0.05), m(0.05), m(1.0), 16), metal); p.position.set(0, m(0.5), m(5.05) * sz); p.castShadow = true; filet.add(p); }

  // ---------- projecteurs : mâts sur les côtés longs ----------
  const projos = groupe('o_projecteurs');
  const tetes = [];
  const verreLed = new THREE.MeshStandardMaterial({ color: 0x222c33, emissive: 0xe8f6ff, emissiveIntensity: 0, roughness: 0.2 });
  for (const x of [-6, 6]) for (const sz of [1, -1]) {
    const mat = new THREE.Mesh(new THREE.BoxGeometry(m(0.1), m(6), m(0.1)), metal); mat.position.set(m(x), m(3), m(5.6) * sz); mat.castShadow = true; projos.add(mat);
    const tete = new THREE.Group(); tete.position.set(m(x), m(6), m(5.45) * sz); tete.rotation.x = 0.55 * sz;
    const boitier = new THREE.Mesh(new THREE.BoxGeometry(m(1.1), m(0.18), m(0.5)), metal); tete.add(boitier);
    const led = new THREE.Mesh(new THREE.PlaneGeometry(m(1.0), m(0.42)), verreLed); led.rotation.x = Math.PI / 2; led.position.y = -m(0.095); tete.add(led);
    projos.add(tete); tetes.push(tete);
  }

  // ---------- raquettes (forme de padel, plan perforé, cadre noir) ----------
  const raquette = (couleur) => {
    const g = new THREE.Group();
    const f = new THREE.Shape();
    const R = 0.13, Lg = 0.30;                         // tête ronde ~26 cm, cœur, puis manche
    f.absarc(0, Lg - R, R, 0, Math.PI, false);
    f.bezierCurveTo(-R, Lg * 0.32, -0.05, 0.06, -0.025, 0.0);
    f.lineTo(0.025, 0.0);
    f.bezierCurveTo(0.05, 0.06, R, Lg * 0.32, R, Lg - R);
    for (let i = -3; i <= 3; i++) for (let j = 0; j < 7; j++) {
      const x = i * 0.03 + (j % 2 ? 0.015 : 0), y = 0.1 + j * 0.026;
      if (Math.hypot(x, y - (Lg - R)) < R - 0.03 && (y > 0.12 || Math.abs(x) < 0.04)) { const t = new THREE.Path(); t.absarc(x, y, 0.0075, 0, Math.PI * 2, true); f.holes.push(t); }
    }
    const geo = new THREE.ExtrudeGeometry(f, { depth: 0.032, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.005, bevelSegments: 3, curveSegments: 40 });
    geo.translate(0, 0, -0.016);
    const face = new THREE.Mesh(geo, [new THREE.MeshPhysicalMaterial({ color: couleur, roughness: 0.35, clearcoat: 0.8 }), new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.5 })]);
    face.castShadow = true; g.add(face);
    const manche = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.016, 0.14, 20), new THREE.MeshStandardMaterial({ color: 0x15181c, roughness: 0.85 }));
    manche.position.y = -0.065; manche.castShadow = true; g.add(manche);
    const dragonne = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.003, 8, 24), new THREE.MeshStandardMaterial({ color: couleur, roughness: 0.6 }));
    dragonne.position.y = -0.14; g.add(dragonne);
    g.scale.setScalar(ECH * 1.0);
    return g;
  };

  // ---------- balle en feutre avec sa couture ----------
  const feutreC = toile(512, 256, (g, L, H) => {
    g.fillStyle = '#d4ec2a'; g.fillRect(0, 0, L, H);
    for (let i = 0; i < 26000; i++) { g.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,210,.18)' : 'rgba(120,140,0,.18)'; g.fillRect(Math.random() * L, Math.random() * H, 1, 1); }
    g.strokeStyle = 'rgba(250,250,240,.95)'; g.lineWidth = 7; g.beginPath();
    for (let x = 0; x <= L; x += 2) { const y = H / 2 + Math.sin((x / L) * Math.PI * 4) * H * 0.26; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  });
  const matBalle = new THREE.MeshStandardMaterial({ map: tex(feutreC), roughness: 0.95 });
  const balle = () => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.034 * ECH * 2.2, 32, 20), matBalle); b.castShadow = true; return b; };

  // ---------- coin d'attente : banc (Poly Haven, CC0), raquettes, balles ----------
  const coin = groupe('o_coin');
  coin.position.set(m(-4.2), 0, m(7.2));
  try {
    const banc = (await loader.loadAsync('modeles/painted_wooden_bench/painted_wooden_bench.gltf')).scene;
    banc.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
    const b = new THREE.Box3().setFromObject(banc); const s = (1.6 * ECH) / Math.max(b.max.x - b.min.x, b.max.z - b.min.z);
    banc.scale.setScalar(s); coin.add(banc);
  } catch (e) { console.warn('banc', e); }
  const r1 = raquette(0xffd400); r1.position.set(m(-0.25), m(0.46), 0); r1.rotation.set(-Math.PI / 2, 0, 0.35); coin.add(r1);
  const r2 = raquette(0x1f5fd1); r2.position.set(m(0.95), m(0.36), m(0.32)); r2.rotation.set(-0.35, 0.4, -0.25); coin.add(r2);
  const bA = balle(); bA.position.set(m(0.35), m(0.45) + 0.0151, m(0.05)); coin.add(bA);
  const bB = balle(); bB.position.set(m(0.6), 0.0151, m(0.75)); coin.add(bB);
  r2.position.y = m(0.15);

  // ---------- la balle qui joue (animée par la page) ----------
  const jeu = groupe('o_jeu'); const bj = balle(); jeu.add(bj);

  return { tetes, verreLed, balleJeu: bj, sol: dalle };
}

// trajectoire d'un échange : la balle traverse, rebondit une fois de chaque côté
export function trajectoire(t) {
  const d = 2.6, k = (t % d) / d;                          // un aller-retour toutes les 2,6 s
  const aller = k < 0.5, u = aller ? k * 2 : (k - 0.5) * 2;
  const x0 = aller ? -7.5 : 7.5, x1 = -x0;
  const x = x0 + (x1 - x0) * u;
  const z = (aller ? -2 : 2) + (aller ? 4 : -4) * u;
  const rebondU = 0.72;                                       // rebond aux trois quarts
  const y = u < rebondU ? 0.05 + Math.sin((u / rebondU) * Math.PI) * 1.9 + (1 - u / rebondU) * 1.0 : Math.sin(((u - rebondU) / (1 - rebondU)) * Math.PI) * 0.9 + 0.05;
  return [x * ECH, Math.max(0.05, y) * ECH, z * ECH];
}
