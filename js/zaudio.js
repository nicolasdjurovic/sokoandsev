"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var zAudio = function () {
	function zAudio(props, trackList) {
		_classCallCheck(this, zAudio);

		this.DOMElement = document.getElementById(props.divId);
		this.autoPlay = props.autoplay;
		this.playList = trackList;
		this.playlistOpen = false;
		this.enableDownload = props.download;
		this.miniPlayer = props.miniplayer;
		this.repeatAll = false;
		this.shuffle = props.shuffle;
		this.defaultVolume = props.defaultVolume ? props.defaultVolume : 50;
		this.themeColor = props.color ? props.color : '#FF9900';

		//Link roboto font and material icons
		// this._linkStylesheet('https://fonts.googleapis.com/css?family=Roboto:400,500');
		// this._linkStylesheet('https://fonts.googleapis.com/icon?family=Material+Icons');

		if (this.playList.length > 1) {
			this._renderPlaylist(this.playList);
		} else {
			this._initialize(); //Initialize without playlist
		}
	}

	_createClass(zAudio, [{
		key: "_stringGen",
		value: function _stringGen(len) {
			var text = " ";

			var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < len; i++) {
				text += charset.charAt(Math.floor(Math.random() * charset.length));
			}return text;
		}
	}, {
		key: "_initialize",
		value: function _initialize() {
			var _this2 = this;

			var playlist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


			this._initTemplate(playlist);

			this.trackTitle = this.DOMElement.getElementsByClassName('zaudio_songtitle')[0];
			this.trackArtist = this.DOMElement.getElementsByClassName('zaudio_songartist')[0];
			this.albumArt = this.DOMElement.getElementsByClassName('zaudio_art')[0];

			this.downloadButton = this.DOMElement.getElementsByClassName('zaudio_download_button')[0];

			this.playButton = this.DOMElement.getElementsByClassName('zaudio_btn_play')[0];
			this.stopButton = this.DOMElement.getElementsByClassName('zaudio_btn_stop')[0];
			this.repeatButton = this.DOMElement.getElementsByClassName('zaudio_btn_repeat')[0];
			this.playlistButton = this.DOMElement.getElementsByClassName('zaudio_btn_playlist')[0];
			this.volumeButton = this.DOMElement.getElementsByClassName('zaudio_btn_mute')[0];
			this.seekbar = this.DOMElement.getElementsByClassName('zaudio_seekbg')[0];
			this.volumebar = this.DOMElement.getElementsByClassName('zaudio_seekbg')[1];

			//Setup mini layout if the parent div is not wide enough;
			if (this.DOMElement.offsetWidth < 600) {
				this.DOMElement.getElementsByClassName('zaudio_art')[0].style.flex = 1;
				this.DOMElement.getElementsByClassName('zaudio_art')[0].style.backgroundPosition = 'center';
				this.DOMElement.getElementsByClassName('zaudio_art')[0].style.backgroundColor = '#5e5e5e';
			}

			if (this.playlistButton) this.playlistButton.style.color = this.themeColor;

			this.seekbar.children[0].style.backgroundColor = this.themeColor;
			this.seekbar.children[0].children[0].style.borderColor = this.themeColor;

			this.volumebar.children[0].style.backgroundColor = this.themeColor;
			this.volumebar.children[0].children[0].style.borderColor = this.themeColor;

			this.audioElement = document.getElementById(this.tagId);

			if (this._mobileCheck()) {
				this.volumebar.style.display = 'none';
			} else this.audioElement.volume = (this.defaultVolume / 100).toFixed(1);

			this.audioElement.autoplay = this.autoPlay;

			if (this.shuffle) this.changeTrack(this._getRandomTrackIndex());else this.changeTrack(0);

			if (this.autoPlay) this.audioElement.play();

			this.audioElement.onplaying = function () {
				_this2.playButton.innerHTML = 'pause';
				sessionStorage.setItem('za_isplaying', true);
			};

			this.audioElement.onpause = function () {
				_this2.playButton.innerHTML = 'play_arrow';
			};

			var circle = document.createElement('DIV');
			var text = document.createTextNode('Streaming');

			//On stall
			this.audioElement.onstalled = function () {
				text.nodeValue = 'Media Unavailable';
				circle.style.backgroundColor = '#dbd7d7';
			};

			//Buffering
			this.audioElement.onwaiting = function () {
				_this2.DOMElement.getElementsByClassName('zaudio_tracktime')[0].innerHTML = '<div class="zaudio_spinner"></div>';
				_this2.DOMElement.getElementsByClassName('zaudio_tracktime')[0].children[0].style.borderTopColor = _this2.themeColor;
			};

			//Set Track duration

			this.audioElement.oncanplay = function () {
				if (_this2.audioElement.duration == 'Infinity') {
					_this2.seekbar.style.display = 'none';

					circle.className = 'zaudio_stream_circle';
					_this2.DOMElement.getElementsByClassName('zaudio_seekbar')[0].appendChild(circle);
					_this2.DOMElement.getElementsByClassName('zaudio_seekbar')[0].appendChild(text);
					_this2.DOMElement.getElementsByClassName('zaudio_tracktime')[0].style.fontSize = '20px';
					_this2.DOMElement.getElementsByClassName('zaudio_tracktime')[0].style.paddingLeft = '0px';
					_this2.stopButton.style.display = 'none';
					_this2.repeatButton.style.display = 'none';
					if (_this2.enableDownload) _this2.downloadButton.style.display = 'none';
				} else {
					_this2.DOMElement.getElementsByClassName('zaudio_tracktime')[0].innerHTML = _this2.formatTime(_this2.audioElement.duration);
					if (!_this2.miniPlayer) {
						_this2.seekbar.removeAttribute('style');
						_this2.stopButton.removeAttribute('style');
						_this2.DOMElement.getElementsByClassName('zaudio_tracktime')[0].removeAttribute('style');
					}
				}
			};

			//Handle the end of playing
			this.audioElement.onended = function (e) {
				_this2.playButton.innerHTML = 'play_arrow';
				_this2.isPlaying = false;
				if (playlist) {
					if (_this2.shuffle) {
						_this2.changeTrack(_this2._getRandomTrackIndex());
						_this2.audioElement.play();
					} else {
						if (_this2.repeatAll && _this2.nowPlayingIndex + 1 == _this2.playList.length) {
							_this2.changeTrack(0);
							_this2.audioElement.play();
							_this2.playlistElement.scrollTop = 0;
						} else {
							if (_this2.nowPlayingIndex + 1 != _this2.playList.length) {
								_this2.changeTrack(_this2.nowPlayingIndex + 1);
								_this2.audioElement.play();
							}
						}
					}
				}
			};

			this.audioElement.onerror = function (e) {};

			//Update current time and seekbar
			this.audioElement.ontimeupdate = function () {
				var precentage = _this2.audioElement.currentTime / _this2.audioElement.duration * 100;
				_this2.DOMElement.getElementsByClassName('zaudio_seekfill')[0].style.width = precentage + "%";

				_this2.DOMElement.getElementsByClassName('zaudio_tracktime')[0].innerHTML = _this2.formatTime(_this2.audioElement.currentTime);
			};

			this._handleInputs();
		}
	}, {
		key: "_mobileCheck",
		value: function _mobileCheck() {
			var check = false;
			(function (a) {
				if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
			})(navigator.userAgent || navigator.vendor || window.opera);
			return check;
		}
	}, {
		key: "_handleInputs",
		value: function _handleInputs() {
			var _this3 = this;

			var that = this;
			this.changeVolume = function (event) {

				var mouseX = event.pageX - that._getOffsetLeft(that.volumebar);
				var volume = mouseX / that._getOffsetWidth(that.volumebar);
				if (volume > 0 & volume < 1) {
					that.volumebar.children[0].style.width = Math.floor(volume * 100) + "%";
					that.audioElement.volume = volume.toFixed(2);
					volume = volume.toFixed(2);
					//update volume button
					if (volume > 0.8) that.volumeButton.innerHTML = 'volume_up';else if (volume < 0.8 & volume > 0.1) that.volumeButton.innerHTML = 'volume_down';else if (volume < 0.1) {
						that.volumeButton.innerHTML = 'volume_mute';
					}
				}
			};

			this.volumebar.addEventListener('mousedown', function (e) {
				window.addEventListener('mousemove', _this3.changeVolume, true);
			});

			window.addEventListener('mouseup', function (e) {
				window.removeEventListener('mousemove', _this3.changeVolume, true);
			});

			//var seekbar = this.DOMElement.getElementsByClassName('zaudio_seekbg')[0];
			this.seekbar.addEventListener('click', function (e) {
				var mouseX = e.pageX - _this3._getOffsetLeft(_this3.seekbar);
				var seekpos = mouseX * _this3.audioElement.duration / _this3._getOffsetWidth(_this3.seekbar);
				_this3.audioElement.currentTime = seekpos;
			});

			if (this.enableDownload) {
				this.downloadButton.addEventListener('click', function (e) {
					_this3._saveFile(_this3.playList[_this3.nowPlayingIndex].downloadLink || _this3.playList[_this3.nowPlayingIndex].url);
				});
			}

			this.DOMElement.getElementsByClassName('zaudio_buttonwrapper')[0].addEventListener('click', function (e) {

				switch (e.target.innerHTML) {
					case 'play_arrow':
						this.audioElement.play();
						this._pauseOtherInstances();
						e.target.innerHTML = 'pause';
						break;
					case 'pause':
						this.audioElement.pause();
						e.target.innerHTML = 'play_arrow';
						break;
					case 'volume_down':
					case 'volume_mute':
						this.audioElement.muted = true;
						e.target.innerHTML = 'volume_off';
						break;
					case 'volume_off':
						this.audioElement.muted = false;
						e.target.innerHTML = 'volume_down';
						break;
					case 'fast_forward':
						this.audioElement.playbackRate += 0.5;
						if (this.audioElement.playbackRate > 2) {
							this.audioElement.playbackRate = 1.0;
						}
						break;
					case 'stop':
						this.audioElement.pause();
						this.playButton.innerHTML = 'play_arrow';
						this.audioElement.currentTime = 0;
						break;
					case 'skip_next':
						this.changeTrack(this.nowPlayingIndex + 1);
						this.audioElement.play();
						this._pauseOtherInstances();
						break;
					case 'skip_previous':
						this.changeTrack(this.nowPlayingIndex - 1);
						this.audioElement.play();
						this._pauseOtherInstances();
						break;
					case 'queue_music':
						e.target.style.color = this.playlistOpen ? '' : this.themeColor;
						this._togglePlaylist();
						break;
					case 'repeat':
						if (!this.repeatAll) {
							this.audioElement.loop = true;
							e.target.innerHTML = 'repeat_one';
						} else {
							this.audioElement.loop = false;
							e.target.removeAttribute('style');
							this.repeatAll = false;
						}
						break;
					case 'repeat_one':
						if (this.repeatAll) {
							this.audioElement.loop = false;
							e.target.innerHTML = 'repeat';
						} else {
							if (this.playList.length > 1) {
								e.target.style.color = this.themeColor;
								this.repeatAll = true;
								this.audioElement.loop = false;
								e.target.innerHTML = 'repeat';
							} else {
								this.audioElement.loop = false;
								e.target.innerHTML = 'repeat';
							}
						}
						break;

				}
			}.bind(this));
		}
	}, {
		key: "_pauseOtherInstances",
		value: function _pauseOtherInstances() {
			var audios = document.getElementsByTagName('audio');
			for (var i = 0, len = audios.length; i < len; i++) {
				if (audios[i] != this.audioElement) {
					audios[i].pause();
				}
			}
		}
	}, {
		key: "_getRandomTrackIndex",
		value: function _getRandomTrackIndex() {
			var num = Math.floor(Math.random() * this.playList.length);
			return num == this.nowPlayingIndex ? this._getRandomTrackIndex() : num;
		}
	}, {
		key: "_getOffsetLeft",
		value: function _getOffsetLeft(element) {
			var rect = element.getBoundingClientRect();
			return rect.left;
		}
	}, {
		key: "_getOffsetWidth",
		value: function _getOffsetWidth(element) {
			var rect = element.getBoundingClientRect();
			return rect.right - rect.left;
		}
	}, {
		key: "changeTrack",
		value: function changeTrack(index) {
			if (index != this.nowPlayingIndex && this.playList.length > index && index >= 0) {
				var track = this.playList[index];
				this.trackTitle.innerHTML = track.title ? track.title : '';
				this.trackArtist.innerHTML = track.artist ? track.artist : '';
				this.albumArt.style.backgroundImage = "url(" + track.albumArturl + ")";
				this.audioElement.src = track.url;
				this.nowPlayingIndex = index;

				if (this.playList.length > 1) this._setActiveItem(this.playlistElement.children[index]);
			}
		}
	}, {
		key: "_saveFile",
		value: function _saveFile(url) {
			// Get file name from url.
			var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
			var xhr = new XMLHttpRequest();
			xhr.responseType = 'blob';
			xhr.onload = function () {
				var a = document.createElement('a');
				a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
				a.download = filename; // Set the file name.
				a.style.display = 'none';
				document.body.appendChild(a);
				a.click();
			};
			xhr.open('GET', url);
			xhr.send();
		}
	}, {
		key: "_togglePlaylist",
		value: function _togglePlaylist() {
			this.DOMElement.getElementsByClassName('zaudio_playlist')[0].style.maxHeight = this.playlistOpen ? '0px' : '200px';
			this.playlistOpen = !this.playlistOpen;
		}
	}, {
		key: "formatTime",
		value: function formatTime(seconds) {
			var m = Math.floor(seconds / 60);
			var s = ("0" + Math.floor(seconds - m * 60)).slice(-2);

			return m + ':' + s;
		}
	}, {
		key: "_initTemplate",
		value: function _initTemplate(playlist) {

			var altWrapClass = this.miniPlayer ? 'zaudio_wrapper_min' : !playlist ? 'zaudio_wrapper_noplaylist' : '';
			this.tagId = "a_" + new Date().getUTCMilliseconds();

			var template = "\n\t\t\t<div class=\"zaudio_wrapper " + altWrapClass + "\">\n\t\t\t\t<audio id=\"" + this.tagId + "\"></audio>\n\t\t\t\t<div class=\"zaudio_container\">\n\t\t\t\t\t\t<div class=\"zaudio_art\" " + (this.miniPlayer ? 'style="display:none"' : '') + ">\n\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"zaudio_player\">\n\t\t\t\t\t\t\t<div class=\"zaudio_trackinfo\">\n\t\t\t\t\t\t\t\t<div class=\"zaudio_playercontrolbuttons\" style=\"display:flex;flex-direction:row;justify-content:space-between;\"><span " + (this.miniPlayer ? 'style="font-size:16px;"' : '') + " class=\"zaudio_songtitle\"></span>\n\t\t\t\t\t\t\t\t" + (this.enableDownload ? '<i class="material-icons zaudio_icons zaudio_download_button">file_download</i>' : '<span/>') + "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<span " + (this.miniPlayer ? 'style="font-size:14px;"' : '') + " class=\"zaudio_songartist\"></span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"zaudio_playercontrols\">\n\t\t\t\t\t\t\t\t<div class=\"zaudio_seekbar\">\n\t\t\t\t\t\t\t\t\t<div " + (this.miniPlayer ? 'style="display:none"' : '') + " class=\"zaudio_seekbg\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"zaudio_seekfill\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"zaudio_seeker\"></div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t" + (!this.miniPlayer ? '<span class="zaudio_tracktime">0:00</span>' : '') + "\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"zaudio_buttonwrapper\">\n\t\t\t\t\t\t\t\t\t<div class=\"zaudio_playercontrolbuttons noselect\">\n\t\t\t\t\t\t\t\t\t\t" + (playlist ? '<i class="material-icons zaudio_icons zaudio_btn_prev">skip_previous</i>' : '') + "\n\t\t\t\t\t\t\t\t\t\t<i class=\"material-icons zaudio_icons zaudio_btn_play\" style=\"color:" + this.themeColor + ";\">play_arrow</i>\n\t\t\t\t\t\t\t\t\t\t<i " + (this.miniPlayer ? 'style="display:none"' : '') + " class=\"material-icons zaudio_icons zaudio_btn_stop\">stop</i>\n\t\t\t\t\t\t\t\t\t\t" + (playlist ? '<i class="material-icons zaudio_icons zaudio_btn_next">skip_next</i>' : '') + "\n\t\t\t\t\t\t\t\t\t\t<i " + (this.miniPlayer ? 'style="display:none"' : '') + "class=\"material-icons zaudio_icons zaudio_btn_repeat\">repeat</i>\n\t\t\t\t\t\t\t\t\t\t" + (this.miniPlayer ? '<span class="zaudio_tracktime zaudio_tracktime_mini">0:00</span>' : '') + "\n\t\t\t\t\t\t\t\t\t\t" + (playlist && !this.miniPlayer ? '<i class="material-icons zaudio_icons zaudio_btn_playlist" style="color:${this.themeColor}">queue_music</i>' : '') + "\n\t\t\t\t\t\t\t\t\t\t<i class=\"material-icons zaudio_icons zaudio_btn_mute\">volume_down</i>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"zaudio_seekbg\" style=\"height:5px; max-width:20%;\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"zaudio_seekfill\" style=\"height:5px;width:" + this.defaultVolume + "%;\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"zaudio_seeker\" style=\"height:12px;min-width:12px;\"></div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t</div>\n\t\t";
			this.DOMElement.innerHTML = template;
		}
	}, {
		key: "_setActiveItem",
		value: function _setActiveItem(li) {
			if (this.activeItem != li) {
				if (this.activeItem) {
					this.activeItem.removeAttribute('style');
					this.activeItem.children[4].innerHTML = 'play_arrow';
				}

				li.style.backgroundColor = '#ececec';
				li.children[4].innerHTML = 'volume_up';
				this.activeItem = li;
			}
		}
	}, {
		key: "_renderPlaylist",
		value: function _renderPlaylist(list) {

			var playlistHTML = '';
			for (var i = 0; i < list.length; i++) {
				var item = list[i];
				playlistHTML += "\n\t\t\t\t<li data-id=\"" + i + "\">\n\t\t\t\t\t<img src=\"" + item.albumArturl + "\"/>\n\t\t\t\t\t<span>" + item.title + "</span>\n\t\t\t\t\t<span>" + item.artist + "</span>\n\t\t\t\t\t<span style=\"flex-grow:1;\"></span>\n\t\t\t\t\t<i class=\"material-icons\" style=\"color:#a3a3a3;\">play_arrow</i>\n\t\t\t\t</li>\n\t\t\t";
			}

			var playlistElement = document.createElement('UL');
			playlistElement.className = 'zaudio_playlist noselect';
			playlistElement.style.display = this.miniPlayer ? 'none' : '';
			playlistElement.innerHTML = playlistHTML;
			this.playlistElement = playlistElement;
			this._initialize(true);
			this.DOMElement.children[0].appendChild(playlistElement);
			this._togglePlaylist(); //Keep playlist expanded by default
			var _this = this;

			playlistElement.addEventListener('click', function (e) {
				var target = e.target;
				while (target && target.parentNode != playlistElement) {
					target = target.parentNode;
					if (!target) {
						return;
					}
				}
				if (target.tagName === 'LI') {
					_this.changeTrack(parseInt(target.dataset.id));
					_this.audioElement.play();
					_this._pauseOtherInstances();
				}
			});
		}
	}]);

	return zAudio;
}();