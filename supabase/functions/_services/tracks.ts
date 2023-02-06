import { Service } from "../_shared/service.ts";
import { TrackParams } from "../_types/tracks.ts";

export class TracksService extends Service {
  /**
   * Find tracks by mixtape ID
   */
  async findByMixtape(mixtapeId: string | number) {
    const { data: tracks, error } = await this.supabase
      .from("tracks")
      .select("*")
      .eq("mixtape_id", mixtapeId);

    if (error) throw new Error(error.message);

    return tracks;
  }

  /**
   * Create new tracks
   */
  async createForMixtape(
    mixtapeId: string | number,
    tracksData: TrackParams[]
  ) {
    const { data: tracks, error } = await this.supabase
      .from("tracks")
      .insert(
        tracksData.map((track, i) => ({
          ...track,
          mixtape_id: mixtapeId,
          position: track.position || i,
        }))
      )
      .select();

    if (error) throw new Error(error.message);

    return tracks;
  }

  /**
   * Update tracks
   */
  async updateForMixtape(
    mixtapeId: string | number,
    tracksData: TrackParams[]
  ) {
    const tracksDataIds = tracksData.reduce(
      (r, t) => [...r, ...(t.id ? [t.id] : [])],
      [] as (string | number)[]
    );

    const { data: existing } = await this.supabase
      .from("tracks")
      .select("id")
      .match({ mixtape_id: mixtapeId });

    const toDeleteIds = existing
      ? existing.filter(
          (track) => track.id && !tracksDataIds.includes(track.id)
        )
      : [];

    const { error: _deleteError } = await this.supabase
      .from("tracks")
      .delete()
      .in("id", toDeleteIds);

    const { data: tracks, error } = await this.supabase
      .from("tracks")
      .upsert(
        tracksData.map((track, i) => ({
          ...track,
          mixtape_id: mixtapeId,
          position: track.position ?? i,
        }))
      )
      .select();

    if (error) throw new Error(error.message);

    return tracks;
  }
}
