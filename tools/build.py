"""يبني: dist/site (نسخة النشر) · dist/standalone.html (ملف واحد) · dist/diwan-prevention-project.zip (المشروع الكامل)"""
import re, base64, os, shutil, zipfile
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); D=R+'/dist'
rd=lambda p:open(R+'/'+p,encoding='utf-8').read()
b64=lambda p:base64.b64encode(open(R+'/'+p,'rb').read()).decode()
MIME={'webp':'image/webp','png':'image/png','jpg':'image/jpeg','woff':'font/woff','mp4':'video/mp4'}
def uri(p): return 'data:%s;base64,%s'%(MIME[p.rsplit('.',1)[1]],b64(p))

shutil.rmtree(D,ignore_errors=True); os.makedirs(D)
# ---------- 1) نسخة النشر (ملفات متعددة) ----------
site=D+'/site'; os.makedirs(site)
for f in ('index.html','design-system.html','manifest.webmanifest','sw.js','intro.mp4','README.md','.nojekyll'):
    if os.path.exists(R+'/'+f): shutil.copy(R+'/'+f,site+'/'+f)
for d in ('assets','docs'): shutil.copytree(R+'/'+d,site+'/'+d)
# ---------- 2) ملف واحد ----------
h=rd('index.html')
h=re.sub(r'<!--PWA-HEAD-->.*?<!--/PWA-HEAD-->\n?','',h,flags=re.S)
h=re.sub(r'<!--PWA-REG-->.*?<!--/PWA-REG-->\n?','',h,flags=re.S)
h=re.sub(r'\s+srcset="[^"]*"','',h)
def css(m):
    c=rd(m.group(1))
    c=re.sub(r'url\(\.\./fonts/([\w.-]+)\)',lambda x:'url(%s)'%uri('assets/fonts/'+x.group(1)),c)
    return '<style>\n'+c+'\n</style>'
h=re.sub(r'<link rel="stylesheet" href="(assets/css/[\w.-]+\.css)">',css,h)
def js(m):
    c=rd(m.group(1)); assert '</script' not in c
    if m.group(1).endswith('app.js'):
        assert "const VIDEO_SRC='intro.mp4';" in c
        c=c.replace("const VIDEO_SRC='intro.mp4';","const VIDEO_SRC='%s';"%uri('intro.mp4'))
    return '<script>\n'+c+'\n</script>'
h=re.sub(r'<script src="(assets/js/[\w.-]+\.js)"></script>',js,h)
imgs=sorted({m for m in re.findall(r'(?<![/\w])(assets/img/[\w.-]+\.(?:webp|png|jpg))',h)})
for p in imgs: h=re.sub(r'(?<![/\w])'+re.escape(p),lambda m,p=p:uri(p),h)
open(D+'/standalone.html','w',encoding='utf-8').write(h)
# ---------- 2ب) صفحة نظام التصميم كملف واحد ----------
d=rd('design-system.html')
d=re.sub(r'<link rel="stylesheet" href="(assets/css/[\w.-]+\.css)">',css,d)
d=re.sub(r'<script src="(assets/js/[\w.-]+\.js)"></script>',js,d)
for p_ in sorted({m for m in re.findall(r'(?<![/\w])(assets/img/[\w.-]+\.(?:webp|png|jpg))',d)}): d=re.sub(r'(?<![/\w])'+re.escape(p_),lambda m,p_=p_:uri(p_),d)
d=re.sub(r'\s+srcset="[^"]*"','',d)
open(D+'/design-system-standalone.html','w',encoding='utf-8').write(d)
# ---------- 3) المشروع الكامل ----------
with zipfile.ZipFile(D+'/diwan-prevention-project.zip','w',zipfile.ZIP_DEFLATED) as z:
    for root,dirs,files in os.walk(R):
        dirs[:]=[d for d in dirs if d not in ('dist','raw','__pycache__','.git')]
        for f in files:
            p=os.path.join(root,f); z.write(p,os.path.relpath(p,R))
print('site:',len(os.listdir(site)),'items | standalone: %.2f MB | zip: %.2f MB'%(os.path.getsize(D+'/standalone.html')/1e6,os.path.getsize(D+'/diwan-prevention-project.zip')/1e6))
print('inlined images:',len(imgs))
