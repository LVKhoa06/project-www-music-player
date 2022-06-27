// End playlist !load
/*
1. Render songs +
2. Scroll +
3. Play / Pause / seek +
4. CD rotate(quay) +
5. Next / Previous +f
6. Next / Repeat when ended + 
7. Random +
8. Active song +
9. Scroll active song into view + 
10. Play song when click +
*/

const audio = document.querySelector('#audio');
const player = document.querySelector('.player');
const playlist = document.querySelector('.playlist');
const ctr_heading = document.querySelector('header h2');
const ctr_cdThumb = document.querySelector('.cd-thumb');
const ctr_cd = document.querySelector('.cd');
const ctr_playBtn = document.querySelector('.btn-toggle-play');
const ctr_progress = document.querySelector('#progress');
const ctr_progressIndicator = document.querySelector('#sub-progress');
const ctr_nextSongBtn = document.querySelector('.btn-next');
const ctr_previousSongBtn = document.querySelector('.btn-prev');
const ctr_randomSongBtn = document.querySelector('.btn-random');
const ctr_repeatSongBtnPlaylist = document.querySelector('.btn-repeat-playlist');
const ctr_noRepeatSongBtn = document.querySelector('.btn-no-repeat');
const ctr_repeatSongBtnOne = document.querySelector('.btn-repeat-one');
const ctr_volume = document.querySelector('#set-volume');
const ctr_volumeUp = document.querySelector('.icon-volume-up');
const ctr_volumeDown = document.querySelector('.icon-volume-down');
const ctr_volumeOff = document.querySelector('.icon-volume-off');
const ctr_speedFast2 = document.querySelector('.speed-audio-fast-2'); // speed = 2.0
const ctr_speedFast1 = document.querySelector('.speed-audio-fast-1'); // speed = 1.5
const ctr_speedDefault = document.querySelector('.speed-audio-default'); // speed = 1.0
const ctr_speedSlow = document.querySelector('.speed-audio-slow'); // speed = 0.5

const RepeatModes = {
    None: 0,
    RepeatOne: 1,
    RepeatList: 2
}

// Hide all opening context menus
document.onclick = function () {
    try {
        document.querySelector('.show-item').classList.remove('show-item');
    } catch (er) { }
} // document.onclick 

const app = {
    isRandom: false,
    isPlaying: false,
    repeatMode: RepeatModes.None,
    currentIndex: 0,
    songs: [],

    async fetchSongs() {
        await fetch("data-song.json")
            .then(response =>
                response.json()
            )
            .then(data => {
                this.songs = data.map(song => ({
                    ...song, // spread operator
                    favorite: false // expanded property
                }));
            })
    }, // fetchSongs

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    }, //

    // Rander playlist song 
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
             <div class="song ${index == this.currentIndex ? 'active' : ''}" data-index="${index}">
              <div class="thumb" style="background-image: url('${song.image}')">
              </div>
             <div class="body">
             <h3 class="title">${song.name}</h3>
             <p class="author">${song.singer}</p>
             </div>
             <div class="option">
             <item class="list-item-setting">
             <span class="item-setting">Item Setting</span>
             <span class="item-setting">Item Setting</span>
             <span class="item-setting">Item Setting</span>
             </item>
             <i class="fas fa-ellipsis-h"></i>  
             </div>
             <div class="favorite-container">
             <span class="${song.favorite ? 'heart hide-item' : 'heart'}">♡</span>
             <span class="${song.favorite ? 'get-heart show-item-heart' : 'get-heart'}">♥</span>
            </div>
          </div>
          `;
        });
        playlist.innerHTML = htmls.join('');
    }, // Rander playlist song

    // Handle event 
    handleEvents: function () {
        // CD rotate / stop 
        const cdThumbAnimate = ctr_cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 30000,
            iterations: Infinity,
        });
        // CD rotate / stop 
        cdThumbAnimate.pause();

        // Scroll hide / show CD 
        const cdWidth = ctr_cd.offsetWidth;
        document.onscroll = function () {
            const scroll = window.scrollY;
            const newCdWidth = cdWidth - scroll;

            ctr_cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            ctr_cd.style.opacity = newCdWidth / cdWidth;
        }, // Scroll hide / show CD 

            // Event click play / stop btn 
            ctr_playBtn.onclick = function () {
                if (app.isPlaying) {
                    audio.pause();

                } else {
                    audio.play();
                }
            }, // Event click play / stop btn

            // Playing music 
            audio.onplay = function () {
                app.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }, // Playing music

            // Pause music 
            audio.onpause = function () {
                app.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }, // Pause music

            // Run progress bar 
            audio.ontimeupdate = function () {
                // audio.duration: Thời gian của audio
                // audio.currentTime: Thời gian hiện tại của audio 
                if (audio.duration) {
                    const progressPercent = Math.round(audio.currentTime / audio.duration * 100);
                    ctr_progress.value = progressPercent;
                    ctr_progressIndicator.style.setProperty('width', `${ctr_progress.value}%`);

                }
            }, // Run progress bar

            // 
            ctr_progress.onmousemove = function () {
                ctr_progressIndicator.style.setProperty('width', `${ctr_progress.value}%`);
            },//

            // Set Volume
            ctr_volumeUp.onclick = function () {
                ctr_volume.value = 0;
                audio.volume = 0;
                ctr_volumeOff.classList.add('show-icon');
                ctr_volumeDown.classList.remove('show-icon');
                ctr_volumeUp.classList.remove('show-icon');
            },

            ctr_volumeDown.onclick = function () {
                ctr_volume.value = 0;
                audio.volume = 0;
                ctr_volumeOff.classList.add('show-icon');
                ctr_volumeDown.classList.remove('show-icon');
                ctr_volumeUp.classList.remove('show-icon');
            },

            ctr_volumeOff.onclick = function () {
                ctr_volume.value = 100;
                audio.volume = 1;
                ctr_volumeUp.classList.add('show-icon');
                ctr_volumeDown.classList.remove('show-icon');
                ctr_volumeOff.classList.remove('show-icon');
            },

            ctr_volume.onmousemove = function (e) {
                const seekVolume = 1 / 100 * e.target.value;
                audio.volume = seekVolume;

                if (audio.volume >= 0.5) {
                    ctr_volumeUp.classList.add('show-icon');
                    ctr_volumeDown.classList.remove('show-icon');
                    ctr_volumeOff.classList.remove('show-icon');

                } else if (audio.volume <= 0.4 && audio.volume > 0) {
                    ctr_volumeDown.classList.add('show-icon');
                    ctr_volumeUp.classList.remove('show-icon');
                    ctr_volumeOff.classList.remove('show-icon');

                } else if (audio.volume === 0) {
                    ctr_volumeOff.classList.add('show-icon');
                    ctr_volumeDown.classList.remove('show-icon');
                    ctr_volumeUp.classList.remove('show-icon');
                }
            }, // Set Volume

            // Seek forward / backward
            ctr_progress.onchange = function (e) {
                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }, // Seek forward / backward

            // When next the song 
            ctr_nextSongBtn.onclick = function () {
                if (app.isRandom) {
                    app.playRandomSong();
                } else {
                    app.nextSong();
                }

                audio.play();
                app.render();
                app.scrollToActiveSong();
            }, // When next the song

            // When previous the song 
            ctr_previousSongBtn.onclick = function () {
                if (app.isRandom) {
                    // If targeting btn-random
                    app.playRandomSong();
                } else {
                    app.previousSong();
                }
                audio.play();
                app.render();
                app.scrollToActiveSong();
            }, // When previous the song

            // Random song
            ctr_randomSongBtn.onclick = function () {
                app.isRandom = !app.isRandom;
                ctr_randomSongBtn.classList.toggle('active', app.isRandom);
            }, // Random song

            // Repeat one song
            ctr_noRepeatSongBtn.onclick = function () {
                app.repeatMode = RepeatModes.RepeatOne;
                ctr_repeatSongBtnOne.classList.add('show-item-repeat');
                ctr_noRepeatSongBtn.classList.add('hide-item');
            }, // Repeat one song

            // Repeat playlist
            ctr_repeatSongBtnOne.onclick = function () {
                app.repeatMode = RepeatModes.RepeatList;
                ctr_repeatSongBtnOne.classList.remove('show-item-repeat');
                ctr_repeatSongBtnPlaylist.classList.add('show-item-repeat');
            }, // Repeat playlist  

            // No repeat
            ctr_repeatSongBtnPlaylist.onclick = function () {
                app.repeatMode = RepeatModes.None;
                ctr_repeatSongBtnPlaylist.classList.remove('show-item-repeat');
                ctr_noRepeatSongBtn.classList.remove('hide-item');
            }, // No repeat

            // Next song at the end 
            audio.onended = function () {
                switch (app.repeatMode) {
                    case RepeatModes.RepeatOne:
                        audio.play();
                        break;

                    case RepeatModes.RepeatList:
                        ctr_nextSongBtn.click();
                        break;

                    default: // RepeatModes.None
                        if (app.currentIndex === app.songs.length - 1)
                            audio.pause();
                        else
                            ctr_nextSongBtn.click();
                        break;
                }

            }, // Next song at the end

            // Go to the clicked song

            playlist.onclick = function (e) {
                try {
                    const songCloset = e.target.closest('.song');
                    const songActive = e.target.closest('.song:not(.active)');

                    const songItemHeart = e.target.closest('.favorite-container');
                    const optionItem = e.target.closest('.option');

                    const setting = songCloset.querySelector('.list-item-setting');
                    const heart = songCloset.querySelector('.heart');
                    const getHeart = songCloset.querySelector('.get-heart');

                    if (songActive && !optionItem && !songItemHeart) {
                        app.currentIndex = Number(songActive.dataset.index);
                        app.loadSong();
                        app.render();
                        audio.play();
                    }

                    if (optionItem) {
                        e.stopPropagation();

                        // Remove current active option
                        try {
                            const currentActiveOption = document.querySelector('.show-item');
                            const currentSongWithActiveOption = (currentActiveOption.parentElement).parentElement;

                            if (currentSongWithActiveOption.getAttribute('data-index') != songCloset.getAttribute('data-index'))
                                currentActiveOption.classList.remove('show-item');
                        } catch (err) { }

                        // Toggle currently clicked option
                        setting.classList.toggle('show-item');
                    }

                    if (songItemHeart) {
                        heart.classList.toggle('hide-item');
                        getHeart.classList.toggle('show-item-heart');
                        app.songs[Number(songCloset.dataset.index)].favorite = getHeart.classList.contains('show-item-heart');
                    }
                } catch (err) { }
            }, // playlist.onclick

            // Speed audio
            ctr_speedDefault.onclick = function () {
                ctr_speedDefault.classList.add('active');
                ctr_speedFast2.classList.remove('active');
                ctr_speedSlow.classList.remove('active');
                ctr_speedFast1.classList.remove('active');

                app.checkSpeed();
            },
            ctr_speedFast1.onclick = function () {
                ctr_speedFast1.classList.add('active');
                ctr_speedFast2.classList.remove('active');
                ctr_speedDefault.classList.remove('active');
                ctr_speedSlow.classList.remove('active');

                app.checkSpeed();
            },
            ctr_speedFast2.onclick = function () {
                ctr_speedFast2.classList.add('active');
                ctr_speedDefault.classList.remove('active');
                ctr_speedSlow.classList.remove('active');
                ctr_speedFast1.classList.remove('active');

                app.checkSpeed();
            },

            ctr_speedSlow.onclick = function (e) {
                ctr_speedSlow.classList.add('active');
                ctr_speedFast2.classList.remove('active');
                ctr_speedDefault.classList.remove('active');
                ctr_speedFast1.classList.remove('active');

                app.checkSpeed();
            }
        // Speed audio
    }, // Handle event 

    // Check speed
    checkSpeed: function () {
        if (ctr_speedDefault.classList.contains("active")) {
            audio.playbackRate = 1;
        }
        else if (ctr_speedFast1.classList.contains("active")) {
            audio.playbackRate = 1.5;
        }
        else if (ctr_speedFast2.classList.contains("active")) {
            audio.playbackRate = 2;
        }
        else if (ctr_speedSlow.classList.contains("active")) {
            audio.playbackRate = 0.5;
        }

    }, // Check speed

    // Scroll to active song 
    scrollToActiveSong: function () {
        setTimeout(() => {
            const songActive = document.querySelector('.song.active');
            if (app.currentIndex == 0 || app.currentIndex == 1 || app.currentIndex == 2) {
                songActive.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            } else {
                songActive.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 200);
    }, // Scroll to active song 

    // Load song
    loadSong: function () {
        ctr_heading.textContent = this.currentSong.name;
        ctr_cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        this.checkSpeed();
    }, // Load song

    // Next song
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadSong();

    }, // Next song

    // Previous song
    previousSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadSong();


    }, // Previous song

    // Random song
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.round(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadSong();
    }, // Random song

    // When start then run the function inside
    async start() {
        await this.fetchSongs();

        this.defineProperties();
        this.render();
        this.handleEvents();
        this.loadSong();
    } // start
} // app

app.start();

