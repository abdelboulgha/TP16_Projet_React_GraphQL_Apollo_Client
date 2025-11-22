import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TRANSACTION } from '../graphql/mutations';
import { GET_ALL_COMPTES, GET_ALL_TRANSACTIONS } from '../graphql/queries';

const TransactionForm = () => {
  const [compteId, setCompteId] = useState('');
  const [type, setType] = useState('DEPOT');
  const [montant, setMontant] = useState('');
  const [message, setMessage] = useState('');

  const { data: comptesData, loading: comptesLoading } = useQuery(GET_ALL_COMPTES);

  const [addTransaction, { loading }] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [
      { query: GET_ALL_COMPTES },
      { query: GET_ALL_TRANSACTIONS }
    ],
    onCompleted: () => {
      setMessage('Transaction ajoutée avec succès!');
      setMontant('');
      setCompteId('');
      setType('DEPOT');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      setMessage(`Erreur: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!compteId) {
      setMessage('Veuillez sélectionner un compte');
      return;
    }

    if (!montant || parseFloat(montant) <= 0) {
      setMessage('Veuillez entrer un montant valide');
      return;
    }

    try {
      // CORRECTION: Changé transactionRequest en transaction
      await addTransaction({
        variables: {
          transaction: {
            type,
            montant: parseFloat(montant),
            compteId: parseInt(compteId),
          },
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction :', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ajouter une Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compte
          </label>
          {comptesLoading ? (
            <p className="text-gray-500">Chargement des comptes...</p>
          ) : (
            <select
              value={compteId}
              onChange={(e) => setCompteId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionnez un compte</option>
              {comptesData && comptesData.allComptes && comptesData.allComptes.map((compte) => (
                <option key={compte.id} value={compte.id}>
                  {compte.type} - Solde: {compte.solde.toFixed(2)}€ (ID: {compte.id})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de transaction
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="DEPOT">Dépôt</option>
            <option value="RETRAIT">Retrait</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant (€)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
            placeholder="Entrez le montant"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('Erreur') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !compteId}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Ajout...' : 'Ajouter la transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;