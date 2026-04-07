import React, { useState, useEffect } from 'react'
import './App.css'
import { newsService } from './services/newsService'
import { aiGenerator } from './services/aiGenerator'
import { 
  GraduationCap, Newspaper, ArrowRight, CheckCircle2, 
  AlertCircle, HelpCircle, Loader2, Sparkles, 
  BookOpen, RefreshCcw, ExternalLink, Search, Layers, 
  MessageCircle, Info, Flag, AlertTriangle, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const getFlag = (countryCode) => {
  const flags = {
    'FRANCE': '🇫🇷',
    'SWITZERLAND': '🇨🇭',
    'GERMANY': '🇩🇪',
    'USA': '🇺🇸',
    'GLOBAL': '🌐'
  };
  return flags[countryCode] || '🌐';
};

function App() {
  const [news, setNews] = useState([])
  const [selectedNews, setSelectedNews] = useState(null)
  const [ageRange, setAgeRange] = useState('8-9')
  const [country, setCountry] = useState('GLOBAL')
  const [customUrl, setCustomUrl] = useState('')
  const [customContent, setCustomContent] = useState('')
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('landing')
  const [searchTerm, setSearchTerm] = useState('')
  const [language, setLanguage] = useState('fr')
  const [showTutorial, setShowTutorial] = useState(true)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [activeCategory, setActiveCategory] = useState('ALL')

  const uiText = {
    fr: { 
      badge: "Intelligence Artificielle Pédagogique",
      title: "Débats Éthiques & Philo pour Enfants", 
      subtitle: "Transformez l'actualité mondiale en opportunité d'apprentissage, sans tabou, avec la bonne méthode.",
      countryLabel: "Votre Pays",
      ageLabel: "Âge des élèves",
      startBtn: "Voir les actualités",
      curationTitle: "Curation du jour",
      curationSub: "Sujets à débattre avec les",
      backBtn: "Changer de profil",
      searchPlaceholder: "Filtrer par mot-clé (ex: climat, espace, justice...)",
      prepareBtn: "Préparer la séance",
      generateBtn: "Générer la séance",
      generating: "Génération en cours...",
      customSectionTitle: "Créer une séance sur mesure",
      customSectionDesc: "Vous avez trouvé un article intéressant ? Collez son lien ou son texte ci-dessous. L'IA analysera votre texte et cherchera d'autres sources formelles pour le mettre en perspective.",
      customUrlLabel: "Lien vers votre article",
      customTextLabel: "Ou collez le texte brut",
      years: "ans",
      countries: { GLOBAL: "🌐 Monde / International", FRANCE: "🇫🇷 France", SWITZERLAND: "🇨🇭 Suisse", GERMANY: "🇩🇪 Allemagne", USA: "🇺🇸 États-Unis" },
      newsDate: "Actu du",
      readOriginal: "Lire l'article original ↗",
      warningTitle: "Conseils pour aborder ce sujet sensible",
      preReqTitle: "Prérequis & contexte",
      vocabLabel: "Vocabulaire :",
      philoLabel: "Notions philosophiques :",
      aPrioriTitle: "Analyse à priori",
      mediatorTitle: "Le détour pédagogique",
      newsSummaryTitle: "Résumé détaillé de l'info",
      perspectiveTitle: "Mise en perspective des sources",
      debateTitle: "Déroulé du débat",
      problematicLabel: "Problématique :",
      objectiveLabel: "Objectif :",
      conclusionTitle: "Synthèse & conclusion",
      sourcesCitedTitle: "Sources utilisées pour cette fiche :",
      backToNewsBtn: "Autre sujet",
      printBtn: "Imprimer",
      sheetTitle: "Fiche de préparation détaillée",
      tutorialTitle: "Bienvenue sur débats éthiques & philo ! 🎓",
      tutorialStep1Title: "Choisissez l'actu",
      tutorialStep1Desc: "Sélectionnez votre pays et l'âge de vos élèves, puis parcourez les actualités du jour.",
      tutorialStep2Title: "Option A : sélectionnez un article",
      tutorialStep2Desc: "Cliquez sur 'Préparer la séance' sous n'importe quel article de la curation du jour.",
      tutorialStep3Title: "Option B : leçon sur mesure",
      tutorialStep3Desc: "Vous avez déjà un article en tête ? Collez son lien ou son texte dans la zone 'Sur mesure'.",
      tutorialStep4Title: "Générez le débat",
      tutorialStep4Desc: "L'IA prépare une fiche complète : contexte, vocabulaire, 'détour pédagogique' (pour aborder les sujets sensibles) et questions.",
      tutorialGotItBtn: "J'ai compris, on y va !",
      tutorialNextBtn: "Suivant",
      tutorialPrevBtn: "Précédent",
      helpTab: "Aide",
      howStep1Title: "Choisissez un sujet",
      howStep1Desc: "Parcourez l'actu du jour ou collez votre propre article.",
      howStep2Title: "L'IA analyse",
      howStep2Desc: "Croisement de sources, adaptation à l'âge, détour pédagogique.",
      howStep3Title: "Débattez en classe",
      howStep3Desc: "Obtenez une fiche complète prête à l'emploi.",
      catAll: 'Tous',
      catSport: '🏆 Sport & Jeux',
      catJustice: '⚖️ Justice & Lois',
      catNature: '🌍 Nature & Planète',
      catTech: '🚀 Écrans & Futur',
      catIdentity: '👤 Identité & Émotions',
      catHealth: '🍎 Corps & Santé',
      catCulture: '🎨 Arts & Culture',
      catTruth: '🕵️ Vérité & Info',
      catMoney: '💰 Argent & Métiers',
      catSociety: '🤝 Vivre ensemble'
    },
    en: { 
      badge: "Pedagogical Artificial Intelligence",
      title: "Ethical Debates & Philosophy for Kids", 
      subtitle: "Transform global news into learning opportunities, without taboos, using the right method.",
      countryLabel: "Your Country",
      ageLabel: "Students' Age",
      startBtn: "See news",
      curationTitle: "Today's curation",
      curationSub: "Topics to discuss with",
      backBtn: "Change settings",
      searchPlaceholder: "Filter by keyword (e.g., climate, space, justice...)",
      prepareBtn: "Prepare session",
      generateBtn: "Generate session",
      generating: "Generating...",
      customSectionTitle: "Create custom session",
      customSectionDesc: "Found an interesting article? Paste its link or text below. AI will analyze your text and search for other sources to provide perspective.",
      customUrlLabel: "Link to your article",
      customTextLabel: "Or paste raw text",
      years: "years old",
      countries: { GLOBAL: "🌐 Global / International", FRANCE: "🇫🇷 France", SWITZERLAND: "🇨🇭 Switzerland", GERMANY: "🇩🇪 Germany", USA: "🇺🇸 United States" },
      newsDate: "News from",
      readOriginal: "Read original article ↗",
      warningTitle: "Advice for tackling this sensitive subject",
      preReqTitle: "Prerequisites & context",
      vocabLabel: "Vocabulary:",
      philoLabel: "Philosophical concepts:",
      aPrioriTitle: "A priori analysis",
      mediatorTitle: "The pedagogical detour",
      newsSummaryTitle: "Detailed news summary",
      perspectiveTitle: "Putting sources into perspective",
      debateTitle: "Debate flow",
      problematicLabel: "Problematic:",
      objectiveLabel: "Objective:",
      conclusionTitle: "Synthesis & conclusion",
      sourcesCitedTitle: "Sources used for this sheet:",
      backToNewsBtn: "Another topic",
      printBtn: "Print",
      sheetTitle: "Detailed lesson plan",
      tutorialTitle: "Welcome to ethical debates & philo! 🎓",
      tutorialStep1Title: "Choose the news",
      tutorialStep1Desc: "Select your country and students' age, then browse today's news.",
      tutorialStep2Title: "Option A: select an article",
      tutorialStep2Desc: "Click on 'Prepare session' under any article from today's curation.",
      tutorialStep3Title: "Option B: custom lesson",
      tutorialStep3Desc: "Already have an article in mind? Paste its link or text in the 'Custom' area.",
      tutorialStep4Title: "Generate debate",
      tutorialStep4Desc: "AI prepares a complete sheet: context, vocabulary, 'pedagogical detour' (for sensitive topics), and follow-up questions.",
      tutorialGotItBtn: "Got it, let's go!",
      tutorialNextBtn: "Next",
      tutorialPrevBtn: "Previous",
      helpTab: "Help",
      howStep1Title: "Pick a topic",
      howStep1Desc: "Browse today's news or paste your own article.",
      howStep2Title: "AI analyzes",
      howStep2Desc: "Cross-referencing sources, age adaptation, pedagogical detour.",
      howStep3Title: "Debate in class",
      howStep3Desc: "Get a complete, ready-to-use lesson plan.",
      catAll: 'All',
      catSport: '🏆 Sports & Games',
      catJustice: '⚖️ Justice & Laws',
      catNature: '🌍 Nature & Planet',
      catTech: '🚀 Screens & Future',
      catIdentity: '👤 Identity & Emotions',
      catHealth: '🍎 Body & Health',
      catCulture: '🎨 Arts & Culture',
      catTruth: '🕵️ Truth & Info',
      catMoney: '💰 Money & Jobs',
      catSociety: '🤝 Living together'
    },
    de: { 
      badge: "Pädagogische Künstliche Intelligenz",
      title: "Ethische Debatten & Philosophie für Kinder", 
      subtitle: "Verwandeln Sie Weltnachrichten in Lernmöglichkeiten, ohne Tabus, mit der richtigen Methode.",
      countryLabel: "Ihr Land",
      ageLabel: "Alter der Schüler",
      startBtn: "Nachrichten sehen",
      curationTitle: "Heutige Kuration",
      curationSub: "Themen zur Diskussion mit",
      backBtn: "Einstellungen ändern",
      searchPlaceholder: "Nach Stichwort filtern (z. B. Klima, Weltraum, Gerechtigkeit...)",
      prepareBtn: "Sitzung vorbereiten",
      generateBtn: "Sitzung generieren",
      generating: "Wird geladen...",
      customSectionTitle: "Maßgeschneiderte Sitzung erstellen",
      customSectionDesc: "Haben Sie einen interessanten Artikel gefunden? Fügen Sie den Link oder Text unten ein. Die KI analysiert Ihren Text und sucht nach anderen Quellen zur Perspektivierung.",
      customUrlLabel: "Link zu Ihrem Artikel",
      customTextLabel: "Oder Rohtext einfügen",
      years: "Jahre",
      countries: { GLOBAL: "🌐 Global / International", FRANCE: "🇫🇷 Frankreich", SWITZERLAND: "🇨🇭 Schweiz", GERMANY: "🇩🇪 Deutschland", USA: "🇺🇸 USA" },
      newsDate: "Nachrichten vom",
      readOriginal: "Originalartikel lesen ↗",
      warningTitle: "Ratschläge für den Umgang mit diesem sensiblen Thema",
      preReqTitle: "Voraussetzungen & Kontext",
      vocabLabel: "Vokabular:",
      philoLabel: "Philosophische Begriffe:",
      aPrioriTitle: "A-Priori-Analyse",
      mediatorTitle: "Der pädagogische Umweg",
      newsSummaryTitle: "Detaillierte Nachrichtenzusammenfassung",
      perspectiveTitle: "Quellen in Relation setzen",
      debateTitle: "Ablauf der Debatte",
      problematicLabel: "Problematik:",
      objectiveLabel: "Ziel:",
      conclusionTitle: "Synthese & Schlussfolgerung",
      sourcesCitedTitle: "Für dieses Blatt verwendete Quellen:",
      backToNewsBtn: "Anderes Thema",
      printBtn: "Drucken",
      sheetTitle: "Detaillierter Vorbereitungsbogen",
      tutorialTitle: "Willkommen bei ethische Debatten! 🎓",
      tutorialStep1Title: "Nachrichten auswählen",
      tutorialStep1Desc: "Wählen Sie Ihr Land und das Alter der Schüler, durchsuchen Sie dann die Nachrichten.",
      tutorialStep2Title: "Option A: Artikel auswählen",
      tutorialStep2Desc: "Klicken Sie auf 'Sitzung vorbereiten' unter einem beliebigen Artikel aus der heutigen Auswahl.",
      tutorialStep3Title: "Option B: maßgeschneiderte Lektion",
      tutorialStep3Desc: "Haben Sie bereits einen Artikel im Kopf? Fügen Sie den Link oder Text im Bereich 'Maßgeschneidert' ein.",
      tutorialStep4Title: "Debatte generieren",
      tutorialStep4Desc: "Die KI erstellt ein komplettes Blatt: Kontext, Vokabular, 'pädagogischer Umweg' und Folgefragen.",
      tutorialGotItBtn: "Verstanden, los geht's!",
      tutorialNextBtn: "Weiter",
      tutorialPrevBtn: "Zurück",
      helpTab: "Hilfe",
      howStep1Title: "Thema wählen",
      howStep1Desc: "Durchsuchen Sie die Nachrichten oder fügen Sie Ihren eigenen Artikel ein.",
      howStep2Title: "KI analysiert",
      howStep2Desc: "Quellenabgleich, Altersanpassung, pädagogischer Umweg.",
      howStep3Title: "In der Klasse debattieren",
      howStep3Desc: "Erhalten Sie einen vollständigen, sofort einsetzbaren Leitfaden.",
      catAll: 'Alle',
      catSport: '🏆 Sport & Spiele',
      catJustice: '⚖️ Justiz & Gesetze',
      catNature: '🌍 Natur & Planet',
      catTech: '🚀 Bildschirme & Zukunft',
      catIdentity: '👤 Identität & Emotionen',
      catHealth: '🍎 Körper & Gesundheit',
      catCulture: '🎨 Kunst & Kultur',
      catTruth: '🕵️ Wahrheit & Info',
      catMoney: '💰 Geld & Berufe',
      catSociety: '🤝 Zusammenleben'
    }
  };


  useEffect(() => {
    if (step === 'selection') {
      const fetchNews = async () => {
        setLoading(true)
        try {
          const data = await newsService.getLatestNews(country)
          console.log("Données reçues de n8n :", data);
          
          // Logique de "déballage" du JSON n8n
          if (data && data[0]?.message?.content) {
            const rawContent = data[0].message.content;
            // On enlève les balises ```json et ```
            const jsonString = rawContent.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(jsonString);
            
            // On enregistre uniquement la liste des articles (clusters)
            setNews(parsed.clusters || []);
          } else {
            setNews(Array.isArray(data) ? data : []);
          }
        } catch (error) {
          console.error("Erreur de parsing des news:", error);
          setNews([]);
        }
        setLoading(false)
      }
      fetchNews()
    }
  }, [step, country])

  const handleStart = () => setStep('selection')

  const getArticleCategory = (item) => {
    if (!item) return 'SOCIETY';
    const getString = (val) => (typeof val === 'object' ? (val[language] || val['fr'] || '') : (val || ''));
    const content = (getString(item.topicTitle) + ' ' + getString(item.summary)).toLowerCase();

    // Utilisation de RegExp avec \b pour ne matcher que les mots ENTIERS
    const check = (regex) => new RegExp(`\\b(${regex})\\b`, 'i').test(content);

    if (check('sport|foot|boxe|jo|olympique|match|joueur|athlète|médaille|stade')) return 'SPORT';
    if (check('justice|loi|règle|tribunal|police|triche|droit|interdit|procès|juge|prison|vol|crime')) return 'JUSTICE';
    if (check('nature|climat|écologie|animal|animaux|météo|pollution|eau|forêt|planète|terre|environnement|inondation')) return 'NATURE';
    if (check('tech|écran|internet|ia|robot|espace|science|futur|téléphone|réseau|virtuel|algorithme|lune|nasa|astronaute|numérique')) return 'TECH';
    if (check('identité|émotion|peur|joie|différence|genre|fille|garçon|sentiment|amour|tristesse|sexisme')) return 'IDENTITY';
    if (check('santé|maladie|hôpital|médecin|alimentation|nourriture|handicap|corps|soin|virus|sucre')) return 'HEALTH';
    if (check('art|musique|film|livre|histoire|peinture|musée|artiste|culture|beauté|cinéma')) return 'CULTURE';
    if (check('vrai|faux|rumeur|mensonge|secret|fake|croyance|information|journaliste|complot')) return 'TRUTH';
    if (check('argent|riche|pauvre|métier|travail|acheter|vendre|prix|économie|entreprise|salaire|tourisme')) return 'MONEY';
    
    return 'SOCIETY';
  };

  const finalDisplayNews = React.useMemo(() => {
    // On force la lecture en tableau (vu les logs de 152 items)
    const rawList = Array.isArray(news) ? news : (news?.clusters || []);
    
    return rawList.filter(item => {
      const itemCat = getArticleCategory(item);
      const matchesCategory = activeCategory === 'ALL' || itemCat === activeCategory;
      
      const getString = (val) => (typeof val === 'object' ? (val[language] || val['fr'] || '') : (val || ''));
      const title = getString(item.topicTitle).toLowerCase();
      const summary = getString(item.summary).toLowerCase();
      const matchesSearch = title.includes(searchTerm.toLowerCase()) || summary.includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [news, activeCategory, searchTerm, language]);

  const handleGenerateSession = async (item = null) => {
    // Si on a un lien ou un texte custom, on force isCustom: true
    const newsToProcess = item || selectedNews || { 
      isCustom: true, 
      topicTitle: customUrl ? "Sujet personnalisé" : "Texte manuel", 
      sources: customUrl ? [{ name: "Lien fourni", url: customUrl }] : [],
      content: customContent
    }
    
    setLoading(true)
    const result = await aiGenerator.generateSession(newsToProcess, ageRange, language)
    setSession(result)
    setLoading(false)
    setStep('session')
  }

  return (
    <div className="container">
      {/* ONBOARDING TUTORIAL MODAL */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            className="tutorial-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTutorial(false)}
          >
            <motion.div 
              className="tutorial-modal glass-card"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
            >
              <button 
                className="close-modal-btn" 
                onClick={() => { setShowTutorial(false); setTutorialStep(0); }}
                aria-label="Fermer"
              >
                <X size={20} />
              </button>

              <h2>{uiText[language].tutorialTitle}</h2>
              
              <div className="tutorial-slideshow">
                <div className="tutorial-gif-placeholder">
                  <video 
                    key={tutorialStep}
                    src={`${import.meta.env.BASE_URL}${tutorialStep === 0 ? "step1" : tutorialStep === 1 ? "step2alt" : tutorialStep === 2 ? "step2" : "step3"}.mp4`} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    style={{ width: '100%', height: 'auto', display: 'block', zIndex: 10, position: 'relative' }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {tutorialStep === 0 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="tutorial-step active">
                      <div className="step-icon"><Newspaper size={24} /></div>
                      <div>
                        <h4>1. {uiText[language].tutorialStep1Title}</h4>
                        <p>{uiText[language].tutorialStep1Desc}</p>
                      </div>
                    </motion.div>
                  )}
                  {tutorialStep === 1 && (
                    <motion.div key="step2a" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="tutorial-step active">
                      <div className="step-icon"><Newspaper size={24} /></div>
                      <div>
                        <h4>2. {uiText[language].tutorialStep2Title}</h4>
                        <p>{uiText[language].tutorialStep2Desc}</p>
                      </div>
                    </motion.div>
                  )}
                  {tutorialStep === 2 && (
                    <motion.div key="step2b" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="tutorial-step active">
                      <div className="step-icon"><ExternalLink size={24} /></div>
                      <div>
                        <h4>3. {uiText[language].tutorialStep3Title}</h4>
                        <p>{uiText[language].tutorialStep3Desc}</p>
                      </div>
                    </motion.div>
                  )}
                  {tutorialStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="tutorial-step active">
                      <div className="step-icon"><MessageCircle size={24} /></div>
                      <div>
                        <h4>4. {uiText[language].tutorialStep4Title}</h4>
                        <p>{uiText[language].tutorialStep4Desc}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="tutorial-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <div className="tutorial-dots" style={{ display: 'flex', gap: '8px' }}>
                  {[0, 1, 2, 3].map(idx => (
                    <div 
                      key={idx} 
                      onClick={() => setTutorialStep(idx)}
                      style={{ 
                        width: '8px', height: '8px', borderRadius: '50%', 
                        background: tutorialStep === idx ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }} 
                    />
                  ))}
                </div>

                <div className="tutorial-controls" style={{ display: 'flex', gap: '8px' }}>
                  {tutorialStep > 0 && (
                    <button className="btn btn-outline" style={{ padding: '8px 16px' }} onClick={() => setTutorialStep(prev => prev - 1)}>
                      {uiText[language].tutorialPrevBtn}
                    </button>
                  )}
                  
                  {tutorialStep < 3 ? (
                    <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => setTutorialStep(prev => prev + 1)}>
                      {uiText[language].tutorialNextBtn} <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                    </button>
                  ) : (
                    <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => { setShowTutorial(false); setTutorialStep(0); }}>
                      {uiText[language].tutorialGotItBtn} <CheckCircle2 size={16} style={{ marginLeft: '6px' }} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING HELP TAB */}
      <AnimatePresence>
        {!showTutorial && (
          <motion.div 
            className="help-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setShowTutorial(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={uiText[language].helpTab}
          >
            <HelpCircle size={22} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div 
            key="landing" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="hero"
            onAnimationStart={() => window.scrollTo(0, 0)}
          >
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ 
                  padding: '10px 16px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.15)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>
            <div className="badge"><Sparkles size={14} /> {uiText[language].badge}</div>
            <h1>{uiText[language].title}</h1>
            <p className="subtitle">{uiText[language].subtitle}</p>
            
            <div className="landing-controls glass-card">
              <div className="control-group">
                <label>{uiText[language].countryLabel}</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                  {Object.entries(uiText[language].countries).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label>{uiText[language].ageLabel}</label>
                <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
                  {['4-5', '6-7', '8-9', '10-11', '12-13', '14-15'].map(age => (
                    <option key={age} value={age}>{age} {uiText[language].years}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="how-it-works">
              <div className="how-step">
                <div className="how-icon"><Newspaper size={22} /></div>
                <h4>{uiText[language].howStep1Title}</h4>
                <p>{uiText[language].howStep1Desc}</p>
              </div>
              <div className="how-arrow"><ArrowRight size={16} /></div>
              <div className="how-step">
                <div className="how-icon"><Sparkles size={22} /></div>
                <h4>{uiText[language].howStep2Title}</h4>
                <p>{uiText[language].howStep2Desc}</p>
              </div>
              <div className="how-arrow"><ArrowRight size={16} /></div>
              <div className="how-step">
                <div className="how-icon"><MessageCircle size={22} /></div>
                <h4>{uiText[language].howStep3Title}</h4>
                <p>{uiText[language].howStep3Desc}</p>
              </div>
            </div>

            <button className="btn btn-primary btn-large" onClick={handleStart}>
              {uiText[language].startBtn} <ArrowRight size={18} style={{ marginLeft: '10px' }} />
            </button>
          </motion.div>
        )}

        {step === 'selection' && (
          <motion.div 
            key="selection" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="selection-view"
            onAnimationStart={() => window.scrollTo(0, 0)}
          >
            
            {/* SECTION SUJET SUR MESURE */}
            <div className="custom-link-section">
              <h3><ExternalLink size={24} /> {uiText[language].customSectionTitle}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {uiText[language].customSectionDesc}
              </p>
              <div className="input-stack">
                <div className="input-group">
                  <label>{uiText[language].customUrlLabel}</label>
                  <input 
                    type="url" 
                    placeholder="https://www.letemps.ch/..." 
                    value={customUrl}
                    onChange={(e) => { 
                      setCustomUrl(e.target.value); 
                      setCustomContent(''); 
                      setSelectedNews(null);
                    }}
                  />
                </div>
                <div className="input-group">
                  <label>{uiText[language].customTextLabel}</label>
                  <textarea 
                    placeholder="Si l'article est derrière un paywall, collez le texte ici..." 
                    value={customContent}
                    onChange={(e) => { 
                      setCustomContent(e.target.value); 
                      setCustomUrl(''); 
                      setSelectedNews(null);
                    }}
                  />
                </div>
              </div>

              {/* BOUTON GÉNÉRER SPÉCIFIQUE AU SUR-MESURE */}
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-primary" 
                  disabled={(!customUrl && !customContent) || loading} 
                  onClick={() => handleGenerateSession()}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {loading && (customUrl || customContent) ? (
                    <>
                      <Loader2 size={16} className="spinner" /> 
                      {uiText[language].generating}
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      {uiText[language].generateBtn}
                    </>
                  )}
                </button>
              </div>
            </div>

            <header className="selection-header" style={{ marginTop: '4rem' }}>
              <div className="header-titles">
                <h2>{uiText[language].curationTitle}</h2>
                <p>{uiText[language].countries[country]} · {ageRange} {uiText[language].years}</p>
              </div>
              <button className="btn btn-outline" onClick={() => setStep('landing')}>{uiText[language].backBtn}</button>
            </header>

            <div className="search-container glass-card">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder={uiText[language].searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="category-filters" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['ALL', 'SPORT', 'JUSTICE', 'NATURE', 'TECH', 'IDENTITY', 'HEALTH', 'CULTURE', 'TRUTH', 'MONEY', 'SOCIETY'].map(cat => {
                const label = uiText[language][`cat${cat.charAt(0) + cat.slice(1).toLowerCase()}`] || cat;
                return (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '2rem',
                      border: activeCategory === cat ? 'none' : '1px solid var(--border-color)',
                      background: activeCategory === cat ? 'var(--primary)' : 'var(--glass)',
                      color: activeCategory === cat ? 'white' : 'var(--text-color)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: activeCategory === cat ? '600' : 'normal',
                      transition: 'all 0.2s ease',
                      boxShadow: activeCategory === cat ? '0 4px 12px rgba(236, 72, 153, 0.3)' : 'none'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="grid">
              {finalDisplayNews.map((item) => {
                  const titleObj = item.topicTitle;
                  const title = typeof titleObj === 'object' ? (titleObj[language] || titleObj['fr'] || '') : (titleObj || '');

                  const summaryObj = item.summary;
                  const summary = typeof summaryObj === 'object' ? (summaryObj[language] || summaryObj['fr'] || '') : (summaryObj || '');

                  return (
                    <div 
                      key={item.id} 
                      className={`news-card glass-card ${item.isSensitive ? 'sensitive-border' : ''}`}
                    >
                      <div className="sources-badges-container">
                        {item.isSensitive && <span className="sensitive-tag"><AlertTriangle size={12} /> Sensible</span>}
                        {item.sources?.map((s, idx) => (
                          <a 
                            key={idx} 
                            href={s.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="source-tag clickable"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={12} /> {getFlag(s.country)} {s.name}
                          </a>
                        ))}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px', fontWeight: '500' }}>
                        📅 {uiText[language].newsDate} {item.date}
                      </p>
                      
                      {/* On affiche les variables contenant le texte dans la bonne langue */}
                      <h3>{title}</h3>
                      <p>{summary}</p>
                      
                      <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="source-link"
                        >
                          {uiText[language].readOriginal}
                        </a>

                        <button 
                          className="btn btn-primary btn-small" 
                          disabled={loading && selectedNews?.id === item.id}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                          onClick={() => {
                            setSelectedNews(item);
                            handleGenerateSession(item);
                          }}
                        >
                          {loading && selectedNews?.id === item.id ? (
                            <>
                              <Loader2 size={14} className="spinner" /> 
                              {uiText[language].generating}
                            </>
                          ) : (
                            uiText[language].prepareBtn
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>


          </motion.div>
        )}

        {step === 'session' && session && (
          <motion.div 
            key="session" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="session-view glass-card"
            onAnimationStart={() => window.scrollTo(0, 0)}
          >
            
            {/* BANDEAU DE VIGILANCE PÉDAGOGIQUE */}
            {session.pedagogicalWarning && (
              <div className="pedagogical-warning-box">
                <div className="warning-header">
                  <AlertCircle size={20} />
                  <h4>{uiText[language].warningTitle}</h4>
                </div>
                <p>{session.pedagogicalWarning}</p>
              </div>
            )}

            <header className="session-header">
              <div className="meta">
                <span className="age-badge">{ageRange} {uiText[language].years}</span>
                <span>{uiText[language].sheetTitle}</span>
              </div>
              <h2>{session.title}</h2>
              <p className="intro-text-large">{session.introduction}</p>
            </header>

            <div className="session-grid">
              {/* NOUVEAU : LE CHOC DES VALEURS */}
              {session.conflictingValues && (
                <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--secondary)', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '1rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
                    <Layers size={20} />
                    Le Choc des Valeurs
                  </h3>
                  <p style={{ marginTop: '0.5rem', fontWeight: '500', color: '#fff', fontSize: '1.05rem', lineHeight: '1.6' }}>{session.conflictingValues}</p>
                </div>
              )}

              {/* 1. RÉSUMÉ DE L'INFO (La base) */}
              <section className="guide-section news-box">
                <h3><BookOpen size={20} /> {uiText[language].newsSummaryTitle}</h3>
                <p>{session.newsSummary}</p>
              </section>

              {/* 2. OUTIL MÉDIATEUR (Le détour) */}
              {session.mediatorTool && (
                <section className="guide-section mediator-box">
                  <h3>
                    <Sparkles size={20} /> {uiText[language].mediatorTitle}
                  </h3>
                  <p>{session.mediatorTool}</p>
                </section>
              )}

              {/* 3. PRÉREQUIS & CONTEXTE (Le cadre) */}
              <section className="guide-section highlight">
                <h3><Info size={18} /> {uiText[language].preReqTitle}</h3>
                
                {session.prerequisites?.context && (
                  <p style={{ marginBottom: '1.5rem' }}>{session.prerequisites.context}</p>
                )}
                
                {session.prerequisites?.vocabulary?.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.85rem', marginBottom: '10px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{uiText[language].vocabLabel}</h4>
                    <ul style={{ fontSize: '0.9rem', paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                      {session.prerequisites.vocabulary.map((v, i) => (
                        <li key={i} style={{ marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                          <strong style={{ color: '#fff' }}>{v.term}</strong> : {v.definition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <h4 style={{ fontSize: '0.85rem', color: 'var(--primary)', marginTop: '15px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{uiText[language].philoLabel}</h4>
                <p>{session.theoreticalContext}</p>
              </section>

              {/* 4. ANALYSE A PRIORI */}
              <section className="guide-section">
                <h3><Search size={18} /> {uiText[language].aPrioriTitle}</h3>
                <p>{session.aPrioriAnalysis}</p>
              </section>

              {/* 5. MISE EN PERSPECTIVE */}
              {session.sourceComparison && (
                <section className="guide-section highlight">
                  <h3>
                    <Layers size={18} /> 
                    {uiText[language].perspectiveTitle}
                  </h3>
                  <p>{session.sourceComparison}</p>
                </section>
              )}

                <section className="guide-section debate-box">
                  <h3><MessageCircle size={20} /> {uiText[language].debateTitle}</h3>
                  <div className="main-question-card">
                    <h4>{uiText[language].problematicLabel}</h4>
                    <p>"{session.mainQuestion}"</p>
                  </div>
                  <div className="discussion-guide">
                    {session.discussionGuide?.map((item, i) => (
                      <div key={i} className="guide-item">
                        <p><strong>{i + 1}. {item.question}</strong></p>
                        <p className="q-purpose">🎯 {uiText[language].objectiveLabel} {item.purpose}</p>
                      </div>
                    ))}
                  </div>
                </section>
                
                {/* NOUVEAU : ANTICIPATION DES ÉLÈVES (Bouées de sauvetage) */}
                {session.studentAnticipation && session.studentAnticipation.length > 0 && (
                  <section className="guide-section" style={{ background: 'rgba(236, 72, 153, 0.05)', borderColor: 'rgba(236, 72, 153, 0.2)', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--secondary)' }}>
                      <AlertTriangle size={20} /> Anticipation & Bouées de sauvetage
                    </h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                      Comment rebondir philosophiquement si un élève réagit de manière abrupte :
                    </p>
                    <div className="anticipation-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {session.studentAnticipation.map((anticipation, i) => (
                        <div key={i} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', borderLeft: '3px solid var(--secondary)' }}>
                          <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#fca5a5' }}>Si un élève dit :</strong> "{anticipation.probableReaction}"
                          </p>
                          <p style={{ fontSize: '0.95rem' }}>
                            <strong style={{ color: '#86efac' }}>Relancez avec :</strong> "{anticipation.teacherRebound}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {session.conclusion && (
                  <section className="guide-section conclusion-box" style={{ marginTop: '20px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Flag size={20} /> {uiText[language].conclusionTitle}</h3>
                    <p>{session.conclusion}</p>
                  </section>
                )}

                {/* NOUVEAU : LES SOURCES DE LA LEÇON */}
                {session.sources && session.sources.length > 0 && (
                  <section className="guide-section sources-box">
                    <h3>{uiText[language].sourcesCitedTitle}</h3>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                      {session.sources.map((src, idx) => (
                        <li key={idx} style={{ marginBottom: '8px' }}>
                          <a 
                            href={src.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ color: '#0ea5e9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}
                          >
                            <ExternalLink size={14} /> {src.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

            <footer className="session-footer">
              <button className="btn btn-outline" onClick={() => { setStep('selection'); setCustomContent(''); setCustomUrl(''); }}>{uiText[language].backToNewsBtn}</button>
              <button className="btn btn-primary" onClick={() => window.print()}>{uiText[language].printBtn}</button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App