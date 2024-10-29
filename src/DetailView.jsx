// src/DetailView.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { capitalize } from './utils';

const DetailView = () => {
  const { id } = useParams();
  const [pokemonDetails, setPokemonDetails] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setPokemonDetails(data);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
      }
    };
    fetchPokemon();
  }, [id]);

  if (!pokemonDetails) return <p>Loading...</p>;

  return (
    <div className="detail-view">
      <h2>{capitalize(pokemonDetails?.name)} (#{pokemonDetails?.id})</h2>
      <p>Height: {pokemonDetails?.height}</p>
      <p>Weight: {pokemonDetails?.weight}</p>
      <p>Types: {pokemonDetails?.types.map(type => capitalize(type.type.name)).join(', ')}</p>
      <p>Abilities: {pokemonDetails?.abilities.map(ability => capitalize(ability.ability.name)).join(', ')}</p>
    </div>
  );
};

export default DetailView;
