// Función para crear un objeto canción
function createSong(artistName, title, audioPath, artistImage) {
    return {
        artistName,
        artistImage,
        title,
        audio: new Audio(audioPath),
    };
}

// Arreglo de canciones
let songs = [

    new createSong("Simple Plan", "Welcome to My Life", "songs/welcome.mp3", "img/simplePlan.png"),
    new createSong("Simple Plan", "What's New Scooby-Doo?", "songs/whats.mp3", "img/scooby.png"),
    new createSong("Taylor Swift", "Shake it Off", "songs/shake.mp3", "img/taylor.png"),
    new createSong("Taylor Swift", "Love Story", "songs/love.mp3", "img/love.png"),
    new createSong("Simple Plan", "I'm Just a Kid", "songs/kid.mp3", "img/kid.png"),
    new createSong("Train", "Marry Me", "songs/marry.mp3", "img/train.png"),
    new createSong("Train", "Hey, Soul Sister", "songs/hey.mp3", "img/sister.png"),
    new createSong("Pereza", "Princesas", "songs/princesas.mp3", "img/princesas.png"),
    new createSong("Pereza", "Lady Madrid", "songs/lady.mp3", "img/lady.png"),
    new createSong("Pereza", "Pienso en Aquella Tarde", "songs/pienso.mp3", "img/pienso.png"),
    new createSong("James Blunt", "Bonfire Heart", "songs/bonfire.mp3", "img/james.png"),
    new createSong("James Blunt", "You're Beautiful", "songs/youre.mp3", "img/beautiful.png"),
    new createSong("Phil Collins", "En Marcha Estoy", "songs/en.mp3", "img/en.png"),
    new createSong("Phil Collins", "No Hay Salida", "songs/no.mp3", "img/no.png"),
    new createSong("James Blunt", "1973", "songs/1973.mp3", "img/1973.png"),
    new createSong("Train", "Drive By", "songs/drive.mp3", "img/drive.png"),
    new createSong("Phil Collins", "Hijo de Hombre", "songs/hijo.mp3", "img/hijo.png"),
    new createSong("Melendi", "Pirata del bar caribe", "songs/pirata.mp3", "img/pirata.png"),
    new createSong("Melendi", "Caminando por la vida", "songs/caminando.mp3", "img/caminando.png"),
    new createSong("Melendi", "Magic Alonso", "songs/nano.mp3", "img/nano.png"),
    new createSong("Taylor Swift", "Cruel Summer", "songs/cruel.mp3", "img/summer.png"),
];

// Función para comparar canciones por artista y título
function compareSongs(a, b) {
    // Compara los artistas primero
    if (a.artistName < b.artistName) {
        return -1;
    }
    if (a.artistName > b.artistName) {
        return 1;
    }

    // Si los artistas son iguales, compara por título
    if (a.title < b.title) {
        return -1;
    }
    if (a.title > b.title) {
        return 1;
    }

    return 0;
}

// Ordena las canciones por artista y título
songs.sort(compareSongs);

// Configuración para mostrar un número específico de canciones por página
let elementsPerPage = 3;
let totalPages = Math.ceil(songs.length / elementsPerPage);
let currentPage = 1;

// Elementos del reproductor de música
let artistNameElement = document.getElementById("artist-name");
let artistImageElement = document.getElementById("artist-image");
let songTitleElement = document.getElementById("song-title");
let playButton = document.getElementById("play-button");
let pauseButton = document.getElementById("pause-button");
let audioPlayer = new Audio();
let progressBar = document.getElementById('progress');
let previousButton = document.getElementById("previous-button");
let nextButton = document.getElementById("next-button");
let loopButton = document.getElementById("loop-button");
let randomButton = document.getElementById("random-button");
let volumeSlider = document.getElementById("sliderVolumen");
let volumeButton = document.getElementById("volume-button");
let songListElement = document.getElementById("song-list");

// Índice de la canción actual
let currentSongIndex = 0;

// Variables para controlar el modo de reproducción
let isLooping = false;
let isRandom = false;
let isMuted = false;
let lastPlayedIndex = 0;

// Función para controlar el botón de silencio
volumeButton.addEventListener("click", toggleMute);

// Función para alternar entre silenciado y sonido
function toggleMute() {
    if (isMuted) {
        audioPlayer.volume = 0.1;
        volumeSlider.value = 10;
        volumeButton.className = "bx bxs-volume-full";
    } else {
        audioPlayer.volume = 0;
        volumeSlider.value = 0;
        volumeButton.className = "bx bxs-volume-mute";
    }
    isMuted = !isMuted;
}

// Mostrar el botón de reproducción y pausa
playButton.style.display = "inline-block";
pauseButton.style.display = "none";

// Eventos para los botones de repetición y reproducción aleatoria
loopButton.addEventListener("click", toggleLoop);
randomButton.addEventListener("click", toggleRandom);

// Evento cuando una canción termina
audioPlayer.addEventListener("ended", playNextSong);

// Evento cuando se inicia la reproducción de una canción
audioPlayer.addEventListener("play", () => {
    playButton.style.display = "none";
    pauseButton.style.display = "inline-block";
    artistImageElement.classList.add("rotating");
});

// Evento cuando se pausa la reproducción de una canción
audioPlayer.addEventListener("pause", () => {
    playButton.style.display = "inline-block";
    pauseButton.style.display = "none";
    artistImageElement.classList.remove("rotating");
});

// Evento para controlar la barra de progreso
progressBar.addEventListener("input", () => {
    let currentTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = currentTime;
});

// Evento para controlar el deslizador de volumen
volumeSlider.addEventListener("input", () => {
    let volume = volumeSlider.value / 100;
    audioPlayer.volume = volume;
    if (volume > 0) {
        isMuted = false;
        if (volume <= 0.2) {
            volumeButton.className = "bx bxs-volume";
        } else if (volume > 0.2 && volume <=0.4){
            volumeButton.className = "bx bxs-volume-low";
        }else{
            volumeButton.className = "bx bxs-volume-full";
        }
        
    } 
    else {
        isMuted = true;
        volumeButton.className = "bx bxs-volume-mute";
    }
});

// Función para actualizar la barra de progreso
function updateProgress() {
    if (audioPlayer.currentTime > 0) {
        progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;

        let durationSeconds = Math.floor(audioPlayer.duration);
        let currentSeconds = Math.floor(audioPlayer.currentTime);

        let formattedDuration = secondsToString(durationSeconds);
        let formattedCurrentTime = secondsToString(currentSeconds);

        document.getElementById('current-time').innerText = formattedCurrentTime;
        document.getElementById('song-duration').innerText = formattedDuration;
    }
    if (audioPlayer.ended) {
        playNextSong();
    }
}

// Evento para actualizar la barra de progreso durante la reproducción
audioPlayer.addEventListener("timeupdate", updateProgress);

// Eventos para los botones de reproducción y pausa
playButton.addEventListener("click", playSong);
pauseButton.addEventListener("click", pauseSong);

// Evento para el botón de reproducción anterior
previousButton.addEventListener("click", playPreviousSong);

// Evento para el botón de reproducción siguiente
nextButton.addEventListener("click", playNextSong);

// Función para reproducir la canción anterior
function playPreviousSong() {
    if (isRandom) {
        // Modo aleatorio activado
        if (lastPlayedIndex !== currentSongIndex) {
            // Si la última canción no fue la misma que la actual
            currentSongIndex = lastPlayedIndex; // Vuelve a la última canción
        } else {
            // Si la última canción fue la misma que la actual, selecciona una nueva aleatoria
            let newRandomIndex;
            do {
                // Genera un número aleatorio para seleccionar una nueva canción.
                newRandomIndex = Math.floor(Math.random() * songs.length);
            } while (newRandomIndex === currentSongIndex);
            // Continúa generando un nuevo número aleatorio si coincide con el índice de la canción actual.
            
            currentSongIndex = newRandomIndex;
        }
    } else {
        // Modo aleatorio desactivado, simplemente retrocede a la canción anterior
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
    loadSong(currentSongIndex);
    playSong();
}

// Función para alternar el modo de reproducción aleatoria
function toggleRandom() {
    isRandom = !isRandom;
    randomButton.classList.toggle("active", isRandom);

    if (isRandom) {
        randomButton.style.color = "#FF11A0";
        playRandomSong();
        // Desactiva el modo de bucle
        isLooping = false;
        audioPlayer.loop = isLooping;
        loopButton.classList.remove("active");
        loopButton.style.color = "";
    } else {
        randomButton.style.color = "";
    }
}

// Función para alternar el modo de repetición
function toggleLoop() {
    isLooping = !isLooping;
    audioPlayer.loop = isLooping;
    loopButton.classList.toggle("active", isLooping);

    if (isLooping) {
        loopButton.style.color = "#FF11A0";
        // Desactiva el modo aleatorio
        isRandom = false;
        randomButton.classList.remove("active");
        randomButton.style.color = "";
    } else {
        loopButton.style.backgroundColor = "";
        loopButton.style.color = "";
    }
}

// Función para cargar una canción
function loadSong(songIndex) {
    let song = songs[songIndex];
    artistNameElement.textContent = song.artistName;
    artistImageElement.style.backgroundImage = `url(${song.artistImage})`;
    songTitleElement.textContent = song.title;
    audioPlayer.src = song.audio.src;
    audioPlayer.load();
    audioPlayer.addEventListener("loadedmetadata", showDuration);
    showDuration();
}

// Función para reproducir una canción
function playSong() {
    audioPlayer.play();
}

// Función para pausar una canción
function pauseSong() {
    audioPlayer.pause();
}

// Función para convertir segundos en formato minutos:segundos
function secondsToString(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Función para mostrar las canciones en la página actual
function showSongsOnPage(page) {
    songListElement.innerHTML = "";

    let start = (page - 1) * elementsPerPage;
    let end = start + elementsPerPage;
    let songsOnPage = songs.slice(start, end);

    songsOnPage.forEach((song, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = `${song.artistName} - ${song.title}`;
        listItem.addEventListener("click", () => {
            loadSong(index + start);
            playSong();
        });
        songListElement.appendChild(listItem);
    });
}

// Función para crear los enlaces de paginación
function createPaginationLinks() {
    let paginationElement = document.getElementById("pagination");

    paginationElement.innerHTML = "";

    let prevButton = document.createElement("a");
    prevButton.href = "#";
    prevButton.textContent = "Anterior";
    prevButton.classList.add("prev-next");
    prevButton.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            showSongsOnPage(currentPage);
            createPaginationLinks();
        }
    });

    let nextButton = document.createElement("a");
    nextButton.href = "#";
    nextButton.textContent = "Siguiente";
    nextButton.classList.add("prev-next");
    nextButton.addEventListener("click", function () {
        if (currentPage < totalPages) {
            currentPage++;
            showSongsOnPage(currentPage);
            createPaginationLinks();
        }
    });
    paginationElement.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        let link = document.createElement("a");
        link.href = "#";
        link.textContent = i;

        link.addEventListener("click", () => {
            currentPage = i;
            showSongsOnPage(currentPage);
            createPaginationLinks();
        });

        if (i === currentPage) {
            link.classList.add("active");
        }

        paginationElement.appendChild(link);
    }
    paginationElement.appendChild(nextButton);
}

// Función para mostrar la duración de la canción
function showDuration() {
    let duration = audioPlayer.duration;
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    let durationFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById("song-duration").textContent = durationFormatted;
}

// Función para reproducir la siguiente canción
function playNextSong() {
    if (isRandom) {
        playRandomSong();
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    }
}

// Función para reproducir una canción aleatoria
function playRandomSong() {
    pauseSong();
    lastPlayedIndex = currentSongIndex;

    let newRandomIndex = currentSongIndex;
    while (newRandomIndex === currentSongIndex) {
        newRandomIndex = Math.floor(Math.random() * songs.length);
    }

    currentSongIndex = newRandomIndex;

    let newSong = songs[currentSongIndex];
    artistNameElement.textContent = newSong.artistName;
    artistImageElement.style.backgroundImage = `url(${newSong.artistImage})`;
    songTitleElement.textContent = newSong.title;
    audioPlayer.src = newSong.audio.src;
    playSong();
}

// Mostrar las canciones en la página inicial
showSongsOnPage(currentPage);

// Crear enlaces de paginación
createPaginationLinks();

// Cargar la primera canción
loadSong(currentSongIndex);
