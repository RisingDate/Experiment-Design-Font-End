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
              <el-button type="primary" size="default" @click="knowledgeGraphDialogVisible = true; loadDemandChart()">
                知识图谱
              </el-button>
              <el-button type="default" size="default" @click="logDrawerVisible = true">查看日志</el-button>
              <el-button type="warning" size="default" @click="demandAnalysis()">解析</el-button>
            </div>
          </div>
          <el-input v-model="demandText" style="width: 100%; font-size: 14px; line-height: 1.5"
                    :rows="8" resize="none" type="textarea" placeholder="Please input your demand"/>
          <!--  对话框    -->
          <el-card style="width: 100%; height: 60vh; margin-top: 1rem; position: relative" shadow="never">
            <div style="display: flex; flex-direction: column; width: 100%">
              <div style="display: flex; width: 100%; justify-content: center; align-items: center">
                <img src="../assets/images/llmIcon.png" style="height: 30px; width: 30px" alt="llmIcon"/>
                <span class="card-title-font" style="font-size: 20px; margin-left: 0.5rem">LLM对话</span>
              </div>
            </div>
            <el-scrollbar height="400px" ref="llmDialogScrollbarRef">
              <div style="display: flex; flex-direction: column; width: 100%">
                <div v-for="(item, index) in user2LLMDialogue">
                  <div class="dialogueDiv" :class="{'dialogDiv-reverse': !item.userOrLLM}">
                    <img src="../assets/images/avatar/expGoal.png" class="dialogueAvatar" alt="llmIcon"/>
                    <el-card class="dialogueCard" shadow="never">
                      {{item.content}}
                    </el-card>
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <div class="llm-input-pos">
              <el-input ref="llmDialogInputRef" v-model="llmDialogInput" class="input-round-corner" resize="none"
                        type="textarea" :autosize="{minRows: 1, maxRows: 4}" @keydown.enter="llmInputConfirm">
              </el-input>
            </div>
            <el-button circle size="default" color="#626aef" @click="llmInputConfirm"
                       style="position: absolute; bottom: 20px; right: 46px; z-index: 12">
              <el-icon size="18"><Top/></el-icon>
            </el-button>
          </el-card>
        </el-card>
      </div>
      <div style="width: 60%; display: flex; flex-direction: column; justify-content: space-between;">
        <el-card style="width: 100%; height: 100%" shadow="never">
          <el-scrollbar max-height="88vh">
            <div style="display: flex; flex-direction: column; width: 100%">
              <!--    实验目的     -->
              <div style="width: 100%; display: flex">
                <div class="avatar-card">
                  <div v-loading="avatarLoading[0]">
                    <img :src="index2Avatar[0]" class="avatar-size" alt="加载失败"/>
                  </div>
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
                  <div v-loading="avatarLoading[1]">
                    <img :src="index2Avatar[1]" class="avatar-size" alt="expGoal"/>
                  </div>
                  <div style="display: flex">
                    <el-tag round style="margin-right: 5px" :type="agentAvatarState.expGoalObserver.idType">2</el-tag>
                    <el-tag :type="agentAvatarState.expGoalObserver.type">{{ agentAvatarState.expGoalObserver.state }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <!--    影响因素 & 响应变量     -->
              <div style="display: flex; align-items: center; width: 100%; margin-top: 2rem;">
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
                  <div v-loading="avatarLoading[2]">
                    <img :src="index2Avatar[2]" class="avatar-size" alt="expGoal"/>
                  </div>
                  <div style="display: flex">
                    <el-tag round style="margin-right: 5px" :type="agentAvatarState.VCObserver.idType">3</el-tag>
                    <el-tag :type="agentAvatarState.VCObserver.type">{{ agentAvatarState.VCObserver.state }}</el-tag>
                  </div>
                </div>
              </div>
              <!--    实验方法    -->
              <div style="display: flex; align-items: center; width: 100%; margin-top: 2rem;">
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
                  <div v-loading="avatarLoading[3]">
                    <img :src="index2Avatar[3]" class="avatar-size" alt="expGoal"/>
                  </div>
                  <div style="display: flex">
                    <el-tag round style="margin-right: 5px" :type="agentAvatarState.VCParamObserver.idType">4</el-tag>
                    <el-tag :type="agentAvatarState.VCParamObserver.type">{{ agentAvatarState.VCParamObserver.state }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <!--    Agent设计    -->
              <div style="display: flex; width: 100%; align-items: center; margin-top: 2rem">
                <div style="display: flex; flex-direction: column; width: calc(100% - 100px)">
                  <div class="card-title-font" style="display: flex; width: 100%; justify-content: center">
                    智能体设计
                  </div>
                  <el-card style="width: 100%; min-height: 24vh; margin-top: 5px; display: flex; flex-direction: column" shadow="never">
                    <div v-for="(agentItem, agentIndex) in expData.agentDesignRes.attribute" style="margin-top: 1rem">
                      <el-descriptions :column="3" border>
                        <el-descriptions-item v-for="(item, index) in agentItem">
                          <template #label>
                            <span style="font-weight: bold">
                              {{ item.key }}
                            </span>
                          </template>
                          {{ item.value }}
                        </el-descriptions-item>
                      </el-descriptions>
                    </div>
                  </el-card>
                </div>
                <div class="avatar-card avatar-card-right">
                  <div v-loading="avatarLoading[4]">
                    <img :src="index2Avatar[4]" class="avatar-size" alt="expGoal" />
                  </div>
                  <div style="display: flex">
                    <el-tag round style="margin-right: 5px" :type="agentAvatarState.agentDesigner.idType">5</el-tag>
                    <el-tag :type="agentAvatarState.agentDesigner.type">{{ agentAvatarState.agentDesigner.state }}</el-tag>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </div>
    </div>
    <!--   知识图谱dialog     -->
    <el-dialog v-model="knowledgeGraphDialogVisible" title="知识图谱" center width="60%">
      <div style="display: flex; width: 100%; margin-top: 2rem">
        <div id="demandChart" style="width: 60%; height: 50vh"></div>
        <div style="display: flex; flex-direction: column; width: 40%; padding: 2vh 5px 0 5px">
          <el-scrollbar max-height="48vh">
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
    </el-dialog>
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
      <div style="display: flex; flex-direction: column">
        <div v-for="(item, index) in logData" :key="index" class="log-line">
          <!--    头像    -->
          <img :src="index2Avatar[item.agentIndex]" style="width: 10%; height: 10%" alt="图片加载失败"/>
          <div style="display: flex; flex-direction: column; width: 85%; margin-left: 5%; line-height: 1.5">
            <!--    时间    -->
            <div :style="{color: index2Color[item.agentIndex]}" style="margin-bottom: 5px">
              {{item.time}}
            </div>
            <!--    信息    -->
            <div>
              {{item.info}}
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {nextTick, ref} from "vue";
import request from "../utils/request";
import {ElMessage} from "element-plus";
import {Loading, Plus, Search, Top, View} from "@element-plus/icons-vue";
import * as echarts from "echarts";

export default {
  name: "Home",
  components: {Top, View, Loading, Plus, Search},
  setup() {
    const cardMaxHeight = ref(100)
    const props = {
      expandTrigger: 'hover'
    }
    const loadingAnimation = ref(false)
    const customColors = [
      {color: '#f56c6c', percentage: 20},
      {color: '#e6a23c', percentage: 40},
      {color: '#5cb87a', percentage: 60},
      {color: '#1989fa', percentage: 80},
      {color: '#6f7ad3', percentage: 100},
    ]
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
      },
      agentDesignRes: {
        attribute: [],
        attributeExplain: [],
        relationshipNet: []
      }
    })
    return {
      cardMaxHeight, props, loadingAnimation,
      customColors, expData
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
            {value: 1, label: '局部分析'},
            {value: 2, label: '全局分析'},
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
      user2LLMDialogue: [
        {userOrLLM: 0, avatar: '', content: '你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好好好好好好好好好好好好好好好好好好',},
        {userOrLLM: 1, avatar: '', content: '你好好好好好',},
        {userOrLLM: 1, avatar: '', content: '你好好好好好你好好好好好你好好好好好',},
        {userOrLLM: 0, avatar: '', content: '你好好好好好好好好好',},
      ],
      formulaDialogVisible: false,
      agentAvatarState: {
        expGoal: {state: '等待中', type: 'info', idType: 'warning'},
        expGoalObserver: {state: '等待中', type: 'info', idType: 'info'},
        VCObserver: {state: '等待中', type: 'info', idType: 'info'},
        VCParamObserver: {state: '等待中', type: 'info', idType: 'info'},
        agentDesigner: {state: '等待中', type: 'info', idType: 'info'}
      },
      num2State: ['等待中', '思考中', '完成', '不通过'],
      num2Type: ['info', 'primary', 'success', 'danger'],
      index2Avatar: [
          new URL('@/assets/images/avatar/expGoal.png', import.meta.url).href,
          new URL('@/assets/images/avatar/goalCheck.png', import.meta.url).href,
          new URL('@/assets/images/avatar/VarCheck.png', import.meta.url).href,
          new URL('@/assets/images/avatar/expMethod.png', import.meta.url).href,
          new URL('@/assets/images/avatar/agentDesign.png', import.meta.url).href,
      ],
      index2Color: ['#6D8CAB', '#CDCE82', '#E97A66', '#D1C9BF', '#414045'],
      avatarLoading: [0, 0, 0, 0, 0],
      logDrawerVisible: false,
      knowledgeGraphDialogVisible: false,

      llmDialogInput: '',
      // logData: {agentIndex: 0, time: '', info: ''}
      logData: [
        // {agentIndex: 0, time: '2025-01-01 13:00:23', info: 'nihao'},
        // {agentIndex: 1, time: '2025-01-01 13:01:45', info: '你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好'}
      ],
      websocket: null,
    }
  },
  created() {

  },
  mounted() {
    // this.loadDemandChart();
  },
  methods: {
    goBack() {
      this.$router.push('/home/powerGame/expDesign');
    },
    resShow(res){
      this.expData.goal = res.data.goal;
      this.expData.influenceFactor = res.data.influence_factor;
      this.expData.responseVar = res.data.response_var;
      this.expData.formula = res.data.formula;
      this.expData.expParams.expMethod = res.data.exp_params.exp_method;
      this.expData.expParams.params = res.data.exp_params.params;

      // 生成实验方案table数据
      let params = res.data.exp_params.params;
      let tableKeys = Object.keys(params);
      this.expParamsTableData = []
      for (let i = 0; i < params[tableKeys[0]].length; i++) {
        let rowData = {index: '实验' + (i + 1)}
        for (let j = 0; j < tableKeys.length; j++)
          rowData[tableKeys[j]] = params[tableKeys[j]][i]
        this.expParamsTableData.push(rowData);
      }

      // 生成智能体设计description数据
      if (res.data.agent_design_res) {
        this.expData.agentDesignRes = {
          attribute: [],
          attributeExplain: [],
          relationshipNet: []
        }
        res.data.agent_design_res.attribute.forEach(agent => {
          let keys = Object.keys(agent)
          let values = Object.values(agent)
          let newAgentLine = []
          for (let i = 0; i < keys.length; i++)
            newAgentLine.push({key: keys[i], value: values[i]});
          this.expData.agentDesignRes.attribute.push(newAgentLine);
        })
      }
    },
    demandAnalysis(res) {
      this.run('begin')
      // request.post('/requirementAnalysis', {
      //   text: this.demandText
      // }).then(res => {
      //   console.log(res)
      //   if (res.type === 'error') {
      //     ElMessage({
      //       type: 'error',
      //       message: '需求解析失败，请重新尝试'
      //     })
      //     return;
      //   }
      //   ElMessage({
      //     type: 'success',
      //     message: '需求解析完成'
      //   })
      // })
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
            roam: false,
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
    async llmInputConfirm(event){
      if(event.shiftKey) return;
      this.user2LLMDialogue.push({
        userOrLLM: 0, avatar: '', content: this.llmDialogInput
      })
      await this.$refs.llmDialogInputRef.clear();
      await this.$refs.llmDialogInputRef.blur();
      await nextTick()
      await this.$refs.llmDialogScrollbarRef.setScrollTop(800)
    },
    async run(param){
      await this.initWebSocket(param, (res) => {
        let agentIndex = 0
        for(const key in this.agentAvatarState){
          this.agentAvatarState[key].state = this.num2State[res.agent_state[agentIndex]];
          this.agentAvatarState[key].type = this.num2Type[res.agent_state[agentIndex]];
          this.avatarLoading[agentIndex] = (res.agent_state[agentIndex] === 1 || res.agent_state[agentIndex] === '1') ? 1 : 0;
          ++agentIndex;
        }
        if(res.info)
          this.logData.push({agentIndex: res.info.agent_index, time: res.info.time, info: res.info.data})
        if(res.data)
          this.resShow(res)
      });
    },
    async initWebSocket(param, callback){
      if('WebSocket' in window){
        return new Promise((resolve, reject) => {
          this.websocket = new WebSocket('ws://localhost:8765');
          this.websocket.onopen = () => {
            console.log('websocket opened');
            this.websocket.send(param);
          }
          this.websocket.onclose = () => {
            console.log('websocket closed');
            this.websocket.close();
          }
          this.websocket.onmessage = (msg) => {
            console.log('websocket 接收数据', JSON.parse(msg.data));
            callback(JSON.parse(msg.data));
          }
          this.websocket.onerror = (err) => {
            console.log(err);
            reject(err);
          }
        })
      }
      else{
        console.log('您的浏览器不支持websocket')
      }
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

.dialogueDiv{
  display: flex;
  width: 100%;
  margin-top: 1rem;
}

.dialogDiv-reverse{
  flex-direction: row-reverse;

}

.dialogueAvatar{
  width: 40px;
  height: 40px;
  margin-right: 0.5rem;
  margin-bottom: 5px;
}

.dialogueCard{
  --el-card-padding: 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 20px;
  background-color: aliceblue;
  display: flex;
  align-items: center;
}

.llm-input-pos{
  display: flex;
  align-items: center;
  width: calc(100% - 80px);
  padding: 0 20px;
  position: absolute;
  z-index: 10;
  bottom: 1rem;
}
.input-round-corner :deep(.el-textarea__inner) {
  border-radius: 20px;
  padding: 10px 35px 10px 15px;
  width: 100%;
}

.log-line{
  display: flex;
  width: 100%;
  margin-bottom: 2rem;
  font-size: 15px;
}
</style>