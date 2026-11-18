// Expert Deco Design (Tanger) : le SEUL fichier qui change d'un prospect à l'autre (modèle « salons et bois », 18/11/2026).
// Données relevées sur la fiche Google Maps le 17-18/11/2026 (travaux/2026-11-17-cibles-36/DOSSIERS-8.md, § 4) :
// nom, téléphone 06 81 32 49 76, adresse « n 63, Rue Al Quadissia, Tanger 90060 », catégorie « Décorateur d'intérieur »,
// note 5,0 (5 avis), avis d'Anthony (cité mot pour mot), photos de la rubrique « Photos du propriétaire ».
// Rien d'inventé. AUCUN prix. Pas de site ni de réseau trouvé : pas de lien Facebook/Instagram.
window.SITE = {
  nom: 'Expert Deco Design',
  nomLong: { fr: 'Expert Deco Design Tanger', ar: 'Expert Deco Design طنجة' },
  metier: { fr: 'Salons sur mesure, plafonds et panneaux en bois à Tanger', ar: 'صالونات على المقاس، أسقف وألواح خشبية في طنجة' },
  whatsapp: '212681324976',
  telephoneAffiche: '06 81 32 49 76',
  adresse: { fr: 'N° 63, Rue Al Quadissia, Tanger 90060', ar: 'رقم 63، زنقة القدسية، طنجة 90060' },
  carte: 'https://www.google.com/maps/search/?api=1&query=Expert+Deco+Design+Tanger',
  note: 5, // 5,0 sur Google, 5 avis
  // tissus du salon (couleurs indicatives)
  facades: [
    { id: 'emeraude', couleur: '#0F6B6E', nom: { fr: 'Vert canard', ar: 'أخضر بطي' } },
    { id: 'nuit', couleur: '#22304F', nom: { fr: 'Bleu nuit', ar: 'أزرق ليلي' } },
    { id: 'bordeaux', couleur: '#6E2430', nom: { fr: 'Bordeaux', ar: 'بوردو' } },
    { id: 'sable', couleur: '#CDB99A', nom: { fr: 'Beige sable', ar: 'بيج رملي' } },
  ],
  // bois du plafond et des panneaux
  plans: [
    { id: 'chene', fond: '#C9A576', clair: true, nom: { fr: 'Chêne clair', ar: 'بلوط فاتح' } },
    { id: 'noyer', fond: '#6B4630', nom: { fr: 'Noyer', ar: 'جوز' } },
    { id: 'blanc', fond: '#E8E4DB', laque: true, nom: { fr: 'Blanc laqué', ar: 'أبيض مطلي' } },
  ],
  gamme: [
    { fr: 'Salons marocains', ar: 'صالونات مغربية' },
    { fr: 'Salons modernes', ar: 'صالونات عصرية' },
    { fr: 'Sofas sur mesure', ar: 'سوفا على المقاس' },
    { fr: 'Chambres', ar: 'غرف النوم' },
    { fr: 'Plafonds et panneaux en bois', ar: 'أسقف وألواح خشبية' },
  ],
  photos: [
    { src: 'photos/salon.webp', alt: { fr: 'Salon d’angle vert canard, tables basses marbre et laiton, plafond sculpté', ar: 'صالون ركن أخضر، طاولات رخام ونحاس، سقف منحوت' } },
    { src: 'photos/chambre.webp', alt: { fr: 'Chambre : tête de lit capitonnée et lattes de bois', ar: 'غرفة نوم: رأس سرير مبطن وألواح خشب' } },
    { src: 'photos/lit-panneaux.webp', alt: { fr: 'Lit, tables de chevet et panneaux muraux en bois', ar: 'سرير وطاولات جانبية وألواح حائط خشبية' } },
  ],
  avis: {
    // citation mot pour mot (Anthony, avis Google, il y a 5 mois)
    texte: { fr: 'Maison de décoration créative et incomparable les décorateurs sont des pros , ils fabriques de la fourniture sur mesure des salons modernes ou salon marocains sofas ou traditionnels avec de bons prix je suis bien satisfait', ar: 'Maison de décoration créative et incomparable les décorateurs sont des pros , ils fabriques de la fourniture sur mesure des salons modernes ou salon marocains sofas ou traditionnels avec de bons prix je suis bien satisfait' },
    auteur: 'Anthony, avis Google',
  },
  textes: {
    surtitre: { fr: 'Tanger · Décorateur d’intérieur', ar: 'طنجة · ديكور داخلي' },
    titre: { fr: ['Le salon', 'qui vous', 'ressemble.'], ar: ['الصالون', 'اللي كيشبهك', 'على المقاس.'] },
    chapo: { fr: 'Salons marocains et modernes, sofas, chambres, plafonds et panneaux en bois : fabriqués sur mesure à Tanger.', ar: 'صالونات مغربية وعصرية، سوفا، غرف نوم، أسقف وألواح خشبية: كلشي على المقاس فطنجة.' },
    boutonDevis: { fr: 'Demander un devis', ar: 'طلب ديفي' },
    boutonDecouvrir: { fr: 'Composer mon salon', ar: 'صاوب الصالون ديالي' },
    noteCourte: { fr: '5,0 sur Google · 5 avis', ar: '5,0 على Google · 5 تقييمات' },
    etapes: [
      { titre: { fr: 'Un salon sur mesure', ar: 'صالون على المقاس' }, texte: { fr: 'Banquette d’angle, sofa ou salon marocain : il se dessine selon votre pièce et vos mesures.', ar: 'ركن، سوفا ولا صالون مغربي: كيتصاوب على حساب البيت والمقاسات ديالك.' } },
      { titre: { fr: 'Choisissez le tissu', ar: 'اختار القماش' }, texte: { fr: 'Touchez une couleur : le salon change devant vous.', ar: 'كليكي على لون: الصالون كيتبدل قدامك.' }, choix: 'facades' },
      { titre: { fr: 'Plafond et panneaux en bois', ar: 'السقف والألواح الخشبية' }, texte: { fr: 'Le bois habille le plafond et le mur. Essayez les teintes.', ar: 'الخشب كيلبس السقف والحيط. جرب الألوان.' }, choix: 'plans' },
      { titre: { fr: 'Les lumières du soir', ar: 'ضو العشية' }, texte: { fr: 'Corniche lumineuse, lustre et tables basses : l’ambiance fait la pièce.', ar: 'ضو فالكورنيش، ثريا وطاولات صغيرة: الأجواء هي اللي كتصاوب البيت.' } },
    ],
    noteCouleurs: { fr: 'Couleurs indicatives : les finitions réelles se choisissent avec l’atelier.', ar: 'الألوان غير للتوضيح: الفينيسيون الحقيقيين كتختارهم مع الورشة.' },
    titreGamme: { fr: 'Ce que fait Expert Deco Design', ar: 'شنو كتدير Expert Deco Design' },
    titreReal: { fr: 'Quelques réalisations', ar: 'شي إنجازات' },
    sourcePhotos: { fr: 'Photos : rubrique « Photos du propriétaire » de la fiche Google Maps. Exemple de maquette.', ar: 'الصور: من فيشة Google Maps (صور المالك). نموذج ماكيط.' },
    titreAvis: { fr: 'Ce que disent les clients', ar: 'شنو كيقولو الكليان' },
    titreDevis: { fr: 'Votre projet en une minute', ar: 'المشروع ديالك فدقيقة' },
    sousDevis: { fr: 'L’atelier vous répond sur WhatsApp. Rien n’est engagé avant votre accord.', ar: 'الورشة كتجاوبك فواتساب. والو ما كيتلزم بلا موافقتك.' },
    champProjet: { fr: 'Votre projet', ar: 'المشروع' },
    champLongueur: { fr: 'Longueur du mur (m, environ)', ar: 'طول الحيط (متر، تقريبا)' },
    champFacade: { fr: 'Tissu', ar: 'القماش' },
    champPlan: { fr: 'Bois', ar: 'الخشب' },
    champQuartier: { fr: 'Quartier', ar: 'الحي' },
    champNom: { fr: 'Votre nom', ar: 'الاسم' },
    consentement: { fr: 'J’accepte que ces informations servent uniquement à traiter ma demande (loi 09-08).', ar: 'أوافق على استعمال هاد المعلومات غير باش يتعالج الطلب ديالي (القانون 09-08).' },
    boutonEnvoyer: { fr: 'Envoyer sur WhatsApp', ar: 'صيفط على واتساب' },
    messageWhatsapp: { fr: 'Bonjour Expert Deco Design, je voudrais un devis.', ar: 'السلام عليكم Expert Deco Design، بغيت ديفي.' },
    recapTitre: { fr: 'Votre demande', ar: 'الطلب ديالك' },
    titreVisite: { fr: 'Passer à l’atelier', ar: 'زور الورشة' },
    boutonCarte: { fr: 'Ouvrir l’itinéraire', ar: 'افتح الطريق' },
    exemple: { fr: 'Exemple de maquette', ar: 'نموذج ماكيط' },
    credits: { fr: 'Objets 3D : Poly Haven (CC0) · Three.js (MIT)', ar: 'نماذج ثلاثية الأبعاد: Poly Haven (CC0) · Three.js (MIT)' },
  },
};
