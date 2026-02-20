const audio = document.getElementById('audioElement');
const lyricsContainer = document.getElementById('lyricsContainer');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');

let lyricsData = [];

const pauseIcon = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
const playIcon = '<path d="M8 5v14l11-7z"/>';

playBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        document.getElementById('playIcon').innerHTML = pauseIcon;
    } else {
        audio.pause();
        document.getElementById('playIcon').innerHTML = playIcon;
    }
};

audio.ontimeupdate = () => {
    if (!audio.duration) return;
    const p = (audio.currentTime / audio.duration) * 100;
    progress.value = p;
    document.getElementById('currTime').textContent = formatTime(audio.currentTime);
};

audio.onloadedmetadata = () => {
    document.getElementById('durTime').textContent = formatTime(audio.duration);
};

progress.oninput = () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
};

function formatTime(s) {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

setupDropZone('audioDrop', file => {
    audio.src = URL.createObjectURL(file);
    document.getElementById('trackName').textContent = formatFileName(file.name);
});

setupDropZone('lrcDrop', file => {
    const reader = new FileReader();
    reader.onload = e => parseLRC(e.target.result);
    reader.readAsText(file);
    document.getElementById('lrcName').textContent = `Lyrics: ${file.name}`;
});

document.getElementById('audioFile').onchange = e => {
    const file = e.target.files[0];
    if (file) {
        audio.src = URL.createObjectURL(file);
        const cleanName = formatFileName(file.name);
        document.getElementById('trackName').textContent = cleanName;
        updateBackground(cleanName);
    }
};

document.getElementById('lrcFile').onchange = e => {
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = ev => parseLRC(ev.target.result);
        reader.readAsText(e.target.files[0]);
        document.getElementById('lrcName').textContent = formatFileName(e.target.files[0].name);
    }
};

const volumeSlider = document.getElementById('volumeSlider');
audio.volume = volumeSlider.value;
volumeSlider.oninput = () => {
    audio.volume = volumeSlider.value;
};

function formatFileName(name) {
    return name.replace(/\.[^/.]+$/, "");
}

function setupDropZone(id, callback) {
    const zone = document.getElementById(id);
    zone.ondragover = e => { e.preventDefault(); zone.classList.add('dragover'); };
    zone.ondragleave = () => zone.classList.remove('dragover');
    zone.ondrop = e => {
        e.preventDefault();
        zone.classList.remove('dragover');
        callback(e.dataTransfer.files[0]);
    };
}

async function updateBackground(query) {
    const bgElement = document.querySelector('.bg-visualizer');
    const placeholder = "https://c.pxhere.com/photos/0a/e8/disk_music_sound_turntable_vinyl-1268072.jpg!d";
    
    try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const highResArt = data.results[0].artworkUrl100.replace('100x100bb', '1000x1000bb');
            bgElement.style.backgroundImage = `url('${highResArt}')`;
        } else {
            bgElement.style.backgroundImage = `url('${placeholder}')`;
        }
    } catch (err) {
        bgElement.style.backgroundImage = `url('${placeholder}')`;
    }
}

function parseLRC(text) {
    const lines = text.split('\n');
    lyricsData = [];
    
    lines.forEach(line => {
        const timeMatch = line.match(/\[(\d+):(\d+\.\d+)\]/);
        if (!timeMatch) return;

        const lineStartTime = parseInt(timeMatch[1]) * 60 + parseFloat(timeMatch[2]);
        let content = line.replace(/\[.*?\]/g, '').trim();
        
        if (!content) return;

        let words = [];

        const parts = content.split(/(<\d+:\d+\.\d+>)/g);
        let currentTime = lineStartTime;

        parts.forEach(part => {
            const wordTimeMatch = part.match(/<(\d+):(\d+\.\d+)>/);
            if (wordTimeMatch) {
                currentTime = parseInt(wordTimeMatch[1]) * 60 + parseFloat(wordTimeMatch[2]);
            } else {
                const wordText = part.trim();
                if (wordText) {
                    words.push({ time: currentTime, text: wordText });
                }
            }
        });

        if (words.length > 0) {
            lyricsData.push({ startTime: lineStartTime, words });
        }
    });
    render();
}

function render() {
    lyricsContainer.innerHTML = '';
    lyricsData.forEach((data, i) => {
        const div = document.createElement('div');
        div.className = 'lyric-line';
        div.id = `line-${i}`;
        
        data.words.forEach(w => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = w.text;

            span.onclick = (e) => {
                e.stopPropagation();
                audio.currentTime = w.time;
            };
            div.appendChild(span);
        });
        
        div.onclick = () => audio.currentTime = data.startTime;
        lyricsContainer.appendChild(div);
    });
}

function updateLoop() {
    const ct = audio.currentTime;
    
    lyricsData.forEach((data, i) => {
        const el = document.getElementById(`line-${i}`);
        if (!el) return;

        const isLast = i === lyricsData.length - 1;
        const nextStart = isLast ? Infinity : lyricsData[i+1].startTime;

        if (ct >= data.startTime && ct < nextStart) {
            if (!el.classList.contains('active')) {
                el.classList.add('active');
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            const spans = el.querySelectorAll('.word');
            data.words.forEach((w, j) => {
                const nextWordT = data.words[j+1] ? data.words[j+1].time : nextStart;
                if (ct >= w.time && ct < nextWordT) spans[j].classList.add('highlight');
                else spans[j].classList.remove('highlight');
            });
        } else {
            el.classList.remove('active');
            el.querySelectorAll('.word').forEach(s => s.classList.remove('highlight'));
        }
    });
    requestAnimationFrame(updateLoop);
}

audio.onplay = () => requestAnimationFrame(updateLoop);