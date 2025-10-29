export type NormalizedUser = {
  id: number | string | null;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  phone_number?: string | null;
  total_points?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  // allow any extra props
  [key: string]: any;
};

export function mapUser(raw: any): NormalizedUser | null {
  if (!raw) return null;

  // raw may be: { user: { ... } }, { data: { user: { ... } } }, or the user object itself
  const user = raw.user ?? raw.data?.user ?? raw.data ?? raw;

  if (!user || typeof user !== "object") return null;

  const normalized: NormalizedUser = {
    id: user.id ?? null,
    name: user.name ?? user.full_name ?? user.username ?? null,
    email: user.email ?? null,
    avatar:
      user.avatar ??
      user.avatar_url ??
      user.profile_image ??
      user.photo ??
      null,
    phone_number: user.phone_number ?? user.phone ?? null,
    total_points:
      user.total_points ?? user.points ?? user.point_balance ?? null,
    created_at: user.created_at ?? user.createdAt ?? null,
    updated_at: user.updated_at ?? user.updatedAt ?? null,
  };

  // copy additional keys that might be used by the UI
  for (const k of [
    "id",
    "name",
    "email",
    "avatar",
    "phone_number",
    "total_points",
    "created_at",
    "updated_at",
  ]) {
    delete (user as any)[k];
  }

  return { ...user, ...normalized };
}

export default mapUser;
