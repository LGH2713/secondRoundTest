// 歌曲详情请求地址转换函数
function playingUrl(ids) {
    let playingHeader = 'http://localhost:3000';
    return playingHeader + '/song/detail?ids=' + ids;
}

// 歌曲详情请求地址转换函数
function idFun() {
    let ids = ''
    if(window.localStorage.getItem('playing_list')) {
        let playing_list = JSON.parse(window.localStorage.getItem('playing_list'));
        console.log(playing_list);
        for(let i = 0; i < playing_list.length; i++) {
            ids += playing_list[i].id;
            if(i < playing_list.length - 1) {
                ids += ',';
            }
        }
    }
    return ids;
}

//点击加入当前播放列表
function addSongs(module) {
    let search_interface = document.querySelector('.search_interface');
    let user_interface = document.querySelector('.user_interface');

    if(module == 'user') {
        let song_item = user_interface.querySelectorAll('.song_item');
        var song_item_add = user_interface.querySelectorAll('.song_item_add')
        for(let i = 0; i < song_item.length; i++) {
            // 放入当前播放列表 start
            song_item_add[i].setAttribute('index', i);
            song_item_add[i].addEventListener('click', function() {
                clickAdd(song_item_add[i], module);
            })
            // 放入当前列表 end 
        }
    } else if (module == 'searchSongs') {
        let list_song_box = search_interface.querySelector('.list_song_box');
        let song_item = list_song_box.querySelectorAll('.song_item');
        var song_item_add = list_song_box.querySelectorAll('.song_item_add')
        for(let i = 0; i < song_item.length; i++) {
            // 放入当前播放列表 start
            song_item_add[i].setAttribute('index', i);
            song_item_add[i].addEventListener('click', function() {
                clickAdd(song_item_add[i], module);
            })
            // 放入当前列表 end 
        }
    } else if(module == 'searchSingerSongs') {
        let list_singerSong_box = search_interface.querySelector('.list_singerSong_box');
        let song_item = list_singerSong_box.querySelectorAll('.song_item');
        var song_item_add = list_singerSong_box.querySelectorAll('.song_item_add')
        for(let i = 0; i < song_item.length; i++) {
            // 放入当前播放列表 start
            song_item_add[i].setAttribute('index', i);
            song_item_add[i].addEventListener('click', function() {
                clickAdd(song_item_add[i], module);
            })
            // 放入当前列表 end 
        }
    } else if(module == 'searchPlaylistSongs') {
        let list_playlistSong_box = search_interface.querySelector('.list_playlistSong_box');
        let song_item = list_playlistSong_box.querySelectorAll('.song_item');
        var song_item_add = list_playlistSong_box.querySelectorAll('.song_item_add')
        for(let i = 0; i < song_item.length; i++) {
            // 放入当前播放列表 start
            song_item_add[i].setAttribute('index', i);
            song_item_add[i].addEventListener('click', function() {
                clickAdd(song_item_add[i], module);
            })
            // 放入当前列表 end 
        }
    }
}

// 点击后数据处理函数
function clickAdd(item, module) {
    let playing_list = [];
    var data;
    switch(module) {
        case 'user':
            data = JSON.parse(window.localStorage.getItem('addNeed'));
            break;
        case 'searchSongs':
            data = JSON.parse(window.localStorage.getItem('search')).result.songs;
            break;
        case 'searchSingerSongs':
            data = JSON.parse(window.localStorage.getItem('singerSong')).songs;
            break;
        case 'searchPlaylistSongs':
            data = JSON.parse(window.localStorage.getItem('playlistSongs')).songs;
            break;
    }
    
    let index = item.getAttribute('index');
    if(window.localStorage.getItem('playing_list')) {
        playing_list = JSON.parse(window.localStorage.getItem('playing_list'));//解析搜索记录并用新数组保存
        playing_list.push(data[index]); //将点击的歌曲推入新数组
        playing_list = clearMore(playing_list);//数组去重
        window.localStorage.removeItem('playing_list');//移除原数据
        window.localStorage.setItem('playing_list',JSON.stringify(playing_list))//储存新数组
    } else {
        playing_list.push(data[index]);
        window.localStorage.setItem('playing_list',JSON.stringify(playing_list))
    }
    AjaxRequest_playingList(playingUrl(idFun()));
}

// 当前播放列表发送请求
function AjaxRequest_playingList(url) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 301 || xhr.status == 304) {
                let result = JSON.parse(xhr.responseText);
                window.localStorage.setItem('nowPlaying', JSON.stringify(result.songs));
                callback_playingList(result);
            } else {
                alert("Request was unsuccessful：" + xhr.status);
            }
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
}

function isAlia(item) {
    if(item) {
        if(item[0]) {
            return item[0];
        } else {
            return '';
        }
    } else {
        return '';
    }
}

function isAr(item) {
    if(item) {
        return item[0].name;
    } else {
        return '';
    }
}

// 当前播放列表回调函数
function callback_playingList(data) {
    const Header = 'http://localhost:3000';
    var playing_list = document.querySelector('.playing_list');
    let delete_all = document.querySelector('.delete_all');
    const playing_all = document.querySelector('.playing_all');
    let audio = document.querySelector('audio');
    playing_list.innerHTML = '';
    for(let i = 0; i < data.songs.length; i++) {
        playing_list.innerHTML += `<li class="playing_list_item">
        <div class="playing_list_item_con">
        <span class="playing_list_item_num">${i + 1}</span>
        <div class="playing_list_item_img"><img src=${data.songs[i].al.picUrl}
                alt=""></div>
        <div class="playing_list_item_msg">
            <div class="playing_list_item_song">
                <div class="playing_list_item_songDetail">${data.songs[i].al.name} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${isAlia(data.songs[i].alia)}
                </div>
            </div>
            <span class="playing_list_item_singer">${isAr(data.songs[i].ar)}</span>
        </div>
        </div>
        <div class="delete_one"><i class=" icon-cancel-circle""></i></div>
    </li>`
    }


    // 每次点击播放时歌曲盒子样式变化
    var playing_songs = JSON.parse(window.localStorage.getItem('playing_list'));
    let playing_list_item = document.querySelectorAll('.playing_list_item');
    let playing_list_item_con = document.querySelectorAll('.playing_list_item_con');
    let playing_list_item_num = document.querySelectorAll('.playing_list_item_num');
    let playing_list_item_img = document.querySelectorAll('.playing_list_item_img');
    let playing_list_item_msg = document.querySelectorAll('.playing_list_item_msg');
    for(let i = 0; i < playing_list_item_con.length; i++) {
        playing_list_item_con[i].setAttribute('index', i);
        playing_list_item[i].setAttribute('index', i);
        playing_list_item_con[i].addEventListener('click', function() {
            for(let i = 0; i < playing_list_item_con.length; i++) {
                playing_list_item_con[i].className = 'playing_list_item';
                playing_list_item_num[i].className = 'playing_list_item_num';
                playing_list_item_img[i].className = 'playing_list_item_img';
                playing_list_item_msg[i].className = 'playing_list_item_msg';
            }

            let index = this.getAttribute('index');

            playing_list_item_con[index].className = 'playing_list_item playing_list_item_on';
            playing_list_item_num[index].className = 'playing_list_item_num playing_list_item_num_on';
            playing_list_item_img[index].className = 'playing_list_item_img playing_list_item_img_on';
            playing_list_item_msg[index].className = 'playing_list_item_msg playing_list_item_msg_on';


            window.localStorage.setItem('now_index',index)//保存当前索引号
            let lyricUrl = Header + '/lyric?id=' + nowPlaying[index].id;
            AjaxRequest_playingListLyric(lyricUrl, 'list');
            audio.src = `https://music.163.com/song/media/outer/url?id=${playing_songs[index].id}.mp3`;
            player_con(playing_songs, index);

            let comment_btn = document.querySelector('.comment_btn'); 
            comment_btn.style.display = 'block';
            comment_btn.onclick = function() {
                let commentUrl = Header + `/comment/music?id=${playing_songs[index].id}`;
                AjaxRequest_comment(commentUrl);
            }
        })

    }

    delete_oneFun();


    delete_all.addEventListener('click', function() {
        if(window.localStorage.getItem('playing_list')) {
            playing_songs = null;
            window.localStorage.removeItem('playing_list');
            window.localStorage.removeItem('nowPlaying');
            console.log(JSON.parse(window.localStorage.getItem('playing_list')));
            console.log(JSON.parse(window.localStorage.getItem('nowPlaying')));
            playing_list.innerHTML = '';
            addSongs();
        }
    })

    let order_control = document.querySelector('.order_control');
    let module = document.querySelector('.module');

    order_control.setAttribute('moduleBtn', 'list');


    
    let nowPlaying = JSON.parse(window.localStorage.getItem('nowPlaying'));
    let user_interface = document.querySelector('.user_interface');
    var lyric_area = document.querySelector('.lyric_area');
    playing_all.addEventListener('click', function() {
        user_interface.style.display = 'none';
        lyric_area.style.display = 'block';
        window.localStorage.setItem('now_index', '0')//设置当前播放第一首
        let lyricUrl = Header + '/lyric?id=' + nowPlaying[0].id
        AjaxRequest_playingListLyric(lyricUrl, 'list');
        audio.src = `https://music.163.com/song/media/outer/url?id=${nowPlaying[0].id}.mp3`;
        player_con(nowPlaying, 0)
        var playing_list_item_msg = document.querySelectorAll('.playing_list_item_msg');
        var playing_list_item_img = document.querySelectorAll('.playing_list_item_img');
        var playing_list_item = document.querySelectorAll('.playing_list_item');
        var playing_list_item_num = document.querySelectorAll('.playing_list_item_num');
        playing_list_item[0].className = 'playing_list_item playing_list_item_on';
        playing_list_item_num[0].className = 'playing_list_item_num playing_list_item_num_on';
        playing_list_item_img[0].className = 'playing_list_item_img playing_list_item_img_on';
        playing_list_item_msg[0].className = 'playing_list_item_msg playing_list_item_msg_on';
    })



    order_control.onclick = function() {
        switch(order_control.getAttribute('moduleBtn')){
            case 'list':
                audio.loop = true;
                module.className = `icon-loop module`
                order_control.setAttribute('moduleBtn', 'loop');
                break;
            case 'loop':
                audio.loop = false;
                random_playing();
                module.className = `icon-shuffle module`
                order_control.setAttribute('moduleBtn', 'random');
                break;
            case 'random':
                list_playing();
                module.className = `icon-menu module`;
                order_control.setAttribute('moduleBtn', 'list');
                break;
        }
    }

    
}

// 删除当前播放列表中的任意一首歌
function delete_oneFun() {
    var delete_one = document.querySelectorAll('.delete_one');
    var playing_list_item_con = document.querySelectorAll('.playing_list_item_con');
    var playing_list_item = document.querySelectorAll('.playing_list_item');
    var playing_list_item_num = document.querySelectorAll('.playing_list_item_num');
    var nowPlaying = JSON.parse(window.localStorage.getItem('nowPlaying'));
    let audio = document.querySelector('audio');
    

    for(let i = 0; i < playing_list_item.length; i++) {
        delete_one[i].setAttribute('index', i);//给元素添加索引号
        delete_one = document.querySelectorAll('.delete_one');
        delete_one[i].addEventListener('click', function() {
            var index = this.getAttribute('index');

            playing_list_item_con = document.querySelectorAll('.playing_list_item_con');
            delete_one = document.querySelectorAll('.delete_one');
            for(let i = 0; i < playing_list_item_con.length; i++) {
                delete_one[i].removeAttribute('index');//给元素添加索引号
            }
            for(let i = 0; i < playing_list_item_con.length; i++) {
                delete_one[i].setAttribute('index', i);//给元素添加索引号
            }
                        
            if(delete_one.length == 1) {
                index = this.getAttribute('index');
                nowPlaying = [];//点击单曲删除后删除该元素
                playing_list_item[0].remove();//删除该节点
            } else {
                index = this.getAttribute('index');
                nowPlaying.splice(index, 1);//点击单曲删除后删除该元素
                playing_list_item[index].remove();//删除该节点
            }
            delete_one = document.querySelectorAll('.delete_one');
            playing_list_item_num = document.querySelectorAll('.playing_list_item_num');
            playing_list_item = document.querySelectorAll('.playing_list_item');
            
            if(playing_list_item.length && playing_list_item_con.length) {
                for(let i = 0; i < playing_list_item.length; i++) {
                    playing_list_item[i].removeAttribute('index');
                    playing_list_item_con[i].removeAttribute('index');
                }

                for(let i = 0; i < nowPlaying.length; i++) {
                    if(i < playing_list_item_con.length) {
                        playing_list_item[i].setAttribute('index', i);
                        playing_list_item_con[i].setAttribute('index', i);
                    }
                }
                for(let i = 0; i < playing_list_item_num.length; i++) {
                    playing_list_item_num[i].textContent = i + 1;
                }
            }

            // console.log(parseInt(index));
            if(nowPlaying.length != 0) {
                audio.src = `https://music.163.com/song/media/outer/url?id=${nowPlaying[parseInt(index)].id}.mp3`;//播放下一首歌
            } else {
                audio.src = ``;
            }

            window.localStorage.removeItem('playing_list');
            window.localStorage.setItem('playing_list', JSON.stringify(nowPlaying));
            
            window.localStorage.setItem('now_index', index);//标记下一首的索引号
            window.localStorage.setItem('nowPlaying', JSON.stringify(nowPlaying));//存储更改后的列表数据;
            // console.log(window.localStorage.getItem('nowPlaying'));
            console.log(JSON.parse(window.localStorage.getItem('nowPlaying')));
        })
    }
    
}

// 切换上一首下一首
function switchSong(module) {
    const Header = 'http://localhost:3000';
    const audio = document.querySelector('audio');
    const previousBtn = document.querySelector('.previousBtn');
    const nextBtn = document.querySelector('.nextBtn');
    const playing_list = document.querySelector('.playing_list');
    let nowPlaying = JSON.parse(window.localStorage.getItem('nowPlaying'));
    var now_index = parseInt(window.localStorage.getItem('now_index'));

    previousBtn.onclick = function() {
        
        if(module == 'list') {
            if(now_index <= 0) {
                now_index = playing_list.children.length - 1;
            } else {
                now_index--;
            }
        } else {
            now_index = getRandom(0, nowPlaying.length, 0);
            if(now_index == nowPlaying.length) {
                now_index = nowPlaying.length - 1;
            }
        }

        var playing_list_item = document.querySelectorAll('.playing_list_item');
        var playing_list_item_num = document.querySelectorAll('.playing_list_item_num');
        var playing_list_item_img = document.querySelectorAll('.playing_list_item_img');
        var playing_list_item_msg = document.querySelectorAll('.playing_list_item_msg');

        window.localStorage.setItem('now_index', now_index)

        for(let i = 0; i < playing_list_item.length; i++) {
            playing_list_item[i].className = 'playing_list_item';
            playing_list_item_num[i].className = 'playing_list_item_num';
            playing_list_item_img[i].className = 'playing_list_item_img';
            playing_list_item_msg[i].className = 'playing_list_item_msg';
        }


        playing_list_item[now_index].className = 'playing_list_item playing_list_item_on';
        playing_list_item_num[now_index].className = 'playing_list_item_num playing_list_item_num_on';
        playing_list_item_img[now_index].className = 'playing_list_item_img playing_list_item_img_on';
        playing_list_item_msg[now_index].className = 'playing_list_item_msg playing_list_item_msg_on';

        console.log(now_index);
        window.localStorage.setItem('now_index_all', now_index);
        audio.src = `https://music.163.com/song/media/outer/url?id=${nowPlaying[now_index].id}.mp3`;
        let lyricUrl = Header + '/lyric?id=' + nowPlaying[now_index].id
        AjaxRequest_playingListLyric(lyricUrl);
        player_con(nowPlaying, now_index);
    }

    nextBtn.onclick = function() {
        
        if(module == 'list') {
            if(now_index >= playing_list.children.length - 1) {
                now_index = 0;
            } else {
                now_index++;
            }
        } else {
            now_index = getRandom(0, nowPlaying.length, 0);
            if(now_index == nowPlaying.length) {
                now_index = nowPlaying.length - 1;
            }
        }

        window.localStorage.setItem('now_index', now_index)


        var playing_list_item = document.querySelectorAll('.playing_list_item');
        var playing_list_item_num = document.querySelectorAll('.playing_list_item_num');
        var playing_list_item_img = document.querySelectorAll('.playing_list_item_img');
        var playing_list_item_msg = document.querySelectorAll('.playing_list_item_msg');
        for(let i = 0; i < nowPlaying.length; i++) {
            playing_list_item[i].className = 'playing_list_item';
            playing_list_item_num[i].className = 'playing_list_item_num';
            playing_list_item_img[i].className = 'playing_list_item_img';
            playing_list_item_msg[i].className = 'playing_list_item_msg';
        }


        playing_list_item[now_index].className = 'playing_list_item playing_list_item_on';
        playing_list_item_num[now_index].className = 'playing_list_item_num playing_list_item_num_on';
        playing_list_item_img[now_index].className = 'playing_list_item_img playing_list_item_img_on';
        playing_list_item_msg[now_index].className = 'playing_list_item_msg playing_list_item_msg_on';

        // if(flag == true) {

        // }

        window.localStorage.setItem('now_index_all', now_index);
        audio.src = `https://music.163.com/song/media/outer/url?id=${nowPlaying[now_index].id}.mp3`;
        let lyricUrl = Header + '/lyric?id=' + nowPlaying[now_index].id
        AjaxRequest_playingListLyric(lyricUrl, module);
        player_con(nowPlaying, now_index);
    }
}

// 将歌曲基本信息渲染到进度条上
function player_con(data, index) {
    let progress_container_songName = document.querySelector('.progress_container_songName');
    let progress_container_singerName = document.querySelector('.progress_container_singerName');
    progress_container_songName.innerHTML = `${data[index].name}`;
    progress_container_singerName.innerHTML = `${singerName(data, index)}`;
}

// 判断歌手名字是否存在
function singerName(item, index) {
    index = parseInt(index);
    if(item.songs) {
        if(item.songs[index].ar) {
            return item.songs[index].ar[0].name;
        } else if(item.songs[index].artists) {
            return item.songs[index].artists[0].name;
        } else {
            return '佚名';
        }
    } else {
        if(item[index].ar) {
            return item[index].ar[0].name;
        } else if(item[index].artists) {
            return item[index].artists[0].name;
        } else {
            return '佚名';
        }
    }
}

// 歌词发送请求
function AjaxRequest_playingListLyric(url, module) {
    let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                // alert(xhr.readyState);
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 301 || xhr.status == 304) {
                    let data = JSON.parse(xhr.responseText);
                    if(data.lrc) {
                        callback_playingListLyric(data.lrc.lyric, module);
                    } else {
                        let lyric_ul = document.querySelector('#lyric_ul');
                        lyric_ul.innerHTML = '<p class="absMusic">请欣赏纯音乐</p>';
                    }
                } else {
                    alert("Request was unsuccessful：" + xhr.status);
                }
            }
        }
        xhr.open("GET", url, false);
        xhr.send();
}

// 歌词回调函数
function callback_playingListLyric(data, module) {
    const audio = document.querySelector('audio');
    var lines = data.split('\n');
    pattern = /\[\d{2}:\d{2}.(\d{2}|\d{3})\]/g;
    result = [];
    
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function (v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
        //提取出时间[xx:xx.xx]
        var time = v.match(pattern),
            //提取歌词

            value = v.replace(pattern, '');

        time.forEach(function (v1, i1, a1) {
            //去掉时间里的中括号得到xx:xx.xx
            var t = v1.slice(1, -1).split(':');
            //将结果压入最终数组
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        });
    });

    result.sort(function (a, b) {
        return a[0] - b[0];
    });

    lyric_ul.innerHTML = '';
    
    for(let i = 0; i < result.length; i++) {
        lyric_ul.innerHTML += `<li class="lyric_li">${result[i][1]}</li>`;
        
    }

    let lyric_li = lyric_ul.querySelectorAll('.lyric_li');
    for(let i = 0; i < result.length; i++) {
        lyric_li[i].setAttribute('index', i);
        lyric_li[i].setAttribute('time', result[i][0]);
    }

    let heigh = 80;
    let progress_inner = document.querySelector('.progress_inner');
    let progressBarWidth = document.querySelector('.progress_bar').offsetWidth;
    let progress_go = document.querySelector('.progress_go');
    let progress_container_time = document.querySelector('.progress_container_time');
    let nextBtn = document.querySelector('.nextBtn');//下一首
    let previousBtn = document.querySelector('.previousBtn');//上一首
    let nowPlaying = window.localStorage.getItem('nowPlaying');
    audio.ontimeupdate = function(e) {
        switchSong(module);
        if(audio.ended) {
            if(module == 'list') {                
                let now_index = parseInt(window.localStorage.getItem('now_index'));
                audio.src = `https://music.163.com/song/media/outer/url?id=${nowPlaying[now_index].id}.mp3`;
                nextBtn.onclick();
            } else if(module == 'random') {
                let now_index = parseInt(window.localStorage.getItem('now_index'));
                audio.src = `https://music.163.com/song/media/outer/url?id=${nowPlaying[now_index].id}.mp3`;
                nextBtn.onclick();
            }
        }

        let lyric_ul = document.querySelector('#lyric_ul');
        progress_container_time.innerHTML = playerTime(audio.currentTime, audio.duration);
        if(parseInt(window.localStorage.getItem('dragFlag')) != 1) {
            progress_inner.style.left = progressBarWidth * audio.currentTime / audio.duration + 'px';
            for(let i = 0; i < result.length; i++) {
                if(this.currentTime > result[i][0]) {
                    lyric_ul.style.top = `${-heigh*i + 'px'}`;
                    for(let k = 0; k < lyric_li.length; k++) {
                        lyric_li[k].style.color = '#333';
                    } 
                    lyric_li[i].style.color = ' rgba(19, 2, 250, 0.603)';
                }
            }
        }
        progress_go.style.width = progress_inner.style.left;
        
    }
    
} 


//获取范围内的随机数
function getRandom(start, end, fixed) {
    console.log(start, end);
    let differ = end - start;
    let random = Math.random();
    return (start + differ * random).toFixed(fixed);
}

//列表播放
function list_playing() {
    const Header = 'http://localhost:3000';
    const user_interface = document.querySelector('.user_interface');
    let nowPlaying = JSON.parse(window.localStorage.getItem('nowPlaying'));
    const nextBtn = document.querySelector('.nextBtn');
    const playing_all = document.querySelector('.playing_all');
    let audio = document.querySelector('audio');

    let lyricUrl = Header + '/lyric?id=' + nowPlaying[parseInt(window.localStorage.getItem('now_index'))].id
    AjaxRequest_playingListLyric(lyricUrl, 'list');

}

//随机播放
function random_playing() {
    const Header = 'http://localhost:3000';
    const user_interface = document.querySelector('.user_interface');
    const playing_all = document.querySelector('.playing_all');
    let nowPlaying = JSON.parse(window.localStorage.getItem('nowPlaying'));
    let audio = document.querySelector('audio');

    let lyricUrl = Header + '/lyric?id=' + nowPlaying[parseInt(window.localStorage.getItem('now_index'))].id
    AjaxRequest_playingListLyric(lyricUrl, 'random');
}

//进度条上方播放时间变化
function playerTime(curTime, durTime) {
    if(durTime) {
        return `${curTime / 60 > 9 ? parseInt(curTime / 60) : '0' + parseInt(curTime / 60)}:${curTime % 60 > 9 ? parseInt(curTime % 60) : '0' + parseInt(curTime % 60)}/${durTime / 60 > 9 ? parseInt(durTime / 60) : '0' + parseInt(durTime / 60)}:${durTime % 60> 9 ? parseInt(durTime % 60) : '0' + parseInt(durTime % 60)}`;
    }
}

//当前播放列表的显示与隐藏
function now_playlist_appear(item) {
    let now_playlist = document.querySelector('.now_playlist');
    now_playlist.onmouseover = function() {
        item.style.display = 'none';
    };
    now_playlist.onmouseout = function() {
        item.style.display = 'block'; 
    };
}

//数组查重
function clearMore(arr) {
    var i, j, len = arr.length;
    for(i = 0; i < len; i++) {
        for(j = i + 1; j < len; j++) {
            if(arr[i].id == arr[j].id) {
                arr.splice(j, 1);
                len--;
                j--;
            }
        }
    }
    return arr;
}

function pauseOrNotChange() {
    let btn = document.querySelector('.pauseOrNot').querySelector('i');
    btn.className = 'icon-pause2';
}

