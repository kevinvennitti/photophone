module.exports = {
  site: {
    baseURL         : 'http://127.0.0.1:3000',
    port            : 3000
  },
  
  //////////////////////////////////////////////////////////
  // 
  //  Configuration du téléphone en dessous
  
  phone: {
    delayBetweenCalls        : 210,   // Temps entre chaque appel automatique du téléphone (en secondes)
                                      // -- minimum : 20 secondes 
    
    delayBeforePictures: [            // Pour chaque photo prise ci-dessous,
                                      // il est déconseillé de prendre deux photos à la suite
                                      // avec moins de 5 secondes d'intervalle.
                                      
                                      // Il est recommandé de laisser au moins 10 secondes
                                      // entre chaque photo.
                                      
      0,                              // Temps avant la pré-photo       (en secondes)
      5,                              // Temps avant la pré-photo       (en secondes)
      10,                             // Temps avant la photo           (en secondes)
      15                              // Temps avant la post-photo      (en secondes)
    ]
  }
}