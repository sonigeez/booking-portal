import React, { useState } from "react"; // import useState hook
import { Link } from "react-router-dom";

function Header() {
  const [searchQuery, setSearchQuery] = useState(""); // initialize state for search query

  const handleSearch = () => {
    // function to handle search button click
    console.log(`Search for bookings with query: ${searchQuery}`);
    // implement logic for searching bookings using searchQuery
  };

  const handleInputChange = (e) => {
    // function to handle input field change
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-white text-black bg-opacity-50 backdrop-blur-lg drop-shadow-lg ">
      <nav className="flex items-center justify-between px-4 py-3">
      <Link to="/">
        <h1 className="text-xl font-bold bg-clip-text bg-gradient-to-br from-pink-400 to-red-600">Booking App</h1>
           
           </Link>
        <div className="flex items-center space-x-4">
          <div>
            <input
              type="text"
              placeholder="Enter collegeid"
              className="px-4 py-2 border rounded-md text-black"
              value={searchQuery}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Link to={"/bookings/"+searchQuery}>
              <button
                type="button"
                className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 my-2"
              >
                Search Booking
              </button>
            </Link>

          
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
