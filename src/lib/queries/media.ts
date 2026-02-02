import { createClient } from "@/lib/supabase/client";

const BUCKET_NAME = "media";

interface UploadResult {
  path: string;
  publicUrl: string;
}

export async function uploadFile(
  file: File,
  folder: "covers" | "wiki" | "content" = "content",
): Promise<UploadResult> {
  const supabase = createClient();

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl: urlData.publicUrl,
  };
}

export async function deleteFile(path: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) throw error;
}

export async function listFiles(folder: string = "") {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) throw error;

  return data.map((file) => {
    const path = folder ? `${folder}/${file.name}` : file.name;
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);
    return {
      ...file,
      path,
      publicUrl: urlData.publicUrl,
    };
  });
}

// Save media record to database
export async function saveMediaRecord(media: {
  filename: string;
  storage_path: string;
  url: string;
  mime_type?: string;
  size_bytes?: number;
  alt_text?: string;
  story_id?: string;
  chapter_id?: string;
  entity_id?: string;
}) {
  const supabase = createClient();

  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("media")
    .insert({
      filename: media.filename,
      storage_path: media.storage_path,
      url: media.url,
      mime_type: media.mime_type,
      size_bytes: media.size_bytes,
      alt_text: media.alt_text,
      story_id: media.story_id,
      chapter_id: media.chapter_id,
      entity_id: media.entity_id,
      uploaded_by: user.user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMediaRecords(limit = 50, offset = 0) {
  const supabase = createClient();

  const { data, error, count } = await supabase
    .from("media")
    .select("*, profiles(username)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { media: data, count };
}

export async function deleteMediaRecord(id: string) {
  const supabase = createClient();

  // Get the storage path first
  const { data: record, error: fetchError } = await supabase
    .from("media")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // Delete from storage
  if (record.storage_path) {
    await deleteFile(record.storage_path);
  }

  // Delete from database
  const { error } = await supabase.from("media").delete().eq("id", id);

  if (error) throw error;
}
