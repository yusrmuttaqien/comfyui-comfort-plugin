// A single shared clock driving all comfort polling.
//
// The mute/bypass family and the NInfer gate all need periodic work (re-evaluate
// relay votes, refresh the group list, poll NInfer model status). Rather than
// each concern owning its own setInterval, they register a job with a cadence
// (in ticks) and this one timer invokes each job only when its tick is due.
// That keeps the browser from running several independent timers and makes the
// cadences easy to reason about in one place.
//
// Jobs are compared by reference, so callers must hold a stable closure (a
// module-level `const`), not an inline arrow.

const BASE_MS = 500;

type Job = () => void;

class ComfortScheduler {
  private timer: number | null = null;
  private counter = 0;
  private jobs = new Map<Job, number>();

  /** Run `job` every `cadenceTicks` ticks (1 = every 500ms). */
  schedule(job: Job, cadenceTicks: number): void {
    this.jobs.set(job, Math.max(1, cadenceTicks));
    this.ensureTimer();
  }

  unschedule(job: Job): void {
    this.jobs.delete(job);
    if (!this.jobs.size) this.stopTimer();
  }

  private ensureTimer(): void {
    if (this.timer == null) {
      this.timer = window.setInterval(() => this.tick(), BASE_MS);
    }
  }

  private stopTimer(): void {
    if (this.timer != null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick(): void {
    // Wrap well below Number.MAX_SAFE_INTEGER so the modulo stays exact.
    this.counter = (this.counter + 1) % 1_000_000;
    for (const [job, cadence] of this.jobs) {
      if (this.counter % cadence !== 0) continue;
      try {
        job();
      } catch {
        /* a single job's error must not stall the others */
      }
    }
  }
}

export const scheduler = new ComfortScheduler();
