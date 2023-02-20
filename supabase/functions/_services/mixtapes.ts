import {
  MixtapeExt,
  MixtapeParams,
  MixtapeParamsExt,
} from "../_types/mixtapes.ts";
import { formatAuthorNames, handleLocalFileUrl } from "../_shared/utils.ts";
import {
  mixtapeAuthorsWithAuthorsRelation,
  mixtapeTagsWithTagsRelation,
  tracksRelation,
} from "../_shared/relations.ts";

import { AuthorParamsExt } from "../_types/authors.ts";
import { AuthorsService } from "./authors.ts";
import { Service } from "../_shared/service.ts";
import { TagParams } from "../_types/tags.ts";
import { TagsService } from "./tags.ts";

export class MixtapesService extends Service {
  /**
   * Validate mixtape POST Data or throwing errors
   */
  validateData(data: MixtapeParamsExt) {
    const { authors, ..._mixtapeData } = data;

    if (!authors?.length) {
      throw new Error("Mixtape should have at least one author");
    }

    return data;
  }

  /**
   * Format mixtape data
   */
  format(mixtape: MixtapeExt) {
    const _authors = new AuthorsService(this.headers);
    const { mixtapes_authors, mixtapes_tags, cover, ...rest } = mixtape;
    const authors = mixtapes_authors
      ? mixtapes_authors.map(({ authors: author, position }) => {
          return _authors.format({
            position,
            ...author,
          });
        })
      : [];
    const tags = mixtapes_tags
      ? mixtapes_tags.map(({ tags: tag }) => {
          return {
            ...tag,
          };
        })
      : [];

    return {
      ...rest,
      cover,
      cover_url: cover
        ? handleLocalFileUrl(
            this.supabase.storage.from("covers").getPublicUrl(cover).data
              .publicUrl
          )
        : null,
      authors,
      tags,
      created_by: formatAuthorNames(authors),
      tracks: mixtape.tracks
        ? mixtape.tracks.map(
            ({
              created_at: _created_at,
              mixtape_id: _mixtape_id,
              ...track
            }) => ({
              ...track,
            })
          )
        : [],
    };
  }

  /**
   * Fetch all mixtapes
   */
  async findAll() {
    const { data: mixtapes, error } = await this.supabase
      .from("mixtapes")
      .select(
        `*, ${mixtapeAuthorsWithAuthorsRelation}, ${mixtapeTagsWithTagsRelation}, ${tracksRelation}`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return mixtapes.map((m) => this.format(m));
  }

  /**
   * Find a mixtape by ID
   */
  async find(id: string | number) {
    const { data: mixtape, error } = await this.supabase
      .from("mixtapes")
      .select(
        `*, ${mixtapeAuthorsWithAuthorsRelation}, ${mixtapeTagsWithTagsRelation}, ${tracksRelation}`
      )
      .match({ id })
      .single();

    if (error) throw error;

    return this.format(mixtape);
  }

  /**
   * Find a mixtape by Authors and Name
   */
  async findByInfos({ authors, name }: { authors: string; name: string }) {
    const { data: mixtape, error } = await this.supabase
      .from("mixtapes")
      .select(
        `*, ${mixtapeAuthorsWithAuthorsRelation}, ${mixtapeTagsWithTagsRelation}, ${tracksRelation}`
      )
      .match({ name, authors_text: authors })
      .single();

    if (error) throw error;

    return this.format(mixtape);
  }

  /**
   * Find mixtapes by name
   */
  async findByName(name: string) {
    const { data: mixtapes, error } = await this.supabase
      .from("mixtapes")
      .select("*")
      .ilike("name", `%${name}%`);

    if (error) throw new Error(error.message);

    return mixtapes.map((a) => this.format(a));
  }

  /**
   * Find mixtapes by exact name
   */
  async findByExactName(name: string) {
    const { data: mixtapes, error } = await this.supabase
      .from("mixtapes")
      .select("*")
      .ilike("name", name);

    if (error) throw new Error(error.message);

    return mixtapes.map((a) => this.format(a));
  }

  /**
   * Add authors to mixtape
   */
  async addAuthors(id: string | number, authors: AuthorParamsExt[] = []) {
    const _authors = new AuthorsService(this.headers);
    const authorIds = await _authors.getIdsOrCreate(authors);
    const { error } = await this.supabase.from("mixtapes_authors").insert(
      authorIds.map((authorId, position) => ({
        author_id: authorId,
        mixtape_id: id,
        position,
      }))
    );

    if (error) throw error;
  }

  /**
   * Update authors to mixtape
   */
  async updateAuthors(id: string | number, authors: AuthorParamsExt[] = []) {
    const _authors = new AuthorsService(this.headers);
    const authorIds = await _authors.getIdsOrCreate(authors);
    const { data: existing } = await this.supabase
      .from("mixtapes_authors")
      .select("*")
      .match({ mixtape_id: id });

    const toDeleteIds = existing?.length
      ? existing
          .filter((ma) => !authorIds.includes(ma.author_id))
          .reduce((res, ma) => [...res, ma.author_id], [])
      : [];

    const { error: _deleteError } = await this.supabase
      .from("mixtapes_authors")
      .delete()
      .eq("mixtape_id", id)
      .in("author_id", toDeleteIds);

    const { error } = await this.supabase.from("mixtapes_authors").upsert(
      authorIds.map((authorId, position) => ({
        author_id: authorId,
        mixtape_id: id,
        position,
      })),
      { onConflict: "mixtape_id,author_id" }
    );

    if (error) throw error;
  }

  /**
   * Add tags to mixtape
   */
  async addTags(id: string | number, tags: TagParams[] = []) {
    const _tags = new TagsService(this.headers);
    const tagIds = await _tags.getIdsOrCreate(tags);
    const { error } = await this.supabase.from("mixtapes_tags").insert(
      tagIds.map((tagId) => ({
        tag_id: tagId,
        mixtape_id: id,
      }))
    );

    if (error) throw error;
  }

  /**
   * Update tags to mixtape
   */
  async updateTags(id: string | number, tags: TagParams[] = []) {
    const _tags = new TagsService(this.headers);
    const tagIds = await _tags.getIdsOrCreate(tags);
    const { data: existing } = await this.supabase
      .from("mixtapes_tags")
      .select("*")
      .match({ mixtape_id: id });

    const toDeleteIds = existing?.length
      ? existing
          .filter((ma) => !tagIds.includes(ma.tag_id))
          .reduce((res, ma) => [...res, ma.tag_id], [])
      : [];

    const { error: _deleteError } = await this.supabase
      .from("mixtapes_tags")
      .delete()
      .eq("mixtape_id", id)
      .in("tag_id", toDeleteIds);

    const { error } = await this.supabase.from("mixtapes_tags").upsert(
      tagIds.map((tagId) => ({
        tag_id: tagId,
        mixtape_id: id,
      })),
      { onConflict: "mixtape_id,tag_id" }
    );

    if (error) throw error;
  }

  /**
   * Create a new mixtape
   */
  async create(mixtapeData: MixtapeParams) {
    const { data: mixtape, error } = await this.supabase
      .from("mixtapes")
      .insert([mixtapeData])
      .select()
      .single();

    if (error) throw error;

    return mixtape;
  }

  /**
   * Update a mixtape by ID
   */
  async update(id: string | number, mixtapeData: MixtapeParams) {
    const { data: mixtape, error } = await this.supabase
      .from("mixtapes")
      .update({ ...mixtapeData, updated_at: new Date() })
      .match({ id })
      .select();

    if (error) throw error;

    return mixtape;
  }

  /**
   * Delete a mixtape by ID
   */
  async delete(id: string | number) {
    const { error } = await this.supabase
      .from("mixtapes")
      .delete()
      .match({ id });

    if (error) throw error;

    return { deleted: id };
  }
}
