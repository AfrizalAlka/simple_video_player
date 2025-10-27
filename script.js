// Global variables
let videoFiles = [];
let subtitleFiles = [];
let allFiles = [];
let currentVideoIndex = -1;

// DOM elements
const folderInput = document.getElementById('folderInput');
const videoListContainer = document.getElementById('videoListContainer');
const videoPlayerContainer = document.getElementById('videoPlayerContainer');
const videoInfo = document.getElementById('videoInfo');
const videoTitle = document.getElementById('videoTitle');
const videoSize = document.getElementById('videoSize');
const videoType = document.getElementById('videoType');

// Supported video formats - including MKV, AVI, etc.
// Note: Some formats may not play depending on browser and codec support
const videoFormats = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.mkv', '.avi', '.wmv', '.flv', '.3gp', '.mpg', '.mpeg'];

// Supported subtitle formats
const subtitleFormats = ['.srt', '.vtt', '.ass', '.ssa'];

// Highly supported formats (recommended)
const recommendedFormats = ['.mp4', '.webm', '.m4v'];

// Event listener for folder selection
folderInput.addEventListener('change', handleFolderSelect);

// Handle folder selection
function handleFolderSelect(event) {
    const files = Array.from(event.target.files);
    allFiles = files;

    // Filter video files
    videoFiles = files.filter(file => {
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        return videoFormats.includes(extension);
    });

    // Filter subtitle files
    subtitleFiles = files.filter(file => {
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        return subtitleFormats.includes(extension);
    });

    // Sort videos alphabetically
    videoFiles.sort((a, b) => a.name.localeCompare(b.name));

    if (videoFiles.length === 0) {
        videoListContainer.innerHTML = '<p class="placeholder">Tidak ada video ditemukan di folder ini.</p>';
        return;
    }

    displayVideoList();

    // Show info message about format support
    const infoMsg = document.createElement('div');
    infoMsg.className = 'info-message';
    infoMsg.innerHTML = `📹 ${videoFiles.length} video ditemukan${subtitleFiles.length > 0 ? `, 📄 ${subtitleFiles.length} subtitle` : ''}. Format MKV/AVI mungkin tidak dapat diputar tergantung codec dan browser.`;
    videoListContainer.insertBefore(infoMsg, videoListContainer.firstChild);
}

// Display video list
function displayVideoList() {
    videoListContainer.innerHTML = '';

    videoFiles.forEach((file, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.dataset.index = index;

        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        const isRecommended = recommendedFormats.includes(extension);

        const videoName = document.createElement('div');
        videoName.className = 'video-item-name';
        videoName.innerHTML = file.name + (!isRecommended ? ' <span class="format-badge">⚠️</span>' : '');

        const videoSizeText = document.createElement('div');
        videoSizeText.className = 'video-item-size';
        videoSizeText.textContent = formatFileSize(file.size);

        videoItem.appendChild(videoName);
        videoItem.appendChild(videoSizeText);

        // Add click event
        videoItem.addEventListener('click', () => playVideo(index));

        videoListContainer.appendChild(videoItem);
    });
}

// Play selected video
function playVideo(index) {
    if (index < 0 || index >= videoFiles.length) return;

    currentVideoIndex = index;
    const file = videoFiles[index];

    // Update active state in list
    document.querySelectorAll('.video-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Create video element
    const videoURL = URL.createObjectURL(file);
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    // Determine MIME type based on extension
    let mimeType = file.type;
    if (!mimeType || mimeType === '') {
        const mimeTypes = {
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.ogg': 'video/ogg',
            '.mov': 'video/quicktime',
            '.m4v': 'video/x-m4v',
            '.mkv': 'video/x-matroska',
            '.avi': 'video/x-msvideo',
            '.wmv': 'video/x-ms-wmv',
            '.flv': 'video/x-flv',
            '.3gp': 'video/3gpp',
            '.mpg': 'video/mpeg',
            '.mpeg': 'video/mpeg'
        };
        mimeType = mimeTypes[extension] || 'video/mp4';
    }

    videoPlayerContainer.innerHTML = `
        <video id="mainVideo" controls autoplay preload="auto" crossorigin="anonymous">
            <source src="${videoURL}" type="${mimeType}">
            <source src="${videoURL}">
            Browser Anda tidak mendukung pemutaran video ini.
        </video>
        <div class="subtitle-controls">
            <button id="subtitleToggle" class="subtitle-btn" style="display: none;">
                <span class="subtitle-icon">💬</span>
                <span class="subtitle-text">Subtitle: OFF</span>
            </button>
            <select id="subtitleSelect" class="subtitle-select" style="display: none;">
                <option value="">Tidak ada subtitle</option>
            </select>
        </div>
    `;

    // Find matching subtitle files
    const videoBaseName = file.name.substring(0, file.name.lastIndexOf('.'));
    const matchingSubtitles = findMatchingSubtitles(videoBaseName);

    // Update video info
    videoTitle.textContent = file.name;
    videoSize.textContent = `Ukuran: ${formatFileSize(file.size)}`;
    videoType.textContent = `Type: ${extension.toUpperCase()} (${mimeType})`;
    
    if (matchingSubtitles.length > 0) {
        videoType.textContent += ` | 📄 ${matchingSubtitles.length} subtitle tersedia`;
    }
    
    videoInfo.style.display = 'block';

    // Add event listener for video end (auto play next)
    const videoElement = document.getElementById('mainVideo');
    
    // Load subtitles if available
    if (matchingSubtitles.length > 0) {
        loadSubtitles(videoElement, matchingSubtitles);
    } else {
        // Show info about embedded subtitles for MKV
        if (extension === '.mkv') {
            const subtitleInfo = document.createElement('div');
            subtitleInfo.className = 'info-message';
            subtitleInfo.style.marginTop = '10px';
            subtitleInfo.innerHTML = `⚠️ Video MKV mungkin memiliki softsub embedded. Browser tidak bisa mengekstrak subtitle dari MKV. Silakan ekstrak subtitle (.srt) secara manual menggunakan tools seperti <strong>MKVToolNix</strong> atau <strong>FFmpeg</strong>.`;
            videoInfo.appendChild(subtitleInfo);
        }
    }

    // Show loading state
    videoElement.addEventListener('loadstart', function () {
        console.log('Loading video:', file.name);
    });

    videoElement.addEventListener('loadeddata', function () {
        console.log('Video loaded successfully:', file.name);
    });

    // Error handling for unsupported formats
    videoElement.addEventListener('error', function (e) {
        console.error('Video error:', e);
        videoPlayerContainer.innerHTML = `
            <div class="placeholder-player error">
                <div class="icon">❌</div>
                <p><strong>Gagal memutar video!</strong></p>
                <p style="color: #666;">File: ${file.name}</p>
                <p style="margin-top: 10px;">Format atau codec video ini tidak didukung oleh browser Anda.</p>
                <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: left;">
                    <strong>Solusi:</strong>
                    <ul style="margin: 10px 0 0 20px; font-size: 0.9em;">
                        <li>Gunakan browser Chrome/Edge (support lebih baik)</li>
                        <li>Convert video ke format MP4 (H.264 codec)</li>
                        <li>Gunakan video player desktop (VLC, MPC-HC)</li>
                    </ul>
                </div>
                <button onclick="playNextVideo()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ⏭️ Skip ke Video Berikutnya
                </button>
            </div>
        `;
    });

    videoElement.addEventListener('ended', playNextVideo);

    // Scroll to active video in list
    const activeItem = document.querySelector('.video-item.active');
    if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Play next video
function playNextVideo() {
    if (currentVideoIndex < videoFiles.length - 1) {
        playVideo(currentVideoIndex + 1);
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Find matching subtitle files for a video
function findMatchingSubtitles(videoBaseName) {
    return subtitleFiles.filter(subtitle => {
        const subtitleBaseName = subtitle.name.substring(0, subtitle.name.lastIndexOf('.'));
        // Check if subtitle name matches video name (exact or contains)
        return subtitleBaseName === videoBaseName || 
               subtitleBaseName.startsWith(videoBaseName) ||
               videoBaseName.startsWith(subtitleBaseName);
    });
}

// Load subtitles into video player
function loadSubtitles(videoElement, subtitles) {
    const subtitleToggle = document.getElementById('subtitleToggle');
    const subtitleSelect = document.getElementById('subtitleSelect');
    
    if (subtitles.length === 0) return;

    // Show subtitle controls
    subtitleToggle.style.display = 'inline-flex';
    subtitleSelect.style.display = 'inline-block';

    // Clear existing options
    subtitleSelect.innerHTML = '<option value="">Tidak ada subtitle</option>';

    // Add subtitle tracks
    subtitles.forEach((subtitleFile, index) => {
        const subtitleURL = URL.createObjectURL(subtitleFile);
        const extension = subtitleFile.name.substring(subtitleFile.name.lastIndexOf('.')).toLowerCase();
        
        // Determine subtitle format
        let subtitleKind = 'subtitles';
        let subtitleType = 'vtt';
        
        if (extension === '.srt') {
            subtitleType = 'srt';
        } else if (extension === '.vtt') {
            subtitleType = 'vtt';
        } else if (extension === '.ass' || extension === '.ssa') {
            subtitleType = 'ass';
        }

        // Convert SRT to VTT if needed
        if (extension === '.srt') {
            convertSrtToVtt(subtitleFile).then(vttBlob => {
                const vttURL = URL.createObjectURL(vttBlob);
                const track = document.createElement('track');
                track.kind = subtitleKind;
                track.label = subtitleFile.name;
                track.srclang = 'id';
                track.src = vttURL;
                track.default = index === 0; // Set first subtitle as default
                videoElement.appendChild(track);

                // Add to select dropdown
                const option = document.createElement('option');
                option.value = index;
                option.textContent = subtitleFile.name;
                if (index === 0) option.selected = true;
                subtitleSelect.appendChild(option);
            }).catch(err => {
                console.error('Error converting SRT to VTT:', err);
            });
        } else if (extension === '.vtt') {
            const track = document.createElement('track');
            track.kind = subtitleKind;
            track.label = subtitleFile.name;
            track.srclang = 'id';
            track.src = subtitleURL;
            track.default = index === 0;
            videoElement.appendChild(track);

            // Add to select dropdown
            const option = document.createElement('option');
            option.value = index;
            option.textContent = subtitleFile.name;
            if (index === 0) option.selected = true;
            subtitleSelect.appendChild(option);
        }
    });

    // Enable first subtitle by default
    setTimeout(() => {
        if (videoElement.textTracks.length > 0) {
            videoElement.textTracks[0].mode = 'showing';
            subtitleToggle.querySelector('.subtitle-text').textContent = 'Subtitle: ON';
            subtitleToggle.classList.add('active');
        }
    }, 100);

    // Toggle subtitle on/off
    subtitleToggle.onclick = () => {
        const tracks = videoElement.textTracks;
        let anyActive = false;
        
        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].mode === 'showing') {
                tracks[i].mode = 'hidden';
                anyActive = false;
            } else if (tracks[i].mode === 'hidden') {
                tracks[i].mode = 'showing';
                anyActive = true;
                break;
            }
        }

        subtitleToggle.querySelector('.subtitle-text').textContent = anyActive ? 'Subtitle: ON' : 'Subtitle: OFF';
        if (anyActive) {
            subtitleToggle.classList.add('active');
        } else {
            subtitleToggle.classList.remove('active');
        }
    };

    // Change subtitle track
    subtitleSelect.onchange = (e) => {
        const selectedIndex = parseInt(e.target.value);
        const tracks = videoElement.textTracks;
        
        // Disable all tracks
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].mode = 'hidden';
        }

        // Enable selected track
        if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < tracks.length) {
            tracks[selectedIndex].mode = 'showing';
            subtitleToggle.querySelector('.subtitle-text').textContent = 'Subtitle: ON';
            subtitleToggle.classList.add('active');
        } else {
            subtitleToggle.querySelector('.subtitle-text').textContent = 'Subtitle: OFF';
            subtitleToggle.classList.remove('active');
        }
    };
}

// Convert SRT subtitle to VTT format
function convertSrtToVtt(srtFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                let srtContent = e.target.result;
                
                // Convert SRT to VTT
                let vttContent = 'WEBVTT\n\n';
                
                // Replace timestamps format from SRT (00:00:00,000) to VTT (00:00:00.000)
                vttContent += srtContent.replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4');
                
                // Create blob
                const vttBlob = new Blob([vttContent], { type: 'text/vtt' });
                resolve(vttBlob);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(srtFile);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const video = videoPlayerContainer.querySelector('video');
    if (!video) return;

    switch (e.key) {
        case ' ':
            e.preventDefault();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
            break;
        case 'ArrowRight':
            video.currentTime += 5;
            break;
        case 'ArrowLeft':
            video.currentTime -= 5;
            break;
        case 'ArrowUp':
            e.preventDefault();
            video.volume = Math.min(1, video.volume + 0.1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            video.volume = Math.max(0, video.volume - 0.1);
            break;
        case 'n':
        case 'N':
            playNextVideo();
            break;
    }
});
