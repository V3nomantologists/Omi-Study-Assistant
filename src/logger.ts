const enabled = process.env.NODE_ENV !== 'production';

export function logDebug(message: string, data?: Record<string, unknown>) {
  if (!enabled) return;
  if (data) {
    console.log(`[debug] ${message}`, data);
  } else {
    console.log(`[debug] ${message}`);
  }
}
