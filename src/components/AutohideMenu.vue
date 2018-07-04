<div id="app">
  <div class="center">
    <span class="switch" @click="noSide = !noSide">{{ noSide ? '显示导航' : '隐藏导航'}}</span>
    <div class="menu" :class="{ noSide: noSide }">
      <ul class="item">
        <li v-for="x in lists" class="clearfix main-item">
          <i>图标</i>
          <div class="inner">
            <a class="title" @click.stop="x._show = !x._show">
            {{ x.title }}
          </a>
          <ul class="item" v-if="x._show && x.children.length">
            <li v-for="y in x.children">
              <a class="title">
                <i>图标</i>
                {{ y.title }}
              </a>
            </li>
          </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
  
</div>

var vm = new Vue({
  el: '#app',
  data: {
    noSide: false,
    lists: []
  },
  created: function () {
    this.asyncList(10)
  },
  methods: {
    asyncList: function (num) {
      var that = this
      setTimeout(function () {
        for(var i =0; i < num; i++) {
          that.lists.push({
            title: '测试' + (i + 1),
            icon: '',
            _show: false,
            children: [{
              title: '测试' + (i + 1) + (i + 1),
              icon: '',
               _show: false
            }]
          })
        }
      }, 2000)
    }
  }
})

* {
  margin: 0;
  padding: 0;
}
body {
  background: #e5e5e5;
  box-shadow: 1px 3px 4px 4px rgba(0, 0, 0, .4)
}
.clearfix:before,
.clearfix:after {
    content: " ";
    display: table;
    clear: both;
}
.center {
  padding: 24px 30px;
  background: #fff;
  .switch {
    display: inline-block;
    padding: 8px;
    color: green;
  }
}

.menu {
  width: 200px;
  padding: 24px 0;
  border-right: 1px solid #eee;
  background-color: rgb(48, 65, 86);
  font-size: 14px;
  color: #fff;
  transition: all 300ms;
  &.noSide {
    width: 60px;
    .inner {
      display: none;
      position: absolute;
      top: 0;
      left: 110%;
      width: 200px;
      padding: 24px 16px;
      background-color: rgb(48, 65, 86);
      border-radius: 4px;
      height: auto;
    }
    .main-item:hover {
      .inner {
        display: block;
      }
    }
  }
}
ul {
  list-style: none;
  li {
    position: relative;
    padding: 8px 16px;
    cursor: pointer;
    i {
      float: left;
      display: inline-block;
      font-style: normal;
    }
  }
  .title {
    display: block;
    padding-left: 40px;
    text-align: right;
    cursor: pointer;
  }
}
