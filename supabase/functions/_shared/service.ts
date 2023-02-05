import { Database } from "../_types/supabase.ts";
import { FileModel } from "../_types/api.ts";
import SupabaseClient from "https://esm.sh/v103/@supabase/supabase-js@2.4.0/dist/module/SupabaseClient";
import { createClient } from "https://esm.sh/v103/@supabase/supabase-js@2.4.0/dist/module/index";
import { dataURLtoFile } from "./utils.ts";

export class Service {
  headers: Request["headers"];
  supabase: SupabaseClient;

  constructor(requestHeaders: Request["headers"]) {
    this.headers = requestHeaders;
    this.supabase = createClient<Database>(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: this.headers.get("Authorization")! },
        },
      }
    );
  }

  isFileDataBase64(fileString: string) {
    return /^data:image/.test(fileString);
  }

  async handleFile(fileModel: FileModel, bucket: string) {
    const filename = String(fileModel.filename);
    const fileString = String(fileModel.data) || null;
    if (!fileString || !this.isFileDataBase64(fileString)) {
      return fileString;
    }
    const file = dataURLtoFile(fileString, filename);
    const { data: coverFile, error: coverError } = await this.supabase.storage
      .from(bucket)
      .upload(filename, file, { upsert: true });
    if (coverError) throw coverError;
    return coverFile.path;
  }
}
