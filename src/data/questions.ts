import type { Question, ReceptionScene, ComplaintScene } from '@/types';

export const questions: Question[] = [
  {
    id: 'q001',
    type: 'single',
    category: '服务流程',
    difficulty: 1,
    title: '顾客到院后，前台应在几米范围内主动起身问候？',
    options: [
      { key: 'A', text: '1米' },
      { key: 'B', text: '3米' },
      { key: 'C', text: '5米' },
      { key: 'D', text: '顾客走近再问候' }
    ],
    correctAnswer: 'B',
    explanation: '标准服务规范要求顾客进门3米内需主动微笑问候，体现热情服务态度。'
  },
  {
    id: 'q002',
    type: 'single',
    category: '预约规则',
    difficulty: 2,
    title: '顾客术前多久内改期不收取违约金？',
    options: [
      { key: 'A', text: '提前24小时' },
      { key: 'B', text: '提前48小时' },
      { key: 'C', text: '提前72小时' },
      { key: 'D', text: '随时改期都不收费' }
    ],
    correctAnswer: 'B',
    explanation: '院内规定：术前48小时以上改期不收取违约金，48小时内需收取30%定金作为违约金。'
  },
  {
    id: 'q003',
    type: 'judge',
    category: '隐私保护',
    difficulty: 1,
    title: '可以在休息区公共场合大声讨论顾客的手术项目和既往病史。',
    correctAnswer: 'false',
    explanation: '顾客隐私受严格保护，任何情况下不得在公共场合讨论顾客个人信息和医疗情况。'
  },
  {
    id: 'q004',
    type: 'multiple',
    category: '服务流程',
    difficulty: 2,
    title: 'VIP顾客到院接待时，以下哪些是必须做到的？',
    options: [
      { key: 'A', text: '使用姓氏称呼，如"张女士您好"' },
      { key: 'B', text: '提前准备好专属茶水和点心' },
      { key: 'C', text: '直接安排进诊室无需等候' },
      { key: 'D', text: '告知咨询师VIP顾客到院' }
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'VIP顾客需姓氏尊称、专属茶点、提前通知咨询师。但仍需按顺序安排，特殊情况需灵活处理。'
  },
  {
    id: 'q005',
    type: 'fill',
    category: '术后回访',
    difficulty: 2,
    title: '术后回访时间线：术后第__天首次回访，第7天第二次，第__个月第三次回访。',
    correctAnswer: ['1', '1'],
    explanation: '标准回访时间线：术后24小时（第1天）首次回访确认情况，第7天拆线回访，第1个月效果回访。'
  },
  {
    id: 'q006',
    type: 'single',
    category: '投诉应对',
    difficulty: 2,
    title: '顾客抱怨术后效果不理想，正确的第一反应是？',
    options: [
      { key: 'A', text: '告诉顾客这是正常现象，慢慢会好' },
      { key: 'B', text: '先倾听并表达共情，记录具体诉求' },
      { key: 'C', text: '让顾客直接去找主治医生' },
      { key: 'D', text: '强调手术协议已签字确认' }
    ],
    correctAnswer: 'B',
    explanation: '处理投诉的第一步是倾听和共情，让顾客感受被重视，再逐步解决问题。'
  },
  {
    id: 'q007',
    type: 'judge',
    category: '隐私保护',
    difficulty: 1,
    title: '顾客的手机号和身份证号可以截图发给未授权的同事。',
    correctAnswer: 'false',
    explanation: '严禁将顾客个人信息泄露给未授权人员，信息传递必须走正规系统流程。'
  },
  {
    id: 'q008',
    type: 'single',
    category: '院内动线',
    difficulty: 1,
    title: '顾客做完双眼皮手术后，拆线应该去哪个区域？',
    options: [
      { key: 'A', text: '一楼前台' },
      { key: 'B', text: '二楼咨询室' },
      { key: 'C', text: '三楼换药室' },
      { key: 'D', text: '四楼手术室' }
    ],
    correctAnswer: 'C',
    explanation: '术后拆线、换药均在三楼换药室进行，由专业护士操作。'
  },
  {
    id: 'q009',
    type: 'single',
    category: '服务规范',
    difficulty: 2,
    title: '顾客询问"这个手术会不会疼？"，以下哪种回答最恰当？',
    options: [
      { key: 'A', text: '一点都不疼，放心吧' },
      { key: 'B', text: '手术肯定会有点疼的，忍忍就好' },
      { key: 'C', text: '术中会有麻醉，术后可能有轻微胀痛，我们会有止痛方案' },
      { key: 'D', text: '我也不太清楚，你问医生吧' }
    ],
    correctAnswer: 'C',
    explanation: '应客观真实地告知顾客情况，既不过度承诺也不制造恐慌，同时给出解决方案。'
  },
  {
    id: 'q010',
    type: 'multiple',
    category: '预约规则',
    difficulty: 3,
    title: '以下哪些情况属于预约爽约（No-Show）？',
    options: [
      { key: 'A', text: '顾客未提前告知且未按时到院' },
      { key: 'B', text: '顾客迟到超过30分钟未联系' },
      { key: 'C', text: '顾客提前2小时打电话说不来了' },
      { key: 'D', text: '顾客记错时间第二天才来' }
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: '爽约指未提前48小时告知且未到院的情况。提前2小时虽不合规但属告知行为，按改期处理。'
  }
];

export const receptionScenes: ReceptionScene[] = [
  {
    id: 'rs001',
    title: 'VIP顾客到院接待',
    description: '模拟VIP顾客张女士首次到院的完整接待流程',
    steps: [
      {
        id: 's1',
        scene: '张女士推开大门走进医院，你正在前台整理资料。',
        customerLine: '你好，我是今天下午2点预约的张敏。',
        options: [
          {
            key: 'A',
            text: '继续整理资料，头也不抬说："预约的啊，先坐那边等一下。"',
            isCorrect: false,
            feedback: '❌ 服务态度不达标。VIP顾客到院必须第一时间起身迎接，使用尊称。',
            score: 0
          },
          {
            key: 'B',
            text: '立即起身微笑，走至顾客面前："张女士您好，欢迎光临，一路辛苦了！我是前台小李，今天由我接待您。"',
            isCorrect: true,
            feedback: '✅ 完美！主动起身+姓氏尊称+热情问候，符合VIP接待标准。',
            score: 20
          },
          {
            key: 'C',
            text: '抬头说："哦，张敏是吧，身份证带了吗？先登记一下。"',
            isCorrect: false,
            feedback: '❌ 缺少基本问候礼仪，直接进入登记环节显得生硬冷漠。',
            score: 5
          }
        ]
      },
      {
        id: 's2',
        scene: '已完成问候，顾客已确认身份。',
        options: [
          {
            key: 'A',
            text: '"张女士请坐，我给您倒杯温水，请问有什么忌口吗？"同时递上热毛巾。',
            isCorrect: true,
            feedback: '✅ 标准流程！引导就座+奉茶+个性化需求确认+热毛巾服务，VIP体验到位。',
            score: 20
          },
          {
            key: 'B',
            text: '"坐着等会吧，咨询师马上来。"然后继续做自己的事。',
            isCorrect: false,
            feedback: '❌ 冷落顾客，缺少服务细节，未安排茶水点心。',
            score: 0
          },
          {
            key: 'C',
            text: '"跟我来，直接去咨询室吧。"',
            isCorrect: false,
            feedback: '⚠️ 过于急躁，未让顾客休整，缺少休息缓冲环节。',
            score: 10
          }
        ]
      },
      {
        id: 's3',
        scene: '顾客在休息区等待了12分钟，咨询师还在接待上一位顾客。',
        customerLine: '请问我还要等多久呀？我一会还有事。',
        options: [
          {
            key: 'A',
            text: '"快了快了，再等会。"',
            isCorrect: false,
            feedback: '❌ 模糊答复+敷衍态度，会加重顾客不满。',
            score: 0
          },
          {
            key: 'B',
            text: '主动上前表达歉意："张女士非常抱歉让您久等了，咨询师大概还需5分钟，我先给您拿一份我们最新的杂志，您看需要再加点茶水吗？"同时告知咨询师。',
            isCorrect: true,
            feedback: '✅ 优秀！主动安抚+明确时间+弥补措施+信息同步，完美处理等待超时场景。',
            score: 20
          },
          {
            key: 'C',
            text: '"我也不知道呢，刚才那个人挺麻烦的。"',
            isCorrect: false,
            feedback: '❌ 抱怨其他顾客是服务禁忌，严重影响品牌形象。',
            score: 0
          }
        ]
      },
      {
        id: 's4',
        scene: '咨询师已到位，准备引导顾客进入咨询室。',
        options: [
          {
            key: 'A',
            text: '"咨询室在里面，您自己进去吧。"',
            isCorrect: false,
            feedback: '❌ 未引导陪同，服务流程缺失。',
            score: 0
          },
          {
            key: 'B',
            text: '侧身做出引导手势："张女士请这边走"，走在顾客右前方1米处，到达后开门请顾客先进，向双方介绍："王咨询师，这位是张女士；张女士，这位是我们的金牌咨询师王老师，今天由她为您服务。"',
            isCorrect: true,
            feedback: '✅ 满分！引导手势+正确站位+开门礼仪+双方介绍，完全符合规范。',
            score: 20
          },
          {
            key: 'C',
            text: '带顾客走到咨询室门口说："到了，进去吧。"',
            isCorrect: false,
            feedback: '⚠️ 缺少介绍环节，咨询师和顾客都比较尴尬。',
            score: 10
          }
        ]
      },
      {
        id: 's5',
        scene: '顾客咨询完毕准备离院。',
        options: [
          {
            key: 'A',
            text: '送到前台即可，说："慢走啊。"',
            isCorrect: false,
            feedback: '⚠️ 送别礼仪不到位。',
            score: 5
          },
          {
            key: 'B',
            text: '送至医院门口，拉门："张女士今天辛苦了，回家注意休息，有任何问题随时联系我们，我稍后会把今天的注意事项和下次预约时间发给您。期待下次再见！"目送顾客离开。',
            isCorrect: true,
            feedback: '✅ 完美收官！送至门口+术后提醒+后续服务预告+目送礼，VIP服务有始有终。',
            score: 20
          },
          {
            key: 'C',
            text: '在忙别的事，点头示意一下。',
            isCorrect: false,
            feedback: '❌ 极度不礼貌，服务有头无尾。',
            score: 0
          }
        ]
      }
    ]
  }
];

export const complaintScenes: ComplaintScene[] = [
  {
    id: 'cs001',
    type: 'bad_review',
    title: '术后效果不满差评处理',
    background: '顾客李女士双眼皮术后10天，微信发来差评截图，表示对宽度不满意，认为太宽太假，说朋友都说做得不好看，扬言要在各大平台曝光。',
    customerComplaint: '你们医院什么技术啊！这双眼皮做得这么宽，像两条毛毛虫，我朋友都笑话我！我要求退款，不然我就去大众点评、小红书全部给你们差评！',
    options: [
      {
        key: 'A',
        text: '"李女士您先消消气，双眼皮术后10天还在肿胀期，现在的宽度不是最终效果，一般需要1-3个月才会逐渐自然。您看什么时候方便来院复查一下，我们让主刀医生帮您看看？"',
        isCorrect: true,
        feedback: '✅ 正确做法：先接纳情绪+专业解释+给出解决方案（面诊复查）。不直接否定顾客感受，同时提供医学角度的客观说明。',
        nextTip: '后续步骤：预约复查时间→医生面诊评估→如确需调整则沟通修复方案。'
      },
      {
        key: 'B',
        text: '"这才10天啊，还没消肿呢，你朋友懂什么。我们医生做了几千台了，不会有问题的。"',
        isCorrect: false,
        feedback: '❌ 严重错误：否定顾客感受+质疑顾客朋友+傲慢态度，只会激化矛盾。顾客需要的是被倾听和尊重，不是辩解。'
      },
      {
        key: 'C',
        text: '"不满意可以做修复啊，退款是不可能的，手术协议你签字了的。"',
        isCorrect: false,
        feedback: '❌ 错误：一上来就谈协议和拒绝，完全没有共情和沟通，是引发升级投诉的典型话术。'
      }
    ]
  },
  {
    id: 'cs002',
    type: 'reschedule',
    title: '术前紧急改期处理',
    background: '顾客王先生明天上午9点的隆鼻手术，今晚8点突然打电话说明天有事要改期。距离手术不足12小时，按规定需收取30%违约金。',
    customerComplaint: '什么？要收30%违约金？你们太黑了吧！我也是临时有事啊，又不是故意不去。我之前在别的地方改期都不收费的！',
    options: [
      {
        key: 'A',
        text: '"王先生非常理解您临时有事的为难。院内规定术前48小时内改期需收取违约金，是因为医生和手术室为您预留了专属时间，临时取消会造成资源浪费。不过考虑到您是首次改期，我帮您申请一下能不能减免，您看可以吗？"',
        isCorrect: true,
        feedback: '✅ 正确：表达理解→说明规则原因→给出变通方案，既维护制度又体现人性化。',
        nextTip: '后续：如申请通过则重新预约；如不通过则耐心解释原因，强调手术资源的稀缺性。'
      },
      {
        key: 'B',
        text: '"规定就是规定，术前确认短信你也收到了，写了48小时内改期要扣费的。"',
        isCorrect: false,
        feedback: '❌ 错误：生硬搬出规定，没有共情，会让顾客觉得冷漠不讲理。'
      },
      {
        key: 'C',
        text: '"那行吧，这次就算了，下次注意啊。"',
        isCorrect: false,
        feedback: '⚠️ 过度妥协：虽然避免了冲突，但无原则地破坏制度会导致后续管理混乱，也没有让顾客了解规则的严肃性。'
      }
    ]
  },
  {
    id: 'cs003',
    type: 'privacy',
    title: '顾客信息泄露投诉',
    background: '顾客陈女士发现自己的整形经历被一个接待过她的新来的前台在和同事闲聊时提到了，而且被旁边等候的其他顾客听到了。陈女士非常愤怒。',
    customerComplaint: '你们怎么回事？！我的私事你们随便在大厅讨论？我做什么项目是我的隐私，你们新来的那个小姑娘到处乱说，我要投诉！',
    options: [
      {
        key: 'A',
        text: '"陈女士真的非常抱歉！发生这种事我们有不可推卸的责任。我马上向主管汇报，对涉事员工进行严肃处理和隐私培训。您看方便当面跟您致歉吗？我们会为这次过失给您一个满意的答复。"',
        isCorrect: true,
        feedback: '✅ 正确：立即诚恳道歉+承诺追责+给出补偿姿态。隐私泄露是严重问题，必须第一时间重视并采取行动。',
        nextTip: '后续步骤：当面/电话致歉→涉事员工处罚+全员隐私培训→给予顾客补偿（如免费护理项目）→签署保密承诺。'
      },
      {
        key: 'B',
        text: '"哎呀那个新来的不懂事，我说说她。"',
        isCorrect: false,
        feedback: '❌ 严重错误：轻描淡写+推卸责任（新人不懂事），完全没有意识到隐私泄露的严重性，会让顾客觉得不被重视。'
      },
      {
        key: 'C',
        text: '"其实也没说什么吧，就是聊了一下，没什么大不了的。"',
        isCorrect: false,
        feedback: '❌ 极其错误：否定顾客感受+淡化问题性质，隐私泄露是医疗服务行业的红线，此言一出基本等于失去顾客且可能引发法律纠纷。'
      }
    ]
  },
  {
    id: 'cs004',
    type: 'no_show',
    title: '爽约顾客再次预约',
    background: '顾客刘小姐上周预约后爽约未到也未告知，今天又打电话来要重新预约。按规定爽约顾客再次预约需先支付定金。',
    customerComplaint: '上次我忘了嘛，至于吗还要先交钱？你们这么大医院还怕我跑了？我可是真心想做的。',
    options: [
      {
        key: 'A',
        text: '"刘小姐没关系，忘记预约很正常。不过上次您预约后我们为您预留了医生和设备，您临时没来确实造成了一些资源浪费。这次预约我们需要先收一部分定金，到院后会直接抵扣项目费用，也是为了确保双方的时间都被尊重，您看可以理解吗？"',
        isCorrect: true,
        feedback: '✅ 正确：先淡化矛盾（表示理解）→说明原因（资源浪费）→解释定金规则（抵扣费用+尊重双方），逻辑清晰态度友好。',
        nextTip: '后续：如顾客接受则正常收定金预约；如拒绝则可建议先到院面诊再确定手术时间。'
      },
      {
        key: 'B',
        text: '"上次你说都不说一声就不来了，我们怎么知道你这次会不会又放鸽子。"',
        isCorrect: false,
        feedback: '❌ 错误：指责语气+不信任态度，极易引起顾客反感。应就事论事，不要做人格评判。'
      },
      {
        key: 'C',
        text: '"那算了算了，这次就不收了，下次可别再忘了啊。"',
        isCorrect: false,
        feedback: '⚠️ 错误：无原则妥协，制度形同虚设。长期来看会导致预约管理混乱，爽约率升高。'
      }
    ]
  }
];
