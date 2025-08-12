<template>
  <div class="bg-card">
    <!--		内容Card		-->
    <div style="display: flex; width: 100%">
      <div style="width: 38%; margin-right: 2%">
        <el-card style="width: 100%; height: 100%" shadow="never">
          <div
              style="display: flex; width: 100%; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="font-size: 16px; display: flex; align-items: center">
              <img src="../assets/images/smile.png" style="height: 22px" alt="smile"/>
              <span>请在下方文本框中输入您的需求</span>
              <img src="../assets/images/smile.png" style="height: 22px" alt="smile"/>
            </div>
            <div style="display: flex">
              <el-button type="primary" size="default" @click="logDrawerVisible = true">查看日志</el-button>
              <el-button type="warning" size="default" @click="demandAnalysis()">解析</el-button>
            </div>
          </div>
          <el-input v-model="demandText" style="width: 100%; font-size: 14px; line-height: 1.5"
                    :rows="8" resize="none" type="textarea" placeholder="Please input your demand"/>
          <!--     知识图谱     -->
          <div style="display: flex; width: 100%; margin-top: 2rem">
            <div id="demandChart" style="width: 60%; height: 35vh"></div>
            <div style="display: flex; flex-direction: column; width: 40%; padding: 2vh 5px 0 5px">
              <el-scrollbar max-height="33vh">
                <div v-for="(item,index) in documentData" class="docStyle"
                     style="display: flex; width: 100%; padding: 5px 0">
                  <div style="width: 90%">
                    <img src="../assets/images/document.png" style="height: 22px" alt="doc"/>
                    {{ item }}
                  </div>
                  <div style="margin-left: 3px; width: 10%">
                    <el-button size="small" type="success" plain circle @click="docAdd(index)">
                      <el-icon size="14">
                        <Plus/>
                      </el-icon>
                    </el-button>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <!--     Agent设计     -->
          <div style="display: flex; width: 100%; align-items: center">
            <el-card style="width: calc(100% - 100px); height: 24vh; margin-top: 2vh" shadow="never">
              你好
            </el-card>
            <div style="display: flex; width: 100px; flex-direction: column;">
              <div style="display: flex; width: 100%; justify-content: center; margin-left: 1rem">
                <span class="card-title-font">智能体设计</span>
              </div>
              <div class="avatar-card avatar-card-right">
                <img src="../assets/images/avatar/图层 7.png" class="avatar-size" alt="expGoal"/>
                <div style="display: flex">
                  <el-tag round style="margin-right: 5px" :type="agentAvatarState.agentDesigner.idType">5</el-tag>
                  <el-tag :type="agentAvatarState.agentDesigner.type">{{ agentAvatarState.agentDesigner.state }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div style="width: 60%; display: flex; flex-direction: column; justify-content: space-between;">
        <el-card style="width: 100%; height: 100%" shadow="never" v-loading="isLoading"
                 element-loading-text="需求解析中">
          <el-scrollbar max-height="88vh">
            <div style="display: flex; flex-direction: column; width: 100%">
              <!--    实验目的     -->
              <div style="width: 100%; display: flex">
                <div class="avatar-card">
                  <img src="../assets/images/avatar/expGoal.png" class="avatar-size" alt="加载失败"/>
                  <div style="display: flex">
                    <el-tag round style="margin-right: 5px" :type="agentAvatarState.expGoal.idType">1</el-tag>
                    <el-tag :type="agentAvatarState.expGoal.type">{{ agentAvatarState.expGoal.state }}</el-tag>
                  </div>
                </div>
                <el-card shadow="never"
                         style="display: flex; align-items: center; justify-content: center; height: 100px; width: 100px; font-size: 16px; --el-card-padding: 15px">
                  <div style="width: 100%; justify-content: center; display: flex">实验目的</div>
                  <el-tag size="large" style="margin-top: 2px; width: 100%">{{ expData.goal.category }}</el-tag>
                </el-card>
                <el-card shadow="never"
                         style="margin-left: 1rem; width: calc(100% - 296px); height: 100px; display: flex; align-items: center; font-size: 15px">
                  <span style="color: #9D3807">目的解释：</span>{{ expData.goal.explain }}
                </el-card>
                <div class="avatar-card avatar-card-right">
                  <img src="../assets/images/avatar/图层 0.png" class="avatar-size" alt="expGoal"/>
                  <div style="display: flex">
                    <el-tag round style="margin-right: 5px" :type="agentAvatarState.expGoalObserver.idType">2</el-tag>
                    <el-tag :type="agentAvatarState.expGoalObserver.type">{{ agentAvatarState.expGoalObserver.state }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <!--    影响因素 & 响应变量     -->
              <div style="display: flex; align-items: center; width: 100%; margin-top: 3rem;">
                <div style="width: calc(100% - 100px); display: flex; align-items: center">
                  <el-card style="width: 42%" shadow="never">
                    <div class="var-card">
                      <span class="card-title-font">影响因素</span>
                      <el-scrollbar height="200px">
                        <div style="display: flex; flex-direction: column; width: 100%; align-items: center">
                          <span v-for="(item, index) in expData.influenceFactor" style="font-size: 15px">
                            {{ item }}
                          </span>
                        </div>
                      </el-scrollbar>
                    </div>
                  </el-card>
                  <div
                      style="height: 220px; display: flex; width: 16%; justify-content: center; align-items: center; position: relative">
                    <img src="../assets/images/greenArrow2.png" style="width: 90%" alt="arrow"/>
                    <div style="position: absolute; margin-bottom: 10px">
                      <el-tooltip content="对应关系" effect="light" placement="top">
                        <el-button size="small" plain type="success" circle @click="formulaDialogVisible = true">
                          <el-icon size="14">
                            <View/>
                          </el-icon>
                        </el-button>
                      </el-tooltip>
                    </div>
                  </div>
                  <el-card style="width: 42%" shadow="never">
                    <div class="var-card">
                      <span class="card-title-font">响应变量</span>
                      <el-scrollbar height="200px">
                        <div style="display: flex; flex-direction: column; width: 100%; align-items: center">
                          <span v-for="(item, index) in expData.responseVar" style="font-size: 15px">
                            {{ item }}
                          </span>
                        </div>
                      </el-scrollbar>
                    </div>
                  </el-card>
                </div>
                <div class="avatar-card avatar-card-right">
                  <img src="../assets/images/avatar/图层 3.png" class="avatar-size" alt="expGoal"/>
                  <div style="display: flex">
                    <el-tag round style="margin-right: 5px" :type="agentAvatarState.VCObserver.idType">3</el-tag>
                    <el-tag :type="agentAvatarState.VCObserver.type">{{ agentAvatarState.VCObserver.state }}</el-tag>
                  </div>
                </div>
              </div>
              <!--    实验方法    -->
              <div style="display: flex; align-items: center; width: 100%; margin-top: 3rem;">
                <div style="display: flex; flex-direction: column; width: calc(100% - 100px)">
                  <div class="card-title-font" style="display: flex; width: 100%; justify-content: center">
                    实验方法：<span style="color: #F7D233">{{ expData.expParams.expMethod }}</span>
                  </div>
                  <el-table :data="expParamsTableData" style="margin-top: 5px; width: 100%"
                            border height="299px" stripe>
                    <el-table-column prop="index" label="Index" align="center"/>
                    <el-table-column v-for="(item, index) in expData.influenceFactor"
                                     :prop="item" align="center">
                      <template #header>
                        <el-tooltip :content="item" placement="top">
                          <span>Var{{ index + 1 }}</span>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="avatar-card avatar-card-right">
                  <img src="../assets/images/avatar/图层 5.png" class="avatar-size" alt="expGoal"/>
                  <div style="display: flex">
                    <el-tag round style="margin-right: 5px" :type="agentAvatarState.VCParamObserver.idType">4</el-tag>
                    <el-tag :type="agentAvatarState.VCParamObserver.type">{{ agentAvatarState.VCParamObserver.state }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </div>
    </div>
    <!--   正在解析...小组件   -->
    <el-card style="width: 400px; height: 80px; position: absolute; top: 24vh; left: calc(25% - 200px);"
             shadow="never" v-if="analysisPercentageShow">
      <div style="display: flex; width: 100%; height: 40px; align-items: center;">
        <span style="font-size: 16px">正在解析：</span>
        <el-progress :percentage="analysisPercentage" :stroke-width="15" striped
                     :color="customColors" style="width: 260px"/>
      </div>
    </el-card>
    <!--   实验方案展示dialog   -->
    <el-dialog v-model="formulaDialogVisible" title="响应变量计算公式" center>
      <div style="display: flex; flex-direction: column; font-size: 18px; line-height: 2">
        <span v-for="(item, key) in expData.formula">
          <b>{{ key }} = </b> {{ item }}
        </span>
      </div>
    </el-dialog>
    <!--   日志抽屉   -->
    <el-drawer v-model="logDrawerVisible" title="Agent行为日志" direction="ltr">

    </el-drawer>
  </div>
</template>

<script>
import {ref} from "vue";
import request from "../utils/request";
import {ElMessage} from "element-plus";
import {Loading, Plus, View} from "@element-plus/icons-vue";
import * as echarts from "echarts";

export default {
  name: "Home",
  components: {View, Loading, Plus},
  setup() {
    const cardMaxHeight = ref(100)
    const props = {
      expandTrigger: 'hover'
    }
    const loadingAnimation = ref(false)
    const analysisPercentage = ref(0)
    const customColors = [
      {color: '#f56c6c', percentage: 20},
      {color: '#e6a23c', percentage: 40},
      {color: '#5cb87a', percentage: 60},
      {color: '#1989fa', percentage: 80},
      {color: '#6f7ad3', percentage: 100},
    ]
    const isLoading = ref(false)
    const expData = ref({
      goal: {
        category: '',
        explain: ''
      },
      influenceFactor: [],
      responseVar: [],
      formula: [],
      expParams: {
        expMethod: '',
        params: {}
      }
    })
    return {
      cardMaxHeight, props, loadingAnimation, analysisPercentage,
      customColors, isLoading, expData
    }
  },
  data() {
    return {
      Title: '实验目标设计',
      demandText: '我想要复现古巴导弹危机中美国和古巴在各个时间段的行为，分析什么因素对战争的走势影响最大',
      selectedCardName: ['', 'H扩散稳定', 'H军备竞赛稳定', 'H使用稳定', '态势评估'],
      descriptiveMethod: [],
      descriptiveResearch: [
        {value: 1, label: '人工社会系统',},
        {value: 2, label: '假想实验',},
        {value: 3, label: '糖域实验',},
        {value: 4, label: '种族隔离',},
      ],
      explainMethod: [],
      explainResearch: [
        {
          value: 1, label: '析因分析',
          children: [
            {
              value: 1, label: '局部分析',
            },
            {
              value: 2, label: '全局分析',
            },
          ]
        },
        {value: 2, label: '离散分析',},
        {value: 3, label: '敏感性分析'},
        {value: 4, label: '稳健性分析'},
        {value: 5, label: '模型分析'},
      ],
      predictiveMethod: [],
      predictiveResearch: [
        {value: 1, label: '黑盒分析',},
        {value: 2, label: '白盒分析',},
      ],
      parallelMethod: [],
      parallelOptimization: [
        {value: 1, label: '策略优化',},
        {value: 2, label: '模型优化',},
      ],
      analysisPercentageShow: false,
      demandChart: null,
      demandOption: {},
      demandData: [
        {
          id: '0', symbol: 'image://https://cdn.luogu.com.cn/upload/image_hosting/y4b178hg.png',
          symbolSize: 60, name: '需求加工厂', label: '需求加工厂'
        }
      ],
      demandLink: [],
      documentData: [
        '关于美国肯尼迪政府内部讨论古巴导弹危机应对策略的会议纪要', '苏联赫鲁晓夫与古巴卡斯特罗之间的通信记录', '土耳其领导人杰马勒・古尔塞尔关于本国在北约中角色及对古巴导弹危机立场的讲话记录',
        '冷战时期美苏核军备竞赛的历史背景报告', '美国对古巴长期经济封锁和军事威胁的相关文件汇编', '20 世纪 60 年代国际格局与地缘政治形势分析报告',
        '《联合国宪章》相关条款解读及在古巴导弹危机中的适用性分析', '《部分禁止核试验条约》与古巴导弹危机的关系研究', '国际法中关于领海、领土主权及军事行动限制的相关规定在古巴导弹危机中的案例分析'
      ],
      expParamsTableData: [],
      formulaDialogVisible: false,
      agentAvatarState: {
        expGoal: {state: '思考中', type: 'primary', idType: 'warning'},
        expGoalObserver: {state: '等待中', type: 'info', idType: 'info'},
        VCObserver: {state: '等待中', type: 'info', idType: 'info'},
        VCParamObserver: {state: '等待中', type: 'info', idType: 'info'},
        agentDesigner: {state: '等待中', type: 'info', idType: 'info'}
      },
      logDrawerVisible: false,
    }
  },
  created() {

  },
  mounted() {
    this.loadDemandChart();
  },
  methods: {
    goBack() {
      this.$router.push('/home/powerGame/expDesign');
    },
    demandAnalysis() {
      this.isLoading = true;
      this.analysisPercentage = 0;
      this.analysisPercentageShow = true;
      request.post('/requirementAnalysis', {
        text: this.demandText
      }).then(res => {
        console.log(res)
        this.analysisPercentage += 10;
        this.analysisPercentageShow = false;
        this.isLoading = false;
        if (res.type === 'error') {
          ElMessage({
            type: 'error',
            message: '需求解析失败，请重新尝试'
          })
          return;
        }
        ElMessage({
          type: 'success',
          message: '需求解析完成'
        })

        this.expData.goal = res.data.goal;
        this.expData.influenceFactor = res.data.influence_factor;
        this.expData.responseVar = res.data.response_var;
        this.expData.formula = res.data.formula;
        this.expData.expParams.expMethod = res.data.exp_params.exp_method;
        this.expData.expParams.params = res.data.exp_params.params;

        let params = res.data.exp_params.params;
        let tableKeys = Object.keys(params);
        this.expParamsTableData = []
        for (let i = 0; i < params[tableKeys[0]].length; i++) {
          let rowData = {index: '实验' + (i + 1)}
          for (let j = 0; j < tableKeys.length; j++)
            rowData[tableKeys[j]] = params[tableKeys[j]][i]
          this.expParamsTableData.push(rowData);
        }
      })
      let timeLeft = 10
      let timer = setInterval(() => {
        --timeLeft;
        if (timeLeft < 2) {
          clearInterval(timer);
        }
        this.analysisPercentage += 10;
      }, 1000)
    },
    demandChartNodeClick(param) {
      console.log(param)
      if (param.data.id === '0') return;
      this.documentData.push(param.data.label);
      this.demandLink.splice(this.demandLink.length - 1, 1);
      this.demandData.splice(parseInt(param.data.id), 1)
      for (let i = 1; i < this.demandData.length; i++) {
        this.demandData[i].id = '' + i
        this.demandData[i].name = 'Doc' + i
      }
      this.demandOption.series[0].data = this.demandData;
      this.demandOption.series[0].links = this.demandLink;
      this.demandChart.setOption(this.demandOption);
      ElMessage({
        type: 'warning',
        message: '删除成功'
      })
    },
    loadDemandChart() {
      this.$nextTick(() => {
        this.demandChart = echarts.init(document.getElementById('demandChart'));
        this.demandChart.resize();
        this.demandChart.on('click', this.demandChartNodeClick);
        this.demandOption = {
          title: {
            show: true,
            text: '点击右侧文件添加需求解析涉及的知识图谱',
            left: 'center',
          },
          tooltip: {
            formatter: function (params) {
              return params.data.label;
            }
          },
          series: [{
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 150,
              edgeLength: 100
            },
            draggable: true,
            symbolSize: 40,
            roam: true,
            label: {
              show: true,
              fontSize: 10
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 4],
            edgeLabel: {
              show: false,
              fontSize: 12
            },
            data: this.demandData,
            links: this.demandLink,
            itemStyle: {
              color: 'rgb(242.5, 208.5, 157.5)'
            },
            lineStyle: {
              opacity: 0.9,
              width: 2,
              curveness: 0,
            },
          }],
          animationDurationUpdate: 1500,
        }
        this.demandChart.setOption(this.demandOption);
      })
    },
    docAdd(index) {
      this.demandData.push({
        id: '' + this.demandData.length,
        name: 'Doc' + this.demandData.length,
        label: this.documentData[index]
      })
      this.demandLink.push({
        source: '0',
        target: '' + (this.demandData.length - 1)
      })
      this.demandOption.series[0].data = this.demandData;
      this.demandOption.series[0].links = this.demandLink;
      this.demandChart.setOption(this.demandOption);
      this.documentData.splice(index, 1);
      ElMessage({
        type: 'success',
        message: '添加成功'
      })
    },
  },
}
</script>

<style scoped>
.bg-card {
  width: calc(100% - 40px);
  height: calc(98vh - 40px);
  padding: 20px;
  min-width: 1200px;
  position: relative
}

.avatar-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100px;
  width: 90px;
  margin-right: 1rem;
}

.avatar-card-right {
  margin-left: 1rem;
  margin-right: 0;
}

.avatar-size {
  height: 70px;
  width: 70px;
  margin-bottom: 5px;
}

.var-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  line-height: 1.5
}

.card-title-font{
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px
}
.docStyle {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 5px 0;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
}

.docStyle:hover {
  color: #409EFF;
}
</style>