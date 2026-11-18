// Panier de services (brouillon du 18/11/2026). Les prix sont CEUX AFFICHÉS sur la page, rien d'autre.
(function () {
  var NUM = "212659414774"; // numéro WhatsApp déjà présent sur la page
  var CLE = "amd-maroc-panier-v1";
  // une = payé une fois (ou à l'installation) ; mois = abonnement mensuel ; an = montant annuel ensuite ; devis = sans prix
  var SERVICES = [
    { id: "site", nom: "Site animé (offre nouveau client)", une: 1190, an: 150 },
    { id: "maps", nom: "Fiche Google Maps soignée", une: 490 },
    { id: "clients", nom: "Fichier clients", une: 1990, mois: 190 },
    { id: "devis", nom: "Devis et factures", une: 990 },
    { id: "rappels", nom: "Rappels et relances WhatsApp", une: 1490, mois: 150 },
    { id: "rdv", nom: "Prise de rendez-vous en ligne", une: 990 },
    { id: "stock", nom: "Stock et ventes", une: 2490, mois: 190 },
    { id: "pub", nom: "Publicité Facebook et Instagram (gestion)", mois: 990 },
    { id: "mesure", nom: "Outil sur mesure", devis: true },
    { id: "presence", nom: "Réseaux sociaux : formule Présence", mois: 1490 },
    { id: "croissance", nom: "Réseaux sociaux : formule Croissance", mois: 2490 },
    { id: "pack", nom: "Pack Commerce (site + fiche Google Maps + fichier clients)", une: 2990, mois: 190, an: 150 }
  ];
  var PAR_ID = {}; SERVICES.forEach(function (s) { PAR_ID[s.id] = s; });

  var etat = { sel: {}, champs: { entreprise: "", nom: "", prenom: "", email: "" } };
  try { var b0 = JSON.parse(localStorage.getItem(CLE) || "null"); if (b0) { etat.sel = b0.sel || {}; etat.champs = Object.assign(etat.champs, b0.champs || {}); } } catch (e) {}
  function garde() { try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) {} }
  function fmt(n) { return n.toLocaleString("fr-FR").replace(/[  ]/g, " ") + " DH"; }
  function ids() { return Object.keys(etat.sel).filter(function (k) { return PAR_ID[k]; }); }
  function coches() { return ids().filter(function (k) { return etat.sel[k]; }); }

  var boutons = {};
  document.querySelectorAll("[data-svc]").forEach(function (el) {
    var id = el.getAttribute("data-svc"); if (!PAR_ID[id]) return;
    var b = document.createElement("button"); b.type = "button"; b.className = "btn-panier";
    b.addEventListener("click", function () { if (id in etat.sel) { ouvre(); } else { etat.sel[id] = true; garde(); rend(); } });
    (el.classList.contains("pack") ? el.lastElementChild : el).appendChild(b);
    boutons[id] = b;
  });

  var fab = document.createElement("button"); fab.type = "button"; fab.className = "panier-fab"; fab.setAttribute("aria-label", "Ouvrir le panier");
  fab.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2.5 3h3l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.2a1.6 1.6 0 0 0 1.6-1.2L21 7H6.2"/></svg><span class="nb" data-n="0"></span>';
  document.body.appendChild(fab);
  var voile = document.createElement("div"); voile.className = "panier-voile";
  var pan = document.createElement("aside"); pan.className = "panier"; pan.setAttribute("role", "dialog"); pan.setAttribute("aria-modal", "true"); pan.setAttribute("aria-label", "Votre panier");
  pan.innerHTML =
    '<div class="panier-tete"><h2>Votre commande</h2><button type="button" class="panier-fermer" aria-label="Fermer le panier">×</button></div>' +
    '<div class="panier-corps">' +
      '<h3>Vos coordonnées</h3>' +
      '<div class="panier-champs">' +
        '<label class="large">Nom de l\'entreprise<input type="text" name="entreprise" autocomplete="organization"></label>' +
        '<label>Nom<input type="text" name="nom" autocomplete="family-name"></label>' +
        '<label>Prénom<input type="text" name="prenom" autocomplete="given-name"></label>' +
        '<label class="large">E-mail<input type="email" name="email" autocomplete="email" inputmode="email"></label>' +
      '</div>' +
      '<h3>Votre message</h3>' +
      '<div class="bulle"><p class="salut">Salam Aleikoum, je voudrais commander ces services AMD Project :</p><ul class="lignes"></ul><div class="totaux"></div><p class="note"></p></div>' +
    '</div>' +
    '<div class="panier-pied"><a class="btn btn-wa" target="_blank" rel="noopener" href="#"><svg><use href="#wa"/></svg>Envoyer sur WhatsApp</a><button type="button" class="panier-vider">Vider le panier</button><p class="panier-avert">Rien n\'est payé : le message part sur WhatsApp et on vous répond.</p></div>';
  document.body.appendChild(voile); document.body.appendChild(pan);
  var liste = pan.querySelector(".lignes"), totaux = pan.querySelector(".totaux"), note = pan.querySelector(".note"), envoi = pan.querySelector(".panier-pied .btn-wa");

  function ouvre() { pan.classList.add("ouvert"); voile.classList.add("ouvert"); document.body.classList.add("panier-ouvert"); pan.querySelector(".panier-fermer").focus(); }
  function ferme() { pan.classList.remove("ouvert"); voile.classList.remove("ouvert"); document.body.classList.remove("panier-ouvert"); fab.focus(); }
  fab.addEventListener("click", ouvre); voile.addEventListener("click", ferme);
  pan.querySelector(".panier-fermer").addEventListener("click", ferme);
  addEventListener("keydown", function (e) { if (e.key === "Escape" && pan.classList.contains("ouvert")) ferme(); });
  pan.querySelector(".panier-vider").addEventListener("click", function () { etat.sel = {}; garde(); rend(); });

  Object.keys(etat.champs).forEach(function (k) {
    var i = pan.querySelector('input[name="' + k + '"]'); i.value = etat.champs[k];
    i.addEventListener("input", function () { etat.champs[k] = i.value; garde(); majLien(); });
  });

  function calcul() {
    var une = 0, mois = 0, devis = [];
    coches().forEach(function (k) { var s = PAR_ID[k]; if (s.devis) devis.push(s); else { une += s.une || 0; mois += s.mois || 0; } });
    return { une: une, mois: mois, devis: devis };
  }
  function texte() {
    var c = etat.champs, L = ["Salam Aleikoum, je voudrais commander ces services AMD Project :", ""];
    var n0 = L.length;
    if (c.entreprise.trim()) L.push("Entreprise : " + c.entreprise.trim());
    if (c.nom.trim()) L.push("Nom : " + c.nom.trim());
    if (c.prenom.trim()) L.push("Prénom : " + c.prenom.trim());
    if (c.email.trim()) L.push("E-mail : " + c.email.trim());
    if (L.length > n0) L.push("");
    coches().forEach(function (k) {
      var s = PAR_ID[k], p;
      if (s.devis) p = "sur devis";
      else { var a = []; if (s.une) a.push(fmt(s.une)); if (s.mois) a.push(fmt(s.mois) + " par mois"); p = a.join(" puis "); }
      L.push("- " + s.nom + " : " + p + (s.an ? " (puis " + fmt(s.an) + " par an)" : ""));
    });
    var t = calcul(); L.push("");
    L.push("Total à la commande : " + fmt(t.une));
    if (t.mois) L.push("Puis par mois : " + fmt(t.mois));
    if (t.devis.length) L.push("Sur devis (hors total) : " + t.devis.map(function (s) { return s.nom; }).join(", "));
    return L.join("\n");
  }
  function majLien() { envoi.href = "https://wa.me/" + NUM + "?text=" + encodeURIComponent(texte()); }

  function rend() {
    var n = coches().length;
    var nb = fab.querySelector(".nb"); nb.textContent = n || ""; nb.setAttribute("data-n", n);
    SERVICES.forEach(function (s) {
      var b = boutons[s.id]; if (!b) return; var dedans = s.id in etat.sel;
      b.classList.toggle("dedans", dedans);
      b.textContent = dedans ? "✓ Dans le panier" : "Ajouter au panier";
    });
    liste.innerHTML = "";
    ids().forEach(function (k) {
      var s = PAR_ID[k], on = !!etat.sel[k], p;
      var li = document.createElement("li"); li.className = "ligne" + (on ? "" : " retire");
      if (s.devis) p = "Sur devis"; else p = s.une ? fmt(s.une) : fmt(s.mois) + "/mois";
      var sous = s.devis ? "pas compté dans le total" : [s.une && s.mois ? "puis " + fmt(s.mois) + " par mois" : "", s.an ? "puis " + fmt(s.an) + " par an" : ""].filter(Boolean).join(" · ");
      li.innerHTML = '<label><input type="checkbox"' + (on ? " checked" : "") + '><span class="nom"></span><span class="px"></span></label>';
      li.querySelector(".nom").textContent = s.nom;
      if (sous) { var sm = document.createElement("small"); sm.textContent = sous; li.querySelector(".nom").appendChild(sm); }
      li.querySelector(".px").textContent = p;
      li.querySelector("input").addEventListener("change", function (e) { etat.sel[k] = e.target.checked; garde(); rend(); });
      liste.appendChild(li);
    });
    if (!ids().length) { var v = document.createElement("li"); v.className = "panier-vide"; v.textContent = "Votre panier est vide. Ajoutez un service avec « Ajouter au panier »."; liste.appendChild(v); }
    var t = calcul();
    totaux.innerHTML = "";
    function ligne(a, b, c) { var d = document.createElement("div"); if (c) d.className = c; d.innerHTML = "<span></span><b></b>"; d.firstChild.textContent = a; d.lastChild.textContent = b; totaux.appendChild(d); }
    ligne("Total à la commande", fmt(t.une), "gros");
    if (t.mois) ligne("Puis par mois", fmt(t.mois));
    note.textContent = t.devis.length ? "« Outil sur mesure » est sur devis : il n'est pas compté dans le total." : "Prix en dirhams, tels qu'affichés sur la page.";
    envoi.setAttribute("aria-disabled", n ? "false" : "true");
    majLien();
  }
  rend();
})();
