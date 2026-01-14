# JobFoxy Pricing Strategy

## Competitor Analysis

### Resume Builders

| Tool | Free Tier | Paid Price | Key Features |
|------|-----------|------------|--------------|
| **Rezi** | 1 resume, limited AI | **$29/mo** | ATS optimization, AI bullets |
| **Kickresume** | Basic | **$19/mo** or $7/mo annual | GPT-4, templates, design focus |
| **Zety** | Trial only | **$24-26/mo** | Templates, downloads |
| **Teal** | Good free tier | **$9/week (~$36/mo)** | Job tracking + resume |
| **ResumeStore** | Limited | **$15/mo** or $5/week | Budget option |

### Interview Prep Tools

| Tool | Free Tier | Paid Price | Key Features |
|------|-----------|------------|--------------|
| **Big Interview** | None | **$39/mo** or $299 lifetime | Video practice, feedback |
| **Final Round AI** | Trial | **$81/mo** | AI mock interviews |
| **Huru** | Trial | **$25/mo** or $99/year | AI drills, feedback |
| **Hello Interview** | Basic | **$49/mo** | Premium coaching |
| **Beyz AI** | Limited | **$49-99/mo** | Real-time AI copilot |

---

## JobFoxy Competitive Advantage

**All-in-one platform** - Most competitors specialize in only one area:

| Feature | Resume Tools | Interview Tools | **JobFoxy** |
|---------|--------------|-----------------|-------------|
| Resume Builder | ✅ | ❌ | ✅ |
| AI Resume Optimization | ✅ | ❌ | ✅ |
| ATS Scoring | ✅ | ❌ | ✅ |
| Mock Interviews (Voice) | ❌ | ✅ | ✅ |
| Practice Q&A | ❌ | ✅ | ✅ |
| STAR Story Builder | ❌ | Some | ✅ |
| SWOT Analysis | ❌ | ❌ | ✅ |
| Gap Defense | ❌ | ❌ | ✅ |
| Intro Pitch | ❌ | ❌ | ✅ |
| Cover Letters | Some | ❌ | ✅ |

**To get what JobFoxy offers, users would need:**
- Rezi ($29) + Final Round AI ($81) = **$110/month**
- Kickresume ($19) + Big Interview ($39) = **$58/month**

---

## Recommended Pricing Structure

### Pricing Tiers

| Tier | Monthly | Annual | Savings |
|------|---------|--------|---------|
| **FREE** | $0 | - | - |
| **PRO** | $24/mo | $192/year ($16/mo) | 33% off |
| **PREMIUM** | $49/mo | $348/year ($29/mo) | 41% off |
| **LIFETIME** | - | $299 one-time | Optional |

---

## Feature Matrix by Tier

### FREE - Lead Generation Only

| Feature | Limit |
|---------|-------|
| Resume creation | 1 resume |
| Templates | All templates |
| PDF Export | 1 export |
| AI Bullet Optimization | None |
| AI Summary Generation | None |
| Practice Interview | None |
| Mock Interview | None |
| Coaching Tools | None |
| Cover Letter | None |

**Purpose:** Get users into the platform, showcase templates, upsell to PRO.

---

### PRO - $24/month ($16/mo annual)

| Feature | Limit |
|---------|-------|
| Resume creation | 5 resumes |
| Templates | All templates |
| PDF/DOCX Export | Unlimited |
| AI Bullet Optimization | 50/month |
| AI Summary Generation | 10/month |
| Resume Parsing/Import | 10/month |
| ATS Score + Job Match | Unlimited |
| Practice Interview | Unlimited |
| Cover Letter | 10/month |
| Mock Interview (Voice) | None |
| STAR Story Builder | None |
| SWOT Analysis | None |
| Gap Defense | None |
| Intro Pitch | None |

**Target:** Job seekers who want resume help + practice, but not full interview prep.

---

### PREMIUM - $49/month ($29/mo annual)

| Feature | Limit |
|---------|-------|
| Resume creation | Unlimited |
| Templates | All templates |
| PDF/DOCX Export | Unlimited |
| AI Bullet Optimization | Unlimited |
| AI Summary Generation | Unlimited |
| Resume Parsing/Import | Unlimited |
| ATS Score + Job Match | Unlimited |
| Practice Interview | Unlimited |
| Cover Letter | Unlimited |
| **Mock Interview (Voice)** | **10/month** |
| **STAR Story Builder** | Unlimited |
| **SWOT Analysis** | Unlimited |
| **Gap Defense** | Unlimited |
| **Intro Pitch** | Unlimited |
| LinkedIn Import | Unlimited |
| Priority Support | Yes |

**Target:** Serious job seekers preparing for interviews, career changers.

---

## Credit Packs (Mock Interview Add-on)

For users who need more mock interviews beyond their plan limit:

| Pack | Sessions | Price | Per Session |
|------|----------|-------|-------------|
| 5 Sessions | 5 | $19 | $3.80 |
| 15 Sessions | 15 | $49 | $3.27 |
| 30 Sessions | 30 | $89 | $2.97 |

**Note:** Credits never expire. Can be purchased by any tier (including FREE).

---

## Cost Analysis

### Your Cost per User (estimated)

| Tier | Your Monthly Cost | Revenue | Profit |
|------|-------------------|---------|--------|
| FREE | ~$0 | $0 | $0 |
| PRO | ~$3-6 | $24 | $18-21 |
| PREMIUM | ~$8-15 | $49 | $34-41 |

### High-Cost Features (OpenAI API)

| Feature | Est. Cost per Use |
|---------|-------------------|
| Mock Interview (Realtime API) | $0.30-1.00+ per session |
| STAR Story Builder | ~$0.05-0.15 per story |
| SWOT Analysis | ~$0.05-0.10 per analysis |
| Gap Defense | ~$0.05-0.10 per gap |
| Intro Pitch | ~$0.03-0.05 per pitch |
| AI Bullet Optimization | ~$0.02-0.05 per bullet |
| Practice Answer Scoring | ~$0.02-0.04 per answer |

---

## Market Positioning

```
Budget                    Mid-Range                    Premium
|------------------------|--------------------------|----------------------|
$10-15/mo                $20-35/mo                  $49-99/mo
                              ↑                           ↑
                         PRO ($24)                 PREMIUM ($49)
```

**JobFoxy is positioned as premium but priced competitively** because it offers more value than single-purpose tools.

---

## Implementation Checklist

- [ ] Update Stripe products with new price IDs
- [ ] Update `subscription_plans` table in database
- [ ] Update pricing page UI (`components/landing/Pricing.tsx`)
- [ ] Update feature limits in `lib/config/constants.ts`
- [ ] Update usage checking logic in `lib/utils/subscriptionLimits.ts`
- [ ] Add feature gates throughout the app
- [ ] Update account page subscription display
- [ ] Test checkout flow for all tiers
- [ ] Test annual billing toggle
- [ ] Configure Stripe billing portal

---

## Stripe Products to Create

### Subscriptions
1. **PRO Monthly** - $24/month
2. **PRO Annual** - $192/year
3. **PREMIUM Monthly** - $49/month
4. **PREMIUM Annual** - $348/year

### One-time Purchases
5. **5 Mock Credits** - $19
6. **15 Mock Credits** - $49
7. **30 Mock Credits** - $89
8. **Lifetime Access** - $299 (optional)

---

*Last updated: January 2025*
