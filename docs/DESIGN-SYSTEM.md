# نظام التصميم — ديوان قطاع الشباب والرياضة
المرجع الحيّ: افتح `design-system.html`. هذا الملف يشرح القواعد.

## 1) الهوية
| العنصر | القيمة | الرمز |
|---|---|---|
| الأخضر الداكن (أساسي) | `#1a4731` | `--brand-green` |
| الذهبي (تمييزي) | `#c9993a` | `--brand-gold` |
| الأبيض | `#FFFFFF` | `--brand-white` |
| الكريمي (خلفيات ثانوية) | `#F7F4EC` | `--brand-cream` |

الدرجات المشتقة (`--green-50…950` و`--gold-50…800` و`--cream-50…300` و`--ink-*` و`--red-*`) تُولَّد بالمزج مع الأبيض/الأسود. **الأحمر للأخطاء فقط.**
**العبارة الثابتة**: «لنبني صروح الفكر، لا نكن معاول هدم» (كما في الشعار) — في تذييل الصفحة والشريط الجانبي وشاشة الدخول.

## 2) قواعد الاستعمال
- الأخضر: الشريط الجانبي، الـHero، الأزرار الرئيسية، العناوين الفرعية.
- الذهبي: الإجراء المهم الواحد في الشاشة، المؤشرات (الحالة النشطة، الخط تحت العنوان)، الإطارات التمييزية.
- الأبيض: أسطح المحتوى. الكريمي: الأقسام الثانوية والجداول (رأس الجدول) والبطاقات الثانوية.
- الرسوم البيانية: الأخضر الداكن + الذهبي ودرجاتهما فقط.
- لا تدرّجات لونية مبالغ فيها، ولا زجاجية، ولا إيموجي ملوّن. الأيقونات من المجموعة الموحدة فقط.

## 3) الطباعة
خط أساسي واحد: **Cairo** (مع `Segoe UI` و`Tahoma` وخط احتياطي مضمّن).
| الدور | الرمز | الحجم | الوزن |
|---|---|---|---|
| Display | `--fs-display` | 2.25–3.25rem | 800 |
| H1 | `--fs-h1` | 1.7–2.25rem | 800 |
| H2 | `--fs-h2` | 1.35–1.65rem | 800 |
| H3 | `--fs-h3` | 1.2rem | 700 |
| Body | `--fs-body` | 1rem (سطر 1.85) | 400 |
| Caption | `--fs-caption` | .8rem | 600 |
| Button | `--fs-button` | .95rem | 700 |
| Table | `--fs-table` | .9rem | 400 |

## 4) المسافات والحواف والظلال والحركة
`--sp-1…8` (من .25rem إلى 4rem) · `--r-sm/md/lg/xl/pill` (8/12/16/22/999) · `--sh-1/2/3` ظلال خفيفة بلون أخضر · `--t-fast/base/slow` و`--ease` للانتقالات.
التأثيرات: رفع 1–3px عند المرور، ظهور تدريجي للنوافذ. تُعطَّل كلها مع `prefers-reduced-motion`.

## 5) التخطيط والاستجابة
- الشبكة: شريط جانبي 280px على اليمين + عمود رئيسي (محتوى حتى 1120px).
- ≥1024px: شريط جانبي ثابت. <1024px: درج (Drawer) يُفتح بزر ☰ وبحث يتحول إلى أيقونة عند <760px.
- RTL: كل المحاذاة والهوامش بخصائص منطقية (`inline-start/end`)، والأسهم والأيقونات الاتجاهية مقلوبة صحيحًا.

## 6) المكونات القابلة لإعادة الاستعمال
| المكوّن | الصنف | الملف |
|---|---|---|
| Header | `.topbar` | layout.css |
| Sidebar + Navigation | `.sidebar` `.nav-item` `.sb-*` | layout.css |
| Footer | `.site-footer` `.sf-*` | layout.css |
| Logo | `.sb-brand img` `.m-logo` `.hero-logo` `.sf-brand img` | layout/components/pages |
| Breadcrumb | `.crumbs` | layout.css |
| Button | `.btn` `.btn.sec` `.btn.gold` `.btn.ghost` `.btn.sm/.lg/.icon` | components.css |
| Pill / Chip / Badge | `.pill` `.chip` `.badge(.gold/.red/.muted/.solid)` | components.css |
| Card | `.card` `.card.cream` `.card.accent` `.card.hover` | components.css |
| Stat Card | `.stats` `.stat(.dark)` | components.css |
| Table | `.tblw` `.tbl` | components.css |
| Form / Input / Select | `.field` + عناصر `input/select/textarea` | base.css + components.css |
| Modal | `.modal` `.modal-card` `.modal-head/.modal-body` | components.css |
| Alert | `.alert(.success/.warning/.danger)` | components.css |
| Tabs | `.tabs-ui` `.tab-ui` | components.css |
| Pagination | `.pager` | components.css |
| Search | `.search` `.search-res` | components.css |
| Notifications | `.nf-wrap` `.nf-panel` `.nf-item` | components.css |
| Empty State | `.empty` | components.css |
| Loading State | `.skeleton` `.spinner` | components.css |
| Charts / Progress | `.chart` `.cols-chart` `.hbars` `.progress` | components.css |
| Stepper (محطات الرحلة) | `.track` `.node` | pages.css |
| Toast | `.toast` | layout.css |
| معاينة البطاقة (Canvas) | `.studio-grid` `.studio-preview` | pages.css |
| عدّاد الاستطلاع | `.pcounts` `.pcount` | pages.css |
| ساعة الحصة ومفاتيح النشاط | `.live-clock` `.phase-btns` `.phase` | pages.css |
| قائمة الأسئلة | `.qlist` | pages.css |

## 7) الأيقونات
`assets/js/icons.js` — 60 أيقونة بخط 1.75 على شبكة 24px. في القوالب: `ico('home')` أو `ico('check','sm')`. لإضافة أيقونة: أضف مدخلًا في `ICONS` فتظهر تلقائيًا في صفحة نظام التصميم.

## 8) قاعدة التطوير
أي صفحة جديدة تُبنى من هذه المكونات فقط. إن احتجت مكوّنًا جديدًا فأضفه إلى `components.css` بالرموز، ثم أضفه إلى `design-system.html` ليبقى المرجع كاملًا.
