// Salon marocain sur mesure + plafond et panneaux en bois — modèle « salons et bois », 18/11/2026.
// Meubles bâtis en code (banquette d'angle, tables basses marbre/laiton, plafond à corniche lumineuse) + vrais objets Poly Haven (CC0).
// Unités : mètres réels × ECH. Pièce : mur du fond en z = -1,6 m, mur gauche en x = -2,4 m, plafond à 2,7 m.
// Objets racines « o_* » : chacun entre à son tour (liste intro de la page). Le plafond n'apparaît qu'à l'étape « bois ».
export const ECH = 0.5;
export const HAUT = 2.7;

function toile(l, h, dessin) {
  const c = document.createElement('canvas'); c.width = l; c.height = h;
  dessin(c.getContext('2d'), l, h); return c;
}
const alea = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

// Bois en lattes verticales (plafond, panneaux) : couleur du fond, fil du bois, rainures régulières
export function texturePlan(p) {
  const r = alea(p.id.length * 977 + 31);
  return toile(1024, 1024, (g, L, H) => {
    g.fillStyle = p.fond; g.fillRect(0, 0, L, H);
    const n = p.laque ? 60 : 420;
    for (let i = 0; i < n; i++) {
      const sombre = r() < 0.55;
      g.strokeStyle = p.laque ? `rgba(120,115,105,${0.04 + 0.05 * r()})` : (sombre ? `rgba(60,36,18,${0.06 + 0.16 * r()})` : `rgba(255,236,205,${0.06 + 0.14 * r()})`);
      g.lineWidth = 1 + r() * 3; g.beginPath(); let x = r() * L; g.moveTo(x, 0);
      for (let y = 0; y <= H; y += 32) { x += (r() - 0.5) * 5; g.lineTo(x, y); } g.stroke();
    }
    const pas = 64;                                                   // une latte tous les 64 px
    for (let x = 0; x <= L; x += pas) {
      g.fillStyle = 'rgba(25,16,8,.55)'; g.fillRect(x - 1.5, 0, 3, H);
      g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x + 1.5, 0, 2, H);
    }
  });
}

function textureCanal(couleurTrait = 'rgba(0,0,0,.28)') {                 // capitonnage en canaux verticaux, en niveaux de gris (teinté par la couleur du tissu)
  return toile(256, 256, (g, L, H) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, L, H);
    const w = L / 4;
    for (let k = 0; k < 4; k++) {
      const gr = g.createLinearGradient(k * w, 0, (k + 1) * w, 0);
      gr.addColorStop(0, 'rgba(0,0,0,.30)'); gr.addColorStop(0.5, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(0,0,0,.30)');
      g.fillStyle = gr; g.fillRect(k * w, 0, w, H);
    }
    const r = alea(5);                                              // trame du tissu
    for (let i = 0; i < 5000; i++) { g.fillStyle = `rgba(0,0,0,${0.05 * r()})`; g.fillRect(r() * L, r() * H, 1, 1); }
  });
}
function textureLosange() {                                         // panneau capitonné en losanges (tête de lit)
  return toile(256, 256, (g, L, H) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, L, H);
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 3;
    for (let k = -2; k <= 6; k++) { g.beginPath(); g.moveTo(k * 64, 0); g.lineTo(k * 64 + 256, 256); g.stroke(); g.beginPath(); g.moveTo(k * 64 + 256, 0); g.lineTo(k * 64, 256); g.stroke(); }
    for (let i = -1; i < 5; i++) for (let j = -1; j < 5; j++) { g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.arc(i * 128 + (j % 2 ? 64 : 0), j * 64, 3.5, 0, 7); g.fill(); }
  });
}
function textureMarbre() {
  const r = alea(321);
  return toile(512, 512, (g, L, H) => {
    g.fillStyle = '#f1efea'; g.fillRect(0, 0, L, H);
    g.lineCap = 'round';
    for (let k = 0; k < 9; k++) {
      g.strokeStyle = `rgba(130,126,120,${0.18 + 0.3 * r()})`; g.lineWidth = 1 + r() * 2.5;
      g.beginPath(); let x = r() * L, y = 0; g.moveTo(x, y);
      while (y < H) { x += (r() - 0.45) * 70; y += 18 + r() * 30; g.lineTo(x, y); } g.stroke();
    }
  });
}
function textureTapis() {                                           // tapis géométrique crème, bordure vert canard
  return toile(1024, 640, (g, L, H) => {
    g.fillStyle = '#efe6d3'; g.fillRect(0, 0, L, H);
    g.fillStyle = '#0F6B6E'; g.fillRect(24, 24, L - 48, H - 48);
    g.fillStyle = '#efe6d3'; g.fillRect(56, 56, L - 112, H - 112);
    g.strokeStyle = '#B08D57'; g.lineWidth = 5; g.strokeRect(40, 40, L - 80, H - 80);
    g.strokeStyle = '#0F6B6E'; g.lineWidth = 3;
    const cx = L / 2, cy = H / 2;
    for (let k = 1; k <= 5; k++) { const a = k * 62, b = k * 38; g.beginPath(); g.moveTo(cx, cy - b); g.lineTo(cx + a, cy); g.lineTo(cx, cy + b); g.lineTo(cx - a, cy); g.closePath(); g.stroke(); }
    g.fillStyle = '#B08D57'; g.beginPath(); g.moveTo(cx, cy - 22); g.lineTo(cx + 36, cy); g.lineTo(cx, cy + 22); g.lineTo(cx - 36, cy); g.closePath(); g.fill();
    const r = alea(9); for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(0,0,0,${0.06 * r()})`; g.fillRect(r() * L, r() * H, 2, 2); }
  });
}

export async function construire({ THREE, racine, loader }) {
  const m = (x) => x * ECH;
  const tex = (c, rep = [1, 1], srgb = true) => {
    const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); t.anisotropy = 8; return t;
  };
  const groupe = (nom, parent = racine) => { const g = new THREE.Group(); g.name = nom; parent.add(g); return g; };
  const boite = (parent, mat, x0, x1, y0, y1, z0, z1, ombre = true) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(m(x1 - x0), m(y1 - y0), m(z1 - z0)), mat);
    b.position.set(m((x0 + x1) / 2), m((y0 + y1) / 2), m((z0 + z1) / 2)); b.castShadow = ombre; b.receiveShadow = ombre; parent.add(b); return b;
  };
  // coussin / assise arrondis : extrusion d'un rectangle à angles ronds, UV recalculés de 0 à 1 sur la face
  const coussin = (parent, mat, cx, cy, cz, w, h, d, rayon = 0.06) => {
    const s = new THREE.Shape(); const x = -w / 2, y = -h / 2, r = Math.min(rayon, w / 2 - 0.001, h / 2 - 0.001);
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const b = Math.min(0.03, d / 3);
    const geo = new THREE.ExtrudeGeometry(s, { depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 6 });
    geo.translate(0, 0, -(d - 2 * b) / 2);
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
    geo.scale(ECH, ECH, ECH);
    const mesh = new THREE.Mesh(geo, mat); mesh.position.set(m(cx), m(cy), m(cz)); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };

  // ---------- matériaux partagés (le configurateur les modifie) ----------
  const tissu = new THREE.MeshPhysicalMaterial({ color: 0x0F6B6E, roughness: 0.95, sheen: 0.5, sheenRoughness: 0.8, sheenColor: new THREE.Color(0x555555), map: tex(textureCanal(), [1, 1]) });
  const tissuPlat = tissu.clone(); tissuPlat.map = null;            // assise : tissu lisse (suit la couleur du tissu par l'appli)
  const tissuPanneau = tissu.clone(); tissuPanneau.map = tex(textureLosange(), [3, 2]);
  const plan = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 });                    // bois des panneaux muraux
  const plafond = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, transparent: true, opacity: 0 }); // bois du plafond
  const laiton = new THREE.MeshStandardMaterial({ color: 0xb08d57, roughness: 0.28, metalness: 1 });
  const bois_sombre = new THREE.MeshStandardMaterial({ color: 0x2a1c12, roughness: 0.6 });
  const led = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffd9a0, emissiveIntensity: 0, transparent: true, opacity: 0 });

  // ---------- textures PBR photo (Poly Haven CC0) : relief et rugosité du velours et du chêne ----------
  if (!new URLSearchParams(location.search).has('plat')) {
    const tl = new THREE.TextureLoader();
    const pbr = (nom, rep) => { const t = tl.load(`../moteur-reel/pbr/${nom}.jpg`); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); t.anisotropy = 8; return t; };
    const vN = pbr('velour_velvet-nor_gl', [5, 5]), vR = pbr('velour_velvet-rough', [5, 5]);
    for (const mt of [tissu, tissuPlat, tissuPanneau]) { mt.normalMap = vN; mt.normalScale.set(0.3, 0.3); mt.roughnessMap = vR; mt.roughness = 1; mt.sheen = 0.8; mt.sheenRoughness = 0.5; mt.sheenColor = new THREE.Color(0x88a8a8); }
    const oN = pbr('oak_veneer_01-nor_gl', [1, 3]), oR = pbr('oak_veneer_01-rough', [1, 3]);
    for (const mt of [plan, plafond]) { mt.normalMap = oN; mt.normalScale.set(1.2, 1.2); mt.roughnessMap = oR; mt.roughness = 0.9; }
  }

  // ---------- sol : grand carrelage clair + tapis ----------
  const sol = groupe('o_sol');
  const solC = toile(1024, 1024, (g, L, H) => {
    g.fillStyle = '#e6e2da'; g.fillRect(0, 0, L, H); const r = alea(17);
    for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(150,146,138,${0.12 + 0.2 * r()})`; g.lineWidth = 1 + r() * 2; g.beginPath(); let x = r() * L, y = 0; g.moveTo(x, y); while (y < H) { x += (r() - 0.5) * 80; y += 30 + r() * 40; g.lineTo(x, y); } g.stroke(); }
    g.strokeStyle = 'rgba(120,114,104,.45)'; g.lineWidth = 3;
    for (let k = 0; k <= 2; k++) { g.beginPath(); g.moveTo(k * L / 2, 0); g.lineTo(k * L / 2, H); g.stroke(); g.beginPath(); g.moveTo(0, k * H / 2); g.lineTo(L, k * H / 2); g.stroke(); }
  });
  const dalle = new THREE.Mesh(new THREE.BoxGeometry(m(5.4), m(0.06), m(4.2)), new THREE.MeshPhysicalMaterial({ map: tex(solC, [5.4 / 2, 4.2 / 2]), roughness: 0.25, clearcoat: 0.5, clearcoatRoughness: 0.2 }));
  dalle.position.set(m(0.3), -m(0.03), m(0.5)); dalle.receiveShadow = true; sol.add(dalle);
  const tapis = new THREE.Mesh(new THREE.BoxGeometry(m(3.0), m(0.012), m(2.0)), new THREE.MeshStandardMaterial({ map: tex(textureTapis()), roughness: 1 }));
  tapis.position.set(m(0.45), m(0.006), m(0.15)); tapis.receiveShadow = true; sol.add(tapis);

  // ---------- murs : enduit crème, ouverts côté caméra + panneaux de bois + panneau capitonné ----------
  const murs = groupe('o_murs');
  const enduit = new THREE.MeshStandardMaterial({ color: 0xf2ece0, roughness: 0.95 });
  boite(murs, enduit, -2.5, 2.9, 0, HAUT, -1.72, -1.6);
  boite(murs, enduit, -2.52, -2.4, 0, HAUT, -1.72, 1.6);
  const lames = (x0, x1, y0, y1, z) => {                          // lattes en bois sur le mur du fond
    const p = new THREE.Mesh(new THREE.PlaneGeometry(m(x1 - x0), m(y1 - y0)), plan);
    p.position.set(m((x0 + x1) / 2), m((y0 + y1) / 2), m(z)); p.receiveShadow = true; murs.add(p); return p;
  };
  lames(-2.39, -1.05, 0.02, 2.66, -1.598); lames(1.05, 2.85, 0.02, 2.66, -1.598);
  const lameG = new THREE.Mesh(new THREE.PlaneGeometry(m(2.2), m(2.66)), plan);   // mur de gauche, lattes aussi
  lameG.rotation.y = Math.PI / 2; lameG.position.set(m(-2.398), m(1.35), m(-0.5)); lameG.receiveShadow = true; murs.add(lameG);
  const tete = new THREE.Mesh(new THREE.BoxGeometry(m(2.1), m(2.2), m(0.08)), tissuPanneau);   // panneau capitonné, couleur du tissu
  tete.position.set(m(0), m(1.4), m(-1.56)); tete.castShadow = true; tete.receiveShadow = true; murs.add(tete);
  boite(murs, laiton, -1.07, -1.05, 0.02, 2.66, -1.6, -1.56, false); boite(murs, laiton, 1.05, 1.07, 0.02, 2.66, -1.6, -1.56, false);   // joncs en laiton

  // ---------- banquette d'angle (deux ailes) ----------
  const ban = groupe('o_banquette');
  const aile = (x0, x1, z0, z1, versZ) => {                        // aile le long du mur du fond (versZ=false) ou du mur gauche (true)
    const long = versZ ? z1 - z0 : x1 - x0, larg = versZ ? x1 - x0 : z1 - z0;
    boite(ban, bois_sombre, x0 + 0.04, x1 - 0.04, 0.0, 0.18, z0 + 0.04, z1 - 0.04);                     // socle
    if (!versZ) {
      coussin(ban, tissuPlat, (x0 + x1) / 2, 0.30, (z0 + z1) / 2 + 0.03, long, 0.28, larg - 0.06, 0.05);  // assise
      const nb = Math.round(long / 0.7);
      for (let i = 0; i < nb; i++) coussin(ban, tissu, x0 + (i + 0.5) * long / nb, 0.64, z0 + 0.1, long / nb - 0.02, 0.5, 0.2, 0.08);   // dossier en canaux
    } else {
      coussin(ban, tissuPlat, (x0 + x1) / 2 + 0.03, 0.30, (z0 + z1) / 2, larg - 0.06, 0.28, long, 0.05);
      const nb = Math.round(long / 0.7);
      for (let i = 0; i < nb; i++) { const c = coussin(ban, tissu, x0 + 0.1, 0.64, z0 + (i + 0.5) * long / nb, 0.2, 0.5, long / nb - 0.02, 0.08); }
    }
  };
  aile(-2.38, 1.9, -1.58, -0.86, false);
  aile(-2.38, -1.66, -0.86, 0.95, true);
  // le coin : un dossier plein pour fermer l'angle
  coussin(ban, tissu, -2.28, 0.64, -1.48, 0.2, 0.5, 0.2, 0.08);
  // coussins décoratifs aux couleurs fixes
  const deco1 = (col, x, y, z, ry, w = 0.38, h = 0.38) => { const mt = new THREE.MeshStandardMaterial({ color: col, roughness: 0.9 }); const c = coussin(ban, mt, x, y, z, w, h, 0.12, 0.08); c.rotation.set(-0.18, ry, 0.06); return c; };
  deco1(0xD9B13B, -1.4, 0.62, -1.28, 0.1); deco1(0xe9dfc6, -0.7, 0.62, -1.28, -0.12); deco1(0xB08D57, 0.1, 0.62, -1.28, 0.08); deco1(0xD9B13B, 0.9, 0.62, -1.28, -0.1); deco1(0xe9dfc6, 1.6, 0.62, -1.28, 0.12);
  deco1(0xB08D57, -2.0, 0.62, -0.3, Math.PI / 2 + 0.1); deco1(0xD9B13B, -2.0, 0.62, 0.5, Math.PI / 2 - 0.1);

  // ---------- tables basses : marbre, pied et anneau de laiton ----------
  const tables = groupe('o_tables');
  const marbre = new THREE.MeshPhysicalMaterial({ map: tex(textureMarbre()), roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08 });
  const table = (cx, cz, r, h) => {
    const haut = new THREE.Mesh(new THREE.CylinderGeometry(m(r), m(r), m(0.035), 64), marbre); haut.position.set(m(cx), m(h), m(cz)); haut.castShadow = true; haut.receiveShadow = true; tables.add(haut);
    const bord = new THREE.Mesh(new THREE.TorusGeometry(m(r), m(0.008), 10, 64), laiton); bord.rotation.x = Math.PI / 2; bord.position.set(m(cx), m(h), m(cz)); tables.add(bord);
    const pied = new THREE.Mesh(new THREE.CylinderGeometry(m(r * 0.55), m(r * 0.7), m(h - 0.02), 40), laiton); pied.position.set(m(cx), m((h - 0.02) / 2), m(cz)); pied.castShadow = true; tables.add(pied);
  };
  const PLAT = new URLSearchParams(location.search).has('plat');     // ?plat : ancien rendu, objets dessinés par code (comparaison avant / après)
  if (PLAT) { table(0.2, 0.05, 0.46, 0.42); table(0.95, 0.45, 0.32, 0.34); }

  // ---------- plafond en bois : corniche lumineuse (visible seulement à l'étape « bois ») ----------
  const hautG = groupe('plafond');
  const dalleP = (x0, x1, y0, y1, z0, z1) => { const b = boite(hautG, plafond, x0, x1, y0, y1, z0, z1, false); return b; };
  dalleP(-2.4, 2.9, HAUT - 0.1, HAUT, -1.6, 1.9);                 // grand plateau
  dalleP(-2.4, 2.9, HAUT - 0.1, HAUT - 0.0, -1.6, -1.6);          // (rien : garde l'ordre)
  const cadre = 0.55;                                              // corniche : cadre abaissé
  dalleP(-2.4, 2.9, HAUT - 0.2, HAUT - 0.1, -1.6, -1.6 + cadre); dalleP(-2.4, 2.9, HAUT - 0.2, HAUT - 0.1, 1.9 - cadre, 1.9);
  dalleP(-2.4, -2.4 + cadre, HAUT - 0.2, HAUT - 0.1, -1.6 + cadre, 1.9 - cadre); dalleP(2.9 - cadre, 2.9, HAUT - 0.2, HAUT - 0.1, -1.6 + cadre, 1.9 - cadre);
  const lx0 = -2.4 + cadre, lx1 = 2.9 - cadre, lz0 = -1.6 + cadre, lz1 = 1.9 - cadre;   // rubans LED dans la gorge
  for (const [a, b, c, d] of [[lx0, lx1, lz0 - 0.03, lz0], [lx0, lx1, lz1, lz1 + 0.03], [lx0 - 0.03, lx0, lz0, lz1], [lx1, lx1 + 0.03, lz0, lz1]]) boite(hautG, led, a, b, HAUT - 0.12, HAUT - 0.1, c, d, false);
  hautG.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });

  // ---------- objets réels Poly Haven (CC0) ----------
  const deco = groupe('o_deco');
  const charger = async (id, cible, mesure = 'y') => {
    try {
      const url = id.endsWith('.glb') ? `modeles/${id}` : `modeles/${id}/${id}.gltf`;   // .glb : objets issus d'une photo (image vers 3D)
      const s = (await loader.loadAsync(url)).scene;
      s.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
      const b = new THREE.Box3().setFromObject(s); const t = b.getSize(new THREE.Vector3());
      const k = m(cible) / (mesure === 'y' ? t.y : Math.max(t.x, t.z)); s.scale.setScalar(k);
      const c = b.getCenter(new THREE.Vector3()); s.position.set(-c.x * k, -b.min.y * k, -c.z * k);
      const g = new THREE.Group(); g.add(s); return g;
    } catch (e) { console.warn(id, e); return new THREE.Group(); }
  };
  const [fauteuil, vase, plante, lustre, t1, t2] = await Promise.all([
    charger(PLAT ? 'modern_arm_chair_01' : 'photo3d/fauteuil.glb', PLAT ? 0.85 : 0.82), charger('brass_vase_02', 0.3), charger('potted_plant_02', 1.1), charger('Chandelier_03', 0.75),
    PLAT ? null : charger('photo3d/table.glb', 0.9, 'xz'), PLAT ? null : charger('photo3d/table.glb', 0.62, 'xz'),
  ]);
  fauteuil.position.set(m(1.75), 0, m(1.05)); fauteuil.rotation.y = PLAT ? -2.5 : -0.65; deco.add(fauteuil);
  if (!PLAT) { t1.position.set(m(0.2), 0, m(0.05)); t2.position.set(m(0.95), 0, m(0.45)); t1.rotation.y = 0.4; tables.add(t1); tables.add(t2); }
  vase.position.set(m(0.2), PLAT ? m(0.435) : m(0.575), m(0.05)); deco.add(vase);
  plante.position.set(m(2.45), 0, m(-1.15)); deco.add(plante);

  const lustreG = groupe('lustre');                                 // suspendu au plafond, apparaît avec lui
  lustre.position.set(m(0.3), m(HAUT - 0.75), m(0.3)); lustreG.add(lustre);
  lustreG.userData.base = m(HAUT - 0.75);

  return { facade: tissu, facadePlate: tissuPlat, facadePanneau: tissuPanneau, plan, plafond, led, lustreG, hautG, lustre, suspensions: [lustreG] };
}
