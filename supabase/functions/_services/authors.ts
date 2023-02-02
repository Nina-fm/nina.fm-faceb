import { Author, AuthorExt, AuthorParams } from "../_types/authors.ts";

import { Service } from "../_shared/service.ts";
import { handleLocalStorageUrl } from "../_shared/utils.ts";

export class AuthorsService extends Service {
  /**
   * Validate author POST Data or throwing errors
   */
  validateData(data: Partial<AuthorParams>) {
    const { name } = data;

    if (!name) {
      throw new Error("Author should have at least a name.");
    }

    return data;
  }

  /**
   * Format Author data
   */
  format(author: Partial<AuthorExt>) {
    return {
      ...author,
      avatar_url: author.avatar
        ? handleLocalStorageUrl(
            this.supabase.storage.from("avatars").getPublicUrl(author.avatar)
              .data.publicUrl
          )
        : null,
    };
  }

  /**
   * Fetch all authors
   */
  async findAll() {
    const { data: authors, error } = await this.supabase
      .from("authors")
      .select("*");

    if (error) throw new Error(error.message);

    return authors.map((author: Author) => this.format(author));
  }

  /**
   * Find an author by ID
   */
  async findByID(id: number) {
    const { data: author, error } = await this.supabase
      .from("authors")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    return this.format(author);
  }

  /**
   * Find authors by name
   */
  async findByName(name: string) {
    const { data: authors, error } = await this.supabase
      .from("authors")
      .select("*")
      .ilike("name", `%${name}%`);

    if (error) throw new Error(error.message);

    return authors.map((a) => this.format(a));
  }

  /**
   * Create a new author
   */
  async create(authorData: AuthorParams) {
    const { data: author, error } = await this.supabase
      .from("authors")
      .insert([authorData])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return this.format(author);
  }

  /**
   * Update an author
   */
  async update(id: number, authorData: AuthorParams) {
    const { data: author, error } = await this.supabase
      .from("authors")
      .update({ ...authorData, updated_at: new Date() })
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);

    return author;
  }

  /**
   * Delete an author by ID
   */
  async delete(id: number) {
    const { error } = await this.supabase.from("authors").delete().eq("id", id);

    if (error) throw new Error(error.message);

    console.log({ error });
    return true;
  }
}
