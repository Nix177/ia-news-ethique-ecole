/**
 * newsService.js
 * Service hybride : Tente de récupérer les vraies actualités du jour via n8n.
 * Si n8n est indisponible, utilise les données de secours (Mock).
 */

const INITIAL_NEWS = [
  {
    id: 'cluster-1',
    topicTitle: "Régulation de l'Intelligence Artificielle : Frein ou Sécurité ?",
    date: '2026-03-10',
    summary: "L'Europe adopte de nouvelles règles strictes sur l'IA, suscitant des réactions variées à travers le monde et posant des questions sur la liberté d'innover.",
    category: 'Technology / Ethics',
    countries: ['GLOBAL', 'FRANCE', 'SWITZERLAND', 'GERMANY'],
    recommendedAges: ['12-13', '14-15'],
    link: "https://example.com/fr-ai", // Default link
    sources: [
      { name: "Le Temps", country: "SWITZERLAND", url: "https://example.com/ch-ai" },
      { name: "Le Monde", country: "FRANCE", url: "https://example.com/fr-ai" },
      { name: "BBC News", country: "GLOBAL", url: "https://example.com/bbc-ai" }
    ]
  },
  {
    id: 'cluster-2',
    topicTitle: "Le droit à la déconnexion : Faut-il interdire les écrans le soir ?",
    date: '2026-03-09',
    summary: "Face à l'anxiété numérique, plusieurs pays débattent de lois pour limiter l'accès aux réseaux sociaux et aux emails en dehors des heures définies.",
    category: 'Society',
    countries: ['GLOBAL', 'FRANCE', 'USA'],
    recommendedAges: ['10-11', '12-13', '14-15'],
    link: "https://example.com/fr-deconnexion", // Default link
    sources: [
      { name: "France Info", country: "FRANCE", url: "https://example.com/fr-deconnexion" },
      { name: "NPR", country: "USA", url: "https://example.com/us-screens" }
    ]
  },
  {
    id: 'cluster-test-reel',
    topicTitle: "TEST RÉEL : Les réseaux sociaux à l'école",
    date: "Aujourd'hui",
    summary: "Débat sur l'interdiction des téléphones et des réseaux sociaux dans les établissements scolaires.",
    category: 'Society / Education',
    countries: ['GLOBAL', 'FRANCE', 'SWITZERLAND', 'GERMANY', 'USA'],
    recommendedAges: ['4-5', '6-7', '8-9', '10-11', '12-13', '14-15'],
    link: "https://www.francetvinfo.fr/societe/education/education-l-interdiction-du-telephone-portable-au-college-pourrait-etre-generalisee_6745196.html",
    sources: [
      { name: "France Info", country: "FRANCE", url: "https://www.francetvinfo.fr/societe/education/education-l-interdiction-du-telephone-portable-au-college-pourrait-etre-generalisee_6745196.html" },
      { name: "RTS Info", country: "SWITZERLAND", url: "https://www.rts.ch/info/suisse/14234053-vers-une-interdiction-des-smartphones-dans-les-ecoles-suisses.html" }
    ]
  }
];

export const newsService = {
  async getLatestNews(country = 'GLOBAL', ageRange = '8-9') {
    try {
      // 1. On tente d'appeler le nouveau Workflow A de n8n (Les actus en direct)
      console.log("Tentative de récupération des actus en direct...");
      // N'oublie pas les backticks ( ` ) autour de l'URL pour pouvoir injecter la variable !
      const response = await fetch(`https://n8n.srv893937.hstgr.cloud/webhook/get-daily-news?ageRange=${ageRange}`);      
      
      if (!response.ok) {
        throw new Error("Le serveur n8n n'a pas répondu correctement.");
      }
      
      let data = await response.json();
      
      // Nettoyage de la structure JSON si n8n la renvoie encapsulée
      if (!Array.isArray(data)) {
        const firstKey = Object.keys(data)[0];
        data = data[firstKey] || [];
      }

      // Assurer que chaque item a un champ 'link' à partir de 'url' si nécessaire
      data = data.map(item => ({
        ...item,
        link: item.link || item.url || (item.sources && item.sources[0]?.url) || '#'
      }));

      if (data.length === 0) throw new Error("n8n a renvoyé un tableau vide.");

      // Filtrage dynamique sécurisé (uniquement sur le pays, l'âge est géré par l'IA via n8n)
      const filtered = data.filter(n => {
        // Sécurité : si l'IA oublie le champ countries, on le considère comme GLOBAL
        const itemCountries = n.countries || ['GLOBAL'];
        return itemCountries.includes(country) || itemCountries.includes('GLOBAL');
      });

      console.log("Succès : Actus en direct chargées !");
      return filtered.length > 0 ? filtered : data;

    } catch (error) {
      // 2. PLAN DE SECOURS : Si n8n échoue, on affiche les fausses données
      console.warn("Échec du direct, utilisation des données de secours :", error.message);
      
      const filteredMock = INITIAL_NEWS.filter(n => 
        (n.countries.includes(country) || n.countries.includes('GLOBAL')) &&
        n.recommendedAges.includes(ageRange)
      );
      
      return filteredMock.length > 0 ? filteredMock : INITIAL_NEWS;
    }
  }
};
