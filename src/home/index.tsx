import axios from "axios";
import { useEffect, useReducer, useRef, useState } from "react";
import { reducer } from "../reducer";

export const Home = () => {
  const [search, setSearch] = useState("");
  console.log("🚀 ~ Home ~ search:", search);
  const [page, setPage] = useState(1);
  console.log("🚀 ~ page:", page);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [state, dispatch] = useReducer(reducer, { authors: [] });
  console.log("🚀 ~ Home ~ state:", state);
  const API_URL = "https://openlibrary.org/search/authors.json";
  const bottom = useRef(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 10);
        }
      },
      { threshold: 1.0 }
    );
    if (bottom.current) {
      observer.observe(bottom.current);
    }
    return () => {
      if (bottom.current) {
        observer.unobserve(bottom.current);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    const loadAuthors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}?q=${search}&offset=${page}&limit=${10}`);
        console.log("🚀 ~ loadAuthors ~ response:", response)
        if (page === 1) {
          dispatch({ type: "NEW_SEARCH", payload: response.data.docs });
        } else {
          dispatch({ type: "ADD", payload: response.data.docs });
        }
        setHasMore(response.data.docs.length > 0);
      } catch (error) {
        console.error("Failed to fetch authors", error);
      } finally {
        setLoading(false);
      }
    };

    if (search.trim()) loadAuthors();
  }, [search, page]);

  return (
    <div className="w-full  justify-center p-10">
      <form className="fixed top-0 left-0 right-0 p-10 ">
        <h1>Search for Authors</h1>
        <div className="flex">
          <input
            className="w-full bg-gray-900 p-4 my-2 rounded-lg   "
            type="text"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </form>
      <div className="pt-40">
        {state.authors.map((author: { name: string }, index: any) => {
          return (
            <div className="flex" key={index}>
              <div className="bg-gray-900 p-4 my-2 rounded-lg ">
                {author.name}
              </div>
            </div>
          );
        })}
      </div>
      {loading && <div>Loading...</div>}
      <div ref={bottom} />
    </div>
  );
};
