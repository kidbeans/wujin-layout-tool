---
name: route-review
description: 审查配队路由参数（尾数/阶段分流、front 段、farm 起始关）与 R1~R6 规则，输出修正参数。
---

# 配队路由审查（R1~R6）

## 核对清单

| 规则 | 内容 |
|---|---|
| R1 尾数完备 | 尾数分流下 0~9 每个尾数都有明确归属（deck2 尾数 ∪ Boss 尾数 ∪ deck1 补种 = 全集，无交叠） |
| R2 阶段边界 | 阶段分流下 deck2 指定关、Boss 前置关（bossEarly）、挂机起始关（farmFrom）单调不减且互不矛盾 |
| R3 前置段 | deck1_first / front10 / front30 前置种植段的格子与顺序链一致；front30 喂豆格在棋盘内 |
| R4 Boss 抢占 | Boss 关（尾数 5/0 或 bossEarly 起）不得被 deck1/deck2 种植链命中 |
| R5 farm 收敛 | farmFrom 起的挂机关仍有最低限度维护（点波/捡花不断链）；beilei_stop 停止点与重启节点衔接正确 |
| R6 启动对齐 | 启动关卡数与 agent 计数初值一致；「重置到1」直连「初始化完毕」 |

## 参数修正输出形态

```json
{ "mode": "tail|phase|none", "deck2_tails": "…", "boss_tails": "…", "deck2_level": "…",
  "boss_early": N, "farm_from": N, "start_level": N, "deck1_first": N, "front10": N, "front30": N,
  "front30_feed_cell": "列-路", "tail3_first": N, "beilei_stop": N }
```

只给需要修改的字段并注明原值→新值；整轮模拟结论（各尾数关的处置表）放在证据部分。
