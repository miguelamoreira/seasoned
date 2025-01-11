const baseURL = 'https://api.tvmaze.com'

export const searchShows = async (query) => {
    if (!query) {
        throw new Error('Search query cannot be empty.');
    }

    const url = `${baseURL}/search/shows?q=${query}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data from TVmaze API.');
        }

        const data = await response.json();

        if (data.length === 0) {
            return { error: 'No shows found matching your query.' };
        }

        return { shows: data };
    } catch (error) {
        console.error('Error fetching TV shows:', error);
        return { error: error.message || 'An error occurred' };
    }
};

export const fetchNewReleases = async () => {
    const url = `${baseURL}/schedule`

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch data from TVmaze API.');
        }

        const data = await response.json();

        const filteredData = data.filter(item => 
            item.show.genres &&
            item.show.genres.some(genre => ['Drama', 'Comedy', 'Animated'].includes(genre))
        );

        const firstThree = filteredData.slice(0, 3).map(item => ({
            imageUri: item.show.image?.original || '', 
            title: item.show.name,
            subtitle: item.name, 
            date: item.airdate,
            seriesId: item.show.id,
        }));

        return firstThree
    } catch (error) {
        console.error('Error fetching new releases: ', error);
        return { error: error.message || 'An error occurred' };
    }
} 