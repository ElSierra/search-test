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
        const response = await axios.get(
          `${API_URL}?q=${search}&offset=${page}&limit=${10}`
        );
        console.log("🚀 ~ loadAuthors ~ response:", response);
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
    <div className=" w-screen justify-center p-10  ">
      <form className="fixed top-0 left-0 right-0 p-10 bg-black ">
        <h1 className="sm:text-3xl text-[20px]">Search for Authors</h1>
        <div className="flex">
          <input
            className="w-full bg-gray-900 p-4 my-2 rounded-lg   "
            type="text"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </form>
      <div className="pt-40 w-full">
        {state.authors.map(
          (author: { name: string; top_work: string }, index: any) => {
            return (
              <div
                className="flex flex-col bg-gray-900 w-full gap-2 p-4 my-2 rounded-lg "
                key={index}
              >
                <div className=" flex self-start p-2 rounded-sm">
                  {author.name}
                </div>
                <div className="bg-blue-900 flex rounded-lg p-2 flex-col w-full">
                  <div className="p-1 bg-blue-100 rounded-sm flex self-start">
                    <p className="text-black text-sm font-semibold">
                      Known for
                    </p>
                  </div>

                  <div className="flex capitalize font-extrabold">
                    <p>{author.top_work}</p>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
      {loading && <div>Loading...</div>}
      <div ref={bottom} />
    </div>
  );
};
