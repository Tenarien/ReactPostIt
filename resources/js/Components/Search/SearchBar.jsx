import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ posts: [], users: [] });
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef(null);


    useEffect(() => {
        if (query.trim()) {
            const timeoutId = setTimeout(() => {
                fetchResults();
            }, 300);
            return () => clearTimeout(timeoutId);
        } else {
            setResults({ posts: [], users: [] });
            setIsOpen(false);
        }
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/search', { params: { query } });
            setResults(response.data);
            setIsOpen(true);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full mx-6" ref={searchRef}>
            {/* Search Input */}
            <input
                type="text"
                className="w-full px-2 text-black font-medium border border-orange-500 rounded-lg focus:outline-none focus:ring focus:ring-orange-500"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={() => setIsOpen(true)}
            />

            {/* Results Dropdown */}
            {query.trim() && isOpen && (
                <div className="absolute w-full bg-white border border-orange-500 mt-2 shadow-lg rounded-lg z-50">
                    {loading ? (
                        <div className="p-4 text-center text-orange-500">Loading...</div>
                    ) : (
                        <>
                            {/* Posts Results */}
                            <div>
                                <h3 className="p-2 text-lg font-bold text-orange-500 border-b border-orange-500 mx-4">Posts</h3>
                                {results.posts.length ? (
                                    results.posts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="p-3 hover:bg-orange-50 cursor-pointer text-gray-700"
                                        >
                                            {post.body.substring(0, 30)}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 text-gray-500">No posts found.</div>
                                )}
                            </div>

                            {/* Users Results */}
                            <div>
                                <h3 className="p-2 text-lg font-bold text-orange-500 border-b border-orange-500 mx-4">Users</h3>
                                {results.users.length ? (
                                    results.users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="p-3 hover:bg-orange-50 cursor-pointer text-gray-700"
                                        >
                                            {user.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 text-gray-500">No users found.</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
