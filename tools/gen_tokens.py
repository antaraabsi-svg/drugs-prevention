"""يولّد assets/css/tokens.css من الألوان الرسمية الأربعة.
القاعدة: درجات الفاتح = مزج مع الأبيض، درجات الداكن = مزج مع الأسود، والدرجة الأساسية تبقى كما حددتها الهوية.
لتغيير الهوية لاحقًا: عدّل BRAND ثم شغّل:  python3 tools/gen_tokens.py"""
import os
BRAND={'green':'#1a4731','gold':'#c9993a','cream':'#F7F4EC','white':'#FFFFFF'}
def rgb(h): h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def hx(c): return '#%02x%02x%02x'%tuple(max(0,min(255,round(v))) for v in c)
def mix(c,t,k): return tuple(a+(b-a)*k for a,b in zip(c,t))
W=(255,255,255); B=(0,0,0)
def scale(base,tints,shades):
    c=rgb(base); out={}
    for name,k in tints.items(): out[name]=hx(mix(c,W,k))
    out['500' if base==BRAND['gold'] else '700']=base.lower()
    for name,k in shades.items(): out[name]=hx(mix(c,B,k))
    return out
green=scale(BRAND['green'],{'50':.94,'100':.88,'200':.74,'300':.55,'400':.36,'500':.2,'600':.1},{'800':.22,'900':.42,'950':.62})
gold=scale(BRAND['gold'],{'50':.93,'100':.84,'200':.68,'300':.5,'400':.25},{'600':.14,'700':.3,'800':.46})
cream={'50':hx(mix(rgb(BRAND['cream']),W,.55)),'100':BRAND['cream'].lower(),'200':hx(mix(rgb(BRAND['cream']),B,.04)),'300':hx(mix(rgb(BRAND['cream']),B,.09))}
ink={'900':hx(mix(rgb(BRAND['green']),B,.66)),'700':hx(mix(rgb(BRAND['green']),B,.35)),'500':hx(mix(mix(rgb(BRAND['green']),(120,125,120),.55),B,0)),'400':hx(mix(rgb(BRAND['green']),(150,155,150),.62))}
red={'50':'#fbefec','100':'#f5d9d3','500':'#b3362b','700':'#8a2a21'}
def block(prefix,d): return '\n'.join(f'  --{prefix}-{k}: {v};' for k,v in sorted(d.items(),key=lambda kv:int(kv[0])))
css=f"""/* =====================================================================
   tokens.css — رموز نظام التصميم (Design Tokens)
   الهوية الرسمية لديوان قطاع الشباب والرياضة
   ملف مولَّد بـ tools/gen_tokens.py — القيم الأساسية الأربع فقط هي المرجع:
   الأخضر الداكن {BRAND['green']} · الذهبي {BRAND['gold']} · الأبيض {BRAND['white']} · الكريمي {BRAND['cream']}
   ===================================================================== */
:root{{
  /* ---------- 1) ألوان الهوية الأساسية ---------- */
  --brand-green: {BRAND['green']};
  --brand-gold: {BRAND['gold']};
  --brand-white: {BRAND['white']};
  --brand-cream: {BRAND['cream']};

  /* ---------- 2) السلالم اللونية المشتقة ---------- */
{block('green',green)}
{block('gold',gold)}
{block('cream',cream)}
{block('ink',ink)}
{block('red',red)}

  /* ---------- 3) الرموز الدلالية (استعملها في المكونات بدل القيم الخام) ---------- */
  --color-primary: var(--brand-green);
  --color-primary-hover: var(--green-800);
  --color-primary-soft: var(--green-50);
  --color-accent: var(--brand-gold);
  --color-accent-hover: var(--gold-600);
  --color-accent-soft: var(--gold-100);
  --surface-page: var(--brand-white);
  --surface-card: var(--brand-white);
  --surface-sunken: var(--brand-cream);
  --surface-strong: var(--brand-green);
  --text-strong: var(--ink-900);
  --text-body: var(--ink-700);
  --text-muted: var(--ink-500);
  --text-on-dark: var(--brand-white);
  --text-on-dark-muted: var(--green-200);
  --text-link: var(--green-600);
  --line: #e3ded0;
  --line-strong: #cfc8b4;
  --line-on-dark: rgba(255,255,255,.14);
  --success: var(--green-500);
  --success-bg: var(--green-50);
  --warning: var(--gold-600);
  --warning-bg: var(--gold-50);
  --danger: var(--red-500);
  --danger-bg: var(--red-50);
  --info: var(--green-600);
  --info-bg: var(--cream-100);
  --focus: var(--gold-500);

  /* ---------- 4) الخط والحجم (خط أساسي واحد) ---------- */
  --font: 'Cairo','Segoe UI',Tahoma,'OfflineAr',Arial,sans-serif;
  --fs-display: clamp(2.25rem, 1.6rem + 2.4vw, 3.25rem);
  --fs-h1: clamp(1.7rem, 1.35rem + 1.2vw, 2.25rem);
  --fs-h2: clamp(1.35rem, 1.2rem + .6vw, 1.65rem);
  --fs-h3: 1.2rem;
  --fs-h4: 1.05rem;
  --fs-body: 1rem;
  --fs-small: .9rem;
  --fs-caption: .8rem;
  --fs-button: .95rem;
  --fs-table: .9rem;
  --fw-regular: 400; --fw-medium: 600; --fw-bold: 700; --fw-black: 800;
  --lh-tight: 1.3; --lh-snug: 1.5; --lh-body: 1.85;

  /* ---------- 5) المسافات والأبعاد ---------- */
  --sp-1: .25rem; --sp-2: .5rem; --sp-3: .75rem; --sp-4: 1rem; --sp-5: 1.5rem; --sp-6: 2rem; --sp-7: 3rem; --sp-8: 4rem;
  --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 22px; --r-pill: 999px;
  --bw: 1px;
  --sidebar-w: 280px; --topbar-h: 64px; --content-max: 1120px; --reading-max: 68ch;

  /* ---------- 6) الظلال والحركة ---------- */
  --sh-1: 0 1px 2px rgba(26,71,49,.07);
  --sh-2: 0 4px 16px rgba(26,71,49,.09);
  --sh-3: 0 14px 38px rgba(16,40,28,.16);
  --ease: cubic-bezier(.2,.7,.2,1);
  --t-fast: .15s; --t-base: .25s; --t-slow: .45s;

  /* ---------- 7) طبقات العرض ---------- */
  --z-sticky: 40; --z-topbar: 45; --z-fnav: 54; --z-scrl: 55; --z-sidebar: 60; --z-fab: 62;
  --z-board: 90; --z-modal: 100; --z-help: 110; --z-toast: 120; --z-video: 130;
}}

/* ---------- وضع التباين العالي (خيار في أدوات العرض) ---------- */
:root.hc{{
  --line: #000; --line-strong: #000;
  --text-body: #000; --text-muted: #1a1a1a; --text-strong: #000;
  --color-primary: #0b2a1b; --color-accent: #8a5a00;
  --focus: #000;
}}
"""
os.makedirs('assets/css',exist_ok=True); open('assets/css/tokens.css','w',encoding='utf-8').write(css)
print(css[600:2100])
