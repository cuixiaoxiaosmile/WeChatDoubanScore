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
        this.loadData(this.loadCity);
    },

    //获取城市影片
    loadData: function(city) {
        wx.request({
            url: 'http://39.105.38.10:8081/movie/playing',
            data: {
                city: city
            },
            header: { 'content-type': 'json' },
            success: (res) => {
                console.log(res)
                let movies = res.data.data.subject
                for (let index = 0; index < movies.length; index++) {
                    this.updateMovie(movies[index])
                }
                this.setData({ movies: movies });
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