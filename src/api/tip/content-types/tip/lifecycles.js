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

      // Vérifier si la nouvelle modification existe déjà dans l'historique
      const isDuplicate = currentHistorique
        .split("\n")
        .some((entry) => entry.trim() === newModification.trim());

      if (!isDuplicate) {
        // Ajouter la nouvelle modification en haut
        const updatedHistorique = currentHistorique
          ? `${newModification}\n${currentHistorique}`
          : newModification;

        // Mettre à jour l'historique cumulé dans l'objet data
        data.historique_modification = updatedHistorique;
      } else {
        // Pas de modification si déjà présent
        data.historique_modification = currentHistorique;
      }
    }
  },
};
