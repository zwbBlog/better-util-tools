<div class="text">
  <p>{{time}}</p>
  <ul>
      <li v-for="(val,i) in 10" :key="i" @click="liClick(i+1)">click{{i+1}}</li>
  </ul>
  <el-row>
      <c1-component />
  </el-row>
  <el-row class="ctx">
      <div>content</div>
      <loading-component v-show="loading" />
  </el-row>
  <el-row>
      <empty-component v-show="empty" />
  </el-row>
  <el-image
          v-if="show"
          style="width: 100px;"
          :src="imgSrc"
          fit="fill"
          @click="changSrc"
  >
  </el-image>
  <el-row>
      <el-button @click="show=!show">默认按钮</el-button>
      <el-button @click="click(1)" type="primary">主要按钮</el-button>
      <el-button type="success" @click="loading=!loading">切换loading</el-button>
      <el-button type="info" @click="empty=!empty">切换empty</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
  </el-row>
  <el-row>
      <el-button plain>朴素按钮</el-button>
      <el-button type="primary" plain>主要按钮</el-button>
      <el-button type="success" plain>成功按钮</el-button>
      <el-button type="info" plain>信息按钮</el-button>
      <el-button type="warning" plain>警告按钮</el-button>
      <el-button type="danger" plain>危险按钮</el-button>
  </el-row>
  <el-row>
      <el-button round>圆角按钮</el-button>
      <el-button type="primary" round>主要按钮</el-button>
      <el-button type="success" round>成功按钮</el-button>
      <el-button type="info" round>信息按钮</el-button>
      <el-button type="warning" round>警告按钮</el-button>
      <el-button type="danger" round>危险按钮</el-button>
  </el-row>
  <el-row>
      <el-button icon="el-icon-search" circle></el-button>
      <el-button type="primary" icon="el-icon-edit" circle></el-button>
      <el-button type="success" icon="el-icon-check" circle></el-button>
      <el-button type="info" icon="el-icon-message" circle></el-button>
      <el-button type="warning" icon="el-icon-star-off" circle></el-button>
      <el-button type="danger" icon="el-icon-delete" circle></el-button>
  </el-row>
</div>
