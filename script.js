const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error");
const toggleBtn = document.getElementById("toggle-theme");
const savedList = document.getElementById("saved-list");

let savedWords = JSON.parse(localStorage.getItem("words")) || [];

// Load saved words
function displaySavedWords() {
savedList.innerHTML = "";
savedWords.forEach(word => {
const li = document.createElement("li");
li.textContent = word;
li.onclick = () => fetchWord(word);
savedList.appendChild(li);
});
}
displaySavedWords();

// Search event
form.addEventListener("submit", (e) => {
e.preventDefault();
const word = input.value.trim();
if (word) fetchWord(word);
});

// Fetch API
function fetchWord(word) {
fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
.then(res => {
if (!res.ok) throw new Error("Word not found");
return res.json();
})
.then(data => displayWord(data))
.catch(err => showError(err.message));
}

// Display result
function displayWord(data) {
errorDiv.textContent = "";

const wordData = data[0];
const meaning = wordData.meanings[0];
const definition = meaning.definitions[0];

const audio = wordData.phonetics.find(p => p.audio)?.audio;

resultDiv.innerHTML = `    <h2>${wordData.word}</h2>     <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>     <p><strong>Definition:</strong> ${definition.definition}</p>     <p><strong>Example:</strong> ${definition.example || "N/A"}</p>     <p><strong>Synonyms:</strong> ${meaning.synonyms.slice(0,5).join(", ") || "None"}</p>
    ${audio ?`<button onclick="playAudio('${audio}')">🔊 Play</button>`: ""}     <br><br>     <button onclick="saveWord('${wordData.word}')">💾 Save</button>
 `;

// Dynamic styling
resultDiv.style.border = "2px solid #007BFF";
}

// Play audio
function playAudio(src) {
const audio = new Audio(src);
audio.play();
}

// Save word
function saveWord(word) {
if (!savedWords.includes(word)) {
savedWords.push(word);
localStorage.setItem("words", JSON.stringify(savedWords));
displaySavedWords();
}
}

// Error handling
function showError(message) {
errorDiv.textContent = message;
resultDiv.innerHTML = "";
}

// Theme toggle
toggleBtn.addEventListener("click", () => {
document.body.classList.toggle("dark");
});
