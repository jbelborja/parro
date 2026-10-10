#!/usr/bin/env python3
"""
Script para leer los contenidos nuevos detectados y enviar notificaciones
push a través de Firebase Cloud Messaging (FCM).
"""
import json
import os
import sys

import firebase_admin
from firebase_admin import credentials, messaging

def get_body_for_section(section, title):
    """
    Genera un texto descriptivo para el cuerpo de la notificación según la sección.
    """
    if section == "noticias":
        return f"Nueva noticia: {title}"
    elif section == "toma-y-lee":
        return f"Nueva publicación en Toma y Lee: {title}"
    elif section == "actividades":
        return f"Nueva actividad: {title}"
    return f"Nuevo contenido: {title}"

def main():
    json_path = "/tmp/new_content.json"
    
    if not os.path.exists(json_path):
        print(f"Archivo {json_path} no encontrado. No hay notificaciones para enviar.")
        sys.exit(0)
        
    with open(json_path, 'r', encoding='utf-8') as f:
        try:
            content_list = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error al leer JSON en {json_path}: {e}")
            sys.exit(1)
            
    if not content_list:
        print("La lista de contenidos está vacía.")
        sys.exit(0)

    # Inicializar Firebase
    if "FIREBASE_SERVICE_ACCOUNT_KEY" in os.environ:
        try:
            cert_dict = json.loads(os.environ["FIREBASE_SERVICE_ACCOUNT_KEY"])
            cred = credentials.Certificate(cert_dict)
        except Exception as e:
            print(f"Error al cargar credenciales desde FIREBASE_SERVICE_ACCOUNT_KEY: {e}")
            sys.exit(1)
    elif "GOOGLE_APPLICATION_CREDENTIALS" in os.environ:
        cred = credentials.Certificate(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])
    else:
        print("Error: No se encontró FIREBASE_SERVICE_ACCOUNT_KEY o GOOGLE_APPLICATION_CREDENTIALS en las variables de entorno.")
        sys.exit(1)
        
    try:
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error al inicializar Firebase Admin SDK: {e}")
        sys.exit(1)
        
    sent_count = 0
    failed_count = 0
    
    for item in content_list:
        title = item.get("title", "")
        topic = item.get("topic", "")
        url = item.get("url", "")
        section = item.get("section", "")
        
        body = get_body_for_section(section, title)
        
        # Enviar tanto al topic de la sección como al topic general 'todas'
        condition = f"'{topic}' in topics || 'todas' in topics"
        
        # Construir el mensaje FCM
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data={
                "url": url,
                "section": section,
                "title": title
            },
            condition=condition,
            android=messaging.AndroidConfig(
                priority="high",
                notification=messaging.AndroidNotification(
                    channel_id="new_content_channel"
                )
            ),
            apns=messaging.APNSConfig(
                payload=messaging.APNSPayload(
                    aps=messaging.Aps(
                        sound="default",
                        badge=1
                    )
                )
            )
        )
        
        try:
            response = messaging.send(message)
            print(f"Éxito: Notificación enviada para '{title}' (Message ID: {response})")
            sent_count += 1
        except Exception as e:
            print(f"Error: No se pudo enviar notificación para '{title}': {e}")
            failed_count += 1
            
    print(f"\nResumen: {sent_count} enviadas, {failed_count} fallidas.")
    
    if failed_count > 0:
        sys.exit(1)
    
if __name__ == "__main__":
    main()
