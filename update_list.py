import re

with open('themes/parroquia/layouts/_default/list.html', 'r') as f:
    content = f.read()

old_html = """<div class="layout-with-sidebar">
    <div class="content-wrapper main-column">"""
new_html = """{{ $sidebarHtml := trim (partial "sidebar.html" .) " \\n\\r\\t" }}
<div class="{{ if $sidebarHtml }}layout-with-sidebar{{ else }}content-wrapper{{ end }}">
    <div class="content-wrapper main-column" {{ if not $sidebarHtml }}style="max-width: 100% !important; width: 100% !important; flex: none;"{{ end }}>"""

content = content.replace(old_html, new_html)

old_sidebar_call = """    {{ partial "sidebar.html" . }}
</div>"""
new_sidebar_call = """    {{ if $sidebarHtml }}
    {{ $sidebarHtml | safeHTML }}
    {{ end }}
</div>"""

content = content.replace(old_sidebar_call, new_sidebar_call)

with open('themes/parroquia/layouts/_default/list.html', 'w') as f:
    f.write(content)

print("done")
