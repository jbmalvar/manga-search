import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [mangaList, setMangaList] = useState([]);
  const [highestRated, setHighestRated] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const[searchInput, setSearchInput] = useState("");
  const[averageScore, setAverageScore] = useState(0);
  
  useEffect(() => {
    const fetchMangaData = async () => {
      const response = await fetch(
        "https://api.jikan.moe/v4/manga"
      );
      const json = await response.json();
      setMangaList(json.data);
    };

    fetchMangaData().catch(console.error);
  }
  , []);

  useEffect(() => {
    highestRatedManga();
    averageScoreManga();
    numberCompleted();
  }, [filteredResults, mangaList]);

  const searchItems = searchValue => {
    setSearchInput(searchValue);
    if (searchValue !== "") {
      const filteredData = mangaList.filter((item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(mangaList);
    }
  }

  const selectStatus = (status) => {
    if (status !== "") {
      const filteredData = mangaList.filter((item) =>
        item.status.toLowerCase().includes(status.toLowerCase())
      );
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(mangaList);
    }
  }

  const highestRatedManga = () => {
    const currentList = filteredResults.length > 0 ? filteredResults : mangaList;
    if (currentList.length > 0) {
      const highestRated = currentList.reduce((prev, current) => {
        return (prev.score > current.score) ? prev : current;
      });
      setHighestRated(highestRated);
    } else {
      setHighestRated(null);
    }
  };

  const numberCompleted = () => {
    const currentList = filteredResults.length > 0 ? filteredResults : mangaList;
    const completedCount = currentList.filter(manga => manga.status === 'Finished').length;
    return completedCount;
  }

  const averageScoreManga = () => {
    const currentList = filteredResults.length > 0 ? filteredResults : mangaList;
    if (currentList.length > 0) {
      const totalScore = currentList.reduce((acc, manga) => acc + (manga.score || 0), 0);
      const average = totalScore / currentList.length;
      setAverageScore(average.toFixed(2));
    } else {
      setAverageScore(0);
    }
  }

  return (
    <>
      <div className="App">
        <div className = "mangaSearch">
          <h1>📖 Manga Search</h1>
          <div className = "Manga"></div>
        </div>
        <div className = "MangaSearchContainer">
          <div className = "Categories">
            <h1>
              Mangas
              <span className = "buttons">
                <button className = "button">Prev 25</button>
                <button className = "button">Next 25</button>
              </span>
            </h1>
            <div className = "CollectiveInfo">
              <div className="infoBox">Highest Rated: {highestRated ? highestRated.title : 'N/A'}</div>
              <div className="infoBox">Average Score: {averageScore}</div>
              <div className="infoBox">Number Completed: {numberCompleted()}</div>
            </div>
            <h2 className = "searchHeader">Search:
            <input 
              className="searchInput" 
              value={searchInput} 
              onChange={(e) => setSearchInput(e.target.value)} 
            />
            <button 
              className="searchButton" 
              onClick={() => searchItems(searchInput)}
            >
              Search
            </button>
              <select onChange={(e) => selectStatus(e.target.value)}> 
                <option value="">Select Status </option>
                <option value="Finished">Finished</option>
                <option value="Publishing">Publishing</option>
                <option value="On Hiatus">On Hiatus</option>
              </select>
              <input type='range' min="0" max = '10' step='1'></input>
            </h2>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="table">
              <thead>
                <tr class = "header">
                  <td class = "rankHeader">Rank</td>
                  <td class = "titleHeader">Title</td>
                  <td class = "scoreHeader">Score</td>
                  <td class = "authorHeader">Author</td>
                  <td class = "statusHeader">Status</td>
                </tr>
              </thead>
              <tbody>
              {(filteredResults.length > 0 ? filteredResults : mangaList).map(
                (manga) => (
                  <tr key={manga.mal_id}>
                    <td>{manga.rank}</td>
                    <td>
                      <a href={manga.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                        {manga.title}
                      </a>
                    </td>
                    <td>{manga.score || 'N/A'}</td>
                    <td>{manga.authors?.[0]?.name || 'Unknown'}</td>
                    <td>{manga.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;