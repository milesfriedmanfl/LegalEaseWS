import React, { useEffect, useState } from 'react';
import { fetchSearchHistory, fetchSearchResults, SearchQuery, SearchResult } from '../services/api';
import { catchError, from, retry, take } from 'rxjs';
import './search-view.css';

const SearchView = () => {
    const [searchHistory, setSearchHistory] = useState<SearchQuery[]>([]);
	const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
	const [showSelectDropdown, setShowSelectDropdown] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>('');

	// Fetch search results once on initial load, and then anytime a new search is executed
	useEffect(() => {
		from(handleHistory())
			.pipe(
				retry(3),
				take(1)
			)
			.subscribe({
				next: (result: any) => {
					console.log('successfully fetched search history');
					setSearchHistory(result);
				},
				error: (error) => {
					console.error(JSON.stringify(error));
					alert(`Error fetching search history: ${JSON.stringify(error)}`);
				}
			});
	}, [searchResult]);

    const handleHistory = async () => {
        try {
            const history = await fetchSearchHistory();
            setSearchHistory(history);
        } catch (error) {
            console.error(JSON.stringify(error));
			setShowSelectDropdown(false);
        }
    };

    const handleSearch = async () => {
        if (searchTerm.trim()) {
			try {
				const result = await fetchSearchResults(searchTerm.trim());
				setSearchResult(result);
				setShowSelectDropdown(false); // Close dropdown after search
			} catch (error) {
				console.error(JSON.stringify(error));
				alert(`Error fetching search results: ${JSON.stringify(error)}`);
			}
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleOptionClick = (result: any) => {
        setSearchTerm(result.searchTerm); 
        setShowSelectDropdown(false);
    };

	const handleBlur = () => {
		setShowSelectDropdown(false);
	}

	const handleInputFocus = async () => {
        setShowSelectDropdown(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
		<div className="search-container">
			<h2 className="mb-10">Search Wikipedia</h2>
			<div className="position-relative">
				<input
					type="text"
					value={searchTerm}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
					className="form-control"
				/>
				{showSelectDropdown && (
                    <div className="dropdown-menu search-history show">
                        {searchHistory.length > 0 ? (
                            searchHistory.map((result, index) => (
                                <button 
                                    key={index} 
                                    className="dropdown-item"
                                    onClick={() => handleOptionClick(result?.searchTerm)}
                                >
                                    {result.searchTerm}
                                </button>
                            ))
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>
                )}
			</div>
		</div>
    );
};

export default SearchView;

