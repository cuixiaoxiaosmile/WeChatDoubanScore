Page({
    data: {
        allMovies: [{
                title: '影院热映',
                url: 'playing',
                movies: []
            },
            {
                title: '新片榜',
                url: 'showing',
                movies: []
            },
            {
                title: 'Top250',
                url: 'top250',
                movies: []
            }
        ]
    },

    onLoad: function() {
        //请求网络端新数据
        // for (let index = 0; index < this.data.allMovies.length; index++) {
        //     this.loadData(index, this.loadCity);
        // }

        //加载本地缓存数据
        this.loadLocalData();
    },

    //读取缓存数据
    loadLocalData: function() {
        for (let index = 0; index < this.data.allMovies.length; index++) {
            let obj = this.data.allMovies[index];
            obj.movies = wx.getStorageSync(obj.title);
            console.log(`读取本地缓存数据${index}:`);
            console.log(obj.movies);
        }
        this.setData(this.data);
    },

    //获取城市影片
    loadData: function(idx, city) {
        wx.request({
            url: wx.db.url(this.data.allMovies[idx].url),
            data: {
                city: city
            },
            header: { 'content-type': 'json' },
            success: (res) => {
                console.log(`接口返回数据${idx}:`);
                console.log(res);
                const movies = res.data.data.subject
                let obj = this.data.allMovies[idx]
                obj.movies = [];
                for (let index = 0; index < movies.length; index++) {
                    let movie = movies[index];
                    this.updateMovie(movie);
                    obj.movies.push(movie);
                }
                console.log(`临时数据obj${idx}:`);
                console.log(obj);

                this.setData(this.data);
                //将movies数组缓存到本地
                wx.setStorage({
                    key: obj.title,
                    data: obj.movies
                });
                console.log(`网络数据处理后的本地数据${idx}:`);
                console.log(this.data);
            },
            fail: () => {
                wx.db.toastFail('获取热映失败');
            }
        });
    },

    //获取经纬度
    loadCity: function(success) {
        //逆地理编码
        wx.getLocation({
            success: (res) => {
                console.log(res);
                wx.request({
                    url: 'https://api.map.baidu.com/reverse_geocoding/v3',
                    data: {
                        output: 'json',
                        coordtype: 'wgs84ll',
                        ak: 'AjlwgRZG9xspfir93DuGabN81Cs1gxvH',
                        location: `${res.latitude},${res.longitude}`
                    },
                    fail: (res) => {
                        wx.db.toastFail('获取城市失败');
                    },
                    success: (result) => {
                        console.log('获取城市成功')
                        let city = result.data.result.addressComponent.city;
                        city = city.substring(0, city.length - 1);
                        success && success(city);
                    },
                })
            },
            fail: () => {
                console.log('获取地理位置失败');
                wx.db.toastFail('获取位置失败');
            }
        })
    },

    updateMovie: function(movie) {
        let stars = parseInt(movie.star);
        if (stars == 0) return;
        movie.stars = {};
        movie.stars.on = parseInt(stars / 10);
        movie.stars.half = (stars - (movie.stars.on) * 10) > 0;
        movie.stars.off = parseInt((50 - stars) / 10);
    }
})