import React, { useState, useEffect } from 'react'
import './App.css'
import { newsService } from './services/newsService'
import { aiGenerator } from './services/aiGenerator'
import { 
  GraduationCap, Newspaper, ArrowRight, CheckCircle2, 
  AlertCircle, HelpCircle, Loader2, Sparkles, 
  BookOpen, RefreshCcw, ExternalLink, Search, Layers, 
  MessageCircle, Info, Flag, AlertTriangle
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
      backBtn: "Modifier les réglages",
      searchPlaceholder: "Filtrer par mot-clé (ex: Climat, Espace, Justice...)",
      prepareBtn: "Préparer la séance",
      generateBtn: "Générer la séance",
      generating: "Génération en cours...",
      customSectionTitle: "Créer une séance sur mesure",
      customSectionDesc: "Vous avez trouvé un article intéressant ? Collez son lien ou son texte ci-dessous. L'IA analysera votre texte et ira chercher d'autres sources pour créer une mise en perspective.",
      customUrlLabel: "Lien vers votre article",
      customTextLabel: "Ou collez le texte brut"
    },
    en: { 
      badge: "Pedagogical Artificial Intelligence",
      title: "Ethical Debates & Philosophy for Kids", 
      subtitle: "Transform global news into learning opportunities, without taboos, using the right method.",
      countryLabel: "Your Country",
      ageLabel: "Students' Age",
      startBtn: "See news",
      curationTitle: "Today's Curation",
      curationSub: "Topics to discuss with",
      backBtn: "Change settings",
      searchPlaceholder: "Filter by keyword (e.g., Climate, Space, Justice...)",
      prepareBtn: "Prepare Session",
      generateBtn: "Generate Session",
      generating: "Generating...",
      customSectionTitle: "Create custom session",
      customSectionDesc: "Found an interesting article? Paste its link or text below. AI will analyze your text and search for other sources to provide perspective.",
      customUrlLabel: "Link to your article",
      customTextLabel: "Or paste raw text"
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
      customTextLabel: "Oder Rohtext einfügen"
    }
  };

  useEffect(() => {
    if (step === 'selection') {
      const fetchNews = async () => {
        setLoading(true)
        const data = await newsService.getLatestNews(country)
        setNews(data)
        setLoading(false)
      }
      fetchNews()
    }
  }, [step, country])

  const handleStart = () => setStep('selection')

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
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="hero">
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
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
                  <option value="GLOBAL">🌐 Global / International</option>
                  <option value="FRANCE">🇫🇷 France</option>
                  <option value="SWITZERLAND">🇨🇭 Suisse</option>
                  <option value="GERMANY">🇩🇪 Allemagne</option>
                  <option value="USA">🇺🇸 États-Unis</option>
                </select>
              </div>
              <div className="control-group">
                <label>{uiText[language].ageLabel}</label>
                <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
                  {['4-5', '6-7', '8-9', '10-11', '12-13', '14-15'].map(age => (
                    <option key={age} value={age}>{age} ans</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn btn-primary btn-large" onClick={handleStart}>
              {uiText[language].startBtn} <ArrowRight size={18} style={{ marginLeft: '10px' }} />
            </button>
          </motion.div>
        )}

        {step === 'selection' && (
          <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="selection-view">
            
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
            </div>

            <header className="selection-header" style={{ marginTop: '4rem' }}>
              <div className="header-titles">
                <h2>{uiText[language].curationTitle}</h2>
                <p>{uiText[language].curationSub} {ageRange} ans</p>
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

            <div className="grid">
              {news
                .filter(item => 
                  item.topicTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  item.summary.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                <div 
                  key={item.id} 
                  className={`news-card glass-card ${selectedNews?.id === item.id ? 'active' : ''} ${item.isSensitive ? 'sensitive-border' : ''}`}
                  onClick={() => {
                    setSelectedNews(item);
                    setCustomUrl('');
                    setCustomContent('');
                  }}
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
                    📅 Actu du {item.date}
                  </p>
                  <h3>{item.topicTitle}</h3>
                  <p>{item.summary}</p>
                  
                  <div className="card-footer" onClick={(e) => e.stopPropagation()}>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="source-link"
                    >
                      Lire l'article original ↗
                    </a>

                    <button className="btn btn-primary btn-small" onClick={() => {
                      setSelectedNews(item);
                      handleGenerateSession(item);
                    }}>
                      {uiText[language].prepareBtn}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <footer className="selection-footer sticky-footer">
              <button 
                className="btn btn-primary" 
                disabled={(!selectedNews && !customUrl && !customContent) || loading} 
                onClick={() => handleGenerateSession()}
              >
                {loading ? <Loader2 className="spinner" /> : uiText[language].generateBtn}
              </button>
            </footer>
          </motion.div>
        )}

        {step === 'session' && session && (
          <motion.div key="session" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="session-view glass-card">
            
            {/* BANDEAU DE VIGILANCE PÉDAGOGIQUE */}
            {session.pedagogicalWarning && (
              <div className="pedagogical-warning-box">
                <div className="warning-header">
                  <AlertCircle size={20} />
                  <h4>Conseils pour aborder ce sujet sensible</h4>
                </div>
                <p>{session.pedagogicalWarning}</p>
              </div>
            )}

            <header className="session-header">
              <div className="meta">
                <span className="age-badge">{ageRange} ans</span>
                <span>Fiche de préparation détaillée</span>
              </div>
              <h2>{session.title}</h2>
              <p className="intro-text-large">{session.introduction}</p>
            </header>

            <div className="session-grid">
              <div className="session-sidebar">
                
                {/* PRÉREQUIS & CONTEXTE */}
                <section className="guide-section highlight">
                  <h3><Info size={18} /> Prérequis & Contexte</h3>
                  
                  {session.prerequisites?.context && (
                    <p style={{ marginBottom: '15px' }}>{session.prerequisites.context}</p>
                  )}
                  
                  {session.prerequisites?.vocabulary?.length > 0 && (
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--primary)' }}>Vocabulaire à maîtriser :</h4>
                      <ul style={{ fontSize: '0.9rem', paddingLeft: '15px', margin: 0 }}>
                        {session.prerequisites.vocabulary.map((v, i) => (
                          <li key={i} style={{ marginBottom: '5px' }}>
                            <strong>{v.term}</strong> : {v.definition}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginTop: '15px' }}>Notions philosophiques :</h4>
                  <p>{session.theoreticalContext}</p>
                </section>

                <section className="guide-section">
                  <h3><Search size={18} /> Analyse à Priori</h3>
                  <p>{session.aPrioriAnalysis}</p>
                </section>
              </div>

              <div className="session-main">
                
                {/* OUTIL MÉDIATEUR */}
                {session.mediatorTool && (
                  <section className="guide-section" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, marginBottom: '10px' }}>
                      <Sparkles size={20} /> Le Détour Pédagogique
                    </h3>
                    <p style={{ color: '#15803d', margin: 0 }}>{session.mediatorTool}</p>
                  </section>
                )}

                <section className="guide-section news-box">
                  <h3><BookOpen size={20} /> Résumé détaillé de l'info</h3>
                  <p>{session.newsSummary}</p>
                </section>

                {/* NOUVEAU : COMPARAISON DES SOURCES */}
                {session.sourceComparison && (
                  <section className="guide-section" style={{ backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                    <h3 style={{ color: 'var(--primary)', margin: 0, marginBottom: '10px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={18} /> 
                      Mise en perspective des sources
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{session.sourceComparison}</p>
                  </section>
                )}

                <section className="guide-section debate-box">
                  <h3><MessageCircle size={20} /> Déroulé du Débat</h3>
                  <div className="main-question-card">
                    <h4>Problématique :</h4>
                    <p>"{session.mainQuestion}"</p>
                  </div>
                  <div className="discussion-guide">
                    {session.discussionGuide?.map((item, i) => (
                      <div key={i} className="guide-item">
                        <p><strong>{i + 1}. {item.question}</strong></p>
                        <p className="q-purpose">🎯 Objectif : {item.purpose}</p>
                      </div>
                    ))}
                  </div>
                </section>
                
                {session.conclusion && (
                  <section className="guide-section conclusion-box" style={{ marginTop: '20px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Flag size={20} /> Synthèse & Conclusion</h3>
                    <p>{session.conclusion}</p>
                  </section>
                )}

                {/* NOUVEAU : LES SOURCES DE LA LEÇON */}
                {session.sources && session.sources.length > 0 && (
                  <section className="guide-section sources-box" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1rem', color: '#64748b', margin: '0 0 10px 0' }}>Sources utilisées pour cette fiche :</h3>
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
            </div>

            <footer className="session-footer">
              <button className="btn btn-outline" onClick={() => { setStep('selection'); setCustomContent(''); setCustomUrl(''); }}>Autre sujet</button>
              <button className="btn btn-primary" onClick={() => window.print()}>Imprimer</button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App