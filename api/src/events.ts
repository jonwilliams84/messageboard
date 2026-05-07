type Subscriber = (data: string) => void;

const subscribers = new Set<Subscriber>();

export function subscribe(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function publish(payload: unknown): void {
  const data = JSON.stringify(payload);
  for (const fn of subscribers) {
    try {
      fn(data);
    } catch {
      subscribers.delete(fn);
    }
  }
}
