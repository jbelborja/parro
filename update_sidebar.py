import re

with open('themes/parroquia/layouts/partials/sidebar.html', 'r') as f:
    content = f.read()

# Find the start of <aside class="sidebar-module">
aside_start = content.find('<aside class="sidebar-module">')
if aside_start != -1:
    header_logic = content[:aside_start]
    
    new_aside = """
{{ $hasModule := (and $sidebarModule (not $sidebarModule.Params.draft)) }}
{{ $hasRecent := (and $recentPages (ne .Section "sacramentos")) }}

{{ if or $hasModule $hasRecent }}
<aside class="sidebar-module">
    {{ if $hasModule }}
        {{ if $sidebarModule.Title }}
        <h3>{{ $sidebarModule.Title }}</h3>
        {{ end }}
        <div class="sidebar-content">
            {{ $sidebarModule.Content }}
        </div>
    {{ end }}

    {{ if $hasRecent }}
    <div class="sidebar-recent-posts" {{ if $hasModule }}style="margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border-color);"{{ end }}>
        <h4 style="font-size: 1.1rem; color: var(--primary); margin-bottom: 15px; font-weight: 600;">Últimas publicaciones</h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
            {{ range $recentPages }}
            <li style="margin-bottom: 12px; line-height: 1.4;">
                <a href="{{ .Permalink }}" style="color: var(--primary); text-decoration: none; font-weight: 500; font-size: 0.92rem; display: block; transition: var(--transition);">
                    {{ .Title }}
                </a>
                {{ if not .Date.IsZero }}
                <span style="font-size: 0.8rem; color: var(--text-light); display: block; margin-top: 2px;">
                    📅 {{ .Date.Format "02-01-2006" }}
                </span>
                {{ end }}
            </li>
            {{ end }}
        </ul>
    </div>
    {{ end }}
</aside>
{{- end -}}
"""
    
    # We need to compute $recentPages before
    logic_to_insert = """
    {{/* Obtener la sección/categoría actual para listar los últimos 5 artículos */}}
    {{ $sec := .Section }}
    {{ $cats := .Params.categories }}
    {{ $recentPages := .Site.RegularPages }}

    {{ if $cats }}
        {{ $catName := index $cats 0 }}
        {{ $byCat := where .Site.RegularPages "Params.categories" "intersect" (slice $catName) }}
        {{ if gt (len $byCat) 0 }}
            {{ $recentPages = $byCat }}
        {{ end }}
    {{ else if $sec }}
        {{ $bySection := where .Site.RegularPages "Section" $sec }}
        {{ if gt (len $bySection) 0 }}
            {{ $recentPages = $bySection }}
        {{ end }}
    {{ end }}

    {{ $recentPages = first 5 (sort $recentPages "Date" "desc") }}
"""
    
    with open('themes/parroquia/layouts/partials/sidebar.html', 'w') as f:
        f.write(header_logic + logic_to_insert + new_aside)

print("done")
