# AI Contractor Recommendation Scoring System

## Overview
The AI recommendation engine analyzes contractor data and project requirements to calculate a **total score (0-100)** for each contractor. The score indicates how well-suited a contractor is for the specific project.

---

## Score Breakdown (Total = 100 Points)

### 1. **Success Rate** (30 points max)
- **Calculation**: `(success_rate / 100) × 30`
- **What it measures**: Percentage of projects completed successfully by the contractor
- **Example**: 
  - 100% success rate = 30 points
  - 70% success rate = 21 points
  - 50% success rate = 15 points

### 2. **Credit Score** (25 points max)
- **Calculation**: `(credit_score / 100) × 25`
- **What it measures**: Contractor's overall creditworthiness (0-100 scale)
- **Example**:
  - 100/100 credit score = 25 points
  - 80/100 credit score = 20 points
  - 50/100 credit score = 12.5 points

### 3. **On-Time Completion Rate** (20 points max)
- **Calculation**: `(on_time_completion_rate / 100) × 20`
- **What it measures**: Percentage of projects completed on schedule
- **Example**:
  - 100% on-time = 20 points
  - 85% on-time = 17 points
  - 60% on-time = 12 points

### 4. **Budget Adherence Rate** (15 points max)
- **Calculation**: `(budget_adherence_rate / 100) × 15`
- **What it measures**: How well contractor stays within approved budgets
- **Example**:
  - 100% adherence = 15 points
  - 90% adherence = 13.5 points
  - 70% adherence = 10.5 points

### 5. **Regional Expertise** (5 bonus points)
- **Condition**: If contractor has past projects in the same region
- **What it measures**: Experience in the specific geographic region
- **Display**: Shows number of projects in that region
- **Example**:
  - Has projects in Region VIII → +5 points
  - Plus reason: "Has 3 projects in Region VIII"

### 6. **Project Type Expertise** (3 bonus points)
- **Condition**: If contractor has experience with the same type of work
- **What it measures**: Success with similar project types
- **Display**: Shows success rate for that work type
- **Example**:
  - Has Construction projects → +3 points
  - Plus reason: "87% success rate for Construction"

### 7. **Experience (Years in Business)** (2 points max)
- **Calculation**: `(years_in_business / 5) × 2` (max 2 points)
- **What it measures**: How long contractor has been operating
- **Example**:
  - 10 years = 2 points
  - 5 years = 1 point
  - 2 years = 0.4 points

### 8. **Workload Check** (-5 penalty)
- **Condition**: If contractor has more than 5 ongoing projects
- **What it measures**: Current capacity/workload
- **Impact**: Reduces score by 5 points
- **Display**: Shows number of ongoing projects
- **Example**:
  - 8 ongoing projects → -5 points
  - Plus reason: "Currently managing 8 ongoing projects"

### 9. **Budget Capacity Match** (5 bonus points)
- **Calculation**: Compares project budget to contractor's average project size
- **Condition**: Budget ratio between 0.5x and 1.5x typical project size
- **What it measures**: Budget alignment with contractor's experience
- **Example**:
  - Project budget = $10M, Contractor's typical project = $12M → +5 points
  - Plus reason: "Budget aligns with contractor's typical project size"

---

## Score Interpretation

### Color-Coded Ratings
```
🟢 GREEN (≥80 points)  - Excellent Match
   Best suited for the project
   High probability of success

🔵 BLUE (60-79 points) - Good Match
   Suitable for the project
   Recommended option

🟡 YELLOW (40-59 points) - Fair Match
   Can handle the project
   Consider alternatives

🔴 RED (<40 points)    - Poor Match
   Not recommended
   Look for better options
```

### Minimum Score Threshold
- **Minimum**: 20 points out of 100
- Contractors below this threshold are filtered out
- Ensures only viable recommendations are shown

---

## Displayed Score Components

### On Recommendation Card, You'll See:

1. **Large Score Number** (top right)
   - Main recommendation score (0-100)
   - Color-coded background for quick visual reference

2. **Key Metrics Grid** (4 columns)
   - Success Rate: % of successful projects
   - Credit Score: /100 points
   - On-Time Rate: % of on-time completions
   - Experience: Years in business

3. **Reasons List** (up to 3 shown + indicator)
   - Star icon (⭐) bullet points
   - Shows why this contractor is recommended
   - Examples:
     - "Has 3 projects in Region VIII"
     - "87% success rate for Construction"
     - "10 years in business"
     - "Budget aligns with contractor's typical project size"

4. **Project Status Badges**
   - Completed projects (blue)
   - Ongoing projects (amber)

---

## Example Scoring Scenario

**Project Requirements:**
- Region: Region VIII
- Type of Work: Construction
- Budget: ₱10,000,000
- Infrastructure Type: Pumping Station

**Contractor Analysis:**

| Component | Value | Points |
|-----------|-------|--------|
| Success Rate (90%) | 90/100 × 30 | 27.0 |
| Credit Score (85/100) | 85/100 × 25 | 21.25 |
| On-Time Rate (88%) | 88/100 × 20 | 17.6 |
| Budget Adherence (92%) | 92/100 × 15 | 13.8 |
| Regional Expertise | Has 4 projects | +5 |
| Work Type Match | 85% success rate | +3 |
| Experience (8 years) | 8/5 × 2 | 2.0 |
| Workload (2 ongoing) | No penalty | 0 |
| Budget Capacity | Aligns well | +5 |
| **TOTAL SCORE** | | **94.65** |

**Interpretation**: Score of 94.65 = **Excellent Match** (Green) ✅

---

## How to Interpret in ProjectForm

### When Creating a Project:

1. **Fill Required Fields First:**
   - Region
   - Type of Work
   - Approved Budget

2. **Click "AI Recommend" Button**
   - Button is disabled until those 3 fields are filled
   - Shows loading spinner while analyzing

3. **Review Recommendations:**
   - Top recommendation has a ⭐ award icon
   - Ranked by score (highest to lowest)
   - Each card shows detailed breakdown

4. **Select a Contractor:**
   - Click "Select →" button on any card
   - Contractor name auto-fills in the form field
   - Recommendation panel closes automatically

5. **Or Enter Manually:**
   - Type contractor name directly if preferred
   - Skip AI recommendations if desired

---

## Scoring Algorithm Features

### Strengths
✅ **Comprehensive**: Considers 9 different factors
✅ **Weighted**: Core factors (success, credit) weighted heavily
✅ **Contextual**: Bonuses for relevant experience
✅ **Capacity-Aware**: Penalizes overworked contractors
✅ **Budget-Aware**: Matches contractor capability to project size
✅ **Verified Only**: Only shows verified contractors

### Data Points Used
- Success rate from past projects
- Credit score evaluation
- On-time completion percentage
- Budget adherence history
- Geographic project history
- Project type expertise
- Years in business
- Current project workload
- Average contract value

### Smart Filtering
- Only considers verified contractors
- Filters out contractors below 20-point threshold
- Returns top 5 recommendations
- Sorted by total score (best first)

---

## Visual Score Indicators

### Score Display Card (Top Right)
```
┌─────────────────┐
│       94        │  ← Large number = total score
│     Score       │  ← Label
│   (Green BG)    │  ← Color = quality rating
└─────────────────┘
```

### Color Scheme
- **Green Background** = ≥80 (Excellent)
- **Blue Background** = 60-79 (Good)
- **Yellow Background** = 40-59 (Fair)
- **Red Background** = <40 (Poor)

### Metric Cards Grid
```
┌──────────┬──────────┬──────────┬──────────┐
│ Success  │ Credit   │ On-Time  │ Exp.     │
│ Rate     │ Score    │ Rate     │ (Years)  │
│ 90%      │ 85/100   │ 88%      │ 8y       │
│ (green)  │(primary) │ (blue)   │(gray)    │
└──────────┴──────────┴──────────┴──────────┘
```

---

## API Response Structure

### Recommendation Request
```json
POST /api/contractors/recommendations
{
  "region": "Region VIII",
  "type_of_work": "Construction",
  "approved_budget": 10000000,
  "infrastructure_type": "Pumping Station"
}
```

### Recommendation Response
```json
{
  "success": true,
  "data": [
    {
      "contractorId": "507f1f77bcf86cd799439011",
      "company_name": "ABC Construction Co.",
      "contact_person": "John Doe",
      "contact_number": "+63 912 345 6789",
      "email": "contact@abc.com",
      "success_rate": 90,
      "credit_score": 85,
      "years_in_business": 8,
      "ongoing_projects": 2,
      "completed_projects": 45,
      "total_projects": 47,
      "on_time_completion_rate": 88,
      "budget_adherence_rate": 92,
      "total_score": 94.65,
      "reasons": [
        "Has 4 projects in Region VIII",
        "87% success rate for Construction",
        "Budget aligns with contractor's typical project size"
      ]
    },
    ...
  ],
  "count": 5
}
```

---

## Monitoring Recommendation Quality

### Good Recommendations Show:
✅ Score ≥ 80
✅ Multiple positive reasons (3+)
✅ Reasonable ongoing projects (≤5)
✅ Relevant experience in region/type
✅ High success rate (≥85%)

### Low-Quality Recommendations Show:
⚠️ Score < 40
⚠️ Few or generic reasons
⚠️ High workload (6+ ongoing)
⚠️ No relevant experience
⚠️ Low success rate (<50%)

---

## Tips for Best Results

1. **Ensure Contractor Data is Updated**
   - Success rates reflect actual performance
   - On-time rates are current
   - Budget adherence is accurate

2. **Fill All Optional Fields**
   - Infrastructure type helps match expertise
   - More data = better recommendations

3. **Consider Top 3 Recommendations**
   - Usually sufficient for decision
   - Compare top candidates side-by-side

4. **Use "Refresh Recommendations" Button**
   - Re-analyze if project criteria change
   - Updates based on latest contractor data

5. **Review Detailed Metrics**
   - Don't just look at total score
   - Check individual metrics matter to you
   - Verify reasons align with project needs
