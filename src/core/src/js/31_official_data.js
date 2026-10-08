/* 自动生成：tools/gen_official.py —— MPZ 官方无尽任务画像（预设模式三套 + 通用框架选项目录 + pipeline 概览）。只读。 */
var WJP_OFFICIAL = {
 "generated": "2026-09",
 "base": "resource/",
 "modes": [
  "预设模式",
  "无尽通用框架"
 ],
 "worlds": [
  "神秘埃及",
  "海盗港湾",
  "狂野西部",
  "功夫世界",
  "未来世界",
  "黑暗时代",
  "巨浪沙滩",
  "冰河世界",
  "天空之城",
  "失落之城",
  "摇滚年代",
  "恐龙危机",
  "摩登世界",
  "蒸汽时代",
  "复兴时代",
  "童话世界"
 ],
 "plantConfig": [
  {
   "name": "原大桑葚",
   "subOptions": [
    "原大_boss关是否需要喂豆",
    "原大_小关是否抛花",
    "原大_是否开棱镜塔",
    "原大_是否需要补植物"
   ]
  },
  {
   "name": "心叶兰塔黄",
   "subOptions": [
    "HeartTower_小关喂豆间隔",
    "boss关喂豆间隔",
    "后期是否种蓓蕾",
    "心塔阵型选择",
    "起始关卡选择"
   ]
  },
  {
   "name": "塔黄香蕉(无心叶兰)",
   "subOptions": [
    "tower_banana_boss关是否切换喂豆间隔",
    "tower_banana_小关是否切换喂豆间隔"
   ]
  }
 ],
 "presets": [
  {
   "key": "yuan_big",
   "label": "原大桑葚",
   "taskFiles": [
    "task/Endless/preset/yuan_big/preset_yuan_big.json"
   ],
   "options": [
    {
     "name": "原大_小关是否抛花",
     "type": "switch",
     "label": "普通关是否抛花",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ]
    },
    {
     "name": "原大_是否开棱镜塔",
     "type": "switch",
     "label": "小关是否棱镜塔",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ]
    },
    {
     "name": "原大_boss关是否需要喂豆",
     "type": "switch",
     "label": "boss关是否需要喂豆",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "原大_boss关喂豆位置"
     ]
    },
    {
     "name": "原大_boss关喂豆位置",
     "type": "input",
     "label": "行列坐标",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "inputs": [
      "列",
      "行"
     ]
    },
    {
     "name": "原大_是否需要补植物",
     "type": "switch",
     "label": "是否需要补植物",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽7_补植物",
      "卡槽8_补植物"
     ]
    },
    {
     "name": "卡槽7_补植物",
     "type": "switch",
     "label": "卡槽7补植物位置",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽7_1",
      "卡槽7_2",
      "卡槽7_3",
      "卡槽7_4",
      "卡槽7_5"
     ]
    },
    {
     "name": "卡槽7_1",
     "type": "switch",
     "label": "第1个植物补哪",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽7种第1个植物"
     ]
    },
    {
     "name": "卡槽7种第1个植物",
     "type": "input",
     "label": "行列坐标",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "inputs": [
      "列",
      "行"
     ]
    },
    {
     "name": "卡槽7_2",
     "type": "switch",
     "label": "第2个植物补哪",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽7种第2个植物"
     ]
    },
    {
     "name": "卡槽7种第2个植物",
     "type": "input",
     "label": "行列坐标",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "inputs": [
      "列",
      "行"
     ]
    },
    {
     "name": "卡槽7_3",
     "type": "switch",
     "label": "第3个植物补哪",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽7种第3个植物"
     ]
    },
    {
     "name": "卡槽7种第3个植物",
     "type": "input",
     "label": "行列坐标",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "inputs": [
      "列",
      "行"
     ]
    },
    {
     "name": "卡槽7_4",
     "type": "switch",
     "label": "第4个植物补哪",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽7种第4个植物"
     ]
    },
    {
     "name": "卡槽7种第4个植物",
     "type": "input",
     "label": "行列坐标",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "inputs": [
      "列",
      "行"
     ]
    },
    {
     "name": "卡槽7_5",
     "type": "switch",
     "label": "第5个植物补哪",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽7种第5个植物"
     ]
    },
    {
     "name": "卡槽7种第5个植物",
     "type": "input",
     "label": "行列坐标",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "inputs": [
      "列",
      "行"
     ]
    },
    {
     "name": "卡槽8_补植物",
     "type": "switch",
     "label": "卡槽8补植物位置",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽8_1",
      "卡槽8_2",
      "卡槽8_3",
      "卡槽8_4",
      "卡槽8_5"
     ]
    },
    {
     "name": "卡槽8_1",
     "type": "switch",
     "label": "第1个植物补哪",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽8种第1个植物"
     ]
    },
    {
     "name": "卡槽8种第1个植物",
     "type": "input",
     "label": "行列坐标",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "inputs": [
      "列",
      "行"
     ]
    },
    {
     "name": "卡槽8_2",
     "type": "switch",
     "label": "第2个植物补哪",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽8种第2个植物"
     ]
    },
    {
     "name": "卡槽8种第2个植物",
     "type": "input",
     "label": "行列坐标",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "inputs": [
      "列",
      "行"
     ]
    },
    {
     "name": "卡槽8_3",
     "type": "switch",
     "label": "第3个植物补哪",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽8种第3个植物"
     ]
    },
    {
     "name": "卡槽8种第3个植物",
     "type": "input",
     "label": "行列坐标",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "inputs": [
      "列",
      "行"
     ]
    },
    {
     "name": "卡槽8_4",
     "type": "switch",
     "label": "第4个植物补哪",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽8种第4个植物"
     ]
    },
    {
     "name": "卡槽8种第4个植物",
     "type": "input",
     "label": "行列坐标",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "inputs": [
      "列",
      "行"
     ]
    },
    {
     "name": "卡槽8_5",
     "type": "switch",
     "label": "第5个植物补哪",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "卡槽8种第5个植物"
     ]
    },
    {
     "name": "卡槽8种第5个植物",
     "type": "input",
     "label": "行列坐标",
     "file": "task/Endless/preset/yuan_big/preset_yuan_big.json",
     "inputs": [
      "列",
      "行"
     ]
    }
   ]
  },
  {
   "key": "heart_tower",
   "label": "心塔（心叶兰塔黄）",
   "taskFiles": [
    "task/Endless/preset/heart_tower/preset_heart_tower.json"
   ],
   "options": [
    {
     "name": "心塔阵型选择",
     "type": "select",
     "label": "",
     "file": "task/Endless/preset/heart_tower/preset_heart_tower.json",
     "cases": [
      "一号阵",
      "二号阵(推荐)"
     ]
    },
    {
     "name": "后期是否种蓓蕾",
     "type": "switch",
     "label": "后期是否种蓓蕾",
     "file": "task/Endless/preset/heart_tower/preset_heart_tower.json",
     "cases": [
      "No",
      "Yes"
     ]
    },
    {
     "name": "HeartTower_小关喂豆间隔",
     "type": "select",
     "label": "小关喂豆间隔",
     "file": "task/Endless/preset/heart_tower/preset_heart_tower.json",
     "cases": [
      "5秒",
      "6秒",
      "7秒",
      "8秒",
      "9秒",
      "10秒",
      "11秒"
     ]
    },
    {
     "name": "boss关喂豆间隔",
     "type": "select",
     "label": "boss关喂豆间隔",
     "file": "task/Endless/preset/heart_tower/preset_heart_tower.json",
     "cases": [
      "4秒",
      "5秒",
      "6秒",
      "7秒",
      "8秒",
      "9秒",
      "10秒"
     ]
    },
    {
     "name": "起始关卡选择",
     "type": "select",
     "label": "起始关卡",
     "file": "task/Endless/preset/heart_tower/preset_heart_tower.json",
     "cases": [
      "1关",
      "2关",
      "3-149关"
     ]
    }
   ]
  },
  {
   "key": "banana_tower",
   "label": "塔蕉（塔黄香蕉）",
   "taskFiles": [
    "task/Endless/preset/banana_tower/preset_banana_tower.json"
   ],
   "options": [
    {
     "name": "tower_banana_boss关是否切换喂豆间隔",
     "type": "switch",
     "label": "boss关喂豆间隔",
     "file": "task/Endless/preset/banana_tower/preset_banana_tower.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "tower_banana_boss关喂豆间隔"
     ]
    },
    {
     "name": "tower_banana_boss关喂豆间隔",
     "type": "input",
     "label": "boss关喂豆间隔",
     "file": "task/Endless/preset/banana_tower/preset_banana_tower.json",
     "inputs": [
      "喂豆间隔"
     ]
    },
    {
     "name": "tower_banana_小关是否切换喂豆间隔",
     "type": "switch",
     "label": "小关喂豆间隔",
     "file": "task/Endless/preset/banana_tower/preset_banana_tower.json",
     "cases": [
      "No",
      "Yes"
     ],
     "subOptions": [
      "tower_banana_小关喂豆间隔"
     ]
    },
    {
     "name": "tower_banana_小关喂豆间隔",
     "type": "input",
     "label": "小关喂豆间隔",
     "file": "task/Endless/preset/banana_tower/preset_banana_tower.json",
     "inputs": [
      "喂豆间隔"
     ]
    }
   ]
  }
 ],
 "framework": {
  "options": [
   {
    "name": "自定义布阵",
    "type": "switch",
    "label": "自定义布阵",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_boss关是否喂豆",
     "frame_wj_custom_前期使用编队",
     "frame_wj_custom_回到后期",
     "frame_wj_custom_回到后期切换编队",
     "frame_wj_custom_布完阵是否喂豆",
     "frame_wj_custom_是否使用铲子1",
     "frame_wj_custom_是否使用铲子2",
     "frame_wj_custom_是否种守卫菇",
     "frame_wj_custom_球果切换形态",
     "卡1种植",
     "卡2种植",
     "卡3种植",
     "卡4种植",
     "卡5种植"
    ]
   },
   {
    "name": "frame_wj_custom_前期使用编队",
    "type": "switch",
    "label": "前期使用编队",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_前期切换到第几编队"
    ]
   },
   {
    "name": "frame_wj_custom_前期切换到第几编队",
    "type": "input",
    "label": "第几编队",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "编队"
    ]
   },
   {
    "name": "frame_wj_custom_球果切换形态",
    "type": "switch",
    "label": "球果是否需要切换形态",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_球果位置"
    ]
   },
   {
    "name": "frame_wj_custom_球果位置",
    "type": "select",
    "label": "球果形态",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "恐龙形态",
     "幽灵马形态",
     "水母形态"
    ]
   },
   {
    "name": "frame_wj_custom_是否使用铲子1",
    "type": "switch",
    "label": "种守卫菇前使用铲子",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子1",
     "frame_wj_custom_使用铲子2",
     "frame_wj_custom_使用铲子3",
     "frame_wj_custom_使用铲子4",
     "frame_wj_custom_使用铲子5"
    ]
   },
   {
    "name": "frame_wj_custom_是否使用铲子2",
    "type": "switch",
    "label": "种守卫菇后使用铲子",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子10",
     "frame_wj_custom_使用铲子6",
     "frame_wj_custom_使用铲子7",
     "frame_wj_custom_使用铲子8",
     "frame_wj_custom_使用铲子9"
    ]
   },
   {
    "name": "frame_wj_custom_布完阵是否喂豆",
    "type": "switch",
    "label": "小关是否喂豆",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_喂豆位置"
    ]
   },
   {
    "name": "frame_wj_custom_boss关是否喂豆",
    "type": "switch",
    "label": "boss关是否喂豆",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_boss_custom_喂豆位置",
     "frame_wj_boss_custom_喂豆间隔"
    ]
   },
   {
    "name": "frame_wj_boss_custom_喂豆间隔",
    "type": "input",
    "label": "喂豆间隔（秒）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "秒数"
    ]
   },
   {
    "name": "frame_wj_custom_是否种守卫菇",
    "type": "switch",
    "label": "是否种守卫菇",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_种守卫菇位置1",
     "frame_wj_custom_种守卫菇位置2",
     "frame_wj_custom_种守卫菇位置3",
     "frame_wj_custom_种守卫菇位置4",
     "frame_wj_custom_种守卫菇位置5"
    ]
   },
   {
    "name": "frame_wj_custom_回到后期",
    "type": "input",
    "label": "第几关布好阵",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "关卡"
    ]
   },
   {
    "name": "frame_wj_custom_回到后期切换编队",
    "type": "switch",
    "label": "布完阵切换编队",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_切换到第几编队"
    ]
   },
   {
    "name": "frame_wj_custom_切换到第几编队",
    "type": "input",
    "label": "第几编队",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "编队"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子1",
    "type": "switch",
    "label": "铲子1",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子1坐标"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子1坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子2",
    "type": "switch",
    "label": "铲子2",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子2坐标"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子2坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子3",
    "type": "switch",
    "label": "铲子3",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子3坐标"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子3坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子4",
    "type": "switch",
    "label": "铲子4",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子4坐标"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子4坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子5",
    "type": "switch",
    "label": "铲子5",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子5坐标"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子5坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子6",
    "type": "switch",
    "label": "铲子6",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子6坐标"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子6坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子7",
    "type": "switch",
    "label": "铲子7",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子7坐标"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子7坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子8",
    "type": "switch",
    "label": "铲子8",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子8坐标"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子8坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子9",
    "type": "switch",
    "label": "铲子9",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子9坐标"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子9坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子10",
    "type": "switch",
    "label": "铲子10",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_使用铲子10坐标"
    ]
   },
   {
    "name": "frame_wj_custom_使用铲子10坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_种守卫菇位置1",
    "type": "switch",
    "label": "种守卫菇_位置1",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_种守卫菇位置1坐标"
    ]
   },
   {
    "name": "frame_wj_custom_种守卫菇位置1坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_种守卫菇位置2",
    "type": "switch",
    "label": "种守卫菇_位置2",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_种守卫菇位置2坐标"
    ]
   },
   {
    "name": "frame_wj_custom_种守卫菇位置2坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_种守卫菇位置3",
    "type": "switch",
    "label": "种守卫菇_位置3",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_种守卫菇位置3坐标"
    ]
   },
   {
    "name": "frame_wj_custom_种守卫菇位置3坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_种守卫菇位置4",
    "type": "switch",
    "label": "种守卫菇_位置4",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_种守卫菇位置4坐标"
    ]
   },
   {
    "name": "frame_wj_custom_种守卫菇位置4坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_种守卫菇位置5",
    "type": "switch",
    "label": "种守卫菇_位置5",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_种守卫菇位置5坐标"
    ]
   },
   {
    "name": "frame_wj_custom_种守卫菇位置5坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_custom_喂豆位置",
    "type": "switch",
    "label": "喂豆位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_custom_喂豆位置坐标"
    ]
   },
   {
    "name": "frame_wj_custom_喂豆位置坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_wj_boss_custom_喂豆位置",
    "type": "switch",
    "label": "boss关喂豆位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_wj_boss_custom_喂豆位置坐标"
    ]
   },
   {
    "name": "frame_wj_boss_custom_喂豆位置坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种植",
    "type": "switch",
    "label": "卡1种植",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第10次",
     "卡1种第11次",
     "卡1种第12次",
     "卡1种第13次",
     "卡1种第14次",
     "卡1种第15次",
     "卡1种第16次",
     "卡1种第17次",
     "卡1种第18次",
     "卡1种第19次",
     "卡1种第1次",
     "卡1种第20次",
     "卡1种第21次",
     "卡1种第22次"
    ]
   },
   {
    "name": "卡1种第1次",
    "type": "switch",
    "label": "第1次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第1次坐标"
    ]
   },
   {
    "name": "卡1种第1次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第2次",
    "type": "switch",
    "label": "第2次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第2次坐标"
    ]
   },
   {
    "name": "卡1种第2次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第3次",
    "type": "switch",
    "label": "第3次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第3次坐标"
    ]
   },
   {
    "name": "卡1种第3次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第4次",
    "type": "switch",
    "label": "第4次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第4次坐标"
    ]
   },
   {
    "name": "卡1种第4次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第5次",
    "type": "switch",
    "label": "第5次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第5次坐标"
    ]
   },
   {
    "name": "卡1种第5次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第6次",
    "type": "switch",
    "label": "第6次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第6次坐标"
    ]
   },
   {
    "name": "卡1种第6次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第7次",
    "type": "switch",
    "label": "第7次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第7次坐标"
    ]
   },
   {
    "name": "卡1种第7次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第8次",
    "type": "switch",
    "label": "第8次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第8次坐标"
    ]
   },
   {
    "name": "卡1种第8次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第9次",
    "type": "switch",
    "label": "第9次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第9次坐标"
    ]
   },
   {
    "name": "卡1种第9次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第10次",
    "type": "switch",
    "label": "第10次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第10次坐标"
    ]
   },
   {
    "name": "卡1种第10次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第11次",
    "type": "switch",
    "label": "第11次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第11次坐标"
    ]
   },
   {
    "name": "卡1种第11次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第12次",
    "type": "switch",
    "label": "第12次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第12次坐标"
    ]
   },
   {
    "name": "卡1种第12次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第13次",
    "type": "switch",
    "label": "第13次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第13次坐标"
    ]
   },
   {
    "name": "卡1种第13次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第14次",
    "type": "switch",
    "label": "第14次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第14次坐标"
    ]
   },
   {
    "name": "卡1种第14次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第15次",
    "type": "switch",
    "label": "第15次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第15次坐标"
    ]
   },
   {
    "name": "卡1种第15次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第16次",
    "type": "switch",
    "label": "第16次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第16次坐标"
    ]
   },
   {
    "name": "卡1种第16次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第17次",
    "type": "switch",
    "label": "第17次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第17次坐标"
    ]
   },
   {
    "name": "卡1种第17次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第18次",
    "type": "switch",
    "label": "第18次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第18次坐标"
    ]
   },
   {
    "name": "卡1种第18次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第19次",
    "type": "switch",
    "label": "第19次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第19次坐标"
    ]
   },
   {
    "name": "卡1种第19次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第20次",
    "type": "switch",
    "label": "第20次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第20次坐标"
    ]
   },
   {
    "name": "卡1种第20次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第21次",
    "type": "switch",
    "label": "第21次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第21次坐标"
    ]
   },
   {
    "name": "卡1种第21次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第22次",
    "type": "switch",
    "label": "第22次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第22次坐标"
    ]
   },
   {
    "name": "卡1种第22次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第23次",
    "type": "switch",
    "label": "第23次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第23次坐标"
    ]
   },
   {
    "name": "卡1种第23次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第24次",
    "type": "switch",
    "label": "第24次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第24次坐标"
    ]
   },
   {
    "name": "卡1种第24次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡1种第25次",
    "type": "switch",
    "label": "第25次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡1种第25次坐标"
    ]
   },
   {
    "name": "卡1种第25次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种植",
    "type": "switch",
    "label": "卡2种植",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第10次",
     "卡2种第11次",
     "卡2种第12次",
     "卡2种第13次",
     "卡2种第14次",
     "卡2种第15次",
     "卡2种第16次",
     "卡2种第17次",
     "卡2种第18次",
     "卡2种第19次",
     "卡2种第1次",
     "卡2种第20次",
     "卡2种第21次",
     "卡2种第22次"
    ]
   },
   {
    "name": "卡2种第1次",
    "type": "switch",
    "label": "第1次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第1次坐标"
    ]
   },
   {
    "name": "卡2种第1次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第2次",
    "type": "switch",
    "label": "第2次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第2次坐标"
    ]
   },
   {
    "name": "卡2种第2次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第3次",
    "type": "switch",
    "label": "第3次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第3次坐标"
    ]
   },
   {
    "name": "卡2种第3次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第4次",
    "type": "switch",
    "label": "第4次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第4次坐标"
    ]
   },
   {
    "name": "卡2种第4次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第5次",
    "type": "switch",
    "label": "第5次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第5次坐标"
    ]
   },
   {
    "name": "卡2种第5次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第6次",
    "type": "switch",
    "label": "第6次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第6次坐标"
    ]
   },
   {
    "name": "卡2种第6次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第7次",
    "type": "switch",
    "label": "第7次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第7次坐标"
    ]
   },
   {
    "name": "卡2种第7次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第8次",
    "type": "switch",
    "label": "第8次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第8次坐标"
    ]
   },
   {
    "name": "卡2种第8次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第9次",
    "type": "switch",
    "label": "第9次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第9次坐标"
    ]
   },
   {
    "name": "卡2种第9次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第10次",
    "type": "switch",
    "label": "第10次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第10次坐标"
    ]
   },
   {
    "name": "卡2种第10次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第11次",
    "type": "switch",
    "label": "第11次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第11次坐标"
    ]
   },
   {
    "name": "卡2种第11次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第12次",
    "type": "switch",
    "label": "第12次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第12次坐标"
    ]
   },
   {
    "name": "卡2种第12次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第13次",
    "type": "switch",
    "label": "第13次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第13次坐标"
    ]
   },
   {
    "name": "卡2种第13次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第14次",
    "type": "switch",
    "label": "第14次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第14次坐标"
    ]
   },
   {
    "name": "卡2种第14次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第15次",
    "type": "switch",
    "label": "第15次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第15次坐标"
    ]
   },
   {
    "name": "卡2种第15次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第16次",
    "type": "switch",
    "label": "第16次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第16次坐标"
    ]
   },
   {
    "name": "卡2种第16次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第17次",
    "type": "switch",
    "label": "第17次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第17次坐标"
    ]
   },
   {
    "name": "卡2种第17次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第18次",
    "type": "switch",
    "label": "第18次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第18次坐标"
    ]
   },
   {
    "name": "卡2种第18次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第19次",
    "type": "switch",
    "label": "第19次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第19次坐标"
    ]
   },
   {
    "name": "卡2种第19次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第20次",
    "type": "switch",
    "label": "第20次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第20次坐标"
    ]
   },
   {
    "name": "卡2种第20次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第21次",
    "type": "switch",
    "label": "第21次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第21次坐标"
    ]
   },
   {
    "name": "卡2种第21次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第22次",
    "type": "switch",
    "label": "第22次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第22次坐标"
    ]
   },
   {
    "name": "卡2种第22次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第23次",
    "type": "switch",
    "label": "第23次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第23次坐标"
    ]
   },
   {
    "name": "卡2种第23次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第24次",
    "type": "switch",
    "label": "第24次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第24次坐标"
    ]
   },
   {
    "name": "卡2种第24次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡2种第25次",
    "type": "switch",
    "label": "第25次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡2种第25次坐标"
    ]
   },
   {
    "name": "卡2种第25次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡3种植",
    "type": "switch",
    "label": "卡3种植",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡3种第10次",
     "卡3种第1次",
     "卡3种第2次",
     "卡3种第3次",
     "卡3种第4次",
     "卡3种第5次",
     "卡3种第6次",
     "卡3种第7次",
     "卡3种第8次",
     "卡3种第9次"
    ]
   },
   {
    "name": "卡3种第1次",
    "type": "switch",
    "label": "第1次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡3种第1次坐标"
    ]
   },
   {
    "name": "卡3种第1次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡3种第2次",
    "type": "switch",
    "label": "第2次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡3种第2次坐标"
    ]
   },
   {
    "name": "卡3种第2次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡3种第3次",
    "type": "switch",
    "label": "第3次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡3种第3次坐标"
    ]
   },
   {
    "name": "卡3种第3次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡3种第4次",
    "type": "switch",
    "label": "第4次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡3种第4次坐标"
    ]
   },
   {
    "name": "卡3种第4次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡3种第5次",
    "type": "switch",
    "label": "第5次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡3种第5次坐标"
    ]
   },
   {
    "name": "卡3种第5次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡3种第6次",
    "type": "switch",
    "label": "第6次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡3种第6次坐标"
    ]
   },
   {
    "name": "卡3种第6次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡3种第7次",
    "type": "switch",
    "label": "第7次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡3种第7次坐标"
    ]
   },
   {
    "name": "卡3种第7次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡3种第8次",
    "type": "switch",
    "label": "第8次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡3种第8次坐标"
    ]
   },
   {
    "name": "卡3种第8次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡3种第9次",
    "type": "switch",
    "label": "第9次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡3种第9次坐标"
    ]
   },
   {
    "name": "卡3种第9次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡3种第10次",
    "type": "switch",
    "label": "第10次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡3种第10次坐标"
    ]
   },
   {
    "name": "卡3种第10次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡4种植",
    "type": "switch",
    "label": "卡4种植",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡4种第10次",
     "卡4种第1次",
     "卡4种第2次",
     "卡4种第3次",
     "卡4种第4次",
     "卡4种第5次",
     "卡4种第6次",
     "卡4种第7次",
     "卡4种第8次",
     "卡4种第9次"
    ]
   },
   {
    "name": "卡4种第1次",
    "type": "switch",
    "label": "第1次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡4种第1次坐标"
    ]
   },
   {
    "name": "卡4种第1次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡4种第2次",
    "type": "switch",
    "label": "第2次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡4种第2次坐标"
    ]
   },
   {
    "name": "卡4种第2次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡4种第3次",
    "type": "switch",
    "label": "第3次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡4种第3次坐标"
    ]
   },
   {
    "name": "卡4种第3次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡4种第4次",
    "type": "switch",
    "label": "第4次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡4种第4次坐标"
    ]
   },
   {
    "name": "卡4种第4次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡4种第5次",
    "type": "switch",
    "label": "第5次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡4种第5次坐标"
    ]
   },
   {
    "name": "卡4种第5次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡4种第6次",
    "type": "switch",
    "label": "第6次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡4种第6次坐标"
    ]
   },
   {
    "name": "卡4种第6次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡4种第7次",
    "type": "switch",
    "label": "第7次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡4种第7次坐标"
    ]
   },
   {
    "name": "卡4种第7次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡4种第8次",
    "type": "switch",
    "label": "第8次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡4种第8次坐标"
    ]
   },
   {
    "name": "卡4种第8次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡4种第9次",
    "type": "switch",
    "label": "第9次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡4种第9次坐标"
    ]
   },
   {
    "name": "卡4种第9次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡4种第10次",
    "type": "switch",
    "label": "第10次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡4种第10次坐标"
    ]
   },
   {
    "name": "卡4种第10次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡5种植",
    "type": "switch",
    "label": "卡5种植",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡5种第10次",
     "卡5种第1次",
     "卡5种第2次",
     "卡5种第3次",
     "卡5种第4次",
     "卡5种第5次",
     "卡5种第6次",
     "卡5种第7次",
     "卡5种第8次",
     "卡5种第9次"
    ]
   },
   {
    "name": "卡5种第1次",
    "type": "switch",
    "label": "第1次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡5种第1次坐标"
    ]
   },
   {
    "name": "卡5种第1次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡5种第2次",
    "type": "switch",
    "label": "第2次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡5种第2次坐标"
    ]
   },
   {
    "name": "卡5种第2次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡5种第3次",
    "type": "switch",
    "label": "第3次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡5种第3次坐标"
    ]
   },
   {
    "name": "卡5种第3次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡5种第4次",
    "type": "switch",
    "label": "第4次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡5种第4次坐标"
    ]
   },
   {
    "name": "卡5种第4次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡5种第5次",
    "type": "switch",
    "label": "第5次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡5种第5次坐标"
    ]
   },
   {
    "name": "卡5种第5次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡5种第6次",
    "type": "switch",
    "label": "第6次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡5种第6次坐标"
    ]
   },
   {
    "name": "卡5种第6次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡5种第7次",
    "type": "switch",
    "label": "第7次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡5种第7次坐标"
    ]
   },
   {
    "name": "卡5种第7次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡5种第8次",
    "type": "switch",
    "label": "第8次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡5种第8次坐标"
    ]
   },
   {
    "name": "卡5种第8次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡5种第9次",
    "type": "switch",
    "label": "第9次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡5种第9次坐标"
    ]
   },
   {
    "name": "卡5种第9次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡5种第10次",
    "type": "switch",
    "label": "第10次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡5种第10次坐标"
    ]
   },
   {
    "name": "卡5种第10次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡6种植",
    "type": "switch",
    "label": "卡6种植",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡6种第10次",
     "卡6种第1次",
     "卡6种第2次",
     "卡6种第3次",
     "卡6种第4次",
     "卡6种第5次",
     "卡6种第6次",
     "卡6种第7次",
     "卡6种第8次",
     "卡6种第9次"
    ]
   },
   {
    "name": "卡6种第1次",
    "type": "switch",
    "label": "第1次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡6种第1次坐标"
    ]
   },
   {
    "name": "卡6种第1次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡6种第2次",
    "type": "switch",
    "label": "第2次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡6种第2次坐标"
    ]
   },
   {
    "name": "卡6种第2次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡6种第3次",
    "type": "switch",
    "label": "第3次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡6种第3次坐标"
    ]
   },
   {
    "name": "卡6种第3次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡6种第4次",
    "type": "switch",
    "label": "第4次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡6种第4次坐标"
    ]
   },
   {
    "name": "卡6种第4次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡6种第5次",
    "type": "switch",
    "label": "第5次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡6种第5次坐标"
    ]
   },
   {
    "name": "卡6种第5次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡6种第6次",
    "type": "switch",
    "label": "第6次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡6种第6次坐标"
    ]
   },
   {
    "name": "卡6种第6次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡6种第7次",
    "type": "switch",
    "label": "第7次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡6种第7次坐标"
    ]
   },
   {
    "name": "卡6种第7次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡6种第8次",
    "type": "switch",
    "label": "第8次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡6种第8次坐标"
    ]
   },
   {
    "name": "卡6种第8次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡6种第9次",
    "type": "switch",
    "label": "第9次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡6种第9次坐标"
    ]
   },
   {
    "name": "卡6种第9次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡6种第10次",
    "type": "switch",
    "label": "第10次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡6种第10次坐标"
    ]
   },
   {
    "name": "卡6种第10次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡7种植",
    "type": "switch",
    "label": "卡7种植",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡7种第10次",
     "卡7种第1次",
     "卡7种第2次",
     "卡7种第3次",
     "卡7种第4次",
     "卡7种第5次",
     "卡7种第6次",
     "卡7种第7次",
     "卡7种第8次",
     "卡7种第9次"
    ]
   },
   {
    "name": "卡7种第1次",
    "type": "switch",
    "label": "第1次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡7种第1次坐标"
    ]
   },
   {
    "name": "卡7种第1次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡7种第2次",
    "type": "switch",
    "label": "第2次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡7种第2次坐标"
    ]
   },
   {
    "name": "卡7种第2次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡7种第3次",
    "type": "switch",
    "label": "第3次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡7种第3次坐标"
    ]
   },
   {
    "name": "卡7种第3次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡7种第4次",
    "type": "switch",
    "label": "第4次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡7种第4次坐标"
    ]
   },
   {
    "name": "卡7种第4次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡7种第5次",
    "type": "switch",
    "label": "第5次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡7种第5次坐标"
    ]
   },
   {
    "name": "卡7种第5次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡7种第6次",
    "type": "switch",
    "label": "第6次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡7种第6次坐标"
    ]
   },
   {
    "name": "卡7种第6次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡7种第7次",
    "type": "switch",
    "label": "第7次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡7种第7次坐标"
    ]
   },
   {
    "name": "卡7种第7次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡7种第8次",
    "type": "switch",
    "label": "第8次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡7种第8次坐标"
    ]
   },
   {
    "name": "卡7种第8次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡7种第9次",
    "type": "switch",
    "label": "第9次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡7种第9次坐标"
    ]
   },
   {
    "name": "卡7种第9次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡7种第10次",
    "type": "switch",
    "label": "第10次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡7种第10次坐标"
    ]
   },
   {
    "name": "卡7种第10次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡8种植",
    "type": "switch",
    "label": "卡8种植",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡8种第10次",
     "卡8种第1次",
     "卡8种第2次",
     "卡8种第3次",
     "卡8种第4次",
     "卡8种第5次",
     "卡8种第6次",
     "卡8种第7次",
     "卡8种第8次",
     "卡8种第9次"
    ]
   },
   {
    "name": "卡8种第1次",
    "type": "switch",
    "label": "第1次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡8种第1次坐标"
    ]
   },
   {
    "name": "卡8种第1次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡8种第2次",
    "type": "switch",
    "label": "第2次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡8种第2次坐标"
    ]
   },
   {
    "name": "卡8种第2次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡8种第3次",
    "type": "switch",
    "label": "第3次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡8种第3次坐标"
    ]
   },
   {
    "name": "卡8种第3次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡8种第4次",
    "type": "switch",
    "label": "第4次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡8种第4次坐标"
    ]
   },
   {
    "name": "卡8种第4次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡8种第5次",
    "type": "switch",
    "label": "第5次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡8种第5次坐标"
    ]
   },
   {
    "name": "卡8种第5次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡8种第6次",
    "type": "switch",
    "label": "第6次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡8种第6次坐标"
    ]
   },
   {
    "name": "卡8种第6次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡8种第7次",
    "type": "switch",
    "label": "第7次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡8种第7次坐标"
    ]
   },
   {
    "name": "卡8种第7次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡8种第8次",
    "type": "switch",
    "label": "第8次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡8种第8次坐标"
    ]
   },
   {
    "name": "卡8种第8次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡8种第9次",
    "type": "switch",
    "label": "第9次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡8种第9次坐标"
    ]
   },
   {
    "name": "卡8种第9次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡8种第10次",
    "type": "switch",
    "label": "第10次种植位置",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡8种第10次坐标"
    ]
   },
   {
    "name": "卡8种第10次坐标",
    "type": "input",
    "label": "坐标（列-行）",
    "file": "task/Endless/framework/custom/frame_custom.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "是否抛花",
    "type": "switch",
    "label": "",
    "file": "task/Endless/framework/frame/Flower.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "boss关是否抛花",
     "小关是否抛花",
     "识别能量花卡槽位置"
    ]
   },
   {
    "name": "小关是否抛花",
    "type": "switch",
    "label": "小关是否抛花",
    "file": "task/Endless/framework/frame/Flower.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "1花位置",
     "2花位置"
    ]
   },
   {
    "name": "1花位置",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Flower.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "2花位置",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Flower.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "boss关是否抛花",
    "type": "switch",
    "label": "",
    "file": "task/Endless/framework/frame/Flower.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "boss关_1花位置",
     "boss关_2花位置",
     "boss关_3花位置",
     "boss关_4花位置"
    ]
   },
   {
    "name": "boss关_1花位置",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Flower.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "boss关_2花位置",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Flower.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "boss关_3花位置",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Flower.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "boss关_4花位置",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Flower.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "是否魔甘收尾(牢玩家专属)",
    "type": "switch",
    "label": "是否魔甘收尾(牢玩家专属)",
    "file": "task/Endless/framework/frame/Magic_Gan.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "使用三叶草",
     "多少秒后种魔甘",
     "魔甘高级选项"
    ]
   },
   {
    "name": "魔甘高级选项",
    "type": "switch",
    "label": "",
    "file": "task/Endless/framework/frame/Magic_Gan.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "甜薯1种植位置",
     "甜薯2种植位置",
     "识别魔甘卡槽位置",
     "飓风甘蓝1种植位置",
     "飓风甘蓝2种植位置",
     "魔甘前使用能量豆",
     "魔甘失败后是否重开"
    ]
   },
   {
    "name": "魔甘失败后是否重开",
    "type": "switch",
    "label": "",
    "file": "task/Endless/framework/frame/Magic_Gan.json",
    "cases": [
     "Yes",
     "No"
    ]
   },
   {
    "name": "甜薯1种植位置",
    "type": "input",
    "label": "甜薯1种植位置",
    "file": "task/Endless/framework/frame/Magic_Gan.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "甜薯2种植位置",
    "type": "input",
    "label": "甜薯2种植位置",
    "file": "task/Endless/framework/frame/Magic_Gan.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "飓风甘蓝1种植位置",
    "type": "input",
    "label": "飓风甘蓝1种植位置",
    "file": "task/Endless/framework/frame/Magic_Gan.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "飓风甘蓝2种植位置",
    "type": "input",
    "label": "飓风甘蓝2种植位置",
    "file": "task/Endless/framework/frame/Magic_Gan.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "多少秒后种魔甘",
    "type": "input",
    "label": "",
    "file": "task/Endless/framework/frame/Magic_Gan.json",
    "inputs": [
     "秒"
    ]
   },
   {
    "name": "使用三叶草",
    "type": "switch",
    "label": "",
    "file": "task/Endless/framework/frame/Magic_Gan.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "识别三叶草卡槽位置"
    ]
   },
   {
    "name": "魔甘前使用能量豆",
    "type": "switch",
    "label": "",
    "file": "task/Endless/framework/frame/Magic_Gan.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "魔甘前喂豆位置"
    ]
   },
   {
    "name": "魔甘前喂豆位置",
    "type": "input",
    "label": "魔甘前喂豆位置",
    "file": "task/Endless/framework/frame/Magic_Gan.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "是否需要补植物",
    "type": "switch",
    "label": "是否需要补植物",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽2_补植物",
     "frame_卡槽3_补植物",
     "frame_卡槽4_补植物",
     "frame_卡槽5_补植物",
     "frame_卡槽6_补植物",
     "frame_卡槽7_补植物",
     "frame_卡槽8_补植物",
     "frame_球果切换形态",
     "铲除植物"
    ]
   },
   {
    "name": "frame_球果切换形态",
    "type": "switch",
    "label": "球果是否需要切换形态",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_球果位置"
    ]
   },
   {
    "name": "frame_球果位置",
    "type": "select",
    "label": "球果形态",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "恐龙形态",
     "幽灵马形态",
     "水母形态"
    ]
   },
   {
    "name": "frame_卡槽2_补植物",
    "type": "switch",
    "label": "卡槽2补植物位置",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_1",
     "卡槽2_10",
     "卡槽2_11",
     "卡槽2_12",
     "卡槽2_13",
     "卡槽2_14",
     "卡槽2_15",
     "卡槽2_2",
     "卡槽2_3",
     "卡槽2_4",
     "卡槽2_5",
     "卡槽2_6",
     "卡槽2_7",
     "卡槽2_8"
    ]
   },
   {
    "name": "卡槽2_1",
    "type": "switch",
    "label": "第1个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_1坐标"
    ]
   },
   {
    "name": "卡槽2_1坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_2",
    "type": "switch",
    "label": "第2个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_2坐标"
    ]
   },
   {
    "name": "卡槽2_2坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_3",
    "type": "switch",
    "label": "第3个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_3坐标"
    ]
   },
   {
    "name": "卡槽2_3坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_4",
    "type": "switch",
    "label": "第4个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_4坐标"
    ]
   },
   {
    "name": "卡槽2_4坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_5",
    "type": "switch",
    "label": "第5个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_5坐标"
    ]
   },
   {
    "name": "卡槽2_5坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_6",
    "type": "switch",
    "label": "第6个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_6坐标"
    ]
   },
   {
    "name": "卡槽2_6坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_7",
    "type": "switch",
    "label": "第7个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_7坐标"
    ]
   },
   {
    "name": "卡槽2_7坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_8",
    "type": "switch",
    "label": "第8个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_8坐标"
    ]
   },
   {
    "name": "卡槽2_8坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_9",
    "type": "switch",
    "label": "第9个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_9坐标"
    ]
   },
   {
    "name": "卡槽2_9坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_10",
    "type": "switch",
    "label": "第10个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_10坐标"
    ]
   },
   {
    "name": "卡槽2_10坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_11",
    "type": "switch",
    "label": "第11个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_11坐标"
    ]
   },
   {
    "name": "卡槽2_11坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_12",
    "type": "switch",
    "label": "第12个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_12坐标"
    ]
   },
   {
    "name": "卡槽2_12坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_13",
    "type": "switch",
    "label": "第13个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_13坐标"
    ]
   },
   {
    "name": "卡槽2_13坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_14",
    "type": "switch",
    "label": "第14个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_14坐标"
    ]
   },
   {
    "name": "卡槽2_14坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽2_15",
    "type": "switch",
    "label": "第15个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽2_15坐标"
    ]
   },
   {
    "name": "卡槽2_15坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽3_补植物",
    "type": "switch",
    "label": "卡槽3补植物位置",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_1",
     "卡槽3_10",
     "卡槽3_11",
     "卡槽3_12",
     "卡槽3_13",
     "卡槽3_14",
     "卡槽3_15",
     "卡槽3_2",
     "卡槽3_3",
     "卡槽3_4",
     "卡槽3_5",
     "卡槽3_6",
     "卡槽3_7",
     "卡槽3_8"
    ]
   },
   {
    "name": "卡槽3_1",
    "type": "switch",
    "label": "第1个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_1坐标"
    ]
   },
   {
    "name": "卡槽3_1坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_2",
    "type": "switch",
    "label": "第2个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_2坐标"
    ]
   },
   {
    "name": "卡槽3_2坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_3",
    "type": "switch",
    "label": "第3个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_3坐标"
    ]
   },
   {
    "name": "卡槽3_3坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_4",
    "type": "switch",
    "label": "第4个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_4坐标"
    ]
   },
   {
    "name": "卡槽3_4坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_5",
    "type": "switch",
    "label": "第5个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_5坐标"
    ]
   },
   {
    "name": "卡槽3_5坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_6",
    "type": "switch",
    "label": "第6个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_6坐标"
    ]
   },
   {
    "name": "卡槽3_6坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_7",
    "type": "switch",
    "label": "第7个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_7坐标"
    ]
   },
   {
    "name": "卡槽3_7坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_8",
    "type": "switch",
    "label": "第8个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_8坐标"
    ]
   },
   {
    "name": "卡槽3_8坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_9",
    "type": "switch",
    "label": "第9个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_9坐标"
    ]
   },
   {
    "name": "卡槽3_9坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_10",
    "type": "switch",
    "label": "第10个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_10坐标"
    ]
   },
   {
    "name": "卡槽3_10坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_11",
    "type": "switch",
    "label": "第11个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_11坐标"
    ]
   },
   {
    "name": "卡槽3_11坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_12",
    "type": "switch",
    "label": "第12个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_12坐标"
    ]
   },
   {
    "name": "卡槽3_12坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_13",
    "type": "switch",
    "label": "第13个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_13坐标"
    ]
   },
   {
    "name": "卡槽3_13坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_14",
    "type": "switch",
    "label": "第14个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_14坐标"
    ]
   },
   {
    "name": "卡槽3_14坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽3_15",
    "type": "switch",
    "label": "第15个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽3_15坐标"
    ]
   },
   {
    "name": "卡槽3_15坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽4_补植物",
    "type": "switch",
    "label": "卡槽4补植物位置",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽4_1",
     "卡槽4_2",
     "卡槽4_3",
     "卡槽4_4",
     "卡槽4_5"
    ]
   },
   {
    "name": "卡槽4_1",
    "type": "switch",
    "label": "第1个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽4_1坐标"
    ]
   },
   {
    "name": "卡槽4_1坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽4_2",
    "type": "switch",
    "label": "第2个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽4_2坐标"
    ]
   },
   {
    "name": "卡槽4_2坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽4_3",
    "type": "switch",
    "label": "第3个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽4_3坐标"
    ]
   },
   {
    "name": "卡槽4_3坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽4_4",
    "type": "switch",
    "label": "第4个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽4_4坐标"
    ]
   },
   {
    "name": "卡槽4_4坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽4_5",
    "type": "switch",
    "label": "第5个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽4_5坐标"
    ]
   },
   {
    "name": "卡槽4_5坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽5_补植物",
    "type": "switch",
    "label": "卡槽5补植物位置",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽5_1",
     "卡槽5_2",
     "卡槽5_3",
     "卡槽5_4",
     "卡槽5_5"
    ]
   },
   {
    "name": "卡槽5_1",
    "type": "switch",
    "label": "第1个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽5_1坐标"
    ]
   },
   {
    "name": "卡槽5_1坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽5_2",
    "type": "switch",
    "label": "第2个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽5_2坐标"
    ]
   },
   {
    "name": "卡槽5_2坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽5_3",
    "type": "switch",
    "label": "第3个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽5_3坐标"
    ]
   },
   {
    "name": "卡槽5_3坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽5_4",
    "type": "switch",
    "label": "第4个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽5_4坐标"
    ]
   },
   {
    "name": "卡槽5_4坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽5_5",
    "type": "switch",
    "label": "第5个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽5_5坐标"
    ]
   },
   {
    "name": "卡槽5_5坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽6_补植物",
    "type": "switch",
    "label": "卡槽6补植物位置",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽6_1",
     "卡槽6_2",
     "卡槽6_3",
     "卡槽6_4",
     "卡槽6_5"
    ]
   },
   {
    "name": "卡槽6_1",
    "type": "switch",
    "label": "第1个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽6_1坐标"
    ]
   },
   {
    "name": "卡槽6_1坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽6_2",
    "type": "switch",
    "label": "第2个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽6_2坐标"
    ]
   },
   {
    "name": "卡槽6_2坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽6_3",
    "type": "switch",
    "label": "第3个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽6_3坐标"
    ]
   },
   {
    "name": "卡槽6_3坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽6_4",
    "type": "switch",
    "label": "第4个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽6_4坐标"
    ]
   },
   {
    "name": "卡槽6_4坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "卡槽6_5",
    "type": "switch",
    "label": "第5个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "卡槽6_5坐标"
    ]
   },
   {
    "name": "卡槽6_5坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽7_补植物",
    "type": "switch",
    "label": "卡槽7补植物位置",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽7_1",
     "frame_卡槽7_2",
     "frame_卡槽7_3",
     "frame_卡槽7_4",
     "frame_卡槽7_5"
    ]
   },
   {
    "name": "frame_卡槽7_1",
    "type": "switch",
    "label": "第1个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽7_1坐标"
    ]
   },
   {
    "name": "frame_卡槽7_1坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽7_2",
    "type": "switch",
    "label": "第2个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽7_2坐标"
    ]
   },
   {
    "name": "frame_卡槽7_2坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽7_3",
    "type": "switch",
    "label": "第3个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽7_3坐标"
    ]
   },
   {
    "name": "frame_卡槽7_3坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽7_4",
    "type": "switch",
    "label": "第4个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽7_4坐标"
    ]
   },
   {
    "name": "frame_卡槽7_4坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽7_5",
    "type": "switch",
    "label": "第5个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽7_5坐标"
    ]
   },
   {
    "name": "frame_卡槽7_5坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽8_补植物",
    "type": "switch",
    "label": "卡槽8补植物位置",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽8_1",
     "frame_卡槽8_2",
     "frame_卡槽8_3",
     "frame_卡槽8_4",
     "frame_卡槽8_5"
    ]
   },
   {
    "name": "frame_卡槽8_1",
    "type": "switch",
    "label": "第1个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽8_1坐标"
    ]
   },
   {
    "name": "frame_卡槽8_1坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽8_2",
    "type": "switch",
    "label": "第2个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽8_2坐标"
    ]
   },
   {
    "name": "frame_卡槽8_2坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽8_3",
    "type": "switch",
    "label": "第3个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽8_3坐标"
    ]
   },
   {
    "name": "frame_卡槽8_3坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽8_4",
    "type": "switch",
    "label": "第4个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽8_4坐标"
    ]
   },
   {
    "name": "frame_卡槽8_4坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "frame_卡槽8_5",
    "type": "switch",
    "label": "第5个植物补哪",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "frame_卡槽8_5坐标"
    ]
   },
   {
    "name": "frame_卡槽8_5坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "铲除植物",
    "type": "switch",
    "label": "是否铲除植物",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "铲除植物1",
     "铲除植物2",
     "铲除植物3",
     "铲除植物4",
     "铲除植物5"
    ]
   },
   {
    "name": "铲除植物1",
    "type": "switch",
    "label": "第1个铲除的植物",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "铲除植物1坐标"
    ]
   },
   {
    "name": "铲除植物1坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "铲除植物2",
    "type": "switch",
    "label": "第2个铲除的植物",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "铲除植物2坐标"
    ]
   },
   {
    "name": "铲除植物2坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "铲除植物3",
    "type": "switch",
    "label": "第3个铲除的植物",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "铲除植物3坐标"
    ]
   },
   {
    "name": "铲除植物3坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "铲除植物4",
    "type": "switch",
    "label": "第4个铲除的植物",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "铲除植物4坐标"
    ]
   },
   {
    "name": "铲除植物4坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "铲除植物5",
    "type": "switch",
    "label": "第5个铲除的植物",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "铲除植物5坐标"
    ]
   },
   {
    "name": "铲除植物5坐标",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/Patch_Plants.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "识别能量花卡槽位置",
    "type": "switch",
    "label": "",
    "file": "task/Endless/framework/frame/Recognition.json",
    "cases": [
     "Yes",
     "No"
    ]
   },
   {
    "name": "识别魔甘卡槽位置",
    "type": "switch",
    "label": "",
    "file": "task/Endless/framework/frame/Recognition.json",
    "cases": [
     "Yes",
     "No"
    ]
   },
   {
    "name": "识别三叶草卡槽位置",
    "type": "switch",
    "label": "",
    "file": "task/Endless/framework/frame/Recognition.json",
    "cases": [
     "Yes",
     "No"
    ]
   },
   {
    "name": "fw_boss_是否开相机神器",
    "type": "switch",
    "label": "boss关是否开相机神器复原植物",
    "file": "task/Endless/framework/frame/option.json",
    "cases": [
     "No",
     "Yes"
    ]
   },
   {
    "name": "是否开启点波",
    "type": "switch",
    "label": "是否开启点波",
    "file": "task/Endless/framework/frame/option.json",
    "cases": [
     "Yes",
     "No"
    ]
   },
   {
    "name": "fw_boss_补给智能选取",
    "type": "switch",
    "label": "补给智能选取",
    "file": "task/Endless/framework/frame/option.json",
    "cases": [
     "No",
     "Yes"
    ]
   },
   {
    "name": "fw_boss关是否需要喂豆",
    "type": "switch",
    "label": "boss关是否需要喂豆",
    "file": "task/Endless/framework/frame/option.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "fw_boss关喂豆位置",
     "fw_boss关喂豆间隔",
     "fw_boss关额外喂豆位置"
    ]
   },
   {
    "name": "fw_boss关是否加速",
    "type": "switch",
    "label": "boss关是否加速",
    "file": "task/Endless/framework/frame/option.json",
    "cases": [
     "No",
     "Yes"
    ]
   },
   {
    "name": "fw_boss关喂豆间隔",
    "type": "input",
    "label": "喂豆1间隔",
    "file": "task/Endless/framework/frame/option.json",
    "inputs": [
     "毫秒"
    ]
   },
   {
    "name": "fw_boss关喂豆位置",
    "type": "input",
    "label": "喂豆1位置",
    "file": "task/Endless/framework/frame/option.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "fw_boss关额外喂豆位置",
    "type": "switch",
    "label": "额外的喂豆位置",
    "file": "task/Endless/framework/frame/option.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "fw_boss关喂豆2位置",
     "fw_boss关喂豆2间隔"
    ]
   },
   {
    "name": "fw_boss关喂豆2间隔",
    "type": "input",
    "label": "喂豆2间隔",
    "file": "task/Endless/framework/frame/option.json",
    "inputs": [
     "毫秒"
    ]
   },
   {
    "name": "fw_boss关喂豆2位置",
    "type": "input",
    "label": "喂豆2位置",
    "file": "task/Endless/framework/frame/option.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "小关是否加速",
    "type": "switch",
    "label": "小关是否加速",
    "file": "task/Endless/framework/frame/option.json",
    "cases": [
     "No",
     "Yes"
    ]
   },
   {
    "name": "小关是否喂豆",
    "type": "switch",
    "label": "小关是否喂豆",
    "file": "task/Endless/framework/frame/option.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "小关喂豆位置",
     "小关喂豆间隔",
     "是否开局喂豆球果"
    ]
   },
   {
    "name": "是否开局喂豆球果",
    "type": "switch",
    "label": "是否开局喂豆球果",
    "file": "task/Endless/framework/frame/option.json",
    "cases": [
     "Yes",
     "No"
    ],
    "subOptions": [
     "喂豆球果"
    ]
   },
   {
    "name": "喂豆球果",
    "type": "input",
    "label": "行列坐标",
    "file": "task/Endless/framework/frame/option.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "小关喂豆位置",
    "type": "input",
    "label": "喂豆位置",
    "file": "task/Endless/framework/frame/option.json",
    "inputs": [
     "列",
     "行"
    ]
   },
   {
    "name": "小关喂豆间隔",
    "type": "input",
    "label": "喂豆间隔（秒）",
    "file": "task/Endless/framework/frame/option.json",
    "inputs": [
     "seconds"
    ]
   },
   {
    "name": "刷掉僵尸",
    "type": "switch",
    "label": "",
    "file": "task/Endless/framework/frame/option.json",
    "cases": [
     "No",
     "Yes"
    ],
    "subOptions": [
     "刷新僵尸的类别"
    ]
   },
   {
    "name": "刷新僵尸的类别",
    "type": "checkbox",
    "label": "",
    "file": "task/Endless/framework/frame/option.json",
    "cases": [
     "霹雳舞僵尸"
    ]
   }
  ]
 },
 "pipelineSummary": [
  {
   "file": "pipeline/Endless/01_Endless.json",
   "nodes": 17,
   "entries": [
    "无尽挑战_前置检查"
   ],
   "worldBranches": [
    "无尽挑战_埃及",
    "无尽挑战_海盗港湾",
    "无尽挑战_狂野西部",
    "无尽挑战_功夫世界",
    "无尽挑战_未来世界",
    "无尽挑战_黑暗时代",
    "无尽挑战_巨浪沙滩",
    "无尽挑战_冰河世界",
    "无尽挑战_天空之城",
    "无尽挑战_失落之城",
    "无尽挑战_摇滚年代",
    "无尽挑战_恐龙危机",
    "无尽挑战_摩登世界",
    "无尽挑战_蒸汽时代",
    "无尽挑战_复兴时代",
    "无尽挑战_童话世界"
   ]
  },
  {
   "file": "pipeline/Endless/WjCycle.json",
   "nodes": 11,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/01HeartTower/HeartTower_0.json",
   "nodes": 1,
   "entries": [
    "HeartTowerEntry"
   ],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/01HeartTower/HeartTower_1.json",
   "nodes": 22,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/01HeartTower/HeartTower_2.json",
   "nodes": 27,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/01HeartTower/HeartTower_3.json",
   "nodes": 34,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/02HeartTower/HeartTower0_0.json",
   "nodes": 1,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/02HeartTower/HeartTower2_0.json",
   "nodes": 1,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/02HeartTower/HeartTower2_1.json",
   "nodes": 22,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/02HeartTower/HeartTower2_2.json",
   "nodes": 27,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/02HeartTower/HeartTower2_3.json",
   "nodes": 16,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/02HeartTower/bud.json",
   "nodes": 3,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/Tower_Banana/TowerBanana_1.json",
   "nodes": 39,
   "entries": [
    "Tower_Banana_Entry"
   ],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/Tower_Banana/TowerBanana_2.json",
   "nodes": 13,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/Tower_Banana/TowerBanana_3.json",
   "nodes": 4,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/01_frame_Endless.json",
   "nodes": 45,
   "entries": [
    "Frame_Wj_Entry"
   ],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/02_frame_Endless_Supplement_Plants.json",
   "nodes": 67,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/03_frame_Endless_Bean.json",
   "nodes": 2,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/05_frame_Endless_Magic_Gan.json",
   "nodes": 9,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/06Framework_Endless_Refreshing_Zombie.json",
   "nodes": 7,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/07_frame_Endless_Recognition.json",
   "nodes": 6,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/08_frame_Endless_Cone.json",
   "nodes": 2,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/09_Frame_Endless_boss.json",
   "nodes": 14,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/11_custom_frame_endless.json",
   "nodes": 1,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/Early_stage/01FrameWjCustom_custom.json",
   "nodes": 1,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/Early_stage/FrameWjCustom_1.json",
   "nodes": 140,
   "entries": [
    "frame_wj_custom_Entry"
   ],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/Early_stage/FrameWjCustom_2.json",
   "nodes": 43,
   "entries": [
    "frame_wj_custom_2_Entry"
   ],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/frame/Early_stage/initialization.json",
   "nodes": 408,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/yuan_big/01Endless_yuan_big.json",
   "nodes": 92,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/yuan_big/02Endless_yuan_big_Pirate.json",
   "nodes": 63,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/yuan_big/03Endless_yuan_big_West.json",
   "nodes": 86,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/yuan_big/11Endless_yuan_big_tower.json",
   "nodes": 2,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/yuan_big/12Endless_yuan_big_boss.json",
   "nodes": 4,
   "entries": [],
   "worldBranches": []
  },
  {
   "file": "pipeline/Endless/yuan_big/Endless_yuan_big_world.json",
   "nodes": 2,
   "entries": [],
   "worldBranches": []
  }
 ]
};
