# ITC WAF Integration with AEM Edge Delivery Services

## Executive Summary

**ITC can use their WAF with EDS, but with performance trade-offs.**

Adobe's position: **EDS has built-in WAF security features** and additional WAF layers are officially discouraged ([Unsupported Integrations](https://www.aem.live/docs/unsupported)). However, ITC can implement their WAF rulesets through AWS CloudFront + AWS WAF using the BYO CDN approach.

### Key Points:
- All 9 ITC WAF rules are technically compatible with EDS
- **Highest Performance Impact**: CommonRuleSet-XSS (10-30ms), SQLiRuleSet (10-25ms)
- **Medium Performance Impact**: LinuxRuleSet (8-20ms), BotControlRuleSet (5-15ms)
- **Low Performance Impact**: 5 other rules (<8ms each)
- **Total Expected Latency**: 50-100ms typical case with all rules enabled
- **Expected Lighthouse Score**: 85-90+ (vs 100 baseline) with optimization

---

## Adobe's Position

### EDS Built-in Security
- Strict path filtering at the edge
- Automated performance monitoring via PageSpeed Insights
- Edge-level content rendering with security controls
- Access control at CDN tier

**Reference**: [AEM EDS FAQ](https://www.aem.live/docs/faq#content)

### Adobe's Guidance on WAF
> "Web Application Firewalls can introduce performance challenges through synchronous request processing, complex pattern matching rules, inefficient geographic routing, and interference with CDN caching."

**Recommendation**: Use EDS's built-in WAF security features or implement WAF through supported CDN providers only.

**Reference**: [Unsupported Integrations - Discouraged Security Practices](https://www.aem.live/docs/unsupported#discouraged-security-practices)

---

## ITC WAF Rules - Performance Impact Analysis

| # | Rule Name | Latency | Impact | Critical Optimization |
|---|-----------|---------|--------|----------------------|
| 1 | RateBasedRule_IP-300 | 1-3ms | 🟢 LOW | Keep enabled |
| 2 | **CommonRuleSet-XSS** | **10-30ms** | 🔴 **HIGH** | **MUST scope to form paths only** |
| 3 | KnownBadInputsRuleset | 3-8ms | 🟢 LOW | Keep enabled |
| 4 | BlockLinuxDesktopOnGraphQL | 0.5-2ms | 🟢 LOW | Disable if no GraphQL |
| 5 | **SQLiRuleSet** | **10-25ms** | 🔴 **HIGH** | **MUST scope to API paths only** |
| 6 | AmazonIpReputationList | 2-5ms | 🟢 LOW | Keep enabled |
| 7 | BotControlRuleSet | 5-15ms | 🟡 MEDIUM | Use targeted mode + allowlist Adobe services |
| 8 | LinuxRuleSet | 8-20ms | 🟡 MEDIUM | Evaluate necessity (EDS is managed) |
| 9 | AnonymousIpList | 2-5ms | 🟢 LOW | Use COUNT mode initially |

### Performance Impact Summary

**Total Expected Latency with All Rules:**
- Best Case: 30-50ms
- Typical Case: 50-100ms
- Worst Case: 100-150ms (large POST requests)

**Lighthouse Score Impact:**
- EDS without WAF: **100** (baseline)
- With unoptimized WAF: **70-80**
- With optimized WAF: **85-90+**

---

## Critical Optimizations Required

### 🔴 MUST OPTIMIZE (High Impact Rules)

**1. CommonRuleSet-XSS (10-30ms)**
- **Problem**: Complex regex pattern matching on all requests
- **Solution**: Scope to form/input paths only (e.g., `/forms/*`, `/submit/*`)
- **Savings**: 15-25ms on static content requests

**2. SQLiRuleSet (10-25ms)**
- **Problem**: SQL pattern matching on all requests
- **Solution**: Apply ONLY to backend API paths (e.g., `/api/*`)
- **Savings**: 10-25ms on static content (disable entirely if no DB integrations)

### 🟡 SHOULD OPTIMIZE (Medium Impact Rules)

**3. BotControlRuleSet (5-15ms)**
- Use targeted mode (not comprehensive)
- **Critical**: Allowlist Adobe AEM Sidekick, Google/Bing crawlers, Adobe monitoring services

**4. LinuxRuleSet (8-20ms)**
- Evaluate necessity given EDS's managed infrastructure
- Consider disabling to save 8-20ms

### 🟢 KEEP ENABLED (Low Impact Rules)
5 rules with minimal overhead: Rate limiting, IP reputation, known bad inputs, anonymous IPs, GraphQL blocking

---

## Architecture

```
User Request
    ↓
AWS CloudFront + AWS WAF (ITC's 9 rulesets)
    ↓
EDS Origins (*.aem.live)
    ↓
Content Source (SharePoint/Google Drive/AEM)
```

**Configuration:**
- Point CloudFront to EDS origins
- Apply WAF rules at CloudFront edge (not origin)
- Configure push invalidation for cache management
- Restrict direct .aem.live access to CloudFront only

---

## Supporting References

- **[AEM EDS - Unsupported Integrations](https://www.aem.live/docs/unsupported)** ⭐ Read "Discouraged Security Practices"
- [AEM EDS FAQ - Security](https://www.aem.live/docs/faq#content)
- [AEM EDS - Keeping It 100](https://www.aem.live/docs/keeping-it-100)
- [AEM EDS - BYO CDN Setup](https://www.aem.live/docs/byo-cdn-setup)
- [AEM EDS - AWS CloudFront Setup](https://www.aem.live/docs/cloudfront-setup)

---

## Bottom Line

**Can we do it?** Yes, all 9 rules are compatible via AWS CloudFront + AWS WAF.

**Should we do it?** Adobe officially discourages it, but understands compliance requirements.

**What's the cost?** 50-100ms additional latency, Lighthouse score 85-90+ (vs 100 baseline).

**Critical success factor:** Must scope XSS and SQLi rules to specific paths to maintain acceptable performance.

**Recommendation:** If compliance mandates WAF, proceed with phased, optimized implementation. If not, strongly consider EDS built-in security only.
