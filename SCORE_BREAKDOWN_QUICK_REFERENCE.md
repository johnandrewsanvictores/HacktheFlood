# AI Recommendation Score Breakdown - Quick Reference

## Score Components at a Glance

```
┌────────────────────────────────────────────────────────────┐
│         TOTAL AI RECOMMENDATION SCORE (0-100)              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ✅ SUCCESS RATE              → 0 to 30 points             │
│     (Contractor's track record of successful projects)     │
│                                                            │
│  ✅ CREDIT SCORE              → 0 to 25 points             │
│     (Financial reliability, 0-100 scale)                   │
│                                                            │
│  ✅ ON-TIME COMPLETION RATE   → 0 to 20 points             │
│     (Projects completed within deadline)                   │
│                                                            │
│  ✅ BUDGET ADHERENCE          → 0 to 15 points             │
│     (Stays within approved project budgets)                │
│                                                            │
│  🎁 REGIONAL EXPERTISE         → 0 to 5 bonus points       │
│     (Has completed projects in same region)                │
│                                                            │
│  🎁 WORK TYPE EXPERTISE        → 0 to 3 bonus points       │
│     (Previous experience with same work type)              │
│                                                            │
│  🎁 EXPERIENCE                 → 0 to 2 points             │
│     (1 point per 5 years in business)                      │
│                                                            │
│  🎁 BUDGET CAPACITY            → 0 to 5 bonus points       │
│     (Project budget matches typical size)                  │
│                                                            │
│  ⚠️  WORKLOAD PENALTY          → -5 points (if >5 ongoing) │
│     (Penalize if too many active projects)                 │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  MAXIMUM POSSIBLE SCORE = 105 (capped at 100)              │
│  MINIMUM DISPLAY THRESHOLD = 20 points                     │
│  MINIMUM VIABLE SCORE = 40 points (Fair match)             │
└────────────────────────────────────────────────────────────┘
```

---

## What Each Score Range Means

```
90-100  ┃ 🟢 EXCELLENT MATCH        ★★★★★
        ┃ Best possible recommendation
        ┃ Highest confidence in success
        ┃
80-89   ┃ 🟢 VERY GOOD MATCH        ★★★★☆
        ┃ Strong recommendation
        ┃ High probability of success
        ┃
70-79   ┃ 🔵 GOOD MATCH             ★★★☆☆
        ┃ Recommended option
        ┃ Suitable for project
        ┃
60-69   ┃ 🔵 ACCEPTABLE MATCH       ★★☆☆☆
        ┃ Can handle the project
        ┃ Check other options too
        ┃
40-59   ┃ 🟡 FAIR MATCH             ★☆☆☆☆
        ┃ May work but not ideal
        ┃ Consider alternatives
        ┃
20-39   ┃ 🔴 POOR MATCH             ✗
        ┃ Not recommended
        ┃ Look for better options
        ┃
<20     ┃ ✗  NOT DISPLAYED
        ┃ Filtered out (too low)
```

---

## How to Read the Recommendation Card

```
┌─────────────────────────────────────────────────┐
│ ⭐ #1 ABC Construction Co.          ┌────────┐ │
│ John Doe • +63 912 345 6789        │   94   │ │
│                                     │ Score  │ │
│ ┌──────────┬──────────┬──────────┬─├────────┤ │
│ │ Success  │ Credit   │ On-Time  │ │ Green  │ │
│ │ Rate     │ Score    │ Rate     │ │ = Good │ │
│ │ 90%      │ 85/100   │ 88%      │ │        │ │
│ │ (green)  │(primary) │ (blue)   │ │        │ │
│ └──────────┴──────────┴──────────┴─└────────┘ │
│                                                 │
│ ⭐ Has 4 projects in Region VIII               │
│ ⭐ 87% success rate for Construction           │
│ ⭐ Budget aligns with typical project size     │
│ +1 more reason                                  │
│                                                 │
│ [45 completed] [2 ongoing]    [Select →]       │
└─────────────────────────────────────────────────┘
```

---

## Score Calculation Example

### Scenario: Pump Station in Region VIII

**Contractor: ABC Construction Co.**
```
Component                    Calculation              Points
─────────────────────────────────────────────────────────────
Success Rate:         90% × (30/100) =              27.0
Credit Score:         85% × (25/100) =              21.25
On-Time Rate:         88% × (20/100) =              17.6
Budget Adherence:     92% × (15/100) =              13.8
Regional Match:       Has 4 projects here =         +5.0
Work Type Match:      87% in construction =         +3.0
Experience:           8 years ÷ 5 × 2 =            +2.0
Workload:             Only 2 ongoing =              0 (good)
Budget Capacity:      Typical ₱12M, asking ₱10M =  +5.0
                                                    ─────────
TOTAL:                                             94.65 ✅
```

---

## Understanding Each Component

### 1️⃣ SUCCESS RATE (30 pts max)
- **What**: Out of 100 projects, how many were successful?
- **Range**: 0-100%
- **Score**: success_rate% × 0.30
- **Impact**: HIGH - Most important factor
- **Example**: 90% success = 27 pts

### 2️⃣ CREDIT SCORE (25 pts max)
- **What**: Contractor's financial credibility rating
- **Range**: 0-100
- **Score**: credit_score × 0.25
- **Impact**: HIGH - Shows reliability
- **Example**: 85/100 credit = 21.25 pts

### 3️⃣ ON-TIME COMPLETION (20 pts max)
- **What**: Percentage of projects finished on schedule
- **Range**: 0-100%
- **Score**: on_time_rate% × 0.20
- **Impact**: HIGH - Meets deadlines
- **Example**: 88% on-time = 17.6 pts

### 4️⃣ BUDGET ADHERENCE (15 pts max)
- **What**: How well they stay within approved budgets
- **Range**: 0-100%
- **Score**: adherence_rate% × 0.15
- **Impact**: MEDIUM - Financial management
- **Example**: 92% adherent = 13.8 pts

### 5️⃣ REGIONAL EXPERTISE (5 bonus)
- **What**: Has this contractor worked in this region before?
- **Trigger**: Match found in location_preferences array
- **Score**: +5 if match found
- **Bonus**: Shows "X projects in [region]"
- **Impact**: MEDIUM - Local knowledge

### 6️⃣ WORK TYPE EXPERTISE (3 bonus)
- **What**: Does contractor have experience with this work type?
- **Trigger**: Match found in project_type_expertise array
- **Score**: +3 if match found
- **Bonus**: Shows "X% success for [work_type]"
- **Impact**: MEDIUM - Relevant experience

### 7️⃣ EXPERIENCE (2 pts max)
- **What**: How many years in business?
- **Calculation**: (years_in_business ÷ 5) × 2
- **Score**: 1 point per 5 years (max 2)
- **Impact**: LOW - Establishes track record
- **Example**: 8 years = 1.6 pts

### 8️⃣ WORKLOAD (−5 penalty)
- **What**: Currently managing how many projects?
- **Penalty**: −5 if ongoing_projects > 5
- **Score**: 0 (no penalty) or −5 (penalty applied)
- **Impact**: MEDIUM - Capacity check
- **Example**: 8 ongoing = −5 pts

### 9️⃣ BUDGET CAPACITY (5 bonus)
- **What**: Does project budget fit their typical size?
- **Calculation**: approved_budget ÷ avg_contract_value
- **Trigger**: Ratio between 0.5x and 1.5x
- **Score**: +5 if match found
- **Impact**: MEDIUM - Right-sized project
- **Example**: ₱10M project, typical ₱12M = +5 pts

---

## Color Coding System

### Score Card Background Colors
```
🟢 GREEN    Score ≥ 80     Excellent match, highly recommended
🔵 BLUE     Score 60-79    Good match, recommended
🟡 YELLOW   Score 40-59    Fair match, consider carefully
🔴 RED      Score < 40     Poor match, not recommended
```

### Metric Colors
```
Success Rate:        🟢 Green (like growth/success)
Credit Score:        🔵 Blue (primary brand color)
On-Time Rate:        🔵 Blue (reliability)
Experience (Years):  ⚪ Gray (neutral info)
```

### Badge Colors
```
[45 completed]   🔵 Blue background   - Past success
[2 ongoing]      🟠 Amber background  - Active work
```

---

## Quick Scoring Guide

### Maximum Points Breakdown
```
Component                    Points    Percentage
─────────────────────────────────────────────────
Success Rate                  30        28.6%
Credit Score                  25        23.8%
On-Time Completion           20        19.0%
Budget Adherence             15        14.3%
Regional Expertise (+5)        5         4.8%
Work Type Expertise (+3)       3         2.9%
Experience (2 max)            2         1.9%
Budget Capacity (+5)          5         4.8%
Workload Penalty (-5)        -5           -
─────────────────────────────────────────────────
THEORETICAL MAXIMUM          105        100%*
CAPPED AT                    100        100%
MINIMUM SHOWN                 20        19.0%

*Can exceed 100 due to bonus points
```

---

## What Affects Your Score Most?

### HIGH IMPACT (94 of 100 points)
1. **Success Rate** (30 pts) - Track record
2. **Credit Score** (25 pts) - Trustworthiness
3. **On-Time Rate** (20 pts) - Reliability
4. **Budget Adherence** (15 pts) - Financial management
5. **Workload Penalty** (-5 pts) - Capacity

### MEDIUM IMPACT (Bonus/Situational)
- Regional Expertise (+5) - Local experience
- Budget Capacity (+5) - Right-sized project
- Work Type Expertise (+3) - Relevant skills

### LOW IMPACT
- Years in Business (0-2 pts) - Nice to have

---

## Interpreting the Reasons

Each recommendation shows up to 3 reasons why this contractor scored well:

```
⭐ Has 4 projects in Region VIII
   └─→ Knows the area, understands local challenges

⭐ 87% success rate for Construction
   └─→ Proven capability with this work type

⭐ Budget aligns with contractor's typical project size
   └─→ Right-sized for their experience level

⭐ 10 years in business
   └─→ Established, experienced company

⭐ Currently managing 2 ongoing projects
   └─→ Has capacity for more work
```

---

## Decision Making

### Choose TOP RECOMMENDATION If:
- ✅ Score ≥ 80
- ✅ 3+ positive reasons
- ✅ Experience in region/type
- ✅ Reasonable workload

### Compare TOP 3 If:
- 📊 Similar scores (within 5 points)
- 🤔 Unsure about details
- 🔍 Want to compare metrics

### Consider ALTERNATIVES If:
- ⚠️ Score < 60
- ⚠️ No regional expertise
- ⚠️ High workload (5+ ongoing)
- ⚠️ Low success rate (<70%)

### Manually Select If:
- 🔧 Need specific contractor
- 📞 Personal recommendation
- 💼 Existing relationship
- ⚡ Special requirements

---

## FAQ

**Q: Why is my top recommendation score 94?**
A: Likely excellent success rate + high credit score + on-time performance + regional expertise + budget alignment = 94 points

**Q: Why can score exceed 100?**
A: Bonus points (+Regional +Work Type +Budget Capacity can total +13) are added to base 90 max, but UI caps at 100 for display

**Q: What if all scores are low (<60)?**
A: No verified contractors match your criteria. Consider:
- Different region/work type
- Relaxing budget constraints
- Adding new contractors

**Q: How often should I refresh?**
A: Recommendations refresh automatically when you change:
- Region
- Type of Work
- Budget amount

Manual refresh available via button in recommendation panel

**Q: Can I ignore the recommendation?**
A: Yes! Enter contractor name manually if you prefer. AI recommendation is helpful but not mandatory.

**Q: Does score change if I modify project details?**
A: Yes, completely recalculated based on updated:
- Region
- Type of Work
- Budget
- Infrastructure Type
