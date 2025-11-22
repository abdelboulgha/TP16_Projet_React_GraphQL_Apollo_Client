// Interface pour un compte
export const Compte = {
    id: '',
    solde: 0,
    dateCreation: '',
    type: '',
  };
  
  // Interface pour une transaction
  export const Transaction = {
    id: '',
    type: '',
    montant: 0,
    date: '',
    compte: {},
  };
  
  // Interface pour les statistiques de solde
  export const SoldeStats = {
    count: 0,
    sum: 0,
    average: 0,
  };
  
  // Interface pour les statistiques de transaction
  export const TransactionStats = {
    count: 0,
    sumDepots: 0,
    sumRetraits: 0,
  };
  
  // Interface pour les demandes de création de compte
  export const CompteRequest = {
    solde: 0,
    type: '',
  };
  
  // Interface pour les demandes de création de transaction
  export const TransactionRequest = {
    type: '',
    montant: 0,
    compteId: '',
  };