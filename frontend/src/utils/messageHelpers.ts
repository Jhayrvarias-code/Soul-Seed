/** Sender from API (populated) or socket (often string ObjectId until populated). */
export function getSenderId(sender: unknown): string | undefined {
  if (sender == null) return undefined;
  if (typeof sender === "string") return sender;
  if (typeof sender !== "object") return undefined;
  const doc = sender as { _id?: unknown };
  const id = doc._id;
  if (typeof id === "string") return id;
  if (id != null && typeof (id as { toString(): string }).toString === "function") {
    const s = (id as { toString(): string }).toString();
    if (typeof s === "string" && s !== "[object Object]") return s;
  }
  return undefined;
}

export function messageIdString(id: unknown): string | undefined {
  if (typeof id === "string") return id;
  if (id != null && typeof (id as { toString(): string }).toString === "function") {
    const s = (id as { toString(): string }).toString();
    if (typeof s === "string" && s !== "[object Object]") return s;
  }
  return undefined;
}
