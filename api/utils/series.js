const axios = require("axios");
const db = require("../models/index.js");
const Series = db.Series;
const Seasons = db.Seasons;
const Episodes = db.Episodes;

exports.addSeriesWithSeasonsAndEpisodes = async (seriesId) => {
    try {
        let series = await Series.findOne({ where: { series_api_id: seriesId } });
        if (!series) {
            const seriesApiResponse = await axios.get(`https://api.tvmaze.com/shows/${seriesId}?embed=seasons`);
            const seriesApiData = seriesApiResponse.data;

            console.log('Series data: ', seriesApiData);

            const totalSeasons = seriesApiData._embedded?.seasons.length || 0;
            const creatorResponse = await axios.get(`https://api.tvmaze.com/shows/${seriesId}?embed=crew`);
            const creators = creatorResponse.data._embedded.crew
                .filter(member => member.type === 'Creator')
                .map(creator => creator.person.name);
            const creatorNames = creators.length ? creators.join(', ') : 'Unknown';

            series = await Series.create({
                series_api_id: seriesApiData.id,
                title: seriesApiData.name,
                description: seriesApiData.summary?.replace(/<\/?[^>]+(>|$)/g, ""),
                release_date: seriesApiData.premiered,
                genre: seriesApiData.genres.join(', '),
                total_seasons: totalSeasons,
                average_rating: seriesApiData.rating?.average || null,
                poster_url: seriesApiData.image?.original || null,
                creator: creatorNames,
            });
        }

        const seasonsResponse = await axios.get(`https://api.tvmaze.com/shows/${seriesId}/seasons`);
        const seasonsData = seasonsResponse.data;

        for (const season of seasonsData) {
            const existingSeason = await Seasons.findOne({
                where: { season_id: season.id, series_api_id: series.series_api_id }
            });

            if (existingSeason) {
                continue;
            }

            const seasonRecord = await Seasons.create({
                season_id: season.id,
                series_api_id: series.series_api_id,
                season_number: season.number,
            });

            const episodesResponse = await axios.get(`https://api.tvmaze.com/seasons/${season.id}/episodes`);
            const episodesData = episodesResponse.data;

            const filteredEpisodesData = episodesData.filter(episode => episode.number !== null);

            const episodeData = filteredEpisodesData.map(episode => ({
                episode_api_id: episode.id,
                season_id: seasonRecord.season_id,
                episode_title: episode.name,
                episode_number: episode.number,
                duration: episode.runtime,
                air_date: episode.airdate,
                poster_url: episode.image?.original || null,
                series_api_id: series.series_api_id,
            }));

            await Episodes.bulkCreate(episodeData);

            const episodeIds = episodeData.map(episode => episode.episode_api_id);
            await seasonRecord.update({
                episode_ids: episodeIds.join(','),
            });
        }

        console.log('Series, seasons, and episodes added successfully.');
        return series;
    } catch (error) {
        console.error('Error adding series with seasons and episodes: ', error);
        throw error;
    }
}