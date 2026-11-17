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

const lisse = (t) => t * t * (3 - 2 * t);
const sortie = (t) => 1 - Math.pow(1 - t, 3);
const rebond = (t) => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

export async function lancer(o) {
  const canvas = o.canvas;
  const film = new URLSearchParams(location.search).has('film');
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

  const camera = new THREE.PerspectiveCamera(o.focale ?? 35, 1, 0.05, 60);

  // lumière principale chaude avec ombres + contre-jour froid
  const soleil = new THREE.DirectionalLight(o.couleurSoleil ?? 0xfff1dc, o.forceSoleil ?? 2.2);
  soleil.position.set(...(o.positionSoleil ?? [2.5, 4.5, 3]));
  soleil.castShadow = true;
  soleil.shadow.mapSize.set(1536, 1536);
  soleil.shadow.camera.left = -3; soleil.shadow.camera.right = 3;
  soleil.shadow.camera.top = 3; soleil.shadow.camera.bottom = -3;
  soleil.shadow.radius = 6; soleil.shadow.bias = -0.0004; soleil.shadow.normalBias = 0.02;
  scene.add(soleil);
  const contre = new THREE.DirectionalLight(0xcfe0ff, 0.6);
  contre.position.set(-3, 2.5, -3);
  scene.add(contre);

  // sol invisible qui ne garde que l'ombre (le fond de la page reste visible)
  const sol = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: o.ombre ?? 0.22 }));
  sol.rotation.x = -Math.PI / 2; sol.receiveShadow = true;
  scene.add(sol);

  // chargement
  const draco = new DRACOLoader().setDecoderPath(o.base + 'vendor/addons/libs/draco/');
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const gltf = await new Promise((ok, ko) => loader.load(o.glb, ok, (e) => o.progression?.(e.total ? e.loaded / e.total : 0), ko));
  const racine = gltf.scene;
  scene.add(racine);
  const objets = {};
  racine.traverse((n) => {
    if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; }
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
  const extras = o.lumieres ? o.lumieres({ THREE, scene, objets }) : [];

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
  addEventListener('resize', taille);
  taille();

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
      e.n.position.y = e.y0 + (1 - rebond(t)) * e.hauteur;
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
    o.chaqueImage?.({ temps, dt, objets, extras, finIntro, etape: etapeLissee });
    renderer.render(scene, camera);
  }

  function boucle(t) {
    const dt = Math.min(0.05, (t - dernier) / 1000); dernier = t;
    if (visible) image(dt);
    requestAnimationFrame(boucle);
  }
  if (film) {
    window.__film = { avancer: (dt) => image(dt), pret: true };
    image(0);
  } else requestAnimationFrame((t) => { dernier = t; boucle(t); });

  return {
    allerA: (e) => { etape = e; },
    objets, scene, camera, renderer,
  };
}
