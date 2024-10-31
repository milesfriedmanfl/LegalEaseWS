import {
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchTermDto } from './search.dto';

@Controller('search')
export class SearchController {
    private readonly logger = new Logger(SearchController.name);

    constructor(private readonly searchService: SearchService) {}

    @Get()
    async searchWikipedia(
        @Query('term', new ValidationPipe({ transform: true })) term: string,
    ) {
        try {
            return await this.searchService.searchWikipedia(term);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('history')
    async getSearchHistory() {
        try {
            return await this.searchService.getSearchHistory();
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete()
    async deleteSearchHistory(
        @Query('term', new ValidationPipe({ transform: true })) term: string,
    ) {
        if (term) {
            // If a term is provided, delete the specific term
            try {
                await this.searchService.deleteSearchHistoryByTerm(term);

                return {
                    success: true,
                    message: 'Search history entry deleted successfully',
                };
            } catch (error) {
                throw error instanceof HttpException
                    ? error
                    : new HttpException(
                          error,
                          HttpStatus.INTERNAL_SERVER_ERROR,
                      );
            }
        } else {
            // If no term is provided, clear all search history
            try {
                await this.searchService.clearSearchHistory();

                return {
                    success: true,
                    message: 'All search history cleared successfully',
                };
            } catch (error) {
                throw error instanceof HttpException
                    ? error
                    : new HttpException(
                          'Failed to delete history',
                          HttpStatus.INTERNAL_SERVER_ERROR,
                      );
            }
        }
    }
}
