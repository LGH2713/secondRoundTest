function dataConcat(arr1, arr2) {
    let result = [];
    if(arr2) {
        for(let i = 0; i < arr1.length; i++) {
            result.push(arr1[i].playlist);
        }
        for(let i = 0; i < arr2.length; i++) {
            result.push(arr2[i]);
        }
    } else {
        for(let i = 0; i < arr1.length; i++) {
            result.push(arr1[i].playlist);
        }
    }
    clearMore(result);
    return result;
}



function myPlaylistFun() {
    let Header = 'http://localhost:3000';
    const myplaylist_interface = document.querySelector('.myplaylist_interface');
    let myplaylistInitUrl = Header + `/user/playlist?uid=${JSON.parse(window.localStorage.getItem('logined'))}`;
    AjaxRequest_myplaylist_init(myplaylistInitUrl);
    let myplaylists_data = dataConcat(JSON.parse(window.localStorage.getItem('playlistInit')), JSON.parse(window.localStorage.getItem('myplaylists')));
    
    let playlist = document.querySelector('.playlist');
    playlist.innerHTML = `歌单 ${myplaylists_data.length}`;


    let myplaylist_con = document.querySelector('.myplaylist_con');
    let myplaylist_song_con = document.querySelector('.myplaylist_song_con');
    clearMore(myplaylists_data);



    myplaylist_con.innerHTML = '';
    for(let i = 0; i < myplaylists_data.length; i++) {
        myplaylist_con.innerHTML += `<div class="list_playlist_item">
        <img src=${myplaylists_data[i].coverImgUrl} alt="">
        <div class="list_playlist_item_name">${myplaylists_data[i].name}</div>
        <div class="playlist_item_author">
            <span>By: ${myplaylists_data[i].creator.nickname}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>播放次数：${myplaylists_data[i].playCount}</span>
        </div>
        <div class="playlist_trackcount">${i + 1}</div>
    </div>`
    }

    var list_playlist_item = myplaylist_con.querySelectorAll('.list_playlist_item');
    for(let i = 0; i < list_playlist_item.length; i++) {
        list_playlist_item[i].setAttribute('index', i);
        list_playlist_item[i].addEventListener('click', function() {
            let myplaylist_playAll = myplaylist_interface.querySelector('.myplaylist_playAll');
            myplaylist_playAll.style.display = 'block';
            myplaylist_interface.addEventListener('mouseover', function() {
                myplaylist_playAll.style.opacity = 1;
            })
            myplaylist_interface.addEventListener('mouseout', function() {
                myplaylist_playAll.style.opacity = 1;
            })

            let index = this.getAttribute('index');
            myplaylist_con.style.display = 'none';
            myplaylist_song_con.style.display = 'block';
            if(myplaylists_data[index].trackIds) {
                let playlistSongPlayUrl = Header + '/song/detail?ids=' + playlist_songs(myplaylists_data[index].trackIds);
                console.log(playlistSongPlayUrl);
                AjaxRequest_myplaylist_song_detail(playlistSongPlayUrl);
            }
        })
    }
}

function playlist_songs(item) {
    let result = '';
    for(let i = 0; i < item.length; i++) {
        result += item[i].id;
        if(i < item.length - 1) {
            result += ',';
        }
    }
    return result;
}

// 发送具体歌曲请求
function AjaxRequest_myplaylist_song_detail(url) {
    let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 301 || xhr.status == 304) {
                    let data = JSON.parse(xhr.responseText);
                    let myplaylist_playAll = document.querySelector('.myplaylist_playAll');
                    myplaylist_playAll.addEventListener('click', function() {
                        window.localStorage.removeItem('playing_list');
                        window.localStorage.setItem('playing_list', JSON.stringify(data.songs));
                        AjaxRequest_playingList(playingUrl(idFun()));
                    })
                    callback_myplaylist_song_play(data);
                } else {
                    alert("Request was unsuccessful：" + xhr.status);
                }
            }
        }
        xhr.open("GET", url, true);
        xhr.send();
}

function callback_myplaylist_song_play(data) {
    const Header = 'http://localhost:3000';
    let myplaylist_song_con = document.querySelector('.myplaylist_song_con');
    myplaylist_song_con.innerHTML = '';
    for(let i = 0; i < data.songs.length; i++) {
        myplaylist_song_con.innerHTML += `<div class="myplaylist_song_item">
        <div class="myplaylist_song_order">${i + 1}</div>
        <div class="myplaylist_song_item_img"><img src=${data.songs[i].al.picUrl}
                alt="">
        </div>
        <div class="myplaylist_song_item_name">${data.songs[i].name}&nbsp &nbsp &nbsp   ${songDetail(data.songs[i].alia)}</div>
        <div class="myplaylist_song_ar">${data.songs[i].ar[0].name}</div>
    </div>`
    }

    let myplaylist_song_item = myplaylist_song_con.querySelectorAll('.myplaylist_song_item');
    let audio = document.querySelector('audio');
    let progress_container_songName = document.querySelector('.progress_container_songName');
    let progress_container_singerName = document.querySelector('.progress_container_singerName');
    let lyric_area = document.querySelector('.lyric_area'); 
    for(let i = 0; i < myplaylist_song_item.length; i++) {
        myplaylist_song_item[i].setAttribute('index', i);
        myplaylist_song_item[i].addEventListener('click', function() {
            let index = this.getAttribute('index');
            lyric_area.style.display = 'block';
            // const pause = document.querySelector('.pauseOrNot');
            // pause.onclick();
            audio.src = `https://music.163.com/song/media/outer/url?id=${data.songs[index].id}.mp3`;
            let lyricUrl = Header + '/lyric?id=' + data.songs[index].id;
            AjaxRequest_lyric(lyricUrl);
            progress_container_songName.innerHTML = `${data.songs[index].name}`;
            progress_container_singerName.innerHTML = `${singerName(data, index)}`;

        })
    }
}

function songDetail(result) {
    if(result) {
        return result;
    } else {
        return '';
    }
}


//获取用户原本歌单 start
function AjaxRequest_myplaylist_init(url) {
    let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 301 || xhr.status == 304) {
                    let data = JSON.parse(xhr.responseText);
                    callback_myplaylist_init(data.playlist);
                } else {
                    alert("Request was unsuccessful：" + xhr.status);
                }
            }
        }
        xhr.open("GET", url, false);
        xhr.send();
}

function callback_myplaylist_init(data) {
    let Header = 'http://localhost:3000';
    for(let i = 0; i < data.length; i++) {
        let myplaylistInitDetailUrl = Header + `/playlist/detail?id=${data[i].id}`;
        AjaxRequest_myplaylist_initDetail(myplaylistInitDetailUrl);
    }
}

function AjaxRequest_myplaylist_initDetail(url) {
    let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 301 || xhr.status == 304) {
                    let data = JSON.parse(xhr.responseText);
                    let initDetail = [];
                    if(window.localStorage.getItem('playlistInit')) {
                        initDetail = JSON.parse(window.localStorage.getItem('playlistInit'));
                        initDetail.push(data);
                    } else {
                        initDetail.push(data);
                    }
                    clearMore(initDetail);
                    window.localStorage.setItem('playlistInit', JSON.stringify(initDetail));
                    // callback_myplaylist_init(data);
                } else {
                    alert("Request was unsuccessful：" + xhr.status);
                }
            }
        }
        xhr.open("GET", url, false);
        xhr.send();
}

//获取用户原本歌单 end