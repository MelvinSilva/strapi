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

      // FIX: Vérifier si la nouvelle modification contient DÉJÀ l'historique actuel.
      // Cela arrive quand on sauvegarde depuis le panel Admin : Strapi renvoie tout le contenu.
      // Si c'est le cas, on ne fait rien (on garde newModification tel quel).
      if (currentHistorique && newModification.includes(currentHistorique)) {
        // Rien à faire, newModification est déjà complet
      } else {
        // Sinon, c'est une vraie nouvelle note (ou un delta), on concatène.
        const updatedHistorique = currentHistorique
          ? `${newModification}\n${currentHistorique}` // Nouvelle modification en haut
          : newModification;

        // Mettre à jour l'historique cumulé dans l'objet data
        data.historique_modification = updatedHistorique;
      }
    }
  },
};
