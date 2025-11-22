module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Récupérer l'ID du deal
    const dealId = where.id;

    // Vérifier si un nouveau commentaire/modification est envoyé dans 'historique_modification'
    const newModification = data.historique_modification;

    if (newModification) {
      // Récupérer le contexte de la requête pour savoir d'où vient la modification
      const ctx = strapi.requestContext.get();
      
      // Vérifier si l'utilisateur est un administrateur (Admin Panel)
      const isAdmin = ctx?.state?.auth?.strategy?.name === 'admin';

      if (isAdmin) {
        // Si c'est l'Admin Panel, on fait confiance à ce qui est envoyé.
        // L'admin voit déjà tout l'historique dans le champ, donc s'il sauvegarde,
        // c'est qu'il envoie la version finale désirée. On ne concatène PAS.
        // data.historique_modification est déjà correct.
      } else {
        // Si c'est l'API (Client / Site Web), on suppose qu'on envoie seulement la nouvelle note.
        // Donc on concatène avec l'existant.
        
        const existingDeal = await strapi.entityService.findOne(
            "api::tip.tip",
            dealId,
        );
        const currentHistorique = existingDeal.historique_modification || "";
        
        // On évite quand même les doublons exacts si le client renvoie tout par erreur,
        // mais la logique principale est l'ajout.
        if (!newModification.includes(currentHistorique)) {
             const updatedHistorique = currentHistorique
              ? `${newModification}\n${currentHistorique}`
              : newModification;

            data.historique_modification = updatedHistorique;
        }
      }
    }
  },
};
