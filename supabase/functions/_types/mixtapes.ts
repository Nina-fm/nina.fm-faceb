import { DParams, DType, ResolveRelationQuery } from "./database.ts";
import {
  authorRelation,
  mixtapeAuthorsRelation,
  mixtapeAuthorsWithAuthorsRelation,
  mixtapeTagsRelation,
  mixtapeTagsWithTagsRelation,
  tracksRelation,
} from "../_shared/relations.ts";

import { AuthorParams } from "./authors.ts";
import { FileModel } from "./api.ts";
import { TagParams } from "./tags.ts";
import { TrackParams } from "./tracks.ts";

export type WithAuthor = ResolveRelationQuery<typeof authorRelation, "one">;
export type WithMixtapeAuthors = ResolveRelationQuery<
  typeof mixtapeAuthorsRelation,
  "many"
>;
export type WithMixtapeAuthorsExt = ResolveRelationQuery<
  typeof mixtapeAuthorsWithAuthorsRelation,
  "many"
>;

export type WithTag = ResolveRelationQuery<typeof authorRelation, "one">;
export type WithMixtapeTags = ResolveRelationQuery<
  typeof mixtapeTagsRelation,
  "many"
>;
export type WithMixtapeTagsExt = ResolveRelationQuery<
  typeof mixtapeTagsWithTagsRelation,
  "many"
>;

export type WithTracks = ResolveRelationQuery<typeof tracksRelation, "many">;

export type Mixtape = DType<"mixtapes">;
export type MixtapeParams = DParams<"mixtapes">;

export type MixtapesAuthors = DType<"mixtapes_authors">;
export type MixtapesAuthorsParams = DParams<"mixtapes_authors">;

export type MixtapesTags = DType<"mixtapes_tags">;
export type MixtapesTagsParams = DParams<"mixtapes_tags">;

export type MixtapeExt = Mixtape &
  WithMixtapeAuthorsExt &
  WithMixtapeTagsExt &
  WithTracks & {
    created_by?: string | null;
    cover_url?: string | null;
  };
export type MixtapeParamsExt = MixtapeParams & {
  authors?: Pick<AuthorParams, "id" | "name">[];
  tags?: (Pick<TagParams, "id" | "name"> | string)[];
  tracks?: Omit<TrackParams, "created_at" | "mixtape_id">[];
  cover_url?: string | null;
  cover_file?: FileModel;
};
