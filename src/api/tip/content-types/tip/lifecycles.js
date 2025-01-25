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

      // Concaténer la nouvelle modification AVANT l'historique existant
      const updatedHistorique = currentHistorique
        ? `${newModification}\n${currentHistorique}` // Nouvelle modification en haut
        : newModification;

      // Mettre à jour l'historique cumulé dans l'objet data
      data.historique_modification = updatedHistorique;
    }
  },
};
