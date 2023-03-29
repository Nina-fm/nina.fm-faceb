import { Service } from "../_shared/service.ts"

export class ProfilesService extends Service {
  /**
   * Find profile by userID
   */
  async findById(userId: string) {
    const { data: profile, error } = await this.supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) throw new Error(error.message)

    return profile
  }
}
