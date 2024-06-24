const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const LOCALSTORAGE_CONFIG = "music_ap_config";

const h2 = $("h2");
const cdThumb = $(".cd-thumb");
const cd = $(".cd");
const audio = $("#audio");
const playlist = $(".playlist");
const togglePlay = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const repeatBtn = $(".btn-repeat");
const randomBtn = $(".btn-random");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isDragging: false,
  isRandom: false,
  isRepeat: false,
  configs: JSON.parse(localStorage.getItem(LOCALSTORAGE_CONFIG)) || {},
  songs: [
    {
      name: "Chẳng còn thời gian ấy",
      singer: "BemImPoe",
      path: "./assets/music/ChangConThoiGianAy-BemImPoe-7819862.mp3",
      image: "./assets/img/ChangConThoiGianAy.jpg",
    },
    {
      name: "Mình từng bên nhau",
      singer: "Tama",
      path: "./assets/music/MinhTungBenNhau-TamaVietNamNachiKhang-8141035.mp3",
      image: "./assets/img/MinhTungBenNhau.jpg",
    },
    {
      name: "Ngày em đẹp nhất",
      singer: "Tama",
      path: "./assets/music/NgayEmDepNhatPianoVersion-TamaVietNam-14805205.mp3",
      image: "./assets/img/NgayEmDepNhat.jpg",
    },
    {
      name: "Xin lỗi vì đã xuất hiện",
      singer: "Vũ Duy Khánh",
      path: "./assets/music/XinLoiViDaXuatHien-VuDuyKhanh-8533116.mp3",
      image: "./assets/img/XinLoiViDaXuatHien.jpg",
    },
    {
      name: "Cần không có có không cần",
      singer: "Thanh Hưng",
      path: "./assets/music/CanKhongCoCoKhongCan-ThanhHungIdol-6931362.mp3",
      image: "./assets/img/CanKhongCoCoKhongCan.jpg",
    },
    {
      name: "Phải giữ em thế nào",
      singer: "Mr.Siro",
      path: "./assets/music/PhaiGiuEmTheNao-MrSiro-7067288.mp3",
      image: "./assets/img/PhaiGiuEmTheNao.jpg",
    },
    {
      name: "Tệ thật anh nhớ em",
      singer: "Thanh Hưng",
      path: "./assets/music/TeThatAnhNhoEm-ThanhHung-7132634.mp3",
      image: "./assets/img/TeThatAnhNhoEm.jpg",
    },
    {
      name: "Tự lau nước mắt",
      singer: "Mr.Siro",
      path: "./assets/music/TuLauNuocMat-MrSiro-4754186.mp3",
      image: "./assets/img/TuLauNuocMat.jpg",
    },
    {
      name: "Yêu người không thể yêu",
      singer: "Mr.Siro",
      path: "./assets/music/YeuNguoiKhongTheYeuCover-MrSiro-5049892.mp3",
      image: "./assets/img/YeuNguoiKhongTheYeu.jpg",
    },
  ],

  setConfig: function () {
    localStorage.setItem(LOCALSTORAGE_CONFIG, JSON.stringify(this.configs));
  },

  loadConfig: function () {
    this.isRandom = this.configs.isRandom;
    this.isRepeat = this.configs.isRepeat;
    this.currentIndex = this.configs.currentIndex || 0;
  },

  render: function () {
    var htmls = this.songs.map((song, index) => {
      return `
        <div class="song" data-index="${index}">
          <div
            class="thumb"
            style="
              background-image: url('${song.image}');
            "
          ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
        `;
    });

    playlist.innerHTML = htmls.join("");
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //scrollSongs
    document.onscroll = function () {
      const newWidth = cdWidth - window.scrollY;
      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth > 0 ? newWidth / cdWidth : 0;
    };

    //Animation CD
    const cdThumbAnimation = cdThumb.animate(
      [{ transform: "rotate(360deg)" }],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimation.pause();

    //handle click play
    togglePlay.onclick = function () {
      if (_this.isPlaying == false) {
        audio.play();
      } else {
        audio.pause();
      }
    };

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimation.play();
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimation.pause();
    };

    //progress audio
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        if (_this.isDragging == false) {
          progress.value = progressPercent;
        }
      }
    };

    //tua nhanh
    progress.oninput = function () {
      _this.isDragging = true;
    };

    progress.onchange = function () {
      _this.isDragging = false;
      audio.currentTime = (audio.duration / 100) * progress.value;
    };

    //next audio
    nextBtn.onclick = function () {
      if (_this.isRandom == true) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      _this.scrollToActiveSong();

      //save localstorage
      _this.configs.currentIndex = _this.currentIndex;
      _this.setConfig();
    };

    //previuos audio
    prevBtn.onclick = function () {
      _this.prevSong();
      _this.scrollToActiveSong();

      //save localstorage
      _this.configs.currentIndex = _this.currentIndex;
      _this.setConfig();
    };

    //repeat audio
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);

      //save localstorage
      _this.configs.isRepeat = _this.isRandom;
      _this.setConfig();
    };

    //active ramdom audio
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);

      //save localstorage
      _this.configs.isRandom = _this.isRandom;
      _this.setConfig();
    };

    //When finished a song
    audio.onended = function () {
      if (_this.isRepeat == true) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //When clicked on playlist
    playlist.onclick = function (e) {
      if (!e.target.closest(".option")) {
        if (e.target.closest(".song:not(.active)")) {
          var dataIndex = e.target.closest(".song").getAttribute("data-index");
          _this.currentIndex = dataIndex;
          _this.loadCurrentSong();
          audio.play();

          //save localstorage
          _this.configs.currentIndex = _this.currentIndex;
          _this.setConfig();
        }
      } else {
        console.log("option");
      }
    };
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    audio.play();
  },

  prevSong: function () {
    if (this.currentIndex != 0) {
      this.currentIndex--;
    }
    this.loadCurrentSong();
    audio.play();
  },

  playRandomSong: function () {
    var randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.songs.length);
    } while (randomIndex == this.currentIndex);
    this.currentIndex = randomIndex;
    this.loadCurrentSong();
    audio.play();
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  loadCurrentSong: function () {
    h2.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;

    $(".song.active")?.classList.remove("active");
    $$(".song")[this.currentIndex].classList.add("active");
  },

  scrollToActiveSong: function () {
    $(".song.active").scrollIntoView({
      behavior: "smooth",
      block: `${
        this.currentIndex == 0 ||
        this.currentIndex == 1 ||
        this.currentIndex == 2
          ? "center"
          : "nearest"
      }`,
    });
  },

  start: function () {
    this.loadConfig();
    this.handleEvents();
    this.defineProperties();
    this.render();
    this.loadCurrentSong();

    if (this.isRandom) {
      randomBtn.classList.add("active");
    }

    if (this.isRepeat) {
      repeatBtn.classList.add("active");
    }

    // this.chooseSong();
  },
};

app.start();
