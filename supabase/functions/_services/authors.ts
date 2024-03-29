import { Author, AuthorExt, AuthorParams, AuthorParamsExt } from "../_types/authors.ts"

import { Service } from "../_shared/service.ts"
import { handleLocalFileUrl } from "../_shared/utils.ts"

export class AuthorsService extends Service {
  /**
   * Validate author POST Data or throwing errors
   */
  validateData(data: AuthorParamsExt) {
    const { name, user_id } = data

    if (!name) {
      throw new Error("Author should have at least a name.")
    }

    return { ...data, user_id: user_id || null }
  }

  /**
   * Format Author data
   */
  format(author: Partial<AuthorExt>) {
    return {
      ...author,
      avatar_url: author.avatar
        ? handleLocalFileUrl(this.supabase.storage.from("avatars").getPublicUrl(author.avatar).data.publicUrl)
        : null,
    }
  }

  async getIdsOrCreate(authors: AuthorParamsExt[]) {
    // List all authors and create new ones
    const allAuthors = await Promise.all(
      authors.map(async (author) => {
        if (!author?.id) {
          const find = author?.name ? await this.findByExactName(author.name) : []
          const exists = !!find.length
          if (!exists) {
            return await this.create({ name: author.name })
          }
          return find[0]
        }
        return author
      })
    )
    // Reduce to authors ids
    return allAuthors.map((a) => a.id)
  }

  /**
   * Fetch all authors
   */
  async findAll() {
    const { data: authors, error } = await this.supabase.from("authors").select("*")

    if (error) throw new Error(error.message)

    return authors.map((author: Author) => this.format(author))
  }

  /**
   * Find an author by ID
   */
  async findByID(id: number) {
    const { data: author, error } = await this.supabase.from("authors").select("*").match({ id }).single()

    if (error) throw new Error(error.message)

    return this.format(author)
  }

  /**
   * Find authors by name
   */
  async findByName(name: string) {
    const { data: authors, error } = await this.supabase.from("authors").select("*").ilike("name", `%${name}%`)

    if (error) throw new Error(error.message)

    return authors.map((a) => this.format(a))
  }

  /**
   * Find authors by exact name
   */
  async findByExactName(name: string) {
    const { data: authors, error } = await this.supabase.from("authors").select("*").ilike("name", name)

    if (error) throw new Error(error.message)

    return authors.map((a) => this.format(a))
  }

  /**
   * Create a new author
   */
  async create(authorData: AuthorParams) {
    const { data: author, error } = await this.supabase.from("authors").insert([authorData]).select().single()

    if (error) throw new Error(error.message)

    return this.format(author)
  }

  /**
   * Update an author
   */
  async update(id: number, authorData: AuthorParams) {
    const { data: author, error } = await this.supabase
      .from("authors")
      .update({ ...authorData, updated_at: new Date() })
      .match({ id })
      .select()

    if (error) throw error

    return author
  }

  /**
   * Delete an author by ID
   */
  async delete(id: number) {
    const { data, error } = await this.supabase.from("authors").delete().match({ id }).select()

    if (error) throw error

    if (!data.length) {
      throw new Error("Author associated to mixtapes cannot be deleted.")
    }

    return { deleted: id }
  }
}
