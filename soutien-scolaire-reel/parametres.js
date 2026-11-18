// Centre Najah Tanger : le SEUL fichier qui change d'un prospect à l'autre (modèle « soutien scolaire et concours », 17/11/2026).
// Données relevées le 17/11/2026 (travaux/2026-11-17-cibles-36/DOSSIERS-8.md § 8) : fiche Google Maps + page Facebook
// « Centre NAJAH Tanger ». Rien d'inventé : note, avis, adresse, horaires, téléphone, filières et formations viennent de là.
// Aucun prix. Les textes d'accroche (titres) sont de la mise en page, sans chiffre ni promesse.
window.SITE = {
  nom: 'Centre Najah',
  nomLong: { fr: 'Centre Najah Tanger', ar: 'مركز نجاح طنجة' },
  metier: { fr: 'Soutien scolaire et préparation aux concours', ar: 'الدعم المدرسي والتحضير للمباريات' },
  ville: { fr: 'Tanger', ar: 'طنجة' },
  langues: ['fr', 'ar'],
  whatsapp: '212628473153',               // indicatif + numéro, sans le 0 ni le +
  telephoneAffiche: '06 28 47 31 53',
  facebook: 'https://web.facebook.com/NAJAHCenter4U',
  couleurs: { fond: '#F3EEE3', texte: '#14213D', accent: '#E0782A', second: '#1E3A33' },
  note: { valeur: 4.8, nombre: 5 },        // Google Maps
  abonnes: 693,                            // Facebook
  adresse: { fr: '48 Bd Pasteur, Résidence Al Jesr, 3e étage, Tanger', ar: '48 شارع باستور، إقامة الجسر، الطابق الثالث، طنجة' },
  carte: 'https://www.google.com/maps/search/?api=1&query=Centre+Najah+48+Bd+Pasteur+Tanger',
  // Horaires de la fiche Maps (0 = dimanche). [ouverture, fermeture]
  horaires: { 0: ['11:00', '20:00'], 1: ['15:00', '21:00'], 2: ['15:00', '21:00'], 3: ['15:00', '21:00'], 4: ['15:00', '21:00'], 5: ['15:00', '21:00'], 6: ['08:30', '21:00'] },
  // Ce que le centre propose (page Facebook, mot pour mot dans l'esprit, sans ajout)
  publics: ['BAC', 'FSTT', 'ENSA', 'CPGE'],
  formations: [
    { icone: '✎', titre: { fr: 'Cours de soutien à la carte', ar: 'دروس الدعم حسب الطلب' }, texte: { fr: 'Pour les bacheliers et les étudiants : la matière qui coince, au rythme qu’il faut.', ar: 'للتلاميذ والطلبة: المادة الصعبة، بالوتيرة المناسبة.' } },
    { icone: '◎', titre: { fr: 'Vos diplômes : DUT, DEUG et CNC', ar: 'شواهدكم: DUT و DEUG و CNC' }, texte: { fr: 'Un accompagnement pour les étudiants de la FSTT, de l’ENSA et des CPGE.', ar: 'مواكبة لطلبة FSTT و ENSA والأقسام التحضيرية.' } },
    { icone: '✓', titre: { fr: 'Préparation aux examens et concours', ar: 'التحضير للامتحانات والمباريات' }, texte: { fr: 'Révisions, entraînement, méthode : arriver prêt le jour J.', ar: 'مراجعة، تمارين، منهجية: كن مستعدا يوم الامتحان.' } },
    { icone: '➚', titre: { fr: 'Coaching et orientation', ar: 'المواكبة والتوجيه' }, texte: { fr: 'Choisir sa filière et son école, avec quelqu’un qui connaît le terrain.', ar: 'اختيار الشعبة والمدرسة مع من يعرف الميدان.' } },
  ],
  // Avis Google avec texte, recopiés tels quels
  avis: [
    { nom: 'mohamed amine El alami', etoiles: 5, texte: 'AHSEN CENTRE D PREPA', dir: 'ltr' },
    { nom: 'mohamed amine Hallab', etoiles: 5, texte: 'شكرا استاذ توفبق على التوجيه، أساتذة في المستوى.', dir: 'rtl' },
  ],
  photos: [],   // { src: 'photos/salle-1.jpg', legende: { fr: '…', ar: '…' } } : vraies photos du centre seulement
  textes: {
    surtitre: { fr: 'Tanger · Bd Pasteur', ar: 'طنجة · شارع باستور' },
    titre: { fr: ['Le Bac,', 'les concours,', 'la réussite.'], ar: ['الباك،', 'المباريات،', 'والنجاح.'] },
    chapo: { fr: 'Centre de soutien scolaire pour les bacheliers et les étudiants de la FSTT, de l’ENSA et des CPGE.', ar: 'مركز للدعم المدرسي لتلاميذ الباكالوريا وطلبة FSTT و ENSA والأقسام التحضيرية.' },
    boutonInscription: { fr: 'S’inscrire sur WhatsApp', ar: 'سجّل عبر واتساب' },
    boutonDecouvrir: { fr: 'Découvrir', ar: 'اكتشف' },
    noteCourte: { fr: '{note} sur Google · {nombre} avis', ar: '{note} على Google · {nombre} تقييمات' },
    etapes: [
      { titre: { fr: 'Bacheliers', ar: 'تلاميذ الباكالوريا' }, texte: { fr: 'Cours de soutien à la carte : la matière qui vous bloque, reprise avec méthode.', ar: 'دروس دعم حسب الطلب: المادة التي تعيقك، بمنهجية واضحة.' } },
      { titre: { fr: 'FSTT · ENSA · CPGE', ar: 'FSTT · ENSA · CPGE' }, texte: { fr: 'Vos diplômes : DUT, DEUG et CNC. Un suivi pensé pour les étudiants.', ar: 'شواهدكم: DUT و DEUG و CNC. مواكبة مصممة للطلبة.' } },
      { titre: { fr: 'Examens et concours', ar: 'الامتحانات والمباريات' }, texte: { fr: 'Préparation aux examens et concours, pour arriver prêt.', ar: 'التحضير للامتحانات والمباريات، لتكون مستعدا.' } },
      { titre: { fr: 'Coaching et orientation', ar: 'المواكبة والتوجيه' }, texte: { fr: 'Choisir sa voie, avec des professeurs qui connaissent les filières.', ar: 'اختر طريقك مع أساتذة يعرفون الشعب.' } },
    ],
    // ce que la craie écrit sur l'ardoise, étape par étape (0 = ouverture)
    ardoise: [
      { fr: ['Centre NAJAH', 'BAC · FSTT · ENSA · CPGE'], ar: ['مركز نجاح', 'BAC · FSTT · ENSA · CPGE'] },
      { fr: ['BAC', "f(x) = x² + 3x", "f'(x) = 2x + 3"], ar: ['الباك', "f(x) = x² + 3x", "f'(x) = 2x + 3"] },
      { fr: ['DUT · DEUG · CNC', '∫₀¹ x² dx = 1/3'], ar: ['DUT · DEUG · CNC', '∫₀¹ x² dx = 1/3'] },
      { fr: ['Concours', '✓ méthode', '✓ entraînement'], ar: ['المباريات', '✓ المنهجية', '✓ التمارين'] },
      { fr: ['Orientation', 'ta voie →'], ar: ['التوجيه', '← طريقك'] },
    ],
    titreChiffres: { fr: 'En quelques chiffres', ar: 'بالأرقام' },
    chiffreNote: { fr: 'note sur Google', ar: 'التقييم على Google' },
    chiffreAvis: { fr: 'avis Google', ar: 'تقييمات Google' },
    chiffreAbonnes: { fr: 'abonnés Facebook', ar: 'متابع على فيسبوك' },
    chiffreJours: { fr: 'jours d’ouverture par semaine', ar: 'أيام عمل في الأسبوع' },
    titreFormations: { fr: 'Ce que propose le centre', ar: 'ما يقدمه المركز' },
    titreHoraires: { fr: 'Horaires', ar: 'أوقات العمل' },
    ouvert: { fr: 'Ouvert maintenant', ar: 'مفتوح الآن' },
    ferme: { fr: 'Fermé maintenant', ar: 'مغلق الآن' },
    aujourdhui: { fr: 'aujourd’hui', ar: 'اليوم' },
    jours: { fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'], ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'] },
    titreAvis: { fr: 'Ce que disent les élèves', ar: 'ماذا يقول التلاميذ' },
    sourceAvis: { fr: 'Avis publiés sur Google Maps, recopiés tels quels.', ar: 'تقييمات منشورة على خرائط Google كما هي.' },
    titrePhotos: { fr: 'Le centre', ar: 'المركز' },
    titreVisite: { fr: 'Venir au centre', ar: 'زورونا' },
    boutonCarte: { fr: 'Voir l’itinéraire', ar: 'الطريق إلينا' },
    boutonFacebook: { fr: 'Page Facebook', ar: 'صفحة فيسبوك' },
    titreInscription: { fr: 'Inscription', ar: 'التسجيل' },
    sousInscription: { fr: 'Remplissez, le message part sur WhatsApp au centre.', ar: 'املأ الخانات، وترسل الرسالة إلى المركز عبر واتساب.' },
    champNom: { fr: 'Nom de l’élève', ar: 'اسم التلميذ' },
    champNiveau: { fr: 'Niveau', ar: 'المستوى' },
    niveaux: { fr: ['Bac', 'FSTT', 'ENSA', 'CPGE', 'DUT / DEUG', 'Autre'], ar: ['الباك', 'FSTT', 'ENSA', 'الأقسام التحضيرية', 'DUT / DEUG', 'آخر'] },
    champBesoin: { fr: 'Matière, examen ou concours visé', ar: 'المادة أو الامتحان أو المباراة' },
    consentement: { fr: 'J’accepte que ces informations servent uniquement à me recontacter (loi 09-08).', ar: 'أوافق على استعمال هذه المعلومات فقط للتواصل معي (القانون 09-08).' },
    boutonEnvoyer: { fr: 'Envoyer sur WhatsApp', ar: 'أرسل عبر واتساب' },
    messageWhatsapp: { fr: 'Bonjour Centre Najah, je souhaite une inscription.', ar: 'السلام عليكم مركز نجاح، أريد التسجيل.' },
    credits: { fr: 'Modèles 3D : Poly Haven (CC0) · Three.js (MIT)', ar: 'نماذج ثلاثية الأبعاد: Poly Haven (CC0) · Three.js (MIT)' },
  },
};
