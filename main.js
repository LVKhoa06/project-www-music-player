/* 
1. Render songs +
2. Scroll +
3. Play / Pause / seek +
4. CD rotate(quay) +
5. Next / Previous
6. Next / Repeat when ended
7. Random
8. Active song
9. Scroll active song into view
10. Play song when click
*/

const heading = document.querySelector('header h2');
const cdThumb = document.querySelector('.cd-thumb');
const audio = document.querySelector('#audio')
const cd = document.querySelector('.cd');
const playBtn = document.querySelector('.btn-toggle-play');
const player = document.querySelector('.player');
const progress = document.querySelector('#progress');
const nextSongBtn = document.querySelector('.btn-next');
const previousSongBtn = document.querySelector('.btn-prev')

const app = {

    // List songs
    songs: [
        {
            name: 'Lối nhỏ',
            singer: 'Đen Vâu',
            path: './acssets/music/loi-nho.mp3',
            image: './acssets/img/loi-nho.jpg'
        },
        {
            name: 'Bài này chill phết',
            singer: 'Đen Vâu',
            path: './acssets/music/bai-nay-chill-phet.mp3',
            image: './acssets/img/bai-nay-chill-phet.jpg'
        },
        {
            name: 'Lối nhỏ',
            singer: 'Đen Vâu',
            path: './acssets/music/loi-nho.mp3',
            image: './acssets/img/loi-nho.jpg'
        },
        {
            name: 'Bài này chill phết',
            singer: 'Đen Vâu',
            path: './acssets/music/bai-nay-chill-phet.mp3',
            image: './acssets/img/bai-nay-chill-phet.jpg'
        },
        {
            name: 'Lối nhỏ',
            singer: 'Đen Vâu',
            path: './acssets/music/loi-nho.mp3',
            image: './acssets/img/loi-nho.jpg'
        },
        {
            name: 'Bài này chill phết',
            singer: 'Đen Vâu',
            path: './acssets/music/bai-nay-chill-phet.mp3',
            image: './acssets/img/bai-nay-chill-phet.jpg'
        },
        {
            name: 'Lối nhỏ',
            singer: 'Đen Vâu',
            path: './acssets/music/loi-nho.mp3',
            image: './acssets/img/loi-nho.jpg'
        },
        {
            name: 'Bài này chill phết',
            singer: 'Đen Vâu',
            path: './acssets/music/bai-nay-chill-phet.mp3',
            image: './acssets/img/bai-nay-chill-phet.jpg'
        },
        {
            name: 'Lối nhỏ',
            singer: 'Đen Vâu',
            path: './acssets/music/loi-nho.mp3',
            image: './acssets/img/loi-nho.jpg'
        },
        {
            name: 'Bài này chill phết',
            singer: 'Đen Vâu',
            path: './acssets/music/bai-nay-chill-phet.mp3',
            image: './acssets/img/bai-nay-chill-phet.jpg'
        },
        {
            name: 'Lối nhỏ',
            singer: 'Đen Vâu',
            path: './acssets/music/loi-nho.mp3',
            image: './acssets/img/loi-nho.jpg'
        },
        {
            name: 'Bài này chill phết',
            singer: 'Đen Vâu',
            path: './acssets/music/bai-nay-chill-phet.mp3',
            image: './acssets/img/bai-nay-chill-phet.jpg'
        },
    ], // List songs

    currentIndex: 0,
    //
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    // Rander playlist song 
    render: function () {
        const htmls = this.songs.map(song => {
            return `
             <div class="song">
              <div class="thumb" style="background-image: url('${song.image}')">
              </div>
             <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
          `;
        })
        document.querySelector('.playlist').innerHTML = htmls.join('');
    }, // Rander playlist song

    isPlaying: false,
    // Handle event 
    handleEvents: function () {

        // CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 20000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        // Scroll 
        const cdWidth = cd.offsetWidth;

        document.onscroll = function () {
            const scroll = window.scrollY;
            const newCdWidth = cdWidth - scroll;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }, // Scroll

            // Event click btn play
            playBtn.onclick = function () {
                if (app.isPlaying) {
                    audio.pause();

                } else {
                    audio.play();
                }
            }

        // While playing music
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // While pause music

        audio.onpause = function () {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Run
        audio.ontimeupdate = function () {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPercent;
        }

        // Tua 
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime
        }

        // Khi next song
        nextSongBtn.onclick = function () {
            app.nextSong()
            audio.play()
        }

        // Khi previous song
        previousSongBtn.onclick = function () {
            app.previousSong();
            audio.play();
        }
    }, // Handle event 


    // Load firt current song
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    previousSong: function () {
        this.currentInde--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length;
        }
        this.loadCurrentSong();
    },

    // When start then run the function inside
    start: function () {

        this.defineProperties();
        this.render();
        this.handleEvents();
        this.loadCurrentSong();

    }
}
app.start();
