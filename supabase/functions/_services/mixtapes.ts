import {
  MixtapeExt,
  MixtapeParams,
  MixtapeParamsExt,
} from "../_types/mixtapes.ts";
import { formatAuthorNames, handleLocalFileUrl } from "../_shared/utils.ts";
import {
  mixtapeAuthorsWithAuthorsRelation,
  tracksRelation,
} from "../_shared/relations.ts";

import { AuthorsService } from "./authors.ts";
import { Service } from "../_shared/service.ts";

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
    const { mixtapes_authors, cover, ...rest } = mixtape;
    const authors = mixtapes_authors
      ? mixtapes_authors.map(({ authors: author, position }) => {
          return _authors.format({
            position,
            ...author,
          });
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
      .select(`*, ${mixtapeAuthorsWithAuthorsRelation}, ${tracksRelation}`);

    if (error) throw error;

    return mixtapes.map((m) => this.format(m));
  }

  /**
   * Find a mixtape by ID
   */
  async find(id: string | number) {
    const { data: mixtape, error } = await this.supabase
      .from("mixtapes")
      .select(`*, ${mixtapeAuthorsWithAuthorsRelation}, ${tracksRelation}`)
      .match({ id })
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error("Resource not found");
      } else {
        throw error;
      }
    }

    return this.format(mixtape);
  }

  /**
   * Add authors to mixtape
   */
  async addAuthors(id: string | number, authorIds: unknown[] = []) {
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
  async updateAuthors(id: string | number, authorIds: unknown[] = []) {
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

    return true;
  }
}
