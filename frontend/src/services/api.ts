// const API_URL = `${process.env.REACT_APP_BASE_API_URL}:${process.env.REACT_APP_SERVER_PORT}`; TODO -- debug this more
console.log(`process.env.REACT_APP_BASE_API_URL = ${process.env.REACT_APP_BASE_API_URL}`);
console.log(`process.env.REACT_APP_SERVER_PORT = ${process.env.REACT_APP_SERVER_PORT}`);
const API_URL = `http://localhost:3001`;

export interface SearchResult {
	searchInfo: {
		totalHits: number,
		suggestion: string,
		suggestionssnippet: string
	};
	search: {
		ns: number,
		title: string,
		pageid: number,
		size: number,
		wordcount: number,
		snippet: string,
		timestamp: string
	}[];
}

export interface SearchQuery {
	id: number;
	searchTerm: string;
	searchTimestamp: string;
}

export interface DeleteResponse {
	success: boolean;
	message: string;
}

export const fetchSearchResults = async (term: string): Promise<SearchResult> => {
    const response = await fetch(`${API_URL}/search?term=${encodeURIComponent(term)}`);

    if (!response.ok) {
        throw new Error(`Error fetching search results. ${response?.json() || ''}`);
    }

    return await response.json();
};

export const fetchSearchHistory = async (): Promise<SearchQuery[]> => {
    const response = await fetch(`${API_URL}/search/history`);

    if (!response.ok) {
        throw new Error(`Error fetching search history. ${response?.json() || ''}`);
    }

    return await response.json();
};

export const deleteSearchHistory = async (term?: string): Promise<DeleteResponse> => {
	const queryParam = term ? `?term=${encodeURIComponent(term)}` : '';

    const response = await fetch(`${API_URL}/search${queryParam}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Error deleting search history');
    }

	return await response.json();
};

export {};
