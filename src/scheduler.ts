// Shared clock for all comfort polling. One setInterval. Jobs register by cadence (ticks).

const BASE_MS = 500;

type Job = () => void;

class ComfortScheduler {
  private timer: number | null = null;
  private counter = 0;
  private jobs = new Map<Job, number>();


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
