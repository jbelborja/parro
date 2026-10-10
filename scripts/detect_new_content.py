#!/usr/bin/env python3
"""
Script para detectar nuevo contenido en Hugo y generar un archivo JSON con metadatos
para el posterior envío de notificaciones push a través de Firebase.
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path
import yaml

BASE_URL = "https://jbelborja.github.io/parro/"

def get_new_files(base_ref):
    """
    Obtiene la lista de archivos añadidos usando git diff.
    """
    cmd = ["git", "diff", "--name-only", "--diff-filter=A", base_ref, "HEAD", "--", "content/"]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return [line.strip() for line in result.stdout.splitlines() if line.strip()]
    except subprocess.CalledProcessError as e:
        print(f"Error al ejecutar git diff: {e}\n{e.stderr}")
        sys.exit(2)

def parse_frontmatter(filepath):
    """
    Lee y parsea el frontmatter YAML de un archivo markdown.
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error al leer {filepath}: {e}")
        return None

    if not content.startswith("---"):
        return None

    parts = content.split("---", 2)
    if len(parts) < 3:
        return None
    
    try:
        return yaml.safe_load(parts[1])
    except yaml.YAMLError as e:
        print(f"Error al parsear YAML en {filepath}: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Detecta nuevo contenido en Hugo para notificaciones Push.")
    parser.add_argument("--base-ref", default="HEAD~1", help="Referencia base para git diff (por defecto HEAD~1)")
    parser.add_argument("--dry-run", action="store_true", help="Solo imprime los resultados sin escribir el archivo JSON")
    args = parser.parse_args()

    new_files = get_new_files(args.base_ref)
    
    # Filtrar solo archivos index.md
    index_files = [f for f in new_files if f.endswith("index.md")]
    
    results = []
    valid_topics = ["noticias", "toma-y-lee", "actividades"]
    
    for filepath in index_files:
        path = Path(filepath)
        
        # Determinar topic basado en la ruta: content/topic_name/...
        if len(path.parts) < 3 or path.parts[0] != "content":
            continue
            
        topic = path.parts[1]
        
        if topic not in valid_topics:
            continue
            
        frontmatter = parse_frontmatter(filepath)
        if not frontmatter:
            continue
            
        # Omitir borradores
        if frontmatter.get("draft", False):
            print(f"Omitiendo borrador: {filepath}")
            continue
            
        title = frontmatter.get("title", "Nuevo contenido")
        date_val = frontmatter.get("date", "")
        if not isinstance(date_val, str):
            date_val = str(date_val)
            
        # Construir URL
        # La ruta típica es content/topic/slug/index.md
        # path.parts[1:-1] equivale a ('topic', 'slug')
        url_path = "/".join(path.parts[1:-1])
        url = f"{BASE_URL}{url_path}/"
        
        results.append({
            "title": title,
            "topic": topic,
            "url": url,
            "date": date_val,
            "section": topic
        })

    if not results:
        print("No se encontró nuevo contenido para notificar.")
        sys.exit(1)
        
    print(f"Se encontraron {len(results)} nuevos contenidos:")
    for item in results:
        print(f"- {item['title']} ({item['topic']}) -> {item['url']}")
        
    if not args.dry_run:
        output_file = "/tmp/new_content.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print(f"Resultados guardados en {output_file}")
        
    # Salir con código 0 si se encontró contenido
    sys.exit(0)

if __name__ == "__main__":
    main()
