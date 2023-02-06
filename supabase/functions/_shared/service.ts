import { Database } from "../_types/supabase.ts";
import { FileModel } from "../_types/api.ts";
import SupabaseClient from "https://esm.sh/v103/@supabase/supabase-js@2.4.0/dist/module/SupabaseClient";
import { createClient } from "https://esm.sh/v103/@supabase/supabase-js@2.4.0/dist/module/index";
import { dataURLtoFile } from "./utils.ts";
import path from "https://deno.land/std@0.170.0/node/path.ts";

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

  async fileExists(file: string, bucket: string) {
    const search = path.basename(file);
    const dirname = path.dirname(file);
    const folder = dirname === "." ? "" : dirname;
    const { data } = await this.supabase.storage
      .from(bucket)
      .list(folder, { search });
    return !!data?.length;
  }

  async handleFile(fileModel: FileModel, bucket: string) {
    console.log("handleFile");
    const filename = fileModel.filename ?? "";
    const fileString = fileModel.data;
    const fileExists = await this.fileExists(filename, bucket);
    console.log({ fileExists });
    // If no data, data not base64 or file exists, simply return file path
    if (!fileString || !this.isFileDataBase64(fileString) || fileExists) {
      return filename;
    }
    // Else decode base64
    const file = dataURLtoFile(fileString, filename);
    // Upload the File
    const { data: coverFile, error: coverError } = await this.supabase.storage
      .from(bucket)
      .upload(filename, file);
    if (coverError) throw coverError;
    // And return the new file path
    return coverFile.path;
  }
}
