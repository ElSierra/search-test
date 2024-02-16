import axios from "axios";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
export const Home = () => {
  const [search, setSearch] = useState("");
  const [authors, setAuthors] = useState([]);

  const API_URL = "https://openlibrary.org/search/authors.json";

  useEffect(() => {
    axios.get(`${API_URL}?`);
  }, [search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const {ref, inView, entry} = useInView({
    threshold: 0,
  });

  return (
    <div className="w-screen h-screen justify-center p-10">
      <h1>Search for Authors</h1>
      <form>
        <div className="flex">
          <input
            className="w-full"
            type="text"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </form>
    </div>
  );
};
