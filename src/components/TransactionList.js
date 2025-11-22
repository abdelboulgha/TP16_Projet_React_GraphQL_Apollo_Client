import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_TRANSACTIONS } from "../graphql/queries";

const TransactionList = () => {
  const { loading, error, data } = useQuery(GET_ALL_TRANSACTIONS);

  if (loading) return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-600">Chargement...</p>
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-red-600">Erreur : {error.message}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Historique des Transactions</h2>
      {data && data.allTransactions && data.allTransactions.length > 0 ? (
        <div className="space-y-3">
          {data.allTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500">ID: <span className="font-mono text-gray-700">{transaction.id}</span></p>
                  <p className="text-sm text-gray-500">
                    Compte: <span className="font-mono text-gray-700">{transaction.compte?.id}</span> 
                    ({transaction.compte?.type})
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  transaction.type === 'DEPOT' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-xl font-bold ${
                  transaction.type === 'DEPOT' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'DEPOT' ? '+' : '-'}{transaction.montant.toFixed(2)}€
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(transaction.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {transaction.compte && (
                <p className="text-xs text-gray-500 mt-2">
                  Solde du compte après: {transaction.compte.solde.toFixed(2)}€
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Aucune transaction trouvée</p>
      )}
    </div>
  );
};

export default TransactionList;