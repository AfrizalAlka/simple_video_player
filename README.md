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

✅ **Format dengan support terbaik (Recommended):**
- **MP4** (H.264/H.265) - Universal, semua browser
- **WebM** (VP8/VP9) - Chrome, Firefox, Edge
- **M4V** - Mirip MP4

⚠️ **Format dengan support terbatas:**
- **MKV** (Matroska) - Tergantung codec & browser
- **AVI** - Tergantung codec & browser
- **OGG** (Theora) - Firefox, Chrome
- **MOV** (QuickTime) - Tergantung codec
- **WMV** - Support sangat terbatas
- **FLV** - Support sangat terbatas

> **Catatan Penting:** 
> - Video player ini akan **mencoba memutar semua format** termasuk MKV
> - **Kemampuan memutar MKV tergantung pada:**
>   1. Browser yang digunakan (Chrome/Edge paling baik)
>   2. Codec video di dalam file MKV (H.264 paling kompatibel)
>   3. Sistem operasi Anda
> - Jika MKV tidak bisa diputar, **gunakan VLC** atau **convert ke MP4**
> - Tools convert: [HandBrake](https://handbrake.fr/), [FFmpeg](https://ffmpeg.org/), atau VLC Media Player

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
