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

//#region Declarations -----------------------------------------------------------
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
const ctr_volume = document.querySelector('#set-volume');
const ctr_volumeUp = document.querySelector('.icon-volume-up');
const ctr_volumeDown = document.querySelector('.icon-volume-down');
const ctr_volumeOff = document.querySelector('.icon-volume-off');
const ctr_repeatSongBtn = document.querySelector('.btn-repeat');

const RepeatModes = {
    None: 'No repeat',
    RepeatOne: 'Repeat one song',
    RepeatList: 'Repeat playlist'
}

//#endregion Declarations --------------------------------------------------------

// Hide all opening context menus
document.onclick = function () {
    try {
        document.querySelector('.show-item').classList.remove('show-item');
    } catch (er) { }
} // document.onclick 

const app = {
    interactionInit: false, // check if user has interacted with the browser
    isRandom: false,
    isPlaying: false,
    repeatMode: RepeatModes.None,
    _currentIndex: 0, // will be accessed via getter & setter
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

    //#region getters, setters -------------------------------------------------------- START
    // currentSong
    get currentSong() {
        return this.songs[this._currentIndex];
    }, // get

    // currentIndex
    get currentIndex() {
        return this._currentIndex;
    }, // get
    set currentIndex(value) {
        this._currentIndex = value;
        this.playSong();
    },
    //#endregion getters, setters ----------------------------------------------------- END

    // defineProperties
    // not implemented
    defineProperties: function () {
        Object.defineProperty(this, 'foo', {
            get: function () {
                return 'foo'
            }
        });
    }, // defineProperties


    // Initialize playlist 
    initialize: function () {
        const htmls = this.songs.map((song, index) => {
            return `
             <div class="song ${index === 0 ? 'active' : ''}" data-index="${index}">
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
             <span class="heart">♡</span>
             <span class="get-heart">♥</span>
            </div>
          </div>
          `;
        });

        playlist.innerHTML = htmls.join('');
    }, // initialize

    // Play song at the currentIndex
    playSong: function () {
        ctr_heading.textContent = this.currentSong.name;
        ctr_cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        this.scrollToActiveSong();

        audio.src = this.currentSong.path;
        this.checkSpeed(); // recall this method because speed will reset to 1 on playing new song

        if (this.interactionInit) {
            // Style the active song
            playlist.querySelector('.song.active').classList.remove('active'); // Remove existing active song
            playlist.querySelector(`[data-index='${this.currentIndex}']`).classList.add('active');

            // Prevent error "The play() request was interrupted by a call to play()"
            // Because play() returns a Promimse
            setTimeout(() => audio.play(), 150);
        } // if

        this.interactionInit = true;
    }, // playSong

    // Handle events 
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
            }, // When next the song

            // When previous the song 
            ctr_previousSongBtn.onclick = function () {
                if (app.isRandom) {
                    // If targeting btn-random
                    app.playRandomSong();
                } else {
                    app.previousSong();
                }
            }, // When previous the song

            // Random song
            ctr_randomSongBtn.onclick = function () {
                app.isRandom = !app.isRandom;
                ctr_randomSongBtn.classList.toggle('active', app.isRandom);
            }, // Random song


            // Click repeat btn
            // None => List => One
            ctr_repeatSongBtn.onclick = function () {
                const indicatorIcon = ctr_repeatSongBtn.querySelector('i');
                const indicatorNumber = ctr_repeatSongBtn.querySelector('span');

                switch (app.repeatMode) {
                    case RepeatModes.RepeatOne:
                        app.repeatMode = RepeatModes.None;
                        indicatorIcon.classList.remove('active');
                        indicatorNumber.classList.remove('show-icon-repeat');

                        break;

                    case RepeatModes.RepeatList:
                        app.repeatMode = RepeatModes.RepeatOne;
                        indicatorIcon.classList.add('active');
                        indicatorNumber.classList.add('show-icon-repeat');

                        break;

                    default: // RepeatModes.None
                        app.repeatMode = RepeatModes.RepeatList;
                        indicatorIcon.classList.add('active');
                        indicatorNumber.classList.remove('show-icon-repeat');

                        break;


                } // switch */
            }, // onclick repeat btn

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

            // Song clicked
            playlist.querySelectorAll('.song').forEach(song => {
                song.onclick = function (e) {
                    app.currentIndex = Number(song.dataset.index);
                } // song.onclick

                // Toggle favorite
                const favorite = song.querySelector('.favorite-container');
                favorite.onclick = function (e) {
                    e.stopPropagation();

                    favorite.querySelector('.heart').classList.toggle('hide-item');
                    favorite.querySelector('.get-heart').classList.toggle('show-item-heart');
                } // favorite.onclick

                // Toggle option
                const option = song.querySelector('.option');
                option.onclick = function (e) {
                    e.stopPropagation();

                    // Remove current active option
                    try {
                        const currentActiveOption = playlist.querySelector('.show-item');
                        const currentSongWithActiveOption = (currentActiveOption.parentElement).parentElement;

                        if (currentSongWithActiveOption.dataset.index != song.dataset.index)
                            currentActiveOption.classList.remove('show-item');
                    } catch (err) { }

                    // Toggle currently clicked option
                    option.querySelector('.list-item-setting').classList.toggle('show-item');
                } // option.onclick 
            }); // forEach song

        // Speed audio


        document.querySelectorAll('.speed-audio').forEach(speed => {
            speed.onclick = function () {
                const currentActiveSpeed = document.querySelector('.active');

                currentActiveSpeed.classList.remove('active');
                speed.classList.add('active');

                audio.playbackRate = Number(this.getAttribute('speed'));

            }
        }); // for each speed level
        // Speed audio
    }, // Handle event 

    // Check speed
    checkSpeed: function () {
        const ctr_speed = document.querySelector('.speed-audio.active');
        audio.playbackRate = Number(ctr_speed.getAttribute('speed'));
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

    //#region Navigation --------------------------------------------------
    // Next song
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) 
            this.currentIndex = 0;
    }, // Next song

    // Previous song
    previousSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0)
            this.currentIndex = this.songs.length - 1;
    }, // Previous song

    // Random song
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.round(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
    }, // Random song
    //#endregion Navigation ----------------------------------------------

    // When start then run the function inside
    async start() {
        await this.fetchSongs();

        this.defineProperties();
        this.initialize();
        this.handleEvents();

        this.playSong();
    } // start
} // app

app.start();

