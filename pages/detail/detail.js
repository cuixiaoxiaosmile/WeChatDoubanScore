// pages/detail/detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '' //标题
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const movie = JSON.parse(options.movie);
        this.setData({
            title: movie.title
        });
    }
})