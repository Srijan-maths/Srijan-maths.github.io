/**
 * Application State Storage & Persistence Manager
 */
class AppState {
  constructor() {
    this.mode = null; // 'practice' | 'mock'
    this.paper = null;
    this.currentIndex = 0;
    this.userAnswers = {}; // { questionIndex: string }
    this.reviewFlags = {}; // { questionIndex: boolean }
    this.results = []; // Array of result objects
    this.currentDifficulty = 5.0;
    this.adaptiveHistory = [];
    this.isSubmitted = false;
  }

  reset() {
    this.paper = null;
    this.currentIndex = 0;
    this.userAnswers = {};
    this.reviewFlags = {};
    this.results = [];
    this.adaptiveHistory = [];
    this.isSubmitted = false;
  }
}

window.appState = new AppState();
