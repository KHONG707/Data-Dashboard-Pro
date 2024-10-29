// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import DataList from './DataList';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './App.css';
import { capitalize } from './utils'; 

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [typeData, setTypeData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
        const result = await response.json();

        const detailedData = await Promise.all(
          result.results.map(async (pokemon) => {
            const pokemonDetails = await fetch(pokemon.url).then((res) => res.json());
            return {
              name: capitalize(pokemonDetails.name),
              id: pokemonDetails.id,
              types: pokemonDetails.types.map((t) => capitalize(t.type.name)),
            };
          })
        );

        
      setData(detailedData);
      setFilteredData(detailedData);

      // Initialize type counts based on dropdown options
      const dropdownTypes = document.querySelectorAll('.filter-select option');
      const typeCounts = Array.from(dropdownTypes).reduce((acc, option) => {
        if (option.value) acc[capitalize(option.value)] = 0; // Set each type to 0 count initially
        return acc;
      }, {});

      // Update counts based on Pokémon data
      detailedData.forEach(pokemon => {
        pokemon.types.forEach(type => {
          if (typeCounts[type] !== undefined) {
            typeCounts[type] += 1;
          }
        });
      });



      setTypeData(Object.entries(typeCounts).map(([type, count]) => ({ type, count })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter based on search term and selected type
  useEffect(() => {
    const filtered = data.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === '' || pokemon.types.includes(capitalize(filterType)))
    );
    setFilteredData(filtered);
  }, [searchTerm, filterType, data]);

  return (
    <div className="app">
      <h1>Pokémon Dashboard</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select onChange={(e) => setFilterType(e.target.value)} className="filter-select" value={filterType}>
          <option value="">All Types</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
          <option value="electric">Electric</option>
          <option value="ice">Ice</option>
          <option value="fighting">Fighting</option>
          <option value="poison">Poison</option>
          <option value="ground">Ground</option>
          <option value="flying">Flying</option>
          <option value="psychic">Psychic</option>
          <option value="bug">Bug</option>
          <option value="rock">Rock</option>
          <option value="ghost">Ghost</option>
          <option value="dark">Dark</option>
          <option value="dragon">Dragon</option>
          <option value="steel">Steel</option>
          <option value="fairy">Fairy</option>
        </select>

      </div>
      <div className="summary">
        <p>Total Pokémon: {data.length}</p>
        <p>Filtered Pokémon: {filteredData.length}</p>
      </div>

      {/* Chart to display Pokémon count by type */}
      <div className="chart">
        <h2>Pokémon Count by Type</h2>
        <BarChart width={Math.min(1200, window.innerWidth * 0.9)} height={300} data={typeData} barSize={20} >
          <XAxis dataKey="type" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" dy={10} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>



      </div>


      {loading ? <p>Loading...</p> : <DataList data={filteredData} />}
    </div>
  );
};

export default Dashboard;
