// Fungsi untuk menampilkan feedback (sama seperti sebelumnya)
function showFeedback(message, type = 'warning') {
    const feedbackElement = document.getElementById('feedback-puisi'); // Pastikan ID sesuai
    feedbackElement.textContent = message;
    feedbackElement.className = `mt-4 p-4 rounded relative ${
        type === 'success'
            ? 'bg-green-100 border border-green-400 text-green-700'
            : type === 'warning'
            ? 'bg-yellow-100 border border-yellow-400 text-yellow-700'
            : 'bg-red-100 border border-red-400 text-red-700'
    }`;
    feedbackElement.classList.remove('hidden');
}

function submitAnalisis() {
    const analisisInput = document.getElementById('analisis-puisi').value.trim();
    if (analisisInput === '') {
        showFeedback('Tuliskan analisis Anda terlebih dahulu.');
    } else {
        showFeedback('Terima kasih atas analisis Anda!', 'success');
        // Di sini, Anda bisa mengirim data analisis ke server atau melakukan hal lain
    }
}

// --- Bagian Dialog Interaktif ---
const dialogBox = document.getElementById('dialog-box');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');  // Pastikan ID sesuai dengan HTML
const scoreDisplay = document.getElementById('score-display');
const inputSuaraInput = document.getElementById('input-suara');
const startSuaraButton = document.getElementById('start-suara');

let score = 0;
let recognition;
let speaking = false; // Untuk cek apakah karakter sedang bicara
let currentDialog = 0; // Tambahkan inisialisasi currentDialog

// Data dialog (sama seperti sebelumnya, tapi dengan tambahan scoring)
const dialogData = [
    {
        text: "Selamat datang! Saya adalah teman dialogmu. Siap belajar Bahasa Indonesia?",
        options: [
            { text: "Siap!", next: 1, score: 5 },
            { text: "Belum siap.", next: undefined, score: 0 },
        ],
    },
    {
        text: "Bagus! Pertanyaan pertama: Apa sinonim dari kata 'bahagia'?",
        options: [
            { text: "Senang", next: 2, score: 10 },
            { text: "Sedih", next: undefined, score: 0 },
            { text: "Marah", next: undefined, score: 0 },
        ],
    },
    {
        text: "Benar sekali! Sinonim dari 'bahagia' adalah 'senang'. Pertanyaan kedua: Apa lawan kata dari 'besar'?",
        options: [
            { text: "Kecil", next: 3, score: 10 },
            { text: "Luas", next: undefined, score: 0 },
            { text: "Raksasa", next: undefined, score: 0 },
        ],
    },
    {
        text: "Tepat! Lawan kata dari 'besar' adalah 'kecil'. Sekarang, pertanyaan ini:",
        options: [
            { text: "Siapa nama presiden pertama Indonesia?", next: 4, score: 10 },
        ], // Tidak ada opsi, input via suara
        correctAnswer: "Soekarno", // Jawaban benar untuk input suara
    },
     {
        text: "Oke, pertanyaan terakhir. Pilih kata yang tepat untuk melengkapi kalimat ini: 'Ibu ... nasi di dapur.'",
        options: [
            { text: "Memasak", next: undefined, score: 10 },
            { text: "Makan", next: undefined, score: 0 },
            { text: "Tidur", next: undefined, score: 0 },
        ],
        correctAnswer: "Memasak",
    },
];



function showDialog() {
    const current = dialogData[currentDialog];
    if (!current) {
        endDialog(); // Panggil endDialog jika current undefined
        return;
    }

    dialogBox.textContent = current.text;
    optionsContainer.innerHTML = '';
    feedback.classList.add('hidden');
    inputSuaraInput.classList.add('hidden');
    startSuaraButton.classList.add('hidden');

     // Tambahkan animasi bicara jika karakter sedang bicara
    if (speaking) {
        dialogBox.classList.add('talking');
    } else {
        dialogBox.classList.remove('talking');
    }

    if (current.options.length > 0) {
        current.options.forEach((option) => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.className =
                'bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 option-button';
            button.addEventListener('click', () => {
                score += option.score;
                scoreDisplay.textContent = `Skor: ${score}`;
                currentDialog = option.next;
                if (currentDialog === undefined) {
                    endDialog();
                } else {
                    showDialog();
                }
            });
            optionsContainer.appendChild(button);
        });
    }  else {
        inputSuaraInput.value = ''; //kosongkan input
    }
}

function endDialog() {
    feedback.textContent = `Dialog selesai! Skor Anda: ${score}. Terima kasih sudah belajar!`;
    feedback.classList.remove('hidden');
    dialogBox.textContent = '';
    optionsContainer.innerHTML = '';
    inputSuaraInput.classList.add('hidden');
    startSuaraButton.classList.add('hidden');
    speaking = false;
    // Simpan skor ke localStorage
    localStorage.setItem('skorBahasa', score);
}



function validateInput(input) {
    const current = dialogData[currentDialog];
     if (!current) {
        return; //hentikan jika tidak ada dialog
     }
    if (current.correctAnswer) {
        if (input.toLowerCase().includes(current.correctAnswer.toLowerCase())) {
            score += 10;
            scoreDisplay.textContent = `Skor: ${score}`;
            feedback.textContent = 'Benar!';
            feedback.classList.remove('hidden');
            setTimeout(() => {
                currentDialog++;
                if (currentDialog === undefined) {
                    endDialog();
                } else {
                    showDialog();
                }
            }, 2000);
        } else {
            feedback.textContent = 'Maaf, jawaban Anda kurang tepat. Silakan coba lagi.';
            feedback.classList.remove('hidden');
        }
    } else if (current.options.length > 0){
         const selectedOption = current.options.find(option =>
            input.toLowerCase().includes(option.text.toLowerCase())
        );

        if (selectedOption) {
            score += selectedOption.score;
            scoreDisplay.textContent = `Skor: ${score}`;
            currentDialog = selectedOption.next;
            if (currentDialog === undefined) {
                 endDialog();
            } else {
                 showDialog();
            }
        }
        else {
             feedback.textContent = 'Maaf, jawaban Anda tidak sesuai dengan pilihan yang ada. Silakan coba lagi.';
             feedback.classList.remove('hidden');
        }

    }
    else {
        feedback.textContent = 'Maaf, tidak ada pilihan jawaban untuk pertanyaan ini. Silakan coba lagi.';
        feedback.classList.remove('hidden');
    }
}

inputSuaraInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        validateInput(inputSuaraInput.value.trim());
    }
});

// Load skor dari localStorage
const savedScore = localStorage.getItem('skorBahasa');
if (savedScore) {
    score = parseInt(savedScore, 10);
    scoreDisplay.textContent = `Skor: ${score}`;
}

showDialog(); // Mulai dialog
