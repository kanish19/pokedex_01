import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

function PokemonList() {
  const { darkMode, setDarkMode, legendaryOnly, setLegendaryOnly } =
    useContext(ThemeContext);

  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=80")
      .then((res) => res.json())
      .then(async (data) => {
        const detailed = await Promise.all(
          data.results.map(async (p) => {
            const pokeData = await fetch(p.url).then((res) => res.json());
            const speciesData = await fetch(pokeData.species.url).then((res) =>
              res.json()
            );

            return {
              ...pokeData,
              isLegendary: speciesData.is_legendary,
            };
          })
        );

        setPokemon(detailed);
        setFilteredPokemon(detailed);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let updated = pokemon;

    if (search) {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      updated = updated.filter((p) =>
        p.types.some((t) => t.type.name === typeFilter)
      );
    }

    if (legendaryOnly) {
      updated = updated.filter((p) => p.isLegendary);
    }

    setFilteredPokemon(updated);
  }, [search, typeFilter, legendaryOnly, pokemon]);

  if (loading)
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: darkMode
          ? "linear-gradient(135deg, #232526, #414345)"
          : "linear-gradient(135deg, #d4fc79, #96e6a1)",
        color: darkMode ? "white" : "black",
        transition: "0.4s",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        🌿 Pokedex
      </h1>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
          }}
        >
          <option value="all">All Types</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
          <option value="electric">Electric</option>
          <option value="psychic">Psychic</option>
          <option value="dragon">Dragon</option>
        </select>

        <button
          onClick={() => setLegendaryOnly(!legendaryOnly)}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: legendaryOnly ? "gold" : "#ccc",
          }}
        >
          ⭐ Legendary Only
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: darkMode ? "#111" : "#eee",
            color: darkMode ? "white" : "black",
          }}
        >
          🌙 Toggle Dark Mode
        </button>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredPokemon.map((poke) => (
          <Link
            key={poke.id}
            to={`/pokemon/${poke.name}`}
            style={{
              textDecoration: "none",
              color: darkMode ? "white" : "black",
            }}
          >
            <div
              style={{
                background: darkMode ? "#2c2c2c" : "white",
                padding: "20px",
                borderRadius: "15px",
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={poke.sprites.front_default}
                alt={poke.name}
                style={{ width: "100px" }}
              />
              <h3 style={{ textTransform: "capitalize" }}>
                {poke.name}
              </h3>

              {poke.isLegendary && (
                <p style={{ color: "gold", fontWeight: "bold" }}>
                  ⭐ Legendary
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PokemonList;