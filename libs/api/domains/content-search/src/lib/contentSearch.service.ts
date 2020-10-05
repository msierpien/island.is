import { Injectable } from '@nestjs/common'
import {
  ContentLanguage,
  ElasticService,
  SearcherInput,
  SearchIndexes,
  WebSearchAutocompleteInput,
} from '@island.is/api/content-search'
import { logger } from '@island.is/logging'

import { ContentItem } from './models/contentItem.model'
import { SearchResult } from './models/searchResult.model'
import { WebSearchAutocomplete } from './models/webSearchAutocomplete.model'
import { TagCount } from './models/tagCount'

@Injectable()
export class ContentSearchService {
  constructor(private elasticService: ElasticService) {}

  private getIndex(lang: ContentLanguage) {
    const languageCode = ContentLanguage[lang]
    return SearchIndexes[languageCode] ?? SearchIndexes.is
  }

  private fixCase(doc) {
    const obj = doc._source
    obj.contentType = obj.content_type
    obj.contentBlob = obj.content_blob
    obj.contentId = obj.content_id
    obj.categorySlug = obj.category_slug
    obj.categoryDescription = obj.category_description
    obj.groupSlug = obj.group_slug
    obj.groupDescription = obj.group_description
    obj.id = doc._id
    return obj
  }

  mapFindAggregations(aggregations): TagCount[] {
    if (!aggregations) {
      return null
    }
    return aggregations.groupBy.filtered.groupByCount.buckets.map(
      (tagObject) => ({
        key: tagObject.key,
        count: tagObject.doc_count,
        value: tagObject.groupByValue.buckets?.[0]?.key ?? '', // value of tag is allways the first value here we provide default value since value is optional
      }),
    )
  }

  async find(query: SearcherInput): Promise<SearchResult> {
    const { body } = await this.elasticService.search(
      this.getIndex(query.language),
      query,
    )

    return {
      total: body.hits.total.value,
      // we map data when it goes into the index we can return it without mapping it here
      items: body.hits.hits.map((item) => JSON.parse(item._source.response)),
      tagCounts: this.mapFindAggregations(body.aggregations),
    }
  }

  async fetchSingle(input): Promise<ContentItem> {
    const { body } = await this.elasticService.search(
      this.getIndex(input.language),
      input,
    )

    const hit = body?.hits?.hits[0]
    if (!hit) {
      return null
    }
    return this.fixCase(hit)
  }

  async fetchAutocompleteTerm(
    input: WebSearchAutocompleteInput,
  ): Promise<WebSearchAutocomplete> {
    logger.info('search index', {
      lang: input.language,
      index: this.getIndex(ContentLanguage[input.language]),
    })
    const {
      suggest: { searchSuggester },
    } = await this.elasticService.fetchAutocompleteTerm(
      this.getIndex(ContentLanguage[input.language]),
      {
        ...input,
        singleTerm: input.singleTerm.trim(),
      },
    )

    // we always handle just one terms at a time so we return results for first term
    const firstWordSuggestions = searchSuggester[0].options

    return {
      total: firstWordSuggestions.length,
      completions: firstWordSuggestions.map(
        (suggestionObjects) => suggestionObjects.text,
      ),
    }
  }
}
