// Global variables
let videoFiles = [];
let currentVideoIndex = -1;

// DOM elements
const folderInput = document.getElementById('folderInput');
const videoListContainer = document.getElementById('videoListContainer');
const videoPlayerContainer = document.getElementById('videoPlayerContainer');
const videoInfo = document.getElementById('videoInfo');
const videoTitle = document.getElementById('videoTitle');
const videoSize = document.getElementById('videoSize');
const videoType = document.getElementById('videoType');

// Supported video formats (only formats natively supported by browsers)
// MKV and AVI are NOT supported by browsers natively
const videoFormats = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];

// Unsupported formats that will be shown with warning
const unsupportedFormats = ['.mkv', '.avi', '.wmv', '.flv'];

// Event listener for folder selection
folderInput.addEventListener('change', handleFolderSelect);

// Handle folder selection
function handleFolderSelect(event) {
    const files = Array.from(event.target.files);

    // Separate supported and unsupported video files
    const allVideoFiles = files.filter(file => {
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        return videoFormats.includes(extension) || unsupportedFormats.includes(extension);
    });

    // Filter only supported video files
    videoFiles = allVideoFiles.filter(file => {
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        return videoFormats.includes(extension);
    });

    // Count unsupported files
    const unsupportedCount = allVideoFiles.length - videoFiles.length;

    // Sort videos alphabetically
    videoFiles.sort((a, b) => a.name.localeCompare(b.name));

    if (videoFiles.length === 0 && unsupportedCount === 0) {
        videoListContainer.innerHTML = '<p class="placeholder">Tidak ada video ditemukan di folder ini.</p>';
        return;
    }

    if (videoFiles.length === 0 && unsupportedCount > 0) {
        videoListContainer.innerHTML = `
            <p class="placeholder error">⚠️ Ditemukan ${unsupportedCount} video dengan format yang tidak didukung browser (MKV, AVI, WMV, FLV).<br><br>
            Silakan convert ke format MP4, WebM, atau M4V terlebih dahulu.</p>
        `;
        return;
    }

    displayVideoList();

    // Show warning if there are unsupported files
    if (unsupportedCount > 0) {
        const warning = document.createElement('div');
        warning.className = 'warning-message';
        warning.innerHTML = `⚠️ ${unsupportedCount} video dilewati (format tidak didukung browser)`;
        videoListContainer.insertBefore(warning, videoListContainer.firstChild);
    }
}

// Display video list
function displayVideoList() {
    videoListContainer.innerHTML = '';

    videoFiles.forEach((file, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.dataset.index = index;

        const videoName = document.createElement('div');
        videoName.className = 'video-item-name';
        videoName.textContent = file.name;

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

    videoPlayerContainer.innerHTML = `
        <video controls autoplay>
            <source src="${videoURL}" type="${file.type}">
            Browser Anda tidak mendukung pemutaran video ini.
        </video>
    `;

    // Update video info
    videoTitle.textContent = file.name;
    videoSize.textContent = `Ukuran: ${formatFileSize(file.size)}`;
    videoType.textContent = `Type: ${file.type || 'Unknown'}`;
    videoInfo.style.display = 'block';

    // Add event listener for video end (auto play next)
    const videoElement = videoPlayerContainer.querySelector('video');

    // Error handling for unsupported formats
    videoElement.addEventListener('error', function () {
        videoPlayerContainer.innerHTML = `
            <div class="placeholder-player error">
                <div class="icon">❌</div>
                <p><strong>Gagal memutar video!</strong></p>
                <p>Format atau codec video ini tidak didukung oleh browser.</p>
                <p style="margin-top: 10px; font-size: 0.9em;">
                    Format yang didukung: MP4, WebM, OGG, MOV, M4V<br>
                    Silakan convert video ke format MP4 untuk hasil terbaik.
                </p>
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
