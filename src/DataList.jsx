// src/DataList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DataList = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  return (
    <div className="data-list">
      <ul>
        {data.map((pokemon) => (
          <li key={pokemon.id} className="data-item">
            <Link to={`/pokemon/${pokemon.id}`} className="data-link">
              <h3 className="pokemon-name">{pokemon.name}</h3>
              <div className="data-info">
                <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
                <span className="pokemon-types">{pokemon.types.join(', ')}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataList;
