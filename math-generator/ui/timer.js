/**
 * Precision Countdown Timer Component
 */
class ExamTimer {
  constructor(durationSeconds, onTick, onExpire) {
    this.remainingSeconds = durationSeconds;
    this.onTick = onTick;
    this.onExpire = onExpire;
    this.timerId = null;
  }

  start() {
    this.stop();
    this.timerId = setInterval(() => {
      this.remainingSeconds--;
      if (this.onTick) this.onTick(this.remainingSeconds);

      if (this.remainingSeconds <= 0) {
        this.stop();
        if (this.onExpire) this.onExpire();
      }
    }, 1000);
  }

  stop() {
    if (this.timerId) clearInterval(this.timerId);
  }

  static formatTime(totalSeconds) {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

window.ExamTimer = ExamTimer;
