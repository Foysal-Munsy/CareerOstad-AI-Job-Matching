import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';

const keywords = [
    "Jobs...",
    "Candidates...",
    "Companies..."
];

const Search = () => {
    const [searchCategory, setSearchCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <form
            className="flex items-center mx-2 text-sm rounded-lg h-8 shadow-md"
            onSubmit={e => {
                e.preventDefault();
                // Handle search logic here
            }}
        >
            {/* <select
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="h-8 hidden sm:block rounded-l-lg focus:outline-none cursor-pointer bg-gray-200 text-center text-sm"
            >
                <div className='px-4 py-2'>
                <option value="All">All</option>
                <option value="Candidates">Candidates</option>
                <option value="Companies">Companies</option>
                <option value="Jobs">Jobs</option>
                </div>
            </select> */}
            <select defaultValue="All" className="select h-8 hidden sm:block rounded-none rounded-l-lg border-none focus:outline-none cursor-pointer bg-gray-200 text-center text-sm w-fit">
                <option>All</option>
                <option>Jobs</option>
                <option>Candidates</option>
                <option>Companies</option>
            </select>
            <div className="flex items-center px-2 relative bg-white h-8 rounded-l-lg sm:rounded-l-none">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={`Search For `}
                    className="bg-transparent outline-none w-full"
                    style={{ minWidth: '140px' }}
                />
                {searchQuery === "" && (
                    <span className="absolute left-[105px] pointer-events-none text-gray-400">
                        <Typewriter
                            words={keywords}
                            loop={0}
                            cursor
                            cursorStyle="|"
                            typeSpeed={100}
                            deleteSpeed={100}
                            delaySpeed={2000}
                        />
                    </span>
                )}
            </div>
            <button
                type="submit"
                className="bg-primary text-white px-2 h-8 rounded-none rounded-r-lg shadow-none flex items-center hover:bg-black hover:text-white cursor-pointer transition"
            >
                <FaSearch />
            </button>
        </form>
    );
};

export default Search;
// ...existing code...