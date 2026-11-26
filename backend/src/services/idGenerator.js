import { Counter } from '../models/Counter.js';

export async function generateComplaintId() {
  const currentYear = new Date().getFullYear();
  try {
    const counter = await Counter.findOneAndUpdate(
      { year: currentYear },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const seqPadded = String(counter.seq).padStart(5, '0');
    return `NMF-${currentYear}-${seqPadded}`;
  } catch (error) {
    // Fallback timestamp-based generator if DB is in degraded mode
    const randomSeq = String(Math.floor(1000 + Math.random() * 9000)).padStart(5, '0');
    return `NMF-${currentYear}-${randomSeq}`;
  }
}
