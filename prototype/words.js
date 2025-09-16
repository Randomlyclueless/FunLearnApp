class WordLearningApp {
  constructor() {
    this.currentCategoryIndex = 0;
    this.currentWordIndex = 0;
    this.progress = this.loadProgress();
    this.isSpellingLetters = false; // Track if spelling is in progress

    this.wordCategories = [
      {
        name: "Animals",
        emoji: "🐾",
        words: [
          { word: "cat" },
          { word: "dog" },
          { word: "elephant" },
          { word: "lion" },
          { word: "rabbit" },
        ],
      },
      {
        name: "Fruits",
        emoji: "🍎",
        words: [
          { word: "apple" },
          { word: "banana" },
          { word: "orange" },
          { word: "grape" },
          { word: "strawberry" },
        ],
      },
      {
        name: "Colors",
        emoji: "🌈",
        words: [
          { word: "red" },
          { word: "blue" },
          { word: "green" },
          { word: "yellow" },
          { word: "purple" },
        ],
      },
      {
        name: "Flowers",
        emoji: "🌸",
        words: [
          { word: "rose" },
          { word: "daisy" },
          { word: "tulip" },
          { word: "sunflower" },
          { word: "lily" },
        ],
      },
      {
        name: "Shapes",
        emoji: "🔷",
        words: [
          { word: "circle" },
          { word: "square" },
          { word: "triangle" },
          { word: "rectangle" },
          { word: "star" },
        ],
      },
    ];

    this.wordImages = {
      cat: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg",
      dog: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
      elephant:
        "https://upload.wikimedia.org/wikipedia/commons/3/37/African_Bush_Elephant.jpg",
      lion: "https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg",
      rabbit:
        "https://upload.wikimedia.org/wikipedia/commons/9/94/Oryctolagus_cuniculus_Rcdo.jpg",
      apple: "🍎",
      banana: "🍌",
      orange: "🍊",
      grape: "🍇",
      strawberry: "🍓",
      red: "❤️",
      blue: "🌊",
      green: "🌱",
      yellow: "☀️",
      purple: "🍇",
      rose: "🌹",
      daisy: "🌼",
      tulip: "🌷",
      sunflower: "🌻",
      lily: "🌸",
      circle: "⚪",
      square: "⬜",
      triangle: "🔺",
      rectangle: "📏",
      star: "⭐",
    };

    this.sounds = {
      click: new Audio("https://www.soundjay.com/buttons/button-09.mp3"),
      success: new Audio(
        "https://www.soundjay.com/misc/sounds/achievement-01.mp3"
      ),
    };

    this.init();
  }

  init() {
    this.injectStyles();
    this.createHTML();
    this.bindEvents();
    this.updateDisplay();
    this.fetchDefinition();
  }

  injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      body {
        font-family: "Comic Sans MS", cursive, sans-serif;
        background: linear-gradient(135deg, #e1f5fe 0%, #fff9c4 100%);
        min-height: 100vh;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        overflow-x: hidden;
      }
      .app-container {
        max-width: 800px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }
      .header { 
        text-align: center; 
        animation: slideInDown 0.5s ease-out;
      }
      .title {
        font-size: 2.5rem;
        font-weight: bold;
        color: #2e7d32;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        margin: 10px 0;
      }
      .progress-bar {
        width: 100%;
        max-width: 500px;
        height: 10px;
        background: #e0e0e0;
        border-radius: 5px;
        overflow: hidden;
        margin: 10px 0;
      }
      .progress-fill {
        height: 100%;
        background: #4caf50;
        transition: width 0.3s ease;
      }
      .category-selector {
        display: flex;
        align-items: center;
        gap: 20px;
        background: white;
        padding: 15px 25px;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: transform 0.2s;
      }
      .category-selector:hover {
        transform: scale(1.02);
      }
      .category-btn {
        background: #4caf50;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        min-width: 45px;
        height: 45px;
        transition: transform 0.2s;
      }
      .category-btn:hover {
        transform: scale(1.1);
      }
      .category-display {
        display: flex;
        gap: 10px;
        align-items: center;
        min-width: 200px;
        justify-content: center;
      }
      .category-name {
        font-size: 1.5rem;
        font-weight: bold;
        color: #1976d2;
      }
      .word-card {
        background: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        width: 100%;
        max-width: 500px;
        animation: fadeInUp 0.5s ease-out;
      }
      .word-text {
        font-size: 3rem;
        font-weight: bold;
        color: #1976d2;
        opacity: 0;
        animation: fadeIn 0.5s forwards;
      }
      .word-letters {
        font-size: 2rem;
        font-weight: bold;
        color: #4e342e;
        letter-spacing: 10px;
        display: flex;
        justify-content: center;
        gap: 12px;
        margin: 10px 0;
      }
      .word-letters span {
        transform: scale(0);
        animation: popIn 0.3s forwards;
      }
      .word-letters .highlight {
        color: #e91e63;
        transform: scale(1.2);
        transition: all 0.3s ease;
      }
      @keyframes popIn {
        to { transform: scale(1); }
      }
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideInDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .word-image {
        width: 120px;
        height: 120px;
        object-fit: contain;
        border-radius: 10px;
        transition: transform 0.3s;
      }
      .word-image:hover {
        transform: scale(1.1);
      }
      .image-error {
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        border-radius: 10px;
        color: #666;
        font-size: 1rem;
      }
      .audio-button {
        background: #4caf50;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s;
        margin: 5px;
      }
      .audio-button:hover:not(:disabled) {
        background: #45a049;
      }
      .audio-button:disabled {
        background: #cccccc;
        cursor: not-allowed;
      }
      .definition-section {
        background: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        max-width: 600px;
        width: 100%;
        text-align: center;
        min-height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.5s ease-out;
      }
      .loading-spinner {
        font-size: 1.2rem;
        color: #1976d2;
        display: none;
      }
      .definition-text {
        font-size: 1.3rem;
        color: #333;
        font-weight: 500;
      }
      .word-controls {
        display: flex;
        gap: 20px;
        align-items: center;
      }
      .nav-button {
        background: #2196f3;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.2s, transform 0.2s;
      }
      .nav-button:hover {
        background: #1e88e5;
        transform: scale(1.05);
      }
      .word-counter {
        background: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 1rem;
        color: #1976d2;
        font-weight: bold;
      }
      @media (max-width: 600px) {
        .title { font-size: 2rem; }
        .word-text { font-size: 2.5rem; }
        .word-letters { font-size: 1.5rem; }
        .category-name { font-size: 1.2rem; }
        .category-btn { min-width: 35px; height: 35px; }
        .word-image { width: 100px; height: 100px; }
        .audio-button { padding: 10px 15px; font-size: 1rem; }
      }
    `;
    document.head.appendChild(style);
  }

  createHTML() {
    document.body.innerHTML = `
      <div class="app-container">
        <div class="header">
          <h1 class="title">📝 Leximate - Learn Words</h1>
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
          </div>
        </div>
        <div class="category-selector">
          <button class="category-btn" id="prevCategory">⬅</button>
          <div class="category-display">
            <span id="categoryEmoji"></span>
            <span class="category-name" id="categoryName"></span>
          </div>
          <button class="category-btn" id="nextCategory">➡</button>
        </div>
        <div class="word-card">
          <h2 class="word-text" id="wordText"></h2>
          <div class="word-letters" id="wordLetters"></div>
          <div id="wordImageContainer"></div>
          <div>
            <button class="audio-button" id="speakButton">🔊 Hear Word</button>
            <button class="audio-button" id="spellButton">🔤 Spell Letters</button>
          </div>
        </div>
        <div class="definition-section">
          <div class="loading-spinner" id="loadingSpinner">Loading...</div>
          <p class="definition-text" id="definitionText"></p>
        </div>
        <div class="word-controls">
          <button class="nav-button" id="prevWord">⬅ Prev</button>
          <div class="word-counter"><span id="wordCounter"></span></div>
          <button class="nav-button" id="nextWord">Next ➡</button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const prevCategory = document.getElementById("prevCategory");
    const nextCategory = document.getElementById("nextCategory");
    const prevWord = document.getElementById("prevWord");
    const nextWord = document.getElementById("nextWord");
    const speakButton = document.getElementById("speakButton");
    const spellButton = document.getElementById("spellButton");

    if (prevCategory) {
      prevCategory.addEventListener("click", () => {
        this.playSound("click");
        this.previousCategory();
      });
    } else {
      console.error("Previous Category button not found");
    }

    if (nextCategory) {
      nextCategory.addEventListener("click", () => {
        this.playSound("click");
        this.nextCategory();
      });
    } else {
      console.error("Next Category button not found");
    }

    if (prevWord) {
      prevWord.addEventListener("click", () => {
        this.playSound("click");
        this.previousWord();
      });
    } else {
      console.error("Previous Word button not found");
    }

    if (nextWord) {
      nextWord.addEventListener("click", () => {
        this.playSound("click");
        this.nextWord();
      });
    } else {
      console.error("Next Word button not found");
    }

    if (speakButton) {
      speakButton.addEventListener("click", () => {
        this.playSound("click");
        this.speakWord();
      });
    } else {
      console.error("Speak Word button not found");
    }

    if (spellButton) {
      spellButton.addEventListener("click", () => {
        console.log("Spell Letters button clicked");
        this.playSound("click");
        spellButton.textContent = "🔤 Spelling...";
        this.spellLetters().finally(() => {
          spellButton.textContent = "🔤 Spell Letters";
        });
      });
    } else {
      console.error("Spell Letters button not found");
    }
  }

  playSound(type) {
    try {
      this.sounds[type].currentTime = 0;
      this.sounds[type]
        .play()
        .catch((err) => console.error("Sound play error:", err));
    } catch (err) {
      console.error("Sound initialization error:", err);
    }
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem("leximateProgress");
      return saved ? JSON.parse(saved) : {};
    } catch (err) {
      console.error("Error loading progress:", err);
      return {};
    }
  }

  saveProgress() {
    try {
      this.progress[this.currentCategoryIndex] = this.currentWordIndex;
      localStorage.setItem("leximateProgress", JSON.stringify(this.progress));
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  }

  getCurrentCategory() {
    return this.wordCategories[this.currentCategoryIndex];
  }

  getCurrentWord() {
    return this.getCurrentCategory().words[this.currentWordIndex];
  }

  updateDisplay() {
    const category = this.getCurrentCategory();
    const wordData = this.getCurrentWord();

    document.getElementById("categoryEmoji").textContent = category.emoji;
    document.getElementById("categoryName").textContent = category.name;
    document.getElementById("wordText").textContent = wordData.word;

    // Update progress bar
    const progressPercent =
      ((this.currentWordIndex + 1) / category.words.length) * 100;
    document.getElementById("progressFill").style.width = `${progressPercent}%`;

    // Update letters
    const lettersDiv = document.getElementById("wordLetters");
    lettersDiv.innerHTML = "";
    wordData.word.split("").forEach((letter, i) => {
      const span = document.createElement("span");
      span.textContent = letter.toUpperCase();
      span.style.animationDelay = `${i * 0.2}s`;
      lettersDiv.appendChild(span);
    });

    // Update image with error handling
    const imgContainer = document.getElementById("wordImageContainer");
    imgContainer.innerHTML = "";
    const imgData = this.wordImages[wordData.word];
    if (imgData) {
      if (imgData.startsWith("http")) {
        const img = document.createElement("img");
        img.src = imgData;
        img.className = "word-image";
        img.onerror = () => {
          imgContainer.innerHTML = `<div class="image-error">Image not available</div>`;
        };
        imgContainer.appendChild(img);
      } else {
        const span = document.createElement("span");
        span.textContent = imgData;
        span.style.fontSize = "5rem";
        imgContainer.appendChild(span);
      }
    } else {
      imgContainer.innerHTML = `<div class="image-error">No image</div>`;
    }

    document.getElementById("wordCounter").textContent = `${
      this.currentWordIndex + 1
    } / ${category.words.length}`;

    this.saveProgress();

    // Automatically spell letters for the current word
    setTimeout(() => this.spellLetters(), 500); // Slight delay to avoid overlap
  }

  previousCategory() {
    this.currentCategoryIndex =
      this.currentCategoryIndex > 0
        ? this.currentCategoryIndex - 1
        : this.wordCategories.length - 1;
    this.currentWordIndex = this.progress[this.currentCategoryIndex] || 0;
    this.updateDisplay();
    this.fetchDefinition();
    this.playSound("success");
  }

  nextCategory() {
    this.currentCategoryIndex =
      (this.currentCategoryIndex + 1) % this.wordCategories.length;
    this.currentWordIndex = this.progress[this.currentCategoryIndex] || 0;
    this.updateDisplay();
    this.fetchDefinition();
    this.playSound("success");
  }

  previousWord() {
    const category = this.getCurrentCategory();
    this.currentWordIndex =
      this.currentWordIndex > 0
        ? this.currentWordIndex - 1
        : category.words.length - 1;
    this.updateDisplay();
    this.fetchDefinition();
  }

  nextWord() {
    const category = this.getCurrentCategory();
    this.currentWordIndex = (this.currentWordIndex + 1) % category.words.length;
    this.updateDisplay();
    this.fetchDefinition();
  }

  speakWord() {
    const wordData = this.getCurrentWord();
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(wordData.word);
      utterance.rate = 0.6;
      utterance.pitch = 1.1;
      utterance.onend = () => this.playSound("success");
      speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported");
      alert("Speech synthesis not supported in your browser");
    }
  }

  async spellLetters() {
    if (this.isSpellingLetters) {
      console.log("Spelling in progress, ignoring request");
      return; // Prevent overlapping calls
    }
    this.isSpellingLetters = true;

    const spellButton = document.getElementById("spellButton");
    const originalButtonText = spellButton
      ? spellButton.textContent
      : "🔤 Spell Letters";
    if (spellButton) spellButton.disabled = true;

    const wordData = this.getCurrentWord();
    const letters = wordData.word.split("");
    const lettersDiv = document.getElementById("wordLetters");

    if (!lettersDiv || letters.length === 0) {
      console.error("No letters to spell or letters div not found");
      if (spellButton) {
        spellButton.disabled = false;
        spellButton.textContent = originalButtonText;
      }
      this.isSpellingLetters = false;
      return;
    }

    if ("speechSynthesis" in window) {
      try {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        for (let i = 0; i < letters.length; i++) {
          const letterSpans = lettersDiv.querySelectorAll("span");
          if (letterSpans[i]) {
            letterSpans.forEach((span) => span.classList.remove("highlight"));
            letterSpans[i].classList.add("highlight");

            const utterance = new SpeechSynthesisUtterance(letters[i]);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            await new Promise((resolve) => {
              utterance.onend = resolve;
              utterance.onerror = (err) => {
                console.error("Speech utterance error:", err);
                resolve();
              };
              speechSynthesis.speak(utterance);
            });
            await new Promise((resolve) => setTimeout(resolve, 300)); // Delay between letters
            letterSpans[i].classList.remove("highlight");
          }
        }

        // After spelling, speak the full word
        const utterance = new SpeechSynthesisUtterance(wordData.word);
        utterance.rate = 0.6;
        utterance.pitch = 1.1;
        await new Promise((resolve) => {
          utterance.onend = () => {
            this.playSound("success");
            resolve();
          };
          utterance.onerror = (err) => {
            console.error("Speech utterance error:", err);
            resolve();
          };
          speechSynthesis.speak(utterance);
        });
      } catch (err) {
        console.error("Error spelling letters:", err);
        alert(
          "Error while spelling letters. Please try again or check your browser's audio settings."
        );
      }
    } else {
      console.error("Speech synthesis not supported");
      alert(
        "Speech synthesis not supported in your browser. Please use a compatible browser like Chrome, Firefox, or Edge."
      );
    }

    this.isSpellingLetters = false;
    if (spellButton) {
      spellButton.disabled = false;
      spellButton.textContent = originalButtonText;
    }
  }

  async fetchDefinition() {
    const wordData = this.getCurrentWord();
    const spinner = document.getElementById("loadingSpinner");
    const defText = document.getElementById("definitionText");
    spinner.style.display = "block";
    defText.style.display = "none";

    const simpleDefinitions = {
      cat: "A small furry pet that says meow.",
      dog: "A friendly pet that barks.",
      elephant: "A very big animal with a long trunk.",
      lion: "A big wild cat that roars.",
      rabbit: "A small fluffy animal that hops.",
      apple: "A round red or green fruit.",
      banana: "A long yellow fruit.",
      orange: "A juicy round fruit.",
      grape: "Small round fruits in bunches.",
      strawberry: "A red fruit with tiny seeds.",
      red: "The color of roses.",
      blue: "The color of the sky.",
      green: "The color of grass.",
      yellow: "The color of the sun.",
      purple: "The color of grapes.",
      rose: "A pretty flower with thorns.",
      daisy: "A white flower with a yellow center.",
      tulip: "A cup-shaped spring flower.",
      sunflower: "A tall flower that follows the sun.",
      lily: "A delicate flower near water.",
      circle: "A round shape like a ball.",
      square: "A shape with four equal sides.",
      triangle: "A shape with three sides.",
      rectangle: "A shape like a door.",
      star: "A shape with points like stars in the sky.",
    };

    try {
      await new Promise((r) => setTimeout(r, 500));
      defText.textContent =
        "📖 " + (simpleDefinitions[wordData.word] || "A fun word to learn!");
      spinner.style.display = "none";
      defText.style.display = "block";
    } catch (err) {
      console.error("Error fetching definition:", err);
      defText.textContent = "📖 Unable to load definition";
      spinner.style.display = "none";
      defText.style.display = "block";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    new WordLearningApp();
  } catch (err) {
    console.error("Error initializing app:", err);
    document.body.innerHTML =
      '<div style="text-align: center; color: red;">Error loading application. Please try again.</div>';
  }
});
