module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Récupérer l'ID du deal
    const dealId = where.id;

    // Vérifier si un nouveau commentaire/modification est envoyé dans 'historique_modification'
    const newModification = data.historique_modification;

    if (newModification) {
      // Récupérer l'historique actuel
      const existingDeal = await strapi.entityService.findOne(
        "api::tip.tip",
        dealId,
      );

      const currentHistorique = existingDeal.historique_modification || "";

      // Fonction utilitaire pour normaliser les chaînes (gérer les sauts de ligne \r\n vs \n et les espaces)
      const normalize = (str) => (str || "").replace(/\r\n/g, "\n").trim();

      const normNew = normalize(newModification);
      const normCurrent = normalize(currentHistorique);

      // FIX ROBUSTE : On compare les versions normalisées.
      // Si la nouvelle modification contient déjà l'historique (au caractère près, sans compter les espaces/sauts de ligne invisibles),
      // alors c'est que Strapi a renvoyé tout le contenu (cas du Save Admin).
      if (currentHistorique && normNew.includes(normCurrent)) {
        // On ne fait rien, pour éviter de dupliquer.
        // On s'assure juste que data.historique_modification est bien défini (normalement oui).
      } else {
        // Sinon, c'est un vrai ajout (ou l'historique était vide).
        const updatedHistorique = currentHistorique
          ? `${newModification}\n${currentHistorique}`
          : newModification;

        data.historique_modification = updatedHistorique;
      }
    }
  },
};
