import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { firstValueFrom } from 'rxjs';
import { SearchHistory } from './search.model';

@Injectable()
export class SearchService {
    private readonly logger = new Logger(SearchService.name);

    constructor(
        private readonly httpService: HttpService,
        @InjectModel(SearchHistory)
        private readonly searchHistory: typeof SearchHistory,
    ) {}

    async searchWikipedia(term: string) {
        try {
            // Normalize the term and encode so it can be passed to the api in the expected form
            const decodedTerm = decodeURIComponent(term.toLowerCase());
            let encodedTerm = encodeURIComponent(decodedTerm);

            // Make Wikipedia API call
            const response = await firstValueFrom(
                this.httpService.get(`https://en.wikipedia.org/w/api.php`, {
                    params: {
                        action: 'query',
                        list: 'search',
                        srsearch: encodedTerm,
                        format: 'json',
                    },
                }),
            );

            if (response.status !== 200) {
                throw new HttpException(
                    'Failed to fetch data from Wikipedia API',
                    HttpStatus.BAD_GATEWAY,
                );
            }

            // Save to search history in DB
            await this.saveSearchHistory(decodedTerm);

            // Respond with Wikipedia API data
            return response.data;
        } catch (error) {
            throw new Error(`Failed to search Wikipedia due to: ${error}`);
        }
    }

    async saveSearchHistory(term: string) {
        try {
            term = term.toLowerCase();
            return this.searchHistory.create({ search_term: term });
        } catch (error) {
            throw new Error(`Failed to save search term: ${error}`);
        }
    }

    async getSearchHistory() {
        try {
            return this.searchHistory.findAll();
        } catch (error) {
            throw new Error(`Failed to get search history: ${error}`);
        }
    }

    async clearSearchHistory() {
        try {
            return this.searchHistory.destroy({ where: {} });
        } catch (error) {
            throw new Error(`Failed to clear search history: ${error}`);
        }
    }

    async deleteSearchHistoryByTerm(term: string) {
        try {
            term = term.toLowerCase();
            const destroyedRows = await this.searchHistory.destroy({
                where: { search_term: term },
            });

            if (destroyedRows === 0) {
                throw new HttpException(
                    `Failed to delete searched term, term doesn't exist in table`,
                    HttpStatus.NOT_FOUND,
                );
            }
        } catch (error) {
            throw new HttpException(
                `Failed to delete searched term: ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
