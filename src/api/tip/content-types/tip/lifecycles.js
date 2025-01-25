module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Récupérer l'ID de l'entrée actuelle
    const dealId = where.id;

    // Vérifier si un nouveau commentaire/modification est envoyé dans 'historique_modification'
    const newModification = data.historique_modification;

    if (newModification) {
      // Récupérer l'entrée actuelle pour obtenir l'historique existant
      const existingDeal = await strapi.entityService.findOne(
        "api::tip.tip", // Remplacez "tip" par le nom correct de votre collection
        dealId,
      );

      const currentHistorique = existingDeal.historique_modification || "";

      // Vérifier si la nouvelle modification existe déjà dans l'historique
      const isDuplicate = currentHistorique
        .split("\n")
        .map((line) => line.trim()) // Supprimer les espaces inutiles pour une comparaison propre
        .includes(newModification.trim());

      if (!isDuplicate) {
        // Ajouter la nouvelle modification au début de l'historique
        const updatedHistorique = currentHistorique
          ? `${newModification}\n${currentHistorique}`
          : newModification;

        // Mettre à jour l'historique cumulé dans l'objet data
        data.historique_modification = updatedHistorique;
      } else {
        // Si la modification est déjà présente, ne pas la dupliquer
        data.historique_modification = currentHistorique;
      }
    }
  },
};
