import { Service } from "../_shared/service.ts"
import { TagParams } from "../_types/tags.ts"

export class TagsService extends Service {
  /**
   * Validate tag POST Data or throwing errors
   */
  validateData(data: TagParams) {
    const { name } = data

    if (!name) {
      throw new Error("Tag should have at least a name.")
    }

    return data
  }

  async getIdsOrCreate(tags: TagParams[]) {
    // List all tags and create new ones
    const allTags = await Promise.all(
      tags.map(async (tag) => {
        if (!tag?.id) {
          const find = tag?.name ? await this.findByExactName(tag.name) : []
          const exists = !!find.length
          if (!exists) {
            return await this.create({ name: tag.name })
          }
          return find[0]
        }
        return tag
      })
    )
    // Reduce to tags ids
    return allTags.map((a) => a.id)
  }

  /**
   * Fetch all tags
   */
  async findAll() {
    const { data: tags, error } = await this.supabase.from("tags").select("*")

    if (error) throw error

    return tags
  }

  /**
   * Find an tag by ID
   */
  async findByID(id: number) {
    const { data: tag, error } = await this.supabase.from("tags").select("*").match({ id }).single()

    if (error) throw error

    return tag
  }

  /**
   * Find tags by name
   */
  async findByName(name: string) {
    const { data: tags, error } = await this.supabase.from("tags").select("*").ilike("name", `%${name}%`)

    if (error) throw error

    return tags
  }

  /**
   * Find tags by exact name
   */
  async findByExactName(name: string) {
    const { data: tags, error } = await this.supabase.from("tags").select("*").ilike("name", `${name}`)

    if (error) throw error

    return tags
  }

  /**
   * Create a new tag
   */
  async create(tagData: TagParams) {
    const { data: tag, error } = await this.supabase.from("tags").insert([tagData]).select().single()

    if (error) throw error

    return tag
  }

  /**
   * Update an tag
   */
  async update(id: number, tagData: TagParams) {
    const { data: tag, error } = await this.supabase.from("tags").update(tagData).match({ id }).select()

    if (error) throw error

    return tag
  }

  /**
   * Delete an tag by ID
   */
  async delete(id: number) {
    const { data, error } = await this.supabase.from("tags").delete().match({ id }).select()

    if (error) throw error

    if (!data.length) {
      throw new Error("Tags associated to mixtapes cannot be deleted.")
    }

    return { deleted: id }
  }
}
