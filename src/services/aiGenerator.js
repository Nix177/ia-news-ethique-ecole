const AGE_CONFIGS = {
  '4-5': { focus: 'émotions et entraide', questions: 2 },
  '6-7': { focus: 'règles et vie collective', questions: 3 },
  '8-9': { focus: 'justice et équité', questions: 4 },
  '10-11': { focus: 'responsabilité et intention', questions: 5 },
  '12-13': { focus: 'valeurs et dilemmes éthiques', questions: 6 },
  '14-15': { focus: 'esprit critique et enjeux mondiaux', questions: 7 }
};

export const aiGenerator = {
  async generateSession(newsCluster, ageRange, language = 'fr') {
    const N8N_WEBHOOK_URL = 'https://n8n.srv893937.hstgr.cloud/webhook/generate-lesson';

    const titleString = typeof newsCluster.topicTitle === 'object'
      ? (newsCluster.topicTitle[language] || newsCluster.topicTitle['fr'] || 'Sujet')
      : (newsCluster.topicTitle || 'Sujet');

    const summaryString = typeof newsCluster.summary === 'object'
      ? (newsCluster.summary[language] || newsCluster.summary['fr'] || '')
      : (newsCluster.summary || '');

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: titleString,
          // CORRECTION : On envoie la catégorie pour le routage de l'IA
          category: newsCluster.category || "SOCIETY", 
          sources: newsCluster.sources || [],
          summary: summaryString,
          customArticleText: newsCluster.content || "",
          ageRange: ageRange,
          isCustom: newsCluster.isCustom || false,
          language: language
        })
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Erreur réseau");
      }
    } catch (error) {
      console.warn("Mode secours activé pour :", titleString);
      return this._getMockSession(newsCluster, ageRange, titleString, summaryString);
    }
  },

  _getMockSession(cluster, ageRange, titleString, summaryString) {
    const config = AGE_CONFIGS[ageRange] || AGE_CONFIGS['8-9'];
    const isSensitive = titleString.toLowerCase().match(/guerre|conflit|mort|accident|justice|prison/);

    return {
      title: titleString || "Analyse de l'info",
      introduction: `Séance philo adaptée pour les ${ageRange} ans.`,
      pedagogicalWarning: isSensitive
        ? "Ce sujet touche à des thèmes complexes. Angle conseillé : privilégier la compréhension des causes et les solutions collectives plutôt que les détails factuels anxiogènes."
        : null,
      theoreticalContext: `Nous aborderons les notions de faits vs opinions et le concept de ${config.focus}.`,
      newsSummary: summaryString || "L'actualité traitée sous un angle accessible.",
      mainQuestion: `En quoi cet événement nous parle-t-il de ${config.focus} ?`,
      discussionGuide: [
        { question: "Qu'avez-vous ressenti en écoutant cette information ?", purpose: "Libérer la parole émotionnelle." },
        { question: "Si vous étiez à leur place, quelle règle appliqueriez-vous ?", purpose: "Développer l'empathie et le sens de la loi." }
      ],
      conclusion: "Une séance pour comprendre que l'actualité est un terrain de réflexion permanente."
    };
  }
};
