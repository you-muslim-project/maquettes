// Moteur 3D commun aux maquettes par niche (17/11/2026).
// Une scène GLB (composée dans Blender, objets racines nommés « o_* »), rendue EN DIRECT avec Three.js :
// - entrée animée dès l'ouverture (les objets arrivent l'un après l'autre),
// - caméra pilotée par le défilement (une liste de plans, un plan par étape de l'histoire),
// - écrans dessinés en direct (ex. l'ardoise : mesh « ecran_* » qui reçoit une texture canvas),
// - mode film image par image (?film) pour tourner les vidéos d'aperçu sans saccade.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const lisse = (t) => t * t * (3 - 2 * t);
const sortie = (t) => 1 - Math.pow(1 - t, 3);
// 18/11 : vraie chute avec rebonds. Hauteur au-dessus du plateau (1 = départ, 0 = posé), jamais négative :
// l'objet ne descend donc jamais sous la surface (l'ancienne courbe « easeOutBack » dépassait 1 et l'enfonçait dans le bureau).
const chute = (t) => {
  if (t >= 1) return 0;
  if (t < 0.6) return 1 - Math.pow(t / 0.6, 2);
  if (t < 0.82) { const u = (t - 0.6) / 0.22 * 2 - 1; return Math.max(0, 0.12 * (1 - u * u)); }
  const u = (t - 0.82) / 0.18 * 2 - 1; return Math.max(0, 0.03 * (1 - u * u));
};

export async function lancer(o) {
  const canvas = o.canvas;
  const film = new URLSearchParams(location.search).has('film');
  // 18/11 : rendu « photo » (essai, copies seulement). ?plat revient à l'ancien rendu pour comparer avant / après.
  const photo = o.photo && !new URLSearchParams(location.search).has('plat');
  const Q = new URLSearchParams(location.search);
  const P = photo ? { ...o.photo, ...(Q.get('ao') === '0' ? { ao: false } : {}), ...(Q.get('dof') === '0' ? { profondeur: null } : {}) } : {};
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: film });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, film ? 2 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = o.exposition ?? 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = o.ambiance ?? 0.75;
  if (photo && P.hdri) {
    // éclairage réel : un HDRI de studio (Poly Haven, CC0) remplace la pièce de synthèse
    const hdr = await new RGBELoader().loadAsync(P.hdri);
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = pmrem.fromEquirectangular(hdr).texture;
    scene.environmentIntensity = P.ambiance ?? 1.0;
    scene.environmentRotation.y = P.rotation ?? 0;
    hdr.dispose();
  }

  const camera = new THREE.PerspectiveCamera(o.focale ?? 35, 1, 0.05, 60);

  // lumière principale chaude avec ombres + contre-jour froid
  const soleil = new THREE.DirectionalLight(o.couleurSoleil ?? 0xfff1dc, o.forceSoleil ?? 2.2);
  soleil.position.set(...(o.positionSoleil ?? [2.5, 4.5, 3]));
  soleil.castShadow = true;
  soleil.shadow.mapSize.set(photo ? 2048 : 1536, photo ? 2048 : 1536);
  const zo = o.zoneOmbre ?? 3;
  soleil.shadow.camera.left = -zo; soleil.shadow.camera.right = zo;
  soleil.shadow.camera.top = zo; soleil.shadow.camera.bottom = -zo; soleil.shadow.camera.far = zo * 6;
  soleil.shadow.radius = photo ? 9 : 6; soleil.shadow.bias = -0.0004; soleil.shadow.normalBias = 0.02;
  scene.add(soleil);
  if (photo && P.forceSoleil != null) soleil.intensity = P.forceSoleil;
  const contre = new THREE.DirectionalLight(0xcfe0ff, photo ? (P.contre ?? 0.3) : 0.6);
  contre.position.set(-3, 2.5, -3);
  scene.add(contre);

  // sol invisible qui ne garde que l'ombre (le fond de la page reste visible)
  const sol = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: o.ombre ?? 0.22 }));
  sol.rotation.x = -Math.PI / 2; sol.receiveShadow = true;
  scene.add(sol);

  // chargement
  const draco = new DRACOLoader().setDecoderPath(o.base + 'vendor/addons/libs/draco/');
  const loader = new GLTFLoader().setDRACOLoader(draco);
  // GLB facultatif : une scène peut aussi être bâtie en code (crochet « construire »)
  const racine = o.glb ? (await new Promise((ok, ko) => loader.load(o.glb, ok, (e) => o.progression?.(e.total ? e.loaded / e.total : 0), ko))).scene : new THREE.Group();
  scene.add(racine);
  if (o.construire) await o.construire({ THREE, racine, scene, renderer, loader });
  const objets = {};
  racine.traverse((n) => {
    if (n.isMesh) {
      n.castShadow = true; n.receiveShadow = true;
      if (photo) { // textures nettes sous tous les angles, reflets de l'HDRI dosés
        const ms = Array.isArray(n.material) ? n.material : [n.material];
        for (const m of ms) {
          if (!m) continue;
          for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap']) if (m[k]) m[k].anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
          if (m.envMapIntensity != null && P.reflets != null) m.envMapIntensity = P.reflets;
        }
      }
    }
    if (n.name.startsWith('o_')) objets[n.name] = n;
  });

  // écrans dessinés en direct
  const ecrans = {};
  for (const [nom, def] of Object.entries(o.ecrans || {})) {
    const mesh = racine.getObjectByName(nom);
    if (!mesh) continue;
    const c = document.createElement('canvas');
    c.width = def.largeur; c.height = def.hauteur;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    mesh.material = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, metalness: 0 });
    ecrans[nom] = { def, ctx: c.getContext('2d'), tex };
  }

  // lumières propres à la scène (ex. lampe de bureau qui s'allume)
  const extras = o.lumieres ? o.lumieres({ THREE, scene, objets, soleil, contre, sol, renderer }) : [];

  // entrée : chaque objet arrive d'en haut, l'un après l'autre
  const intro = (o.intro || []).map((e, i) => {
    const n = objets[e.nom];
    if (!n) return null;
    return { n, y0: n.position.y, r0: n.rotation.y, s0: n.scale.clone(), debut: e.debut ?? i * 0.12, duree: e.duree ?? 0.9, hauteur: e.hauteur ?? 0.6, tour: e.tour ?? 0.5 };
  }).filter(Boolean);
  const finIntro = Math.max(0, ...intro.map((e) => e.debut + e.duree));

  // plans de caméra
  let format = 'ordinateur';
  const plansDe = () => o.plans[format] || o.plans.ordinateur;
  let etape = 0, etapeLissee = 0;
  const pos = new THREE.Vector3(), cib = new THREE.Vector3();
  const souris = { x: 0, y: 0, lx: 0, ly: 0 };
  addEventListener('pointermove', (e) => { souris.x = e.clientX / innerWidth - 0.5; souris.y = e.clientY / innerHeight - 0.5; }, { passive: true });

  function taille() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    format = w < 760 ? 'telephone' : 'ordinateur';
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const dec = o.decalage?.[format] ?? 0; // décale la scène (texte d'un côté, 3D de l'autre)
    if (dec) camera.setViewOffset(w, h, -w * dec, 0, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  // post-traitement : ombres de contact (GTAO), léger flou de profondeur, ton cinéma
  let composer = null, gtao = null, bokeh = null;
  const mobile = innerWidth < 760;
  if (photo && P.post !== false) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    if (P.ao !== false) {
      gtao = new GTAOPass(scene, camera, canvas.clientWidth || 800, canvas.clientHeight || 600);
      gtao.output = GTAOPass.OUTPUT.Default;
      gtao.updateGtaoMaterial({ radius: P.aoRayon ?? 0.35, distanceExponent: 1.5, thickness: 1.5, scale: P.aoForce ?? 1.4, samples: mobile ? 8 : 16, distanceFallOff: 1, screenSpaceRadius: false });
      gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: mobile ? 4 : 6, rings: 2, samples: mobile ? 8 : 12 });
      gtao.blendIntensity = P.aoMelange ?? 1.0;
      composer.addPass(gtao);
    }
    if (P.profondeur && !mobile) {
      bokeh = new BokehPass(scene, camera, { focus: 3, aperture: P.profondeur.ouverture ?? 0.0006, maxblur: P.profondeur.flou ?? 0.008 });
      composer.addPass(bokeh);
    }
    composer.addPass(new OutputPass());
  }
  addEventListener('resize', taille);
  taille();
  if (composer) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(canvas.clientWidth, canvas.clientHeight); }
  addEventListener('resize', () => { if (composer) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(canvas.clientWidth, canvas.clientHeight); } });

  function plan(p) {
    const L = plansDe();
    const i = Math.min(L.length - 2, Math.max(0, Math.floor(p)));
    const t = lisse(Math.min(1, Math.max(0, p - i)));
    const a = L[i], b = L[Math.min(L.length - 1, i + 1)];
    pos.set(...a.pos).lerp(new THREE.Vector3(...b.pos), t);
    cib.set(...a.cible).lerp(new THREE.Vector3(...b.cible), t);
  }

  let temps = 0, dernier = performance.now(), visible = true;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(canvas);

  function image(dt) {
    temps += dt;
    // entrée
    for (const e of intro) {
      const t = Math.min(1, Math.max(0, (temps - e.debut) / e.duree));
      e.n.visible = temps >= e.debut;
      e.n.position.y = e.y0 + Math.max(0, chute(t)) * e.hauteur;
      e.n.rotation.y = e.r0 + (1 - sortie(t)) * e.tour;
      const s = 0.6 + 0.4 * sortie(t);
      e.n.scale.copy(e.s0).multiplyScalar(s);
    }
    // caméra : étape lissée + léger va-et-vient permanent (la scène vit même sans défiler)
    etapeLissee += (etape - etapeLissee) * Math.min(1, dt * 3.2);
    plan(etapeLissee);
    souris.lx += (souris.x - souris.lx) * Math.min(1, dt * 2.5);
    souris.ly += (souris.y - souris.ly) * Math.min(1, dt * 2.5);
    const arrivee = 1 - sortie(Math.min(1, temps / Math.max(0.01, finIntro + 0.4)));
    const respire = Math.sin(temps * 0.35) * 0.12;
    const off = new THREE.Vector3().subVectors(pos, cib);
    off.applyAxisAngle(new THREE.Vector3(0, 1, 0), respire * 0.5 + souris.lx * 0.25 + arrivee * 0.55);
    off.multiplyScalar(1 + arrivee * 0.35);
    camera.position.copy(cib).add(off);
    camera.position.y += -souris.ly * 0.15 + arrivee * 0.4;
    camera.lookAt(cib);
    for (const [nom, e] of Object.entries(ecrans)) {
      if (e.def.dessiner(e.ctx, { temps, etape, etapeLissee, finIntro, lang: document.documentElement.lang })) e.tex.needsUpdate = true;
    }
    o.chaqueImage?.({ temps, dt, objets, extras, finIntro, etape: etapeLissee, scene, soleil, contre, renderer });
    if (composer) {
      if (bokeh) bokeh.uniforms.focus.value = pos.distanceTo(cib) * 0.0 + camera.position.distanceTo(cib);
      composer.render(dt);
    } else renderer.render(scene, camera);
  }

  function boucle(t) {
    const dt = Math.min(0.05, (t - dernier) / 1000); dernier = t;
    if (visible) image(dt);
    requestAnimationFrame(boucle);
  }
  if (film) {
    window.__film = { avancer: (dt) => image(dt), pret: true, intro };
    image(0);
  } else requestAnimationFrame((t) => { dernier = t; boucle(t); });

  return {
    allerA: (e) => { etape = e; },
    objets, scene, camera, renderer,
  };
}
