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

      // Concaténer la nouvelle modification avec l'historique existant
      const updatedHistorique = currentHistorique
        ? `${currentHistorique}\n${newModification}`
        : newModification;

      // Mettre à jour l'historique cumulé dans l'objet data (avant que Strapi ne l'enregistre dans la base)
      data.historique_modification = updatedHistorique;
    }
  },
};
