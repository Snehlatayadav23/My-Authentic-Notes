
const noteContent = document.getElementById('note-content');
const addNoteButton = document.getElementById('add-note');
const clearNotesButton = document.getElementById('clear-notes');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme');
const voiceNoteButton = document.getElementById('voice-note');
const body = document.body;


let isDarkMode = false;


const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let isRecording = false;

const startVoiceNote = () => {
    if (!isRecording) {
        recognition.start();
        isRecording = true;
        voiceNoteButton.textContent = 'Stop Recording';
    } else {
        recognition.stop();
        isRecording = false;
        voiceNoteButton.textContent = '🎙️ Record Voice Note';
    }
};


recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    noteContent.value = speechToText;
};


recognition.onerror = (event) => {
    alert('Error occurred in voice recognition: ' + event.error);
};


const loadNotes = () => {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => addNoteToDOM(note));
};


const saveNote = (note) => {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
};


const updateNoteInLocalStorage = (oldNote, newNote) => {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const index = notes.indexOf(oldNote);
    if (index !== -1) {
        notes[index] = newNote;
    }
    localStorage.setItem('notes', JSON.stringify(notes));
};


const deleteNoteFromLocalStorage = (note) => {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(n => n !== note);
    localStorage.setItem('notes', JSON.stringify(notes));
};


const addNoteToDOM = (noteData) => {
    const { text, color } = noteData;
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.style.backgroundColor = color || '#f5f1e7'; 
    noteElement.innerHTML = `
        <textarea>${text}</textarea>
        <div class="note-actions">
            <button class="edit-note">✏️ Edit</button>
            <button class="delete-note">🗑️ Delete</button>
        </div>
    `;

    
    noteElement.querySelector('.delete-note').addEventListener('click', () => {
        deleteNoteFromLocalStorage(noteData);
        notesContainer.removeChild(noteElement);
    });

    
    noteElement.querySelector('.edit-note').addEventListener('click', () => {
        const updatedText = prompt('Edit your note:', text);
        if (updatedText !== null) {
            noteData.text = updatedText;
            updateNoteInLocalStorage(noteData, { ...noteData, text: updatedText });
            noteElement.querySelector('textarea').value = updatedText;
        }
    });

    notesContainer.appendChild(noteElement);
};


addNoteButton.addEventListener('click', () => {
    const noteText = noteContent.value.trim();
    if (noteText !== '') {
        const noteData = { text: noteText, color: '#f5f1e7' };
        saveNote(noteData);
        addNoteToDOM(noteData);
        noteContent.value = ''; 
    } else {
        alert('Please enter a note!');
    }
});

// Clear All Notes Event
clearNotesButton.addEventListener('click', () => {
    localStorage.clear();
    notesContainer.innerHTML = '';
});

// Toggle Theme
toggleThemeButton.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    body.classList.toggle('dark-mode', isDarkMode);
});


loadNotes();


voiceNoteButton.addEventListener('click', startVoiceNote);
