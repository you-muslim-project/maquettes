// Cuisine équipée bâtie en code (meubles = géométrie simple et précise) + vrais objets Poly Haven (CC0) — modèle « cuisiniste », 17/11/2026.
// Unités : mètres réels × ECH. Pièce : mur du fond en z = -1,6 m, mur gauche en x = -2,4 m.
// Objets racines « o_* » : chacun entre à son tour (liste intro de la page).
export const ECH = 0.5;

function toile(l, h, dessin) {
  const c = document.createElement('canvas'); c.width = l; c.height = h;
  dessin(c.getContext('2d'), l, h); return c;
}
const alea = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

// textures de plan de travail (générées une fois)
export function texturePlan(p) {
  const r = alea(p.id.length * 977 + 13);
  return toile(1024, 512, (g, L, H) => {
    g.fillStyle = p.fond; g.fillRect(0, 0, L, H);
    if (p.type === 'granite') {
      const clair = p.id === 'granit-noir';
      for (let i = 0; i < 70000; i++) {
        const v = r();
        g.fillStyle = clair ? (v < 0.7 ? `rgba(120,120,125,${0.5 * r()})` : `rgba(230,225,215,${0.55 * r()})`) : (v < 0.5 ? `rgba(40,40,42,${0.6 * r()})` : `rgba(235,232,226,${0.6 * r()})`);
        const s = 1 + r() * 3; g.fillRect(r() * L, r() * H, s, s);
      }
    } else {
      for (let i = 0; i < 14000; i++) { g.fillStyle = `rgba(200,195,186,${0.25 * r()})`; g.fillRect(r() * L, r() * H, 2, 2); }
      g.lineCap = 'round';
      for (let k = 0; k < 7; k++) {                       // veines grises
        g.strokeStyle = `rgba(140,136,128,${0.25 + 0.35 * r()})`; g.lineWidth = 1 + r() * 3;
        g.beginPath(); let x = r() * L, y = 0; g.moveTo(x, y);
        while (y < H) { x += (r() - 0.45) * 60; y += 20 + r() * 30; g.lineTo(x, y); } g.stroke();
      }
    }
  });
}
function textureChene() {
  const r = alea(4242);
  return toile(512, 1024, (g, L, H) => {
    g.fillStyle = '#b88c5e'; g.fillRect(0, 0, L, H);
    for (let i = 0; i < 260; i++) {
      g.strokeStyle = r() < 0.5 ? `rgba(110,72,38,${0.08 + 0.18 * r()})` : `rgba(230,195,150,${0.1 + 0.15 * r()})`;
      g.lineWidth = 1 + r() * 4; g.beginPath(); let x = r() * L; g.moveTo(x, 0);
      for (let y = 0; y <= H; y += 32) { x += (r() - 0.5) * 5; g.lineTo(x, y); } g.stroke();
    }
  });
}

export async function construire({ THREE, racine, loader }) {
  const m = (x) => x * ECH;
  const tex = (c, rep = [1, 1], srgb = true) => {
    const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); t.anisotropy = 8; return t;
  };
  const groupe = (nom) => { const g = new THREE.Group(); g.name = nom; racine.add(g); return g; };
  const boite = (parent, mat, x0, x1, y0, y1, z0, z1) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(m(x1 - x0), m(y1 - y0), m(z1 - z0)), mat);
    b.position.set(m((x0 + x1) / 2), m((y0 + y1) / 2), m((z0 + z1) / 2)); b.castShadow = true; b.receiveShadow = true; parent.add(b); return b;
  };

  // ---------- matériaux partagés (le configurateur les modifie) ----------
  const facade = new THREE.MeshPhysicalMaterial({ color: 0xecEAE4, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.5 });
  const chene = tex(textureChene());
  const plan = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.15 });
  const caisse = new THREE.MeshStandardMaterial({ color: 0xd9d6cf, roughness: 0.8 });
  const ombreJoint = new THREE.MeshStandardMaterial({ color: 0x17181a, roughness: 0.9 });
  const inox = new THREE.MeshStandardMaterial({ color: 0xb9bcbf, roughness: 0.28, metalness: 0.9 });
  const verreNoir = new THREE.MeshPhysicalMaterial({ color: 0x0c0d0f, roughness: 0.08, clearcoat: 1, metalness: 0.2 });
  const laiton = new THREE.MeshStandardMaterial({ color: 0xb08d57, roughness: 0.3, metalness: 1 });

  // ---------- sol : grands carreaux de grès clair ----------
  const sol = groupe('o_sol');
  const solC = toile(1024, 1024, (g, L, H) => {
    g.fillStyle = '#d8d3ca'; g.fillRect(0, 0, L, H); const r = alea(7);
    for (let i = 0; i < 30000; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '160,150,138' : '245,242,236'},${0.25 * r()})`; g.fillRect(r() * L, r() * H, 2, 2); }
    g.strokeStyle = 'rgba(120,112,100,.55)'; g.lineWidth = 3;
    for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * L / 4, 0); g.lineTo(k * L / 4, H); g.stroke(); g.beginPath(); g.moveTo(0, k * H / 4); g.lineTo(L, k * H / 4); g.stroke(); }
  });
  const dalle = new THREE.Mesh(new THREE.BoxGeometry(m(5.2), m(0.06), m(4.0)), new THREE.MeshStandardMaterial({ map: tex(solC, [5.2 / 2.4, 4 / 2.4]), roughness: 0.55 }));
  dalle.position.set(m(0.2), -m(0.03), m(0.4)); dalle.receiveShadow = true; sol.add(dalle);

  // ---------- murs : enduit chaud, ouverts côté caméra ----------
  const murs = groupe('o_murs');
  const enduit = new THREE.MeshStandardMaterial({ color: 0xefe9df, roughness: 0.95 });
  boite(murs, enduit, -2.5, 2.8, 0, 2.7, -1.72, -1.6);
  boite(murs, enduit, -2.52, -2.4, 0, 2.7, -1.72, 1.4);

  // crédence en zellige vert (touche locale)
  const zelC = toile(1024, 256, (g, L, H) => {
    const r = alea(99), c = 32; g.fillStyle = '#e9e4da'; g.fillRect(0, 0, L, H);
    for (let x = 0; x < L; x += c) for (let y = 0; y < H; y += c) {
      const v = r(); g.fillStyle = `hsl(${150 + v * 14},${30 + v * 18}%,${30 + r() * 14}%)`; g.fillRect(x + 1.5, y + 1.5, c - 3, c - 3);
      g.fillStyle = `rgba(255,255,255,${0.12 * r()})`; g.fillRect(x + 3, y + 3, (c - 6) * r(), 3);
    }
  });
  const zellige = new THREE.MeshPhysicalMaterial({ map: tex(zelC, [3.6 / 2.4, 1]), roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 });

  // ---------- meubles bas du fond : 6 modules de 60 cm (x de -2,4 à 1,2) ----------
  const bas = groupe('o_bas');
  boite(bas, ombreJoint, -2.4, 1.2, 0, 0.1, -1.55, -1.06);                // socle en retrait
  boite(bas, caisse, -2.4, 1.2, 0.1, 0.82, -1.6, -1.02);                 // caissons
  const portesBas = [];
  const fronts = (x0, x1, y0, y1) => { const f = boite(bas, facade, x0 + 0.002, x1 - 0.002, y0 + 0.002, y1 - 0.002, -1.02, -1.0); portesBas.push(f); return f; };
  fronts(-2.4, -1.8, 0.1, 0.78); fronts(-1.8, -1.2, 0.1, 0.78); fronts(-1.2, -0.6, 0.1, 0.78);
  // tiroirs (le premier sort à l'étape « rangements »)
  const tiroir = new THREE.Group(); bas.add(tiroir);
  const tf = boite(tiroir, facade, -0.598, -0.002, 0.58, 0.778, -1.02, -1.0);
  boite(tiroir, caisse, -0.57, -0.03, 0.6, 0.74, -1.5, -1.03);
  const couverts = boite(tiroir, inox, -0.5, -0.1, 0.6, 0.62, -1.4, -1.1); couverts.castShadow = false;
  fronts(-0.6, 0, 0.1, 0.34); fronts(-0.6, 0, 0.34, 0.58);
  fronts(0, 0.6, 0.1, 0.44); fronts(0, 0.6, 0.44, 0.78); fronts(0.6, 1.2, 0.1, 0.78);

  // ---------- colonnes : four encastré + réfrigérateur (x de 1,2 à 2,4) ----------
  const colonnes = groupe('o_colonnes');
  boite(colonnes, ombreJoint, 1.2, 2.4, 0, 0.1, -1.55, -1.06);
  boite(colonnes, caisse, 1.2, 2.4, 0.1, 2.2, -1.6, -1.02);
  const fc = (x0, x1, y0, y1) => boite(colonnes, facade, x0 + 0.002, x1 - 0.002, y0 + 0.002, y1 - 0.002, -1.02, -1.0);
  fc(1.2, 1.8, 0.1, 0.84); fc(1.2, 1.8, 1.46, 2.2); fc(1.8, 2.4, 0.1, 2.2);
  boite(colonnes, laiton, 1.83, 1.845, 0.9, 1.5, -1.0, -0.98);            // poignée verticale du réfrigérateur

  // ---------- plan de travail du fond + crédence ----------
  const planFond = groupe('o_plan');
  boite(planFond, plan, -2.4, 1.2, 0.82, 0.86, -1.6, -0.98);
  const cred = new THREE.Mesh(new THREE.PlaneGeometry(m(3.6), m(0.59)), zellige); cred.position.set(m(-0.6), m(1.155), m(-1.599)); cred.receiveShadow = true; planFond.add(cred);
  // évier sous plan + mitigeur laiton
  boite(planFond, new THREE.MeshStandardMaterial({ color: 0x2a2b2d, roughness: 0.5 }), -1.1, -0.7, 0.835, 0.862, -1.48, -1.12);
  const pied = new THREE.Mesh(new THREE.CylinderGeometry(m(0.018), m(0.022), m(0.3), 20), laiton); pied.position.set(m(-0.9), m(1.01), m(-1.52)); planFond.add(pied);
  const col = new THREE.Mesh(new THREE.TorusGeometry(m(0.09), m(0.014), 12, 40, Math.PI), laiton); col.position.set(m(-0.9), m(1.16), m(-1.43)); col.rotation.y = Math.PI / 2; planFond.add(col);

  // ---------- meubles hauts (portes qui s'ouvrent) + hotte ----------
  const hauts = groupe('o_hauts');
  const portesHautes = [];
  for (const [x0, x1] of [[-2.4, -1.8], [-1.8, -1.2], [-1.2, -0.6], [-0.6, 0], [0.6, 1.2]]) {
    // caisson creux : fond, côtés, dessus, dessous, étagère
    boite(hauts, caisse, x0, x1, 1.45, 2.15, -1.6, -1.58);
    boite(hauts, caisse, x0, x0 + 0.018, 1.45, 2.15, -1.6, -1.27); boite(hauts, caisse, x1 - 0.018, x1, 1.45, 2.15, -1.6, -1.27);
    boite(hauts, caisse, x0, x1, 2.13, 2.15, -1.6, -1.27); boite(hauts, caisse, x0, x1, 1.45, 1.47, -1.6, -1.27);
    boite(hauts, caisse, x0 + 0.018, x1 - 0.018, 1.79, 1.805, -1.58, -1.29);
    // vaisselle : piles d'assiettes et bocaux
    for (let k = 0; k < 2; k++) {
      const pile = new THREE.Mesh(new THREE.CylinderGeometry(m(0.11), m(0.1), m(0.07 + 0.03 * k), 32), new THREE.MeshStandardMaterial({ color: 0xf7f5f0, roughness: 0.3 }));
      pile.position.set(m(x0 + 0.17 + k * 0.26), m(1.47 + (0.035 + 0.015 * k)), m(-1.44)); hauts.add(pile);
      const bocal = new THREE.Mesh(new THREE.CylinderGeometry(m(0.045), m(0.045), m(0.16), 24), new THREE.MeshPhysicalMaterial({ color: 0xe8efe9, roughness: 0.05, transmission: 0.6, thickness: 0.01 }));
      bocal.position.set(m(x0 + 0.18 + k * 0.24), m(1.805 + 0.08), m(-1.45)); hauts.add(bocal);
    }
    // porte sur charnière (pivot au bord gauche)
    const pivot = new THREE.Group(); pivot.position.set(m(x0 + 0.002), m(1.8), m(-1.26)); hauts.add(pivot);
    const p = new THREE.Mesh(new THREE.BoxGeometry(m(0.596), m(0.696), m(0.02)), facade); p.position.set(m(0.298), 0, 0); p.castShadow = true; pivot.add(p);
    portesHautes.push(pivot);
  }
  boite(hauts, inox, 0.02, 0.58, 1.62, 1.72, -1.6, -1.12);                 // hotte
  boite(hauts, inox, 0.17, 0.43, 1.72, 2.15, -1.6, -1.42);
  // ruban LED sous les meubles hauts
  const led = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd9a0, emissiveIntensity: 0 });
  const ruban = boite(hauts, led, -2.38, 1.18, 1.442, 1.45, -1.33, -1.3); ruban.castShadow = false;

  // ---------- îlot avec retours « cascade » ----------
  const ilot = groupe('o_ilot');
  boite(ilot, ombreJoint, -0.95, 0.95, 0, 0.1, 0.25, 0.95);
  boite(ilot, caisse, -1.0, 1.0, 0.1, 0.82, 0.2, 1.0);
  for (const [x0, x1] of [[-1.0, -0.33], [-0.33, 0.33], [0.33, 1.0]]) boite(ilot, facade, x0 + 0.002, x1 - 0.002, 0.102, 0.778, 0.18, 0.2);
  boite(ilot, plan, -1.12, 1.12, 0.82, 0.88, 0.16, 1.34);                  // plateau qui déborde côté tabourets
  boite(ilot, plan, -1.12, -1.06, 0, 0.82, 0.16, 1.34); boite(ilot, plan, 1.06, 1.12, 0, 0.82, 0.16, 1.34);

  // ---------- électroménager ----------
  const electro = groupe('o_electro');
  const four = boite(electro, verreNoir, 1.23, 1.77, 0.86, 1.44, -1.0, -0.975);
  const vitreC = toile(256, 256, (g, L, H) => { g.fillStyle = '#000'; g.fillRect(0, 0, L, H); const gr = g.createRadialGradient(L / 2, H * 0.6, 10, L / 2, H * 0.6, L * 0.6); gr.addColorStop(0, '#ffb35a'); gr.addColorStop(1, '#2a0d00'); g.fillStyle = gr; g.fillRect(L * 0.12, H * 0.3, L * 0.76, H * 0.58); });
  const fourMat = new THREE.MeshPhysicalMaterial({ color: 0x0c0d0f, roughness: 0.08, clearcoat: 1, emissive: 0xffffff, emissiveMap: tex(vitreC), emissiveIntensity: 0 });
  four.material = fourMat;
  boite(electro, inox, 1.25, 1.75, 1.36, 1.38, -0.975, -0.94);             // poignée du four
  const plaqueC = toile(512, 512, (g, L, H) => { g.fillStyle = '#000'; g.fillRect(0, 0, L, H); g.strokeStyle = '#fff'; g.lineWidth = 6;
    for (const [x, y, r] of [[0.3, 0.32, 0.17], [0.72, 0.3, 0.13], [0.3, 0.74, 0.13], [0.72, 0.72, 0.17]]) { g.beginPath(); g.arc(x * L, y * H, r * L, 0, Math.PI * 2); g.stroke(); } });
  const plaque = new THREE.Mesh(new THREE.PlaneGeometry(m(0.56), m(0.5)), new THREE.MeshPhysicalMaterial({ color: 0x0a0a0b, roughness: 0.06, clearcoat: 1, emissive: 0xff3a10, emissiveMap: tex(plaqueC), emissiveIntensity: 0 }));
  plaque.rotation.x = -Math.PI / 2; plaque.position.set(m(0.3), m(0.8625), m(-1.3)); electro.add(plaque);

  // ---------- objets réels Poly Haven (CC0) ----------
  const deco = groupe('o_deco');
  const charger = async (id, cible, mesure = 'y') => {
    try {
      const s = (await loader.loadAsync(`modeles/${id}/${id}.gltf`)).scene;
      s.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
      const b = new THREE.Box3().setFromObject(s); const t = b.getSize(new THREE.Vector3());
      const k = m(cible) / (mesure === 'y' ? t.y : Math.max(t.x, t.z)); s.scale.setScalar(k);
      const c = b.getCenter(new THREE.Vector3()); s.position.set(-c.x * k, -b.min.y * k, -c.z * k);
      const g = new THREE.Group(); g.add(s); return g;
    } catch (e) { console.warn(id, e); return new THREE.Group(); }
  };
  const [t1, t2, l1, l2, planche, the, casserole] = await Promise.all([
    charger('bar_chair_round_01', 0.78), charger('bar_chair_round_01', 0.78),
    charger('modern_ceiling_lamp_01', 0.9), charger('modern_ceiling_lamp_01', 0.9),
    charger('wooden_cutting_board', 0.45, 'xz'), charger('tea_set_01', 0.26, 'xz'), charger('pot_enamel_01', 0.26, 'xz'),
  ]);
  t1.position.set(m(-0.45), 0, m(1.6)); t2.position.set(m(0.45), 0, m(1.6)); t1.rotation.y = 0.25; t2.rotation.y = -0.2; deco.add(t1, t2);
  l1.position.set(m(-0.5), m(1.62), m(0.75)); l2.position.set(m(0.5), m(1.62), m(0.75)); deco.add(l1, l2);
  planche.position.set(m(0.35), m(0.88), m(0.7)); planche.rotation.y = 0.35; deco.add(planche);
  the.position.set(m(-0.45), m(0.88), m(0.65)); the.rotation.y = -0.6; deco.add(the);
  casserole.position.set(m(0.42), m(0.8625), m(-1.22)); deco.add(casserole);
  const citrons = await Promise.all([0, 1, 2].map(() => charger('lemon', 0.085, 'xz')));
  citrons.forEach((c, i) => { c.position.set(m(0.28 + i * 0.08), m(0.92), m(0.68 + (i % 2) * 0.06)); c.rotation.y = i * 1.7; deco.add(c); });

  return { facade, chene, plan, portesHautes, tiroir, led, fourMat, plaque: plaque.material, suspensions: [l1, l2] };
}
