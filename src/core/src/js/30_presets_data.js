/* 自动生成：tools/gen_presets.py —— 十五套世界预设（2026-10-08 翻新：补未来/黑暗/黑暗纯火龙/沙滩火龙/沙滩桑葚/冰河）（阵型/卡槽/顺序/路由/Boss ops/小关抛花）。勿手改，改请改生成器 */
var WJP_PRESETS = {
 "fuxing": {
  "label": "复兴",
  "prefix": "fx_",
  "entry": "Fx_Wj_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "洋芋",
    "大哥",
    "芦荟",
    "原豌",
    "气流水仙花",
    "全息坚果",
    "电豌"
   ],
   "deck2": [
    "能量花",
    "洋芋",
    "大哥",
    "阳光蓓蕾",
    "心叶兰",
    "大守卫菇",
    "珊瑚",
    "瓷砖萝卜"
   ]
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 珊瑚,气流水仙花,芦荟,洋芋,洋芋,-,-,-,阳光蓓蕾|大哥+原豌[瓷],气流水仙花,珊瑚,洋芋,洋芋,全息坚果,-,-,阳光蓓蕾|大哥+原豌[瓷],心叶兰[瓷],洋芋,气流水仙花,珊瑚,全息坚果[瓷],-,-,阳光蓓蕾|大哥+原豌[瓷],气流水仙花,芦荟,洋芋,珊瑚,洋芋,-,-,阳光蓓蕾|珊瑚,气流水仙花,洋芋,洋芋,-,-,-,-,阳光蓓蕾"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "9-1",
     "slot": 1,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "9-2",
     "slot": 1,
     "pre": 0,
     "post": 0
    },
    {
     "t": "sweep",
     "name": "捡花1",
     "begin": [
      1201,
      121
     ],
     "end": [
      1205,
      309
     ],
     "repeat": 50,
     "alt": "fx_d1_气流2_1"
    },
    {
     "t": "plant",
     "name": "d1_大哥1_2",
     "cell": "1-2",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "d1_原豌1_2",
     "cell": "1-2",
     "slot": 5,
     "pre": 0,
     "post": 300,
     "alt": "fx_d1_气流2_1"
    },
    {
     "t": "plant",
     "name": "d1_大哥1_3",
     "cell": "1-3",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "d1_原豌1_3",
     "cell": "1-3",
     "slot": 5,
     "pre": 0,
     "post": 300,
     "alt": "fx_d1_气流2_1"
    },
    {
     "t": "plant",
     "name": "d1_大哥1_4",
     "cell": "1-4",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "d1_原豌1_4",
     "cell": "1-4",
     "slot": 5,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d1_气流2_1",
     "cell": "2-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流2_2",
     "cell": "2-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流4_3",
     "cell": "4-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流2_4",
     "cell": "2-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流2_5",
     "cell": "2-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "d1_洋芋5_1",
     "cell": "5-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋4_1",
     "cell": "4-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋3_5",
     "cell": "3-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋4_5",
     "cell": "4-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋4_2",
     "cell": "4-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋5_2",
     "cell": "5-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋3_3",
     "cell": "3-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋4_4",
     "cell": "4-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋6_4",
     "cell": "6-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_芦荟3_1",
     "cell": "3-1",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_芦荟3_4",
     "cell": "3-4",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_坚果6_2",
     "cell": "6-2",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_坚果6_3",
     "cell": "6-3",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": [
    {
     "t": "wave",
     "name": "点波_初始_d2"
    },
    {
     "t": "plant",
     "name": "d2_蓓蕾9_1",
     "cell": "9-1",
     "slot": 12,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "d2_蓓蕾9_2",
     "cell": "9-2",
     "slot": 12,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "d2_蓓蕾9_3",
     "cell": "9-3",
     "slot": 12,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "d2_蓓蕾9_4",
     "cell": "9-4",
     "slot": 12,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "d2_蓓蕾9_5",
     "cell": "9-5",
     "slot": 12,
     "pre": 0,
     "post": 1000
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡8列_1",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡9列_1",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡右侧_1",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡8列_2",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡9列_2",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡右侧_2",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡8列_3",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡9列_3",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡右侧_3",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "shovel",
     "name": "d2_铲2_3",
     "cell": "2-3",
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_守卫菇2_3",
     "cell": "2-3",
     "slot": 14,
     "pre": 0,
     "post": 300
    },
    {
     "t": "feed",
     "name": "d2_喂豆守卫菇",
     "cell": "2-3",
     "pre": 0,
     "post": 2500,
     "loop": false
    },
    {
     "t": "shovel",
     "name": "d2_铲守卫菇",
     "cell": "2-3",
     "post": 300
    },
    {
     "t": "plant",
     "name": "d2_心叶兰2_3",
     "cell": "2-3",
     "slot": 13,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d2_瓷砖1_2",
     "cell": "1-2",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖2_3",
     "cell": "2-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖1_4",
     "cell": "1-4",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖1_3",
     "cell": "1-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖6_3",
     "cell": "6-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_珊瑚1_1",
     "cell": "1-1",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_珊瑚3_2",
     "cell": "3-2",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_珊瑚5_4",
     "cell": "5-4",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_珊瑚1_5",
     "cell": "1-5",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_珊瑚5_3",
     "cell": "5-3",
     "slot": 15,
     "pre": 0,
     "post": 300
    },
    {
     "t": "wave",
     "name": "点波5_d2"
    }
   ]
  },
  "boss": {
   "feedSelect": false,
   "ops": [
    {
     "t": "stack",
     "name": "boss_叠电大1_2",
     "cell": "1-2",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大1_3",
     "cell": "1-3",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大1_4",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大1_4_2",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大二轮1_2",
     "cell": "1-2",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大二轮1_3",
     "cell": "1-3",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大二轮1_4",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大二轮1_4_2",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "flower",
     "name": "boss_能量花6_1",
     "cell": "6-1"
    },
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 0
    },
    {
     "t": "feed",
     "name": "boss_喂豆2_3",
     "cell": "2-3",
     "pre": 100,
     "post": 1000,
     "loop": true
    }
   ],
   "feedCell": "2-3"
  },
  "route": {
   "start_level": 1,
   "deck1_first": 10,
   "front30": 30
  },
  "routeMode": "tail",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "9-1",
    "9-2"
   ]
  },
  "n_nodes": 131
 },
 "tonghua": {
  "label": "童话",
  "prefix": "th_wj_",
  "entry": "Th_Wj_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "洋芋",
    "大哥",
    "芦荟",
    "原豌",
    "胆小菇",
    "气流水仙花",
    "阳光蓓蕾"
   ],
   "deck2": [
    "能量花",
    "大守卫菇",
    "冰瓜",
    "地锯草",
    "心叶兰",
    "瓷砖萝卜",
    "蜜蜂铃兰",
    "聚能山竹"
   ]
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 大哥+原豌,气流水仙花,洋芋,洋芋,蜜蜂铃兰[瓷],蜜蜂铃兰[瓷],地锯草,阳光蓓蕾,能量花|大哥+原豌,芦荟,气流水仙花,洋芋,洋芋,大守卫菇,聚能山竹[瓷],阳光蓓蕾,能量花|大哥+原豌,气流水仙花,洋芋,胆小菇,胆小菇[瓷],洋芋,冰瓜,阳光蓓蕾,-|大哥+原豌,气流水仙花,洋芋,胆小菇,胆小菇[瓷],洋芋,心叶兰[瓷],阳光蓓蕾,-|大哥+原豌,芦荟,气流水仙花,洋芋,洋芋,大守卫菇,地锯草,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "9-1",
     "slot": 1,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "9-2",
     "slot": 1,
     "pre": 0,
     "post": 0
    },
    {
     "t": "sweep",
     "name": "捡花1",
     "begin": [
      1201,
      121
     ],
     "end": [
      1205,
      309
     ],
     "repeat": 50
    },
    {
     "t": "sweep",
     "name": "捡花2_W1",
     "begin": [
      920,
      150
     ],
     "end": [
      948,
      513
     ],
     "repeat": 10
    },
    {
     "t": "sweep",
     "name": "捡花2_W2",
     "begin": [
      948,
      513
     ],
     "end": [
      976,
      150
     ],
     "repeat": 10
    },
    {
     "t": "sweep",
     "name": "捡花2_W3",
     "begin": [
      976,
      150
     ],
     "end": [
      1004,
      513
     ],
     "repeat": 10
    },
    {
     "t": "sweep",
     "name": "捡花2_W4",
     "begin": [
      1004,
      513
     ],
     "end": [
      1032,
      150
     ],
     "repeat": 10
    },
    {
     "t": "sweep",
     "name": "捡花2_W5",
     "begin": [
      1032,
      150
     ],
     "end": [
      1060,
      513
     ],
     "repeat": 10
    },
    {
     "t": "sweep",
     "name": "捡花2_W6",
     "begin": [
      1060,
      513
     ],
     "end": [
      1088,
      150
     ],
     "repeat": 10
    },
    {
     "t": "sweep",
     "name": "捡花2_W7",
     "begin": [
      1088,
      150
     ],
     "end": [
      1116,
      513
     ],
     "repeat": 10
    },
    {
     "t": "sweep",
     "name": "捡花2_W8",
     "begin": [
      1116,
      513
     ],
     "end": [
      1144,
      150
     ],
     "repeat": 10
    },
    {
     "t": "sweep",
     "name": "捡花2_W9",
     "begin": [
      1144,
      150
     ],
     "end": [
      1172,
      513
     ],
     "repeat": 10
    },
    {
     "t": "sweep",
     "name": "捡花2_W10",
     "begin": [
      1172,
      513
     ],
     "end": [
      1205,
      150
     ],
     "repeat": 10
    },
    {
     "t": "plant",
     "name": "d1_大哥1_1",
     "cell": "1-1",
     "slot": 3,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d1_原豌1_1",
     "cell": "1-1",
     "slot": 5,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d1_大哥1_3",
     "cell": "1-3",
     "slot": 3,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d1_原豌1_3",
     "cell": "1-3",
     "slot": 5,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d1_大哥1_5",
     "cell": "1-5",
     "slot": 3,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d1_原豌1_5",
     "cell": "1-5",
     "slot": 5,
     "pre": 0,
     "post": 300,
     "alt": "th_wj_d1_气流2_1"
    },
    {
     "t": "plant",
     "name": "d1_大哥1_2",
     "cell": "1-2",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "d1_原豌1_2",
     "cell": "1-2",
     "slot": 5,
     "pre": 0,
     "post": 300,
     "alt": "th_wj_d1_气流2_1"
    },
    {
     "t": "plant",
     "name": "d1_大哥1_4",
     "cell": "1-4",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "d1_原豌1_4",
     "cell": "1-4",
     "slot": 5,
     "pre": 0,
     "post": 300
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "d1_气流2_1",
     "cell": "2-1",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流3_2",
     "cell": "3-2",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流2_3",
     "cell": "2-3",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流2_4",
     "cell": "2-4",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流3_5",
     "cell": "3-5",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "d1_洋芋4_2",
     "cell": "4-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋5_2",
     "cell": "5-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋3_4",
     "cell": "3-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋6_4",
     "cell": "6-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋3_1",
     "cell": "3-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋3_3",
     "cell": "3-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋4_1",
     "cell": "4-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋4_5",
     "cell": "4-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "d1_洋芋5_5",
     "cell": "5-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_洋芋6_3",
     "cell": "6-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_芦荟2_2",
     "cell": "2-2",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_芦荟6_2",
     "cell": "6-2",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_芦荟2_5",
     "cell": "2-5",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_芦荟6_5",
     "cell": "6-5",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_胆小菇4_3",
     "cell": "4-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_胆小菇5_3",
     "cell": "5-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_胆小菇4_4",
     "cell": "4-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_胆小菇5_4",
     "cell": "5-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "d1_蓓蕾8_1",
     "cell": "8-1",
     "slot": 8,
     "pre": 0,
     "post": 1000
    },
    {
     "t": "plant",
     "name": "d1_蓓蕾8_2",
     "cell": "8-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_蓓蕾8_3",
     "cell": "8-3",
     "slot": 8,
     "pre": 0,
     "post": 1000
    },
    {
     "t": "plant",
     "name": "d1_蓓蕾8_4",
     "cell": "8-4",
     "slot": 8,
     "pre": 0,
     "post": 1000
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_1",
     "begin": [
      1111,
      167
     ],
     "end": [
      1111,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_1",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_1",
     "begin": [
      1268,
      167
     ],
     "end": [
      1268,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_2",
     "begin": [
      1111,
      167
     ],
     "end": [
      1111,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_2",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_2",
     "begin": [
      1268,
      167
     ],
     "end": [
      1268,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_3",
     "begin": [
      1111,
      167
     ],
     "end": [
      1111,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_3",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_3",
     "begin": [
      1268,
      167
     ],
     "end": [
      1268,
      600
     ],
     "repeat": 1
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": [
    {
     "t": "wave",
     "name": "点波_初始_d2"
    },
    {
     "t": "plant",
     "name": "d2_抛花1",
     "cell": "9-1",
     "slot": 9,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_抛花2",
     "cell": "9-2",
     "slot": 9,
     "pre": 0,
     "post": 0
    },
    {
     "t": "sweep",
     "name": "d2_捡花1",
     "begin": [
      1201,
      121
     ],
     "end": [
      1205,
      309
     ],
     "repeat": 50
    },
    {
     "t": "plant",
     "name": "d2_瓷砖5_3",
     "cell": "5-3",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖6_1",
     "cell": "6-1",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_蜜蜂铃兰6_1",
     "cell": "6-1",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖7_4",
     "cell": "7-4",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_心叶兰7_4",
     "cell": "7-4",
     "slot": 13,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "d2_冰瓜7_3",
     "cell": "7-3",
     "slot": 11,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_蜜蜂铃兰5_1",
     "cell": "5-1",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_聚能山竹7_2",
     "cell": "7-2",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_地锯草7_1",
     "cell": "7-1",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_地锯草7_5",
     "cell": "7-5",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "shovel",
     "name": "d2_铲位6_2",
     "cell": "6-2",
     "post": 100
    },
    {
     "t": "shovel",
     "name": "d2_铲位6_5",
     "cell": "6-5",
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_守卫菇6_2",
     "cell": "6-2",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_守卫菇6_5",
     "cell": "6-5",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "feed",
     "name": "d2_喂豆守卫菇6_2",
     "cell": "6-2",
     "pre": 0,
     "post": 2500,
     "loop": false
    },
    {
     "t": "feed",
     "name": "d2_喂豆守卫菇6_5",
     "cell": "6-5",
     "pre": 0,
     "post": 2500,
     "loop": false
    },
    {
     "t": "shovel",
     "name": "d2_铲守卫菇6_5",
     "cell": "6-5",
     "post": 300
    },
    {
     "t": "shovel",
     "name": "d2_铲守卫菇6_2",
     "cell": "6-2",
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖5_4",
     "cell": "5-4",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖5_1",
     "cell": "5-1",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖7_2",
     "cell": "7-2",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5_d2"
    }
   ]
  },
  "boss": {
   "feedSelect": false,
   "ops": [
    {
     "t": "feed",
     "name": "boss_喂豆5_3",
     "cell": "5-3",
     "pre": 0,
     "post": 1500,
     "loop": false
    },
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 3000
    },
    {
     "t": "feed",
     "name": "boss_喂豆5_3_2",
     "cell": "5-3",
     "pre": 0,
     "post": 3000,
     "loop": false
    },
    {
     "t": "feed",
     "name": "boss_喂豆7_4",
     "cell": "7-4",
     "pre": 0,
     "post": 1000,
     "loop": false
    },
    {
     "t": "feed",
     "name": "boss_喂豆7_4_循环",
     "cell": "7-4",
     "pre": 100,
     "post": 1000,
     "loop": true
    }
   ],
   "feedCell": "7-4"
  },
  "route": {
   "start_level": 1,
   "front30": 30,
   "deck2_tail3_first": 20,
   "front30_feed": "th_wj_给豆1_3",
   "front10": 10,
   "beilei_stop": 50
  },
  "routeMode": "tail",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "9-1",
    "9-2"
   ]
  },
  "n_nodes": 153
 },
 "xibu": {
  "label": "西部",
  "prefix": "xb_wj_",
  "entry": "Xb_Wj_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "洋芋",
    "大哥",
    "芦荟",
    "原豌",
    "电豌",
    "气流水仙花",
    "珊瑚"
   ],
   "deck2": []
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 珊瑚,大哥+原豌,洋芋,气流水仙花,洋芋,电豌,能量花,-,-|珊瑚,芦荟,洋芋,气流水仙花,洋芋,电豌,芦荟,-,-|珊瑚,大哥+原豌,洋芋,气流水仙花,洋芋,-,-,-,-|珊瑚,芦荟,洋芋,气流水仙花,洋芋,电豌,-,-,-|珊瑚,大哥+原豌,洋芋,气流水仙花,洋芋,电豌,芦荟,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "7-1",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "7-2",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "accel",
     "name": "点加速",
     "post": 300
    },
    {
     "t": "sweep",
     "name": "捡花1",
     "begin": "7-1",
     "end": "7-4",
     "repeat": 30
    },
    {
     "t": "wave",
     "name": "点波1"
    },
    {
     "t": "plant",
     "name": "大哥2_1",
     "cell": "2-1",
     "slot": 3,
     "pre": 0,
     "post": 1500
    },
    {
     "t": "plant",
     "name": "原豌2_1",
     "cell": "2-1",
     "slot": 5,
     "pre": 200,
     "post": 0,
     "alt": "xb_wj_点波2"
    },
    {
     "t": "plant",
     "name": "大哥2_3",
     "cell": "2-3",
     "slot": 3,
     "pre": 0,
     "post": 1500,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_3",
     "cell": "2-3",
     "slot": 5,
     "pre": 200,
     "post": 0,
     "alt": "xb_wj_点波2"
    },
    {
     "t": "plant",
     "name": "大哥2_5",
     "cell": "2-5",
     "slot": 3,
     "pre": 0,
     "post": 500,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_5",
     "cell": "2-5",
     "slot": 5,
     "pre": 100,
     "post": 0
    },
    {
     "t": "wave",
     "name": "点波2"
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "气流4_1",
     "cell": "4-1",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流4_2",
     "cell": "4-2",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流4_3",
     "cell": "4-3",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流4_4",
     "cell": "4-4",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流4_5",
     "cell": "4-5",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "洋芋3_1",
     "cell": "3-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_2",
     "cell": "3-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_3",
     "cell": "3-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_4",
     "cell": "3-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_5",
     "cell": "3-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋5_1",
     "cell": "5-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋5_2",
     "cell": "5-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋5_3",
     "cell": "5-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋5_4",
     "cell": "5-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋5_5",
     "cell": "5-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "芦荟2_2",
     "cell": "2-2",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟2_4",
     "cell": "2-4",
     "slot": 4,
     "pre": 0,
     "post": 100,
     "alt": "xb_wj_珊瑚1_1"
    },
    {
     "t": "plant",
     "name": "电豌6_1",
     "cell": "6-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "电豌6_2",
     "cell": "6-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "电豌6_4",
     "cell": "6-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "电豌6_5",
     "cell": "6-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟7_2",
     "cell": "7-2",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟7_5",
     "cell": "7-5",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_1",
     "cell": "1-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_2",
     "cell": "1-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_3",
     "cell": "1-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_4",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_5",
     "cell": "1-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": []
  },
  "boss": {
   "feedSelect": true,
   "ops": [
    {
     "t": "stack",
     "name": "boss_电豌2_3",
     "cell": "2-3",
     "slot": 6,
     "pre": 0,
     "post": 0
    },
    {
     "t": "feed",
     "name": "boss_喂豆_首",
     "cell": "2-3",
     "pre": 50,
     "post": 400,
     "loop": false
    },
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 100
    },
    {
     "t": "stack",
     "name": "boss_电豌2_1",
     "cell": "2-1",
     "slot": 6,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_电豌2_5",
     "cell": "2-5",
     "slot": 6,
     "pre": 0,
     "post": 0
    },
    {
     "t": "feed",
     "name": "boss_喂豆",
     "cell": "2-3",
     "pre": 100,
     "post": 1500,
     "loop": true
    }
   ],
   "feedCell": "2-3"
  },
  "route": {},
  "routeMode": "none",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "7-1",
    "7-2"
   ]
  },
  "n_nodes": 72
 },
 "aiji": {
  "label": "埃及",
  "prefix": "aj_wj_",
  "entry": "Aj_Wj_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "洋芋",
    "大哥",
    "芦荟",
    "火豌豆",
    "大哥",
    "气流水仙花",
    "珊瑚"
   ],
   "deck2": []
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 珊瑚,大哥+火豌,洋芋,气流水仙花,洋芋,大哥+火豌,大哥+火豌,-,能量花|珊瑚,洋芋,芦荟,气流水仙花,洋芋,大哥+火豌,芦荟,-,能量花|珊瑚,大哥+火豌,洋芋,气流水仙花,洋芋,大哥+火豌,大哥+火豌,-,-|珊瑚,洋芋,芦荟,气流水仙花,洋芋,大哥+火豌,大哥+火豌,-,-|珊瑚,大哥+火豌,洋芋,气流水仙花,洋芋,大哥+火豌,芦荟,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "9-1",
     "slot": 1,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "9-2",
     "slot": 1,
     "pre": 0,
     "post": 1000
    },
    {
     "t": "wave",
     "name": "点波1"
    },
    {
     "t": "plant",
     "name": "大哥2_1",
     "cell": "2-1",
     "slot": 3,
     "pre": 0,
     "post": 500
    },
    {
     "t": "plant",
     "name": "火豌2_1",
     "cell": "2-1",
     "slot": 5,
     "pre": 100,
     "post": 0
    },
    {
     "t": "plant",
     "name": "大哥2_3",
     "cell": "2-3",
     "slot": 3,
     "pre": 0,
     "post": 500
    },
    {
     "t": "plant",
     "name": "火豌2_3",
     "cell": "2-3",
     "slot": 5,
     "pre": 100,
     "post": 0,
     "alt": "aj_wj_点波2"
    },
    {
     "t": "plant",
     "name": "大哥2_5",
     "cell": "2-5",
     "slot": 3,
     "pre": 0,
     "post": 500,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌2_5",
     "cell": "2-5",
     "slot": 5,
     "pre": 100,
     "post": 0
    },
    {
     "t": "wave",
     "name": "点波2"
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "气流4_1",
     "cell": "4-1",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流4_2",
     "cell": "4-2",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流4_3",
     "cell": "4-3",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流4_4",
     "cell": "4-4",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流4_5",
     "cell": "4-5",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "洋芋3_1",
     "cell": "3-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋2_2",
     "cell": "2-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_3",
     "cell": "3-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋2_4",
     "cell": "2-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_5",
     "cell": "3-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋5_1",
     "cell": "5-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋5_2",
     "cell": "5-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋5_3",
     "cell": "5-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋5_4",
     "cell": "5-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋5_5",
     "cell": "5-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "芦荟3_2",
     "cell": "3-2",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟3_4",
     "cell": "3-4",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟7_2",
     "cell": "7-2",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟7_5",
     "cell": "7-5",
     "slot": 4,
     "pre": 0,
     "post": 100,
     "alt": "aj_wj_大哥6_2"
    },
    {
     "t": "plant",
     "name": "大哥6_1",
     "cell": "6-1",
     "slot": 3,
     "pre": 0,
     "post": 500,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌6_1",
     "cell": "6-1",
     "slot": 6,
     "pre": 100,
     "post": 0,
     "alt": "aj_wj_大哥6_3"
    },
    {
     "t": "plant",
     "name": "大哥6_2",
     "cell": "6-2",
     "slot": 3,
     "pre": 0,
     "post": 500,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌6_2",
     "cell": "6-2",
     "slot": 6,
     "pre": 100,
     "post": 0,
     "alt": "aj_wj_大哥6_4"
    },
    {
     "t": "plant",
     "name": "大哥6_3",
     "cell": "6-3",
     "slot": 3,
     "pre": 0,
     "post": 500,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌6_3",
     "cell": "6-3",
     "slot": 6,
     "pre": 100,
     "post": 0,
     "alt": "aj_wj_大哥6_5"
    },
    {
     "t": "plant",
     "name": "大哥6_4",
     "cell": "6-4",
     "slot": 3,
     "pre": 0,
     "post": 500,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌6_4",
     "cell": "6-4",
     "slot": 6,
     "pre": 100,
     "post": 0,
     "alt": "aj_wj_大哥7_1"
    },
    {
     "t": "plant",
     "name": "大哥6_5",
     "cell": "6-5",
     "slot": 3,
     "pre": 0,
     "post": 500,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌6_5",
     "cell": "6-5",
     "slot": 6,
     "pre": 100,
     "post": 0,
     "alt": "aj_wj_大哥7_3"
    },
    {
     "t": "plant",
     "name": "大哥7_1",
     "cell": "7-1",
     "slot": 3,
     "pre": 0,
     "post": 500,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌7_1",
     "cell": "7-1",
     "slot": 6,
     "pre": 100,
     "post": 0,
     "alt": "aj_wj_大哥7_4"
    },
    {
     "t": "plant",
     "name": "大哥7_3",
     "cell": "7-3",
     "slot": 3,
     "pre": 0,
     "post": 500,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌7_3",
     "cell": "7-3",
     "slot": 6,
     "pre": 100,
     "post": 0,
     "alt": "aj_wj_珊瑚1_1"
    },
    {
     "t": "plant",
     "name": "大哥7_4",
     "cell": "7-4",
     "slot": 3,
     "pre": 0,
     "post": 500,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌7_4",
     "cell": "7-4",
     "slot": 6,
     "pre": 100,
     "post": 0
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "珊瑚1_1",
     "cell": "1-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_2",
     "cell": "1-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_3",
     "cell": "1-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_4",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_5",
     "cell": "1-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": []
  },
  "boss": {
   "feedSelect": true,
   "ops": [
    {
     "t": "feed",
     "name": "boss_喂豆",
     "cell": "",
     "pre": 100,
     "post": 3000,
     "loop": true
    }
   ],
   "feedCell": "2-3"
  },
  "route": {},
  "routeMode": "none",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "9-1",
    "9-2"
   ]
  },
  "n_nodes": 76
 },
 "sangzhen": {
  "label": "桑葚",
  "prefix": "fx_sz_",
  "entry": "Fx_Sz_Wj_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "桑葚",
    "大哥",
    "芦荟",
    "原豌",
    "气流水仙花",
    "电豌",
    "毒藤"
   ],
   "deck2": [
    "补植物",
    "桑葚",
    "补植物",
    "阳光蓓蕾",
    "全息坚果",
    "大守卫菇",
    "心叶兰",
    "瓷砖萝卜"
   ]
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 气流水仙花,桑葚(毒藤),芦荟,大哥+原豌,桑葚(毒藤),桑葚(毒藤),-,-,阳光蓓蕾|大哥+原豌[瓷],桑葚(毒藤),桑葚(毒藤),桑葚(毒藤),气流水仙花,芦荟,-,-,阳光蓓蕾|心叶兰[瓷],气流水仙花,桑葚(毒藤),桑葚(毒藤),桑葚(毒藤),全息坚果[瓷],-,-,阳光蓓蕾|大哥+原豌[瓷],桑葚(毒藤),芦荟(毒藤),桑葚(毒藤),气流水仙花,桑葚(毒藤),-,-,阳光蓓蕾|气流水仙花,桑葚(毒藤),桑葚(毒藤),大哥+原豌,桑葚(毒藤),芦荟,-,-,阳光蓓蕾"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "9-1",
     "slot": 1,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "9-2",
     "slot": 1,
     "pre": 0,
     "post": 0
    },
    {
     "t": "sweep",
     "name": "捡花1",
     "begin": [
      1201,
      121
     ],
     "end": [
      1205,
      309
     ],
     "repeat": 50
    },
    {
     "t": "plant",
     "name": "d1_大哥1_2",
     "cell": "1-2",
     "slot": 3,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d1_原豌1_2",
     "cell": "1-2",
     "slot": 5,
     "pre": 0,
     "post": 300,
     "alt": "fx_sz_d1_大哥4_1"
    },
    {
     "t": "plant",
     "name": "d1_大哥1_4",
     "cell": "1-4",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "d1_原豌1_4",
     "cell": "1-4",
     "slot": 5,
     "pre": 0,
     "post": 300,
     "alt": "fx_sz_d1_大哥4_5"
    },
    {
     "t": "plant",
     "name": "d1_大哥4_1",
     "cell": "4-1",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "d1_原豌4_1",
     "cell": "4-1",
     "slot": 5,
     "pre": 0,
     "post": 300,
     "alt": "fx_sz_点波2"
    },
    {
     "t": "plant",
     "name": "d1_大哥4_5",
     "cell": "4-5",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "d1_原豌4_5",
     "cell": "4-5",
     "slot": 5,
     "pre": 0,
     "post": 300
    },
    {
     "t": "wave",
     "name": "点波2"
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "d1_桑葚2_1",
     "cell": "2-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚3_3",
     "cell": "3-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚2_5",
     "cell": "2-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤2_1",
     "cell": "2-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤3_3",
     "cell": "3-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤2_5",
     "cell": "2-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波3"
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "d1_气流1_1",
     "cell": "1-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流1_5",
     "cell": "1-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流2_3",
     "cell": "2-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流5_2",
     "cell": "5-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_气流5_4",
     "cell": "5-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_芦荟3_1",
     "cell": "3-1",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_芦荟6_2",
     "cell": "6-2",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_芦荟6_5",
     "cell": "6-5",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_芦荟3_4",
     "cell": "3-4",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤3_4",
     "cell": "3-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波4"
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "d1_桑葚5_1",
     "cell": "5-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚2_2",
     "cell": "2-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚4_3",
     "cell": "4-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚2_4",
     "cell": "2-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚3_5",
     "cell": "3-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚6_1",
     "cell": "6-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚3_2",
     "cell": "3-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚5_3",
     "cell": "5-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚4_4",
     "cell": "4-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚5_5",
     "cell": "5-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚4_2",
     "cell": "4-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_桑葚6_4",
     "cell": "6-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤5_1",
     "cell": "5-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤2_2",
     "cell": "2-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤4_3",
     "cell": "4-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤2_4",
     "cell": "2-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤3_5",
     "cell": "3-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤6_1",
     "cell": "6-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤3_2",
     "cell": "3-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤5_3",
     "cell": "5-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤4_4",
     "cell": "4-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤5_5",
     "cell": "5-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤4_2",
     "cell": "4-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d1_毒藤6_4",
     "cell": "6-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": [
    {
     "t": "wave",
     "name": "点波_初始_d2"
    },
    {
     "t": "plant",
     "name": "d2_蓓蕾9_1",
     "cell": "9-1",
     "slot": 12,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "d2_蓓蕾9_2",
     "cell": "9-2",
     "slot": 12,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "d2_蓓蕾9_3",
     "cell": "9-3",
     "slot": 12,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "d2_蓓蕾9_4",
     "cell": "9-4",
     "slot": 12,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "d2_蓓蕾9_5",
     "cell": "9-5",
     "slot": 12,
     "pre": 0,
     "post": 1000
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡8列_1",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡9列_1",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡8列_2",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡9列_2",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡8列_3",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "d2_蓓蕾捡9列_3",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "shovel",
     "name": "d2_铲1_3",
     "cell": "1-3",
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_守卫菇1_3",
     "cell": "1-3",
     "slot": 14,
     "pre": 0,
     "post": 300
    },
    {
     "t": "feed",
     "name": "d2_喂豆守卫菇",
     "cell": "1-3",
     "pre": 0,
     "post": 2500,
     "loop": false
    },
    {
     "t": "shovel",
     "name": "d2_铲守卫菇",
     "cell": "1-3",
     "post": 300
    },
    {
     "t": "plant",
     "name": "d2_心叶兰1_3",
     "cell": "1-3",
     "slot": 15,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d2_瓷砖1_2",
     "cell": "1-2",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖1_3",
     "cell": "1-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖1_4",
     "cell": "1-4",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_瓷砖6_3",
     "cell": "6-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_坚果6_3",
     "cell": "6-3",
     "slot": 13,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚2_1",
     "cell": "2-1",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚3_3",
     "cell": "3-3",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚2_5",
     "cell": "2-5",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚5_1",
     "cell": "5-1",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚2_2",
     "cell": "2-2",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚4_3",
     "cell": "4-3",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚2_4",
     "cell": "2-4",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚3_5",
     "cell": "3-5",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚6_1",
     "cell": "6-1",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚3_2",
     "cell": "3-2",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚5_3",
     "cell": "5-3",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚4_4",
     "cell": "4-4",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚5_5",
     "cell": "5-5",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚4_2",
     "cell": "4-2",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "d2_桑葚6_4",
     "cell": "6-4",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5_d2"
    }
   ]
  },
  "boss": {
   "feedSelect": true,
   "ops": [
    {
     "t": "stack",
     "name": "boss_叠电大1_2",
     "cell": "1-2",
     "slot": 7,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大1_4",
     "cell": "1-4",
     "slot": 7,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大1_4_2",
     "cell": "1-4",
     "slot": 7,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大二轮1_2",
     "cell": "1-2",
     "slot": 7,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大二轮1_4",
     "cell": "1-4",
     "slot": 7,
     "pre": 0,
     "post": 0
    },
    {
     "t": "stack",
     "name": "boss_叠电大二轮1_4_2",
     "cell": "1-4",
     "slot": 7,
     "pre": 0,
     "post": 0
    },
    {
     "t": "flower",
     "name": "boss_能量花7_1",
     "cell": "7-1"
    },
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 0
    },
    {
     "t": "feed",
     "name": "boss_喂豆1_3",
     "cell": "1-3",
     "pre": 100,
     "post": 2000,
     "loop": false
    },
    {
     "t": "feed",
     "name": "boss_喂豆1_2",
     "cell": "1-2",
     "pre": 100,
     "post": 2000,
     "loop": true
    }
   ],
   "feedCell": "1-2"
  },
  "route": {
   "start_level": 1,
   "deck1_first": 10
  },
  "routeMode": "tail",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "9-1",
    "9-2"
   ]
  },
  "n_nodes": 148
 },
 "haidao": {
  "label": "海盗",
  "prefix": "海盗_",
  "entry": "海盗_无尽",
  "slots": {
   "deck1": [
    "能量花",
    "洋芋",
    "大哥",
    "芦荟",
    "原豌",
    "珊瑚",
    "气流水仙花",
    "电豌"
   ],
   "deck2": [
    "补植物",
    "钢地刺",
    "补植物",
    "补植物",
    "补植物",
    "凤凰木花车",
    "瓷砖萝卜",
    "补植物"
   ]
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 珊瑚,电豌,芦荟,气流水仙花,钢地刺,-,-,-,-|大哥+原豌[瓷],气流水仙花,洋芋,凤凰木花车,钢地刺[瓷],电豌,-,-,-|珊瑚,电豌,芦荟,气流水仙花,钢地刺,-,-,-,-|大哥+原豌[瓷],气流水仙花,洋芋,凤凰木花车,钢地刺[瓷],电豌,-,-,-|珊瑚,电豌,芦荟,气流水仙花,钢地刺,-,-,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "d1_大哥1_2",
     "cell": "1-2",
     "slot": 3,
     "pre": 300,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d1_原豌1_2",
     "cell": "1-2",
     "slot": 5,
     "pre": 200,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d1_大哥1_4",
     "cell": "1-4",
     "slot": 3,
     "pre": 300,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d1_原豌1_4",
     "cell": "1-4",
     "slot": 5,
     "pre": 200,
     "post": 300
    },
    {
     "t": "plant",
     "name": "d1_珊瑚1_1",
     "cell": "1-1",
     "slot": 6,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_珊瑚1_3",
     "cell": "1-3",
     "slot": 6,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_珊瑚1_5",
     "cell": "1-5",
     "slot": 6,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_电豌2_1",
     "cell": "2-1",
     "slot": 8,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_电豌2_3",
     "cell": "2-3",
     "slot": 8,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_电豌2_5",
     "cell": "2-5",
     "slot": 8,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_芦荟3_1",
     "cell": "3-1",
     "slot": 4,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_芦荟3_3",
     "cell": "3-3",
     "slot": 4,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_芦荟3_5",
     "cell": "3-5",
     "slot": 4,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_水仙4_1",
     "cell": "4-1",
     "slot": 7,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_水仙2_2",
     "cell": "2-2",
     "slot": 7,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_水仙4_3",
     "cell": "4-3",
     "slot": 7,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_水仙2_4",
     "cell": "2-4",
     "slot": 7,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_水仙4_5",
     "cell": "4-5",
     "slot": 7,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_洋芋3_2",
     "cell": "3-2",
     "slot": 2,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_洋芋3_4",
     "cell": "3-4",
     "slot": 2,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "d1_电豌6_2",
     "cell": "6-2",
     "slot": 8,
     "pre": 100,
     "post": 150
    },
    {
     "t": "plant",
     "name": "d1_电豌6_4",
     "cell": "6-4",
     "slot": 8,
     "pre": 100,
     "post": 150
    },
    {
     "t": "wave",
     "name": "快速点波循环"
    }
   ],
   "deck2": [
    {
     "t": "wave",
     "name": "点波_初始_d2"
    },
    {
     "t": "plant",
     "name": "Deck2种植_1",
     "cell": "1-2",
     "slot": 15,
     "pre": 200,
     "post": 300
    },
    {
     "t": "plant",
     "name": "Deck2种植_2",
     "cell": "1-4",
     "slot": 15,
     "pre": 200,
     "post": 300
    },
    {
     "t": "plant",
     "name": "Deck2种植_3",
     "cell": "5-2",
     "slot": 15,
     "pre": 200,
     "post": 300
    },
    {
     "t": "plant",
     "name": "Deck2种植_4",
     "cell": "5-4",
     "slot": 15,
     "pre": 200,
     "post": 300
    },
    {
     "t": "plant",
     "name": "Deck2种植_5",
     "cell": "5-1",
     "slot": 10,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "Deck2种植_6",
     "cell": "5-2",
     "slot": 10,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "Deck2种植_7",
     "cell": "5-3",
     "slot": 10,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "Deck2种植_8",
     "cell": "5-4",
     "slot": 10,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "Deck2种植_9",
     "cell": "5-5",
     "slot": 10,
     "pre": 0,
     "post": 200
    },
    {
     "t": "plant",
     "name": "Deck2凤凰木花车4_2",
     "cell": "4-2",
     "slot": 14,
     "pre": 200,
     "post": 300
    },
    {
     "t": "plant",
     "name": "Deck2凤凰木花车4_4",
     "cell": "4-4",
     "slot": 14,
     "pre": 200,
     "post": 300
    },
    {
     "t": "wave",
     "name": "快速点波循环"
    }
   ],
   "farm": [
    {
     "t": "wave",
     "name": "点波_初始_后期"
    },
    {
     "t": "plant",
     "name": "小关抛花1",
     "cell": "7-1",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "小关抛花2",
     "cell": "7-2",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "sweep",
     "name": "捡花1",
     "begin": "7-1",
     "end": "7-4",
     "repeat": 30
    },
    {
     "t": "accel",
     "name": "后期_点加速",
     "post": 300
    },
    {
     "t": "feed",
     "name": "后期_喂豆1_2",
     "cell": "1-2",
     "pre": 100,
     "post": 1000,
     "loop": false
    },
    {
     "t": "plant",
     "name": "后期_补电豌6_2",
     "cell": "6-2",
     "slot": 8,
     "pre": 100,
     "post": 150
    },
    {
     "t": "plant",
     "name": "后期_补电豌6_4",
     "cell": "6-4",
     "slot": 8,
     "pre": 100,
     "post": 150
    },
    {
     "t": "plant",
     "name": "后期_补原大1_大哥",
     "cell": "1-2",
     "slot": 3,
     "pre": 100,
     "post": 300
    },
    {
     "t": "plant",
     "name": "后期_补原大1_原豌",
     "cell": "1-2",
     "slot": 5,
     "pre": 100,
     "post": 300
    },
    {
     "t": "plant",
     "name": "后期_补原大2_大哥",
     "cell": "1-4",
     "slot": 3,
     "pre": 100,
     "post": 300
    },
    {
     "t": "plant",
     "name": "后期_补原大2_原豌",
     "cell": "1-4",
     "slot": 5,
     "pre": 100,
     "post": 300
    },
    {
     "t": "wave",
     "name": "快速点波循环"
    }
   ]
  },
  "boss": {
   "feedSelect": true,
   "ops": [
    {
     "t": "stack",
     "name": "后20Boss_变身电大1_2",
     "cell": "1-2",
     "slot": 8,
     "pre": 0,
     "post": 500
    },
    {
     "t": "stack",
     "name": "后20Boss_变身电大1_4",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 500
    },
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 300
    },
    {
     "t": "feed",
     "name": "boss_喂豆1_2",
     "cell": "1-2",
     "pre": 100,
     "post": 2000,
     "loop": true
    }
   ],
   "opsDianda": [
    {
     "t": "stack",
     "name": "后20Boss_变身电大1_2",
     "cell": "1-2",
     "slot": 8,
     "pre": 0,
     "post": 500
    },
    {
     "t": "stack",
     "name": "后20Boss_变身电大1_4",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 500
    },
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 300
    },
    {
     "t": "feed",
     "name": "boss_喂豆1_2",
     "cell": "1-2",
     "pre": 100,
     "post": 2000,
     "loop": true
    }
   ],
   "feedCell": "1-2"
  },
  "route": {},
  "routeMode": "phase",
  "routePhase": {
   "deck2Levels": [
    2,
    12
   ],
   "bossEarlyFeed": 20,
   "farmFrom": 21
  },
  "n_nodes": 107
 },
 "gongfu": {
  "label": "功夫",
  "prefix": "gf_",
  "entry": "gf_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "洋芋",
    "大哥",
    "白萝卜",
    "原豌",
    "暗物质火龙果",
    "气流水仙花",
    "南瓜头"
   ],
   "deck2": [
    "能量花",
    "阳光蓓蕾",
    "大哥",
    "芦荟",
    "原豌",
    "小黄梨",
    "珊瑚",
    "瓷砖萝卜"
   ]
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 珊瑚,大哥+原豌,芦荟,暗物质火龙果(南瓜头),洋芋(南瓜头),气流水仙花(南瓜头),白萝卜,能量花,-|珊瑚,大哥+原豌,暗物质火龙果(南瓜头)[瓷],洋芋(南瓜头),气流水仙花(南瓜头),芦荟,白萝卜,能量花,阳光蓓蕾|珊瑚,大哥+原豌,暗物质火龙果(南瓜头)[瓷],洋芋(南瓜头),小黄梨[瓷],气流水仙花(南瓜头),白萝卜,-,阳光蓓蕾|珊瑚,大哥+原豌,芦荟,暗物质火龙果(南瓜头),洋芋(南瓜头),气流水仙花(南瓜头),白萝卜,-,阳光蓓蕾|珊瑚,大哥+原豌,暗物质火龙果(南瓜头)[瓷],洋芋(南瓜头),气流水仙花(南瓜头),芦荟,白萝卜,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "8-1",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "8-2",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "2-1",
     "slot": 3,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "2-1",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "gf_大哥2_3"
    },
    {
     "t": "plant",
     "name": "大哥2_2",
     "cell": "2-2",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_2",
     "cell": "2-2",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "gf_大哥2_4"
    },
    {
     "t": "plant",
     "name": "大哥2_3",
     "cell": "2-3",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_3",
     "cell": "2-3",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "gf_大哥2_5"
    },
    {
     "t": "plant",
     "name": "大哥2_4",
     "cell": "2-4",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_4",
     "cell": "2-4",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "gf_洋芋"
    },
    {
     "t": "plant",
     "name": "大哥2_5",
     "cell": "2-5",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_5",
     "cell": "2-5",
     "slot": 5,
     "pre": 200,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋",
     "cell": "5-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋4_2",
     "cell": "4-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋4_3",
     "cell": "4-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋5_4",
     "cell": "5-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋4_5",
     "cell": "4-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "白萝卜",
     "cell": "7-1",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "白萝卜7_2",
     "cell": "7-2",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "白萝卜7_3",
     "cell": "7-3",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "白萝卜7_4",
     "cell": "7-4",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "白萝卜7_5",
     "cell": "7-5",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "3-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_4",
     "cell": "4-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果3_3",
     "cell": "3-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果3_2",
     "cell": "3-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_1",
     "cell": "4-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花",
     "cell": "6-1",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花5_2",
     "cell": "5-2",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花6_3",
     "cell": "6-3",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花6_4",
     "cell": "6-4",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花5_5",
     "cell": "5-5",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头3_1",
     "cell": "3-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头4_1",
     "cell": "4-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头5_1",
     "cell": "5-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头6_1",
     "cell": "6-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头3_2",
     "cell": "3-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头4_2",
     "cell": "4-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头5_2",
     "cell": "5-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头6_2",
     "cell": "6-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头3_3",
     "cell": "3-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头4_3",
     "cell": "4-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头5_3",
     "cell": "5-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头6_3",
     "cell": "6-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头3_4",
     "cell": "3-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头4_4",
     "cell": "4-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头5_4",
     "cell": "5-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头6_4",
     "cell": "6-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头3_5",
     "cell": "3-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头4_5",
     "cell": "4-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头5_5",
     "cell": "5-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头6_5",
     "cell": "6-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": [
    {
     "t": "wave",
     "name": "点波_初始_d2"
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾",
     "cell": "9-2",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_3",
     "cell": "9-3",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_4",
     "cell": "9-4",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_1",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_1",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_1",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_2",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_2",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_2",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_3",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_3",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_3",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "3-1",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟6_2",
     "cell": "6-2",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟3_4",
     "cell": "3-4",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟6_5",
     "cell": "6-5",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "小黄梨",
     "cell": "5-3",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚",
     "cell": "1-1",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_2",
     "cell": "1-2",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_3",
     "cell": "1-3",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_4",
     "cell": "1-4",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_5",
     "cell": "1-5",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜",
     "cell": "5-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜3_3",
     "cell": "3-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜3_5",
     "cell": "3-5",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜3_2",
     "cell": "3-2",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5_d2"
    }
   ]
  },
  "boss": {
   "feedSelect": false,
   "ops": [
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 300
    },
    {
     "t": "feed",
     "name": "boss_喂豆5_3",
     "cell": "5-3",
     "pre": 100,
     "post": 3000,
     "loop": true
    }
   ],
   "feedCell": "5-3"
  },
  "route": {
   "start_level": 1,
   "front30": 30,
   "front10": 30,
   "d2_tails": [
    3,
    8
   ],
   "boss_tails": [
    5,
    0
   ]
  },
  "routeMode": "tail",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "8-1",
    "8-2"
   ]
  },
  "n_nodes": 136
 },
 "longyu": {
  "label": "龙芋",
  "prefix": "ty_",
  "entry": "ty_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "",
    "大哥",
    "",
    "原豌",
    "",
    "",
    ""
   ],
   "deck2": [
    "",
    "仙桃",
    "大哥",
    "阳光蓓蕾",
    "大守卫菇",
    "火豌",
    "钢地刺",
    "瓷砖萝卜"
   ]
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 珊瑚,大哥+原豌,芦荟,洋芋,气流水仙花,暗物质火龙果[瓷],能量花,-,阳光蓓蕾|珊瑚,暗物质火龙果,洋芋,气流水仙花,火豌[瓷],芦荟,能量花,-,阳光蓓蕾|珊瑚,大哥+原豌,洋芋,气流水仙花,钢地刺[瓷],大守卫菇,-,-,阳光蓓蕾|珊瑚,暗物质火龙果,芦荟,洋芋,气流水仙花,仙桃[瓷],-,-,阳光蓓蕾|珊瑚,大哥+原豌,洋芋,气流水仙花,暗物质火龙果[瓷],芦荟,-,-,阳光蓓蕾"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "7-1",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "7-2",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "2-1",
     "slot": 3,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "2-1",
     "slot": 5,
     "pre": 200,
     "post": 100
    },
    {
     "t": "plant",
     "name": "大哥5_2",
     "cell": "5-2",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "大哥2_3",
     "cell": "2-3",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_3",
     "cell": "2-3",
     "slot": 5,
     "pre": 200,
     "post": 100
    },
    {
     "t": "plant",
     "name": "大哥2_5",
     "cell": "2-5",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_5",
     "cell": "2-5",
     "slot": 5,
     "pre": 200,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波2"
    },
    {
     "t": "plant",
     "name": "洋芋",
     "cell": "4-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_5",
     "cell": "3-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_3",
     "cell": "3-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋4_1",
     "cell": "4-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_2",
     "cell": "3-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "3-1",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟6_2",
     "cell": "6-2",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟3_4",
     "cell": "3-4",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟6_5",
     "cell": "6-5",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "2-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果5_5",
     "cell": "5-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果6_3",
     "cell": "6-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果6_1",
     "cell": "6-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果2_2",
     "cell": "2-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花",
     "cell": "5-1",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花4_2",
     "cell": "4-2",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花4_3",
     "cell": "4-3",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花5_4",
     "cell": "5-4",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花4_5",
     "cell": "4-5",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_5",
     "cell": "1-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_1",
     "cell": "1-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_2",
     "cell": "1-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_3",
     "cell": "1-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": [
    {
     "t": "wave",
     "name": "点波_初始_d2"
    },
    {
     "t": "plant",
     "name": "仙桃",
     "cell": "6-4",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾",
     "cell": "9-1",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_2",
     "cell": "9-2",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_3",
     "cell": "9-3",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_4",
     "cell": "9-4",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_5",
     "cell": "9-5",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "大哥5_2_2",
     "cell": "5-2",
     "slot": 11,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌",
     "cell": "5-2",
     "slot": 14,
     "pre": 0,
     "post": 100,
     "check": true
    },
    {
     "t": "plant",
     "name": "钢地刺",
     "cell": "5-3",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜",
     "cell": "5-5",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜6_4",
     "cell": "6-4",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜5_3",
     "cell": "5-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜5_2",
     "cell": "5-2",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜6_1",
     "cell": "6-1",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "shovel",
     "name": "d2_铲_6_3",
     "cell": "6-3",
     "post": 300
    },
    {
     "t": "plant",
     "name": "大守卫菇",
     "cell": "6-3",
     "slot": 13,
     "pre": 0,
     "post": 100
    },
    {
     "t": "feed",
     "name": "d2_喂豆_6_3",
     "cell": "6-3",
     "pre": 100,
     "post": 1500,
     "loop": false
    },
    {
     "t": "shovel",
     "name": "d2_铲掉_6_3",
     "cell": "6-3",
     "post": 300
    },
    {
     "t": "wave",
     "name": "点波5_d2"
    }
   ]
  },
  "boss": {
   "feedSelect": false,
   "ops": [
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 300
    },
    {
     "t": "feed",
     "name": "boss_喂豆5_3",
     "cell": "5-3",
     "pre": 100,
     "post": 1500,
     "loop": true
    }
   ],
   "feedCell": "5-3"
  },
  "route": {
   "start_level": 1,
   "deck1_first": 10,
   "front30": 30,
   "front30_feed": "ty_给豆2_3",
   "boss_feed_early": "ty_boss_喂豆5_2",
   "boss_feed_late": "ty_boss_喂豆5_3"
  },
  "routeMode": "tail",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "7-1",
    "7-2"
   ]
  },
  "n_nodes": 106
 },
 "gongfu2": {
  "label": "功夫纯火龙v2",
  "prefix": "gf2_",
  "entry": "gf2_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "洋芋",
    "大哥",
    "白萝卜",
    "原豌",
    "暗物质火龙果",
    "气流水仙花",
    "南瓜头"
   ],
   "deck2": [
    "能量花",
    "阳光蓓蕾",
    "大哥",
    "芦荟",
    "暗物质火龙果",
    "小黄梨",
    "珊瑚",
    "瓷砖萝卜"
   ]
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 珊瑚,大哥+原豌,暗物质火龙果(南瓜头)[瓷],小黄梨(南瓜头)[瓷],暗物质火龙果(南瓜头),暗物质火龙果(南瓜头),白萝卜,-,-|珊瑚,大哥+原豌,芦荟(南瓜头),暗物质火龙果(南瓜头),暗物质火龙果(南瓜头),芦荟(南瓜头),白萝卜,-,阳光蓓蕾|珊瑚,大哥+原豌,暗物质火龙果(南瓜头)[瓷],暗物质火龙果(南瓜头),白萝卜,-,-,-,阳光蓓蕾|珊瑚,大哥+原豌,暗物质火龙果(南瓜头)[瓷],暗物质火龙果(南瓜头),白萝卜,-,-,-,阳光蓓蕾|珊瑚,大哥+原豌,芦荟(南瓜头),暗物质火龙果(南瓜头),暗物质火龙果(南瓜头),芦荟(南瓜头),白萝卜,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "2-1",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "2-1",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "2-2",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "2-2",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "2-3",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "2-3",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "2-4",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "2-4",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "2-5",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "2-5",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "白萝卜",
     "cell": "7-1",
     "slot": 4,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "白萝卜",
     "cell": "7-2",
     "slot": 4,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "白萝卜",
     "cell": "5-3",
     "slot": 4,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "白萝卜",
     "cell": "5-4",
     "slot": 4,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "白萝卜",
     "cell": "7-5",
     "slot": 4,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "3-4",
     "slot": 6,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "4-5",
     "slot": 6,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "3-1",
     "slot": 6,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "3-3",
     "slot": 6,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "4-2",
     "slot": 6,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "4-3",
     "slot": 6,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "4-4",
     "slot": 6,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "5-1",
     "slot": 6,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "5-2",
     "slot": 6,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "5-5",
     "slot": 6,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "6-1",
     "slot": 6,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "3-1",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "3-2",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "3-3",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "3-4",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "3-5",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "4-1",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "4-2",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "4-3",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "4-4",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "4-5",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "5-1",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "5-2",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "5-5",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "6-1",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "6-2",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "6-5",
     "slot": 8,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": [
    {
     "t": "wave",
     "name": "点波_初始_d2"
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾",
     "cell": "9-2",
     "slot": 10,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾",
     "cell": "9-3",
     "slot": 10,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾",
     "cell": "9-4",
     "slot": 10,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "slide",
     "name": "蓓蕾滑8列_1",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "duration": 150,
     "pre": 0,
     "post": 100
    },
    {
     "t": "slide",
     "name": "蓓蕾滑9列_1",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "duration": 150,
     "pre": 0,
     "post": 100
    },
    {
     "t": "slide",
     "name": "蓓蕾滑右侧_1",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "duration": 150,
     "pre": 0,
     "post": 500
    },
    {
     "t": "slide",
     "name": "蓓蕾滑8列_2",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "duration": 150,
     "pre": 0,
     "post": 100
    },
    {
     "t": "slide",
     "name": "蓓蕾滑9列_2",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "duration": 150,
     "pre": 0,
     "post": 100
    },
    {
     "t": "slide",
     "name": "蓓蕾滑右侧_2",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "duration": 150,
     "pre": 0,
     "post": 500
    },
    {
     "t": "slide",
     "name": "蓓蕾滑8列_3",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "duration": 150,
     "pre": 0,
     "post": 100
    },
    {
     "t": "slide",
     "name": "蓓蕾滑9列_3",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "duration": 150,
     "pre": 0,
     "post": 100
    },
    {
     "t": "slide",
     "name": "蓓蕾滑右侧_3",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "duration": 150,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "3-2",
     "slot": 12,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "6-2",
     "slot": 12,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "3-5",
     "slot": 12,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "6-5",
     "slot": 12,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "小黄梨",
     "cell": "4-1",
     "slot": 14,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "珊瑚",
     "cell": "1-1",
     "slot": 15,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "珊瑚",
     "cell": "1-2",
     "slot": 15,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "珊瑚",
     "cell": "1-3",
     "slot": 15,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "珊瑚",
     "cell": "1-4",
     "slot": 15,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "珊瑚",
     "cell": "1-5",
     "slot": 15,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜",
     "cell": "3-1",
     "slot": 16,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜",
     "cell": "4-1",
     "slot": 16,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜",
     "cell": "3-3",
     "slot": 16,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜",
     "cell": "3-4",
     "slot": 16,
     "pre": 0,
     "post": 100,
     "check": false,
     "alt": ""
    },
    {
     "t": "wave",
     "name": "点波5_d2"
    }
   ]
  },
  "boss": {
   "feedSelect": true,
   "ops": [
    {
     "t": "accel",
     "name": "点加速",
     "post": 300
    },
    {
     "t": "feed",
     "cell": "4-1",
     "pre": 100,
     "post": 1500,
     "loop": true
    }
   ],
   "feedCell": "4-1"
  },
  "route": {
   "start_level": 1,
   "deck1_first": 0,
   "front10": 30,
   "front10_feed": "2-3",
   "front30": 30,
   "front30_feed": "",
   "deck2_tail3_first": 0,
   "beilei_stop": 0,
   "boss_feed_early": "",
   "boss_feed_late": "",
   "bailuo_from": 60,
   "wave_mode": "hold"
  },
  "routeMode": "tail",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "8-1",
    "8-2"
   ]
  },
  "n_nodes": 134
 },
 "weilai": {
  "label": "未来",
  "prefix": "wl_",
  "entry": "wl_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "气流水仙花",
    "大哥",
    "钢地刺",
    "原豌",
    "暗物质火龙果",
    "洋芋",
    "珊瑚"
   ],
   "deck2": [
    "能量花",
    "阳光蓓蕾",
    "大哥",
    "芦荟",
    "原豌",
    "暗物质火龙果",
    "南瓜头",
    "瓷砖萝卜"
   ]
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 珊瑚(南瓜头),大哥(南瓜头)+原豌,芦荟(南瓜头),暗物质火龙果,气流水仙花(南瓜头),洋芋,暗物质火龙果,能量花,-|珊瑚(南瓜头),大哥(南瓜头)+原豌,洋芋(南瓜头),暗物质火龙果[瓷],气流水仙花(南瓜头),芦荟(南瓜头),暗物质火龙果,能量花,阳光蓓蕾|珊瑚(南瓜头),大哥(南瓜头)+原豌[瓷],钢地刺(南瓜头)[瓷],暗物质火龙果,气流水仙花(南瓜头),洋芋,暗物质火龙果,-,阳光蓓蕾|珊瑚(南瓜头),大哥(南瓜头)+原豌,芦荟(南瓜头),暗物质火龙果[瓷],气流水仙花(南瓜头),洋芋,暗物质火龙果,-,阳光蓓蕾|珊瑚(南瓜头),大哥(南瓜头)+原豌,洋芋(南瓜头),暗物质火龙果,气流水仙花(南瓜头),芦荟(南瓜头),暗物质火龙果,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "8-1",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "8-2",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "2-1",
     "slot": 3,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "2-1",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "wl_大哥2_3"
    },
    {
     "t": "plant",
     "name": "大哥2_2",
     "cell": "2-2",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_2",
     "cell": "2-2",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "wl_大哥2_4"
    },
    {
     "t": "plant",
     "name": "大哥2_3",
     "cell": "2-3",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_3",
     "cell": "2-3",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "wl_大哥2_5"
    },
    {
     "t": "plant",
     "name": "大哥2_4",
     "cell": "2-4",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_4",
     "cell": "2-4",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "wl_点波2"
    },
    {
     "t": "plant",
     "name": "大哥2_5",
     "cell": "2-5",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_5",
     "cell": "2-5",
     "slot": 5,
     "pre": 200,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波2"
    },
    {
     "t": "plant",
     "name": "气流水仙花",
     "cell": "5-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花5_2",
     "cell": "5-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花5_3",
     "cell": "5-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花5_4",
     "cell": "5-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花5_5",
     "cell": "5-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "钢地刺",
     "cell": "3-3",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "4-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_5",
     "cell": "4-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_1",
     "cell": "4-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果7_1",
     "cell": "7-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_2",
     "cell": "4-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果7_2",
     "cell": "7-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_3",
     "cell": "4-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果7_3",
     "cell": "7-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果7_4",
     "cell": "7-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果7_5",
     "cell": "7-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "珊瑚",
     "cell": "1-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_2",
     "cell": "1-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_3",
     "cell": "1-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_4",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_5",
     "cell": "1-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋",
     "cell": "3-2",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋6_1",
     "cell": "6-1",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋6_3",
     "cell": "6-3",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋6_4",
     "cell": "6-4",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_5",
     "cell": "3-5",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": [
    {
     "t": "wave",
     "name": "点波_初始_d2"
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾",
     "cell": "9-2",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_3",
     "cell": "9-3",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_4",
     "cell": "9-4",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_1",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_1",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_1",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_2",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_2",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_2",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_3",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_3",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_3",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "3-1",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟6_2",
     "cell": "6-2",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟3_4",
     "cell": "3-4",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟6_5",
     "cell": "6-5",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜",
     "cell": "4-2",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜3_3",
     "cell": "3-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜2_3",
     "cell": "2-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜4_4",
     "cell": "4-4",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "1-1",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头2_1",
     "cell": "2-1",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头3_1",
     "cell": "3-1",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头5_1",
     "cell": "5-1",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头1_2",
     "cell": "1-2",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头2_2",
     "cell": "2-2",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头3_2",
     "cell": "3-2",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头5_2",
     "cell": "5-2",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头6_2",
     "cell": "6-2",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头1_3",
     "cell": "1-3",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头2_3",
     "cell": "2-3",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头3_3",
     "cell": "3-3",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头5_3",
     "cell": "5-3",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头1_4",
     "cell": "1-4",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头2_4",
     "cell": "2-4",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头3_4",
     "cell": "3-4",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头5_4",
     "cell": "5-4",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头1_5",
     "cell": "1-5",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头2_5",
     "cell": "2-5",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头3_5",
     "cell": "3-5",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头5_5",
     "cell": "5-5",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头6_5",
     "cell": "6-5",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5_d2"
    }
   ]
  },
  "boss": {
   "feedSelect": true,
   "ops": [
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 300
    },
    {
     "t": "feed",
     "name": "boss_喂豆2_3",
     "cell": "2-3",
     "pre": 100,
     "post": 3000,
     "loop": false
    },
    {
     "t": "feed",
     "name": "boss_喂豆3_3",
     "cell": "3-3",
     "pre": 100,
     "post": 3000,
     "loop": false
    },
    {
     "t": "feed",
     "name": "boss_喂豆3_3_循环",
     "cell": "3-3",
     "pre": 100,
     "post": 3000,
     "loop": true
    }
   ],
   "feedCell": "3-3"
  },
  "route": {
   "start_level": 1,
   "deck1_first": 20,
   "d2_tails": [
    3,
    8
   ],
   "boss_tails": [
    5,
    0
   ],
   "boss_feed_late": "wl_boss_喂豆2_3",
   "wave_mode": "不点波"
  },
  "routeMode": "tail",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "8-1",
    "8-2"
   ]
  },
  "n_nodes": 136
 },
 "heian": {
  "label": "黑暗",
  "prefix": "ha_",
  "entry": "ha_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "气流水仙花",
    "大哥",
    "电豌豆",
    "原豌",
    "暗物质火龙果",
    "洋芋",
    "珊瑚"
   ],
   "deck2": [
    "能量花",
    "阳光蓓蕾",
    "芦荟",
    "磁力菇",
    "茄子",
    "暗物质火龙果",
    "蛇草",
    "瓷砖萝卜"
   ]
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 珊瑚,大哥+原豌,芦荟,暗物质火龙果[瓷],蛇草,洋芋,气流水仙花,能量花,-|珊瑚,茄子,洋芋,暗物质火龙果[瓷],蛇草,芦荟,气流水仙花,能量花,阳光蓓蕾|珊瑚,大哥+原豌[瓷],洋芋,暗物质火龙果[瓷],蛇草,磁力菇[瓷],气流水仙花,-,阳光蓓蕾|珊瑚,茄子,芦荟,暗物质火龙果[瓷],蛇草,洋芋,气流水仙花,-,阳光蓓蕾|珊瑚,大哥+原豌,洋芋,暗物质火龙果[瓷],蛇草,芦荟,气流水仙花,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "8-1",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "8-2",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花",
     "cell": "7-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花7_2",
     "cell": "7-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花7_3",
     "cell": "7-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花7_4",
     "cell": "7-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花7_5",
     "cell": "7-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "2-1",
     "slot": 3,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "2-1",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "ha_大哥2_5"
    },
    {
     "t": "plant",
     "name": "大哥2_3",
     "cell": "2-3",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_3",
     "cell": "2-3",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "ha_点波2"
    },
    {
     "t": "plant",
     "name": "大哥2_5",
     "cell": "2-5",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_5",
     "cell": "2-5",
     "slot": 5,
     "pre": 200,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波2"
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "4-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_5",
     "cell": "4-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_1",
     "cell": "4-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_2",
     "cell": "4-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_3",
     "cell": "4-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚",
     "cell": "1-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_2",
     "cell": "1-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_3",
     "cell": "1-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_4",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_5",
     "cell": "1-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋",
     "cell": "6-1",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_2",
     "cell": "3-2",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_3",
     "cell": "3-3",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋6_4",
     "cell": "6-4",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_5",
     "cell": "3-5",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": [
    {
     "t": "wave",
     "name": "点波_初始_d2"
    },
    {
     "t": "plant",
     "name": "抛花1_d2",
     "cell": "8-1",
     "slot": 9,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2_d2",
     "cell": "8-2",
     "slot": 9,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾",
     "cell": "9-2",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_3",
     "cell": "9-3",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_4",
     "cell": "9-4",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_1",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_1",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_1",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_2",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_2",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_2",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_3",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_3",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_3",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "plant",
     "name": "磁力菇",
     "cell": "6-3",
     "slot": 12,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "蛇草",
     "cell": "5-1",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "蛇草5_2",
     "cell": "5-2",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "蛇草5_3",
     "cell": "5-3",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "蛇草5_4",
     "cell": "5-4",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "蛇草5_5",
     "cell": "5-5",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "3-1",
     "slot": 11,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟6_2",
     "cell": "6-2",
     "slot": 11,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟3_4",
     "cell": "3-4",
     "slot": 11,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟6_5",
     "cell": "6-5",
     "slot": 11,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "茄子",
     "cell": "2-2",
     "slot": 13,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "茄子2_4",
     "cell": "2-4",
     "slot": 13,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜",
     "cell": "4-1",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜4_2",
     "cell": "4-2",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜4_3",
     "cell": "4-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜4_4",
     "cell": "4-4",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜4_5",
     "cell": "4-5",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜6_3",
     "cell": "6-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜2_3",
     "cell": "2-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5_d2"
    }
   ]
  },
  "boss": {
   "feedSelect": true,
   "ops": [
    {
     "t": "feed",
     "name": "boss_喂豆6_3",
     "cell": "6-3",
     "pre": 100,
     "post": 3000,
     "loop": false
    },
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 300
    },
    {
     "t": "feed",
     "name": "boss_喂豆6_3_2",
     "cell": "6-3",
     "pre": 100,
     "post": 3000,
     "loop": true
    }
   ],
   "feedCell": "6-3"
  },
  "route": {
   "start_level": 1,
   "deck1_first": 20,
   "d2_tails": [
    3,
    8
   ],
   "boss_tails": [
    5,
    0
   ],
   "boss_feed_early": "ha_boss_喂豆6_3_2",
   "boss_feed_late": "ha_boss_喂豆6_3_2",
   "boss_stack_from": 20,
   "boss_stack_entry": "ha_boss_叠电大2_3",
   "boss_stack_skip": "ha_boss_喂豆6_3",
   "wave_mode": "不点波"
  },
  "routeMode": "tail",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "8-1",
    "8-2"
   ]
  },
  "n_nodes": 114
 },
 "heian2": {
  "label": "黑暗纯火龙v2",
  "prefix": "ha2_",
  "entry": "ha2_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "气流水仙花",
    "大哥",
    "芦荟",
    "原豌",
    "暗物质火龙果",
    "磁力菇",
    "军炮"
   ],
   "deck2": [
    "能量花",
    "阳光蓓蕾",
    "大哥",
    "原豌",
    "大守卫菇",
    "暗物质火龙果",
    "蛇草",
    "瓷砖萝卜"
   ]
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 大哥+原豌,暗物质火龙果,芦荟,暗物质火龙果[瓷],蛇草,军炮,暗物质火龙果,能量花,-|军炮,暗物质火龙果,军炮,暗物质火龙果[瓷],蛇草,芦荟,暗物质火龙果,能量花,阳光蓓蕾|大哥+原豌,暗物质火龙果,军炮,暗物质火龙果[瓷],蛇草,磁力菇[瓷],暗物质火龙果,-,阳光蓓蕾|军炮,暗物质火龙果,芦荟,暗物质火龙果[瓷],蛇草,军炮,暗物质火龙果,-,阳光蓓蕾|大哥+原豌,暗物质火龙果,军炮,暗物质火龙果[瓷],蛇草,芦荟,暗物质火龙果,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "8-1",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "8-2",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "1-1",
     "slot": 3,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "1-1",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "ha2_大哥1_5"
    },
    {
     "t": "plant",
     "name": "大哥1_3",
     "cell": "1-3",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌1_3",
     "cell": "1-3",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "ha2_点波2"
    },
    {
     "t": "plant",
     "name": "大哥1_5",
     "cell": "1-5",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌1_5",
     "cell": "1-5",
     "slot": 5,
     "pre": 200,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波2"
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "3-1",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟6_2",
     "cell": "6-2",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟3_4",
     "cell": "3-4",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟6_5",
     "cell": "6-5",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "2-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果2_4",
     "cell": "2-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_2",
     "cell": "4-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果2_1",
     "cell": "2-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_1",
     "cell": "4-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果7_1",
     "cell": "7-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果7_2",
     "cell": "7-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果2_3",
     "cell": "2-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_3",
     "cell": "4-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果7_3",
     "cell": "7-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_4",
     "cell": "4-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果7_4",
     "cell": "7-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果2_5",
     "cell": "2-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果4_5",
     "cell": "4-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果7_5",
     "cell": "7-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "磁力菇",
     "cell": "6-3",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "军炮",
     "cell": "6-1",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "军炮1_2",
     "cell": "1-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "军炮3_2",
     "cell": "3-2",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "军炮3_3",
     "cell": "3-3",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "军炮1_4",
     "cell": "1-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "军炮6_4",
     "cell": "6-4",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "军炮3_5",
     "cell": "3-5",
     "slot": 8,
     "pre": 0,
     "post": 100
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": [
    {
     "t": "wave",
     "name": "点波_初始_d2"
    },
    {
     "t": "plant",
     "name": "抛花1_d2",
     "cell": "8-1",
     "slot": 9,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2_d2",
     "cell": "8-2",
     "slot": 9,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾",
     "cell": "9-2",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_3",
     "cell": "9-3",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "阳光蓓蕾9_4",
     "cell": "9-4",
     "slot": 10,
     "pre": 0,
     "post": 100
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_1",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_1",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_1",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_2",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_2",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_2",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑8列_3",
     "begin": [
      1114,
      167
     ],
     "end": [
      1114,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑9列_3",
     "begin": [
      1204,
      167
     ],
     "end": [
      1204,
      600
     ],
     "repeat": 1
    },
    {
     "t": "sweep",
     "name": "蓓蕾滑右侧_3",
     "begin": [
      1233,
      167
     ],
     "end": [
      1233,
      600
     ],
     "repeat": 1
    },
    {
     "t": "shovel",
     "name": "d2_先铲",
     "cell": "5-3",
     "post": 100
    },
    {
     "t": "plant",
     "name": "大守卫菇",
     "cell": "5-3",
     "slot": 13,
     "pre": 0,
     "post": 100
    },
    {
     "t": "feed",
     "name": "d2_喂豆",
     "cell": "5-3",
     "pre": 0,
     "post": 2000,
     "loop": false
    },
    {
     "t": "shovel",
     "name": "d2_铲",
     "cell": "5-3",
     "post": 100
    },
    {
     "t": "plant",
     "name": "蛇草",
     "cell": "5-1",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "蛇草5_2",
     "cell": "5-2",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "蛇草5_3",
     "cell": "5-3",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "蛇草5_4",
     "cell": "5-4",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "蛇草5_5",
     "cell": "5-5",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜",
     "cell": "4-1",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜4_2",
     "cell": "4-2",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜4_3",
     "cell": "4-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜6_3",
     "cell": "6-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜4_4",
     "cell": "4-4",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜4_5",
     "cell": "4-5",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5_d2"
    }
   ]
  },
  "boss": {
   "feedSelect": true,
   "ops": [
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 300
    },
    {
     "t": "feed",
     "name": "boss_喂豆6_3",
     "cell": "6-3",
     "pre": 100,
     "post": 3000,
     "loop": true
    }
   ],
   "feedCell": "6-3"
  },
  "route": {
   "start_level": 1,
   "deck1_first": 20,
   "d2_tails": [
    3,
    8
   ],
   "boss_tails": [
    5,
    0
   ],
   "boss_feed_early": "ha2_boss_喂豆6_3",
   "boss_feed_late": "ha2_boss_喂豆6_3",
   "wave_mode": "不点波"
  },
  "routeMode": "tail",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "8-1",
    "8-2"
   ]
  },
  "n_nodes": 116
 },
 "shatan": {
  "label": "沙滩火龙",
  "prefix": "st_",
  "entry": "st_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "大守卫菇",
    "大哥",
    "芦荟",
    "原豌",
    "暗物质火龙果",
    "橄榄坑",
    "火豌"
   ],
   "deck2": []
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 大哥+原豌,芦荟,暗物质火龙果,橄榄坑,-,-,-,能量花,-|大哥+火豌,暗物质火龙果,大守卫菇,橄榄坑,-,-,-,能量花,-|大哥+原豌,暗物质火龙果,大哥+火豌,橄榄坑,-,-,-,-,-|大哥+火豌,芦荟,暗物质火龙果,橄榄坑,-,-,-,-,-|大哥+原豌,暗物质火龙果,大守卫菇,橄榄坑,-,-,-,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "8-1",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "8-2",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "1-1",
     "slot": 3,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "1-1",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "st_大哥1_3"
    },
    {
     "t": "plant",
     "name": "大哥1_2",
     "cell": "1-2",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌",
     "cell": "1-2",
     "slot": 8,
     "pre": 200,
     "post": 100,
     "alt": "st_大哥3_3"
    },
    {
     "t": "plant",
     "name": "大哥1_3",
     "cell": "1-3",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌1_3",
     "cell": "1-3",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "st_大哥1_4"
    },
    {
     "t": "plant",
     "name": "大哥3_3",
     "cell": "3-3",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌3_3",
     "cell": "3-3",
     "slot": 8,
     "pre": 200,
     "post": 100,
     "alt": "st_大哥1_5"
    },
    {
     "t": "plant",
     "name": "大哥1_4",
     "cell": "1-4",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌1_4",
     "cell": "1-4",
     "slot": 8,
     "pre": 200,
     "post": 100,
     "alt": "st_点波2"
    },
    {
     "t": "plant",
     "name": "大哥1_5",
     "cell": "1-5",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌1_5",
     "cell": "1-5",
     "slot": 5,
     "pre": 200,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波2"
    },
    {
     "t": "plant",
     "name": "大守卫菇",
     "cell": "3-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "大守卫菇3_5",
     "cell": "3-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "2-1",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟2_4",
     "cell": "2-4",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "3-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果3_1",
     "cell": "3-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果2_2",
     "cell": "2-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果2_3",
     "cell": "2-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果2_5",
     "cell": "2-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "橄榄坑",
     "cell": "4-1",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "橄榄坑4_2",
     "cell": "4-2",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "橄榄坑4_3",
     "cell": "4-3",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "橄榄坑4_4",
     "cell": "4-4",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "橄榄坑4_5",
     "cell": "4-5",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": []
  },
  "boss": {
   "feedSelect": false,
   "ops": [
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 300
    }
   ],
   "feedCell": "2-3"
  },
  "route": {
   "wave_mode": "不点波"
  },
  "routeMode": "none",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "8-1",
    "8-2"
   ]
  },
  "n_nodes": 56
 },
 "shatan2": {
  "label": "沙滩桑葚",
  "prefix": "st2_",
  "entry": "st2_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "大守卫菇",
    "大哥",
    "芦荟",
    "原豌",
    "桑葚",
    "橄榄坑",
    "毒藤"
   ],
   "deck2": []
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 大哥+原豌,桑葚(毒藤),芦荟,橄榄坑,-,-,-,-,-|大哥+原豌,桑葚(毒藤),大守卫菇,橄榄坑,-,-,-,-,-|大哥+原豌,桑葚(毒藤),桑葚(毒藤),橄榄坑,-,-,-,-,-|大哥+原豌,桑葚(毒藤),芦荟,橄榄坑,-,-,-,-,-|大哥+原豌,桑葚(毒藤),大守卫菇,橄榄坑,-,-,-,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "1-1",
     "slot": 3,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "1-1",
     "slot": 5,
     "pre": 200,
     "post": 0,
     "alt": "st2_大哥1_3"
    },
    {
     "t": "plant",
     "name": "大哥1_2",
     "cell": "1-2",
     "slot": 3,
     "pre": 0,
     "post": 0,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌1_2",
     "cell": "1-2",
     "slot": 5,
     "pre": 200,
     "post": 0,
     "alt": "st2_大哥1_4"
    },
    {
     "t": "plant",
     "name": "大哥1_3",
     "cell": "1-3",
     "slot": 3,
     "pre": 0,
     "post": 0,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌1_3",
     "cell": "1-3",
     "slot": 5,
     "pre": 200,
     "post": 0,
     "alt": "st2_大哥1_5"
    },
    {
     "t": "plant",
     "name": "大哥1_4",
     "cell": "1-4",
     "slot": 3,
     "pre": 0,
     "post": 0,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌1_4",
     "cell": "1-4",
     "slot": 5,
     "pre": 200,
     "post": 0,
     "alt": "st2_点波2"
    },
    {
     "t": "plant",
     "name": "大哥1_5",
     "cell": "1-5",
     "slot": 3,
     "pre": 0,
     "post": 0,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌1_5",
     "cell": "1-5",
     "slot": 5,
     "pre": 200,
     "post": 0
    },
    {
     "t": "wave",
     "name": "点波2"
    },
    {
     "t": "plant",
     "name": "大守卫菇",
     "cell": "3-2",
     "slot": 2,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "大守卫菇3_5",
     "cell": "3-5",
     "slot": 2,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "3-1",
     "slot": 4,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "芦荟3_4",
     "cell": "3-4",
     "slot": 4,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "桑葚",
     "cell": "2-5",
     "slot": 6,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "桑葚2_4",
     "cell": "2-4",
     "slot": 6,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "桑葚2_1",
     "cell": "2-1",
     "slot": 6,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "桑葚2_2",
     "cell": "2-2",
     "slot": 6,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "桑葚2_3",
     "cell": "2-3",
     "slot": 6,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "桑葚3_3",
     "cell": "3-3",
     "slot": 6,
     "pre": 0,
     "post": 0
    },
    {
     "t": "interleave",
     "name": "识别结算"
    },
    {
     "t": "plant",
     "name": "橄榄坑",
     "cell": "4-1",
     "slot": 7,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "橄榄坑4_2",
     "cell": "4-2",
     "slot": 7,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "橄榄坑4_3",
     "cell": "4-3",
     "slot": 7,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "橄榄坑4_4",
     "cell": "4-4",
     "slot": 7,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "橄榄坑4_5",
     "cell": "4-5",
     "slot": 7,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "毒藤",
     "cell": "2-1",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "毒藤2_2",
     "cell": "2-2",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "毒藤2_3",
     "cell": "2-3",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "毒藤3_3",
     "cell": "3-3",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "毒藤2_4",
     "cell": "2-4",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "plant",
     "name": "毒藤2_5",
     "cell": "2-5",
     "slot": 8,
     "pre": 0,
     "post": 0
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": []
  },
  "boss": {
   "feedSelect": true,
   "ops": [
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 0
    },
    {
     "t": "feed",
     "name": "boss_喂豆1_3",
     "cell": "1-3",
     "pre": 100,
     "post": 0,
     "loop": true
    }
   ],
   "feedCell": "1-3"
  },
  "route": {},
  "routeMode": "none",
  "n_nodes": 60
 },
 "binghe": {
  "label": "冰河",
  "prefix": "bh_",
  "entry": "bh_Entry",
  "slots": {
   "deck1": [
    "能量花",
    "珊瑚",
    "大哥",
    "芦荟",
    "原豌",
    "气流水仙花",
    "洋芋",
    "火豌"
   ],
   "deck2": [
    "能量花",
    "阳光蓓蕾",
    "大哥",
    "原豌",
    "洋芋",
    "南瓜头",
    "暗物质火龙果",
    "瓷砖萝卜"
   ]
  },
  "board": {
   "cols": 9,
   "rows": 5,
   "compact": "9x5 布阵: 珊瑚,大哥+原豌,芦荟,洋芋,气流水仙花,暗物质火龙果(南瓜头),-,-,-|珊瑚,大哥+原豌[瓷],洋芋,气流水仙花,芦荟,暗物质火龙果(南瓜头),-,-,-|珊瑚,大哥+原豌[瓷],洋芋,气流水仙花,暗物质火龙果,大哥(南瓜头)+火豌[瓷],-,能量花,能量花|珊瑚,大哥+原豌,芦荟,气流水仙花,洋芋,暗物质火龙果(南瓜头),-,-,-|珊瑚,大哥+原豌,气流水仙花,洋芋,芦荟,暗物质火龙果(南瓜头),-,-,-"
  },
  "order": {
   "deck1": [
    {
     "t": "wave",
     "name": "点波_初始"
    },
    {
     "t": "plant",
     "name": "抛花1",
     "cell": "8-3",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "抛花2",
     "cell": "9-3",
     "slot": 1,
     "pre": 100,
     "post": 100
    },
    {
     "t": "plant",
     "name": "大哥",
     "cell": "2-1",
     "slot": 3,
     "pre": 0,
     "post": 300
    },
    {
     "t": "plant",
     "name": "原豌",
     "cell": "2-1",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "bh_大哥2_3"
    },
    {
     "t": "plant",
     "name": "大哥2_2",
     "cell": "2-2",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_2",
     "cell": "2-2",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "bh_大哥6_3"
    },
    {
     "t": "plant",
     "name": "大哥2_3",
     "cell": "2-3",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_3",
     "cell": "2-3",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "bh_大哥2_4"
    },
    {
     "t": "plant",
     "name": "大哥6_3",
     "cell": "6-3",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "火豌",
     "cell": "6-3",
     "slot": 8,
     "pre": 200,
     "post": 100,
     "alt": "bh_大哥2_5"
    },
    {
     "t": "plant",
     "name": "大哥2_4",
     "cell": "2-4",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_4",
     "cell": "2-4",
     "slot": 5,
     "pre": 200,
     "post": 100,
     "alt": "bh_点波2"
    },
    {
     "t": "plant",
     "name": "大哥2_5",
     "cell": "2-5",
     "slot": 3,
     "pre": 0,
     "post": 300,
     "check": true
    },
    {
     "t": "plant",
     "name": "原豌2_5",
     "cell": "2-5",
     "slot": 5,
     "pre": 200,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波2"
    },
    {
     "t": "plant",
     "name": "珊瑚",
     "cell": "1-1",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_2",
     "cell": "1-2",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_3",
     "cell": "1-3",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_4",
     "cell": "1-4",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "珊瑚1_5",
     "cell": "1-5",
     "slot": 2,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟",
     "cell": "3-1",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟5_2",
     "cell": "5-2",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟3_4",
     "cell": "3-4",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "芦荟5_5",
     "cell": "5-5",
     "slot": 4,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花",
     "cell": "5-1",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花4_2",
     "cell": "4-2",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花4_3",
     "cell": "4-3",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花4_4",
     "cell": "4-4",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "气流水仙花3_5",
     "cell": "3-5",
     "slot": 6,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋",
     "cell": "5-4",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋4_5",
     "cell": "4-5",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋4_1",
     "cell": "4-1",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_2",
     "cell": "3-2",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "洋芋3_3",
     "cell": "3-3",
     "slot": 7,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5"
    }
   ],
   "deck2": [
    {
     "t": "wave",
     "name": "点波_初始_d2"
    },
    {
     "t": "plant",
     "name": "暗物质火龙果",
     "cell": "6-1",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果6_2",
     "cell": "6-2",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果5_3",
     "cell": "5-3",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果6_4",
     "cell": "6-4",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "暗物质火龙果6_5",
     "cell": "6-5",
     "slot": 15,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜",
     "cell": "2-2",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜2_3",
     "cell": "2-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "瓷砖萝卜6_3",
     "cell": "6-3",
     "slot": 16,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头",
     "cell": "6-1",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头6_2",
     "cell": "6-2",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头6_3",
     "cell": "6-3",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头6_4",
     "cell": "6-4",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "plant",
     "name": "南瓜头6_5",
     "cell": "6-5",
     "slot": 14,
     "pre": 0,
     "post": 100
    },
    {
     "t": "wave",
     "name": "点波5_d2"
    }
   ]
  },
  "boss": {
   "feedSelect": true,
   "ops": [
    {
     "t": "accel",
     "name": "boss_点加速",
     "post": 300
    },
    {
     "t": "stack",
     "name": "boss_叠种5_1",
     "cell": "5-1",
     "slot": 6,
     "pre": 0,
     "post": 50
    },
    {
     "t": "stack",
     "name": "boss_叠种2_2",
     "cell": "2-2",
     "slot": 8,
     "pre": 0,
     "post": 50
    },
    {
     "t": "stack",
     "name": "boss_叠种2_3",
     "cell": "2-3",
     "slot": 8,
     "pre": 0,
     "post": 50
    },
    {
     "t": "stack",
     "name": "boss_叠种2_2_2",
     "cell": "2-2",
     "slot": 8,
     "pre": 0,
     "post": 50
    },
    {
     "t": "stack",
     "name": "boss_叠种2_3_2",
     "cell": "2-3",
     "slot": 8,
     "pre": 0,
     "post": 50
    },
    {
     "t": "feed",
     "name": "boss_喂豆6_3",
     "cell": "6-3",
     "pre": 100,
     "post": 2500,
     "loop": true
    }
   ],
   "feedCell": "6-3"
  },
  "route": {
   "start_level": 1,
   "deck1_first": 20,
   "d2_tails": [
    3
   ],
   "boss_tails": [
    5,
    0
   ],
   "boss_feed_early": "bh_boss_叠种5_1",
   "boss_feed_late": "bh_boss_叠种5_1",
   "skip_same_deck": true,
   "wave_mode": "不点波"
  },
  "routeMode": "tail",
  "throw": {
   "on": true,
   "slot": 1,
   "cells": [
    "8-3",
    "9-3"
   ]
  },
  "n_nodes": 103
 }
};
