import {
  authorRelation,
  mixtapeAuthorsRelation,
  mixtapeAuthorsWithAuthorsRelation,
  mixtapeTagsRelation,
  mixtapeTagsWithTagsRelation,
  tagRelation,
  tracksRelation,
} from '../_shared/relations.ts'
import { DParams, DType, ResolveRelationQuery } from './database.ts'

import { FileModel } from './api.ts'
import { AuthorParams } from './authors.ts'
import { TagParams } from './tags.ts'
import { TrackParams } from './tracks.ts'

export interface CoverFile {
  data: File | string | null
  filename: string | null
}

export type WithAuthor = ResolveRelationQuery<typeof authorRelation, 'one'>
export type WithMixtapeAuthors = ResolveRelationQuery<typeof mixtapeAuthorsRelation, 'many'>
export type WithMixtapeAuthorsExt = ResolveRelationQuery<typeof mixtapeAuthorsWithAuthorsRelation, 'many'>

export type WithTag = ResolveRelationQuery<typeof tagRelation, 'one'>
export type WithMixtapeTags = ResolveRelationQuery<typeof mixtapeTagsRelation, 'many'>
export type WithMixtapeTagsExt = ResolveRelationQuery<typeof mixtapeTagsWithTagsRelation, 'many'>

export type WithTracks = ResolveRelationQuery<typeof tracksRelation, 'many'>

export type Mixtape = DType<'mixtapes'>
export type MixtapeParams = DParams<'mixtapes'>

export type MixtapesAuthors = DType<'mixtapes_authors'>
export type MixtapesAuthorsParams = DParams<'mixtapes_authors'>

export type MixtapesTags = DType<'mixtapes_tags'>
export type MixtapesTagsParams = DParams<'mixtapes_tags'>

export type MixtapeExt = Mixtape &
  WithAuthor &
  WithMixtapeAuthorsExt &
  WithTag &
  WithMixtapeTagsExt &
  WithTracks & {
    authors_text?: string | null
    cover_url?: string | null
  }

export type MixtapeParamsExt = MixtapeParams & {
  authors?: Pick<AuthorParams, 'id' | 'name'>[]
  tags?: Pick<TagParams, 'id' | 'name'>[]
  tracks?: Omit<TrackParams, 'created_at' | 'mixtape_id'>[]
  cover_url?: string | null
  cover_file?: FileModel
  key?: string
}
