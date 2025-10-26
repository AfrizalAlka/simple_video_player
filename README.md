# Simple Video Player

Video player berbasis website yang dapat membuka folder dan menampilkan seluruh list video yang ada di folder tersebut.

## Fitur

- 📁 Pilih folder untuk menampilkan semua video
- 📝 Tampilan list video yang rapi
- ▶️ Klik video untuk memutar
- 🔄 Auto play video selanjutnya setelah video selesai
- ⌨️ Keyboard shortcuts
- 📱 Responsive design
- 🎨 Modern UI dengan gradient background

## Cara Menggunakan

1. Buka file `index.html` di browser
2. Klik tombol "Pilih Folder Video"
3. Pilih folder yang berisi video
4. Daftar video akan muncul di sidebar
5. Klik video untuk memutar

## Keyboard Shortcuts

- `Space` - Play/Pause
- `Arrow Right` - Forward 5 detik
- `Arrow Left` - Backward 5 detik
- `Arrow Up` - Volume up
- `Arrow Down` - Volume down
- `N` - Play next video

## Format Video yang Didukung

✅ **Format yang BISA diputar di browser:**
- MP4 (H.264/H.265) - **Recommended**
- WebM (VP8/VP9)
- OGG (Theora)
- MOV (tergantung codec)
- M4V

❌ **Format yang TIDAK didukung browser:**
- MKV (Matroska) - Perlu di-convert ke MP4
- AVI - Perlu di-convert ke MP4
- WMV - Perlu di-convert ke MP4
- FLV - Perlu di-convert ke MP4

> **Catatan:** Browser modern (Chrome, Firefox, Edge) tidak mendukung format MKV, AVI, WMV, dan FLV secara native melalui HTML5 `<video>` tag. Gunakan tools seperti [HandBrake](https://handbrake.fr/) atau [FFmpeg](https://ffmpeg.org/) untuk convert video ke format MP4.

## Teknologi

- HTML5
- CSS3
- JavaScript (Vanilla)
- File System Access API

## Browser Support

Browser modern yang mendukung:
- Chrome/Edge (Recommended)
- Firefox
- Safari (limited support)

---

Dibuat dengan ❤️ menggunakan GitHub Copilot
