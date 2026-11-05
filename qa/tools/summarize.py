import json,glob,os,sys
d=sys.argv[1]; detail=len(sys.argv)>2
print(f"{'page':28}{'form':8}{'Perf':>5}{'A11y':>5}{'BP':>4}{'SEO':>4}{'FCP':>7}{'LCP':>7}{'TBT':>7}{'CLS':>7}{'SI':>7}{'bytes':>9}{'req':>5}  LCP element")
for f in sorted(glob.glob(d+"/*.json")):
    r=json.load(open(f)); a=r["audits"]; c=r["categories"]
    name,form=os.path.basename(f).rsplit(".",2)[:2]
    s=lambda k: round((c.get(k,{}).get("score") or 0)*100)
    lcpel=""
    try: lcpel=a["largest-contentful-paint-element"]["details"]["items"][0]["items"][0]["node"]["selector"][-45:]
    except Exception: pass
    nv=lambda k: a[k].get("numericValue",0)
    print(f"{name:28}{form:8}{s('performance'):>5}{s('accessibility'):>5}{s('best-practices'):>4}{s('seo'):>4}{nv('first-contentful-paint')/1000:>6.1f}s{nv('largest-contentful-paint')/1000:>6.1f}s{nv('total-blocking-time'):>6.0f}ms{nv('cumulative-layout-shift'):>7.3f}{nv('speed-index')/1000:>6.1f}s{nv('total-byte-weight')/1048576:>7.1f}MB{len(a['network-requests']['details']['items']):>5}  {lcpel}")
    if detail:
        for k in ["largest-contentful-paint-element","lcp-breakdown-insight","lcp-discovery-insight","render-blocking-insight","layout-shifts","cls-culprits-insight","bootup-time","unused-javascript","total-byte-weight"]:
            if k in a and a[k].get("score") is not None and a[k]["score"]<0.9: print("    ",k,"|",a[k].get("displayValue",""))
        fails=[(k,v["title"]) for k,v in a.items() if v.get("score")==0 and k in sum([[x["id"] for x in cc["auditRefs"]] for n,cc in c.items() if n in("accessibility","seo","best-practices")],[])]
        for k,t in fails: print("     FAIL",k,"-",t)
