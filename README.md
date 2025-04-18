# iot-monitoreo

# servicios
# nano docker-compose.yml
version: '3'

services:
  emqx:
    image: emqx/emqx:latest
    container_name: emqx
    restart: always
    ports:
      - "1883:1883"        # Puerto MQTT
      - "8883:8883"        # Puerto MQTT seguro (TLS)
      - "8083:8083"        # Web dashboard de EMQX
      - "18083:18083" # Dashboard de EMQX (Interfaz Web)
    environment:
      - EMQX_NODE_NAME=emqx@emqx
      - EMQX_LISTENER__TCP__DEFAULT=1883
      - EMQX_LISTENER__SSL__DEFAULT=8883
    volumes:
      - ./data/emqx/data:/opt/emqx/data
      - ./data/emqx/log:/opt/emqx/log

  influxdb:
    image: influxdb:latest
    container_name: influxdb
    restart: always
    environment:
      INFLUXDB_DB: mqtt_data  # Nombre de la base de datos
      INFLUXDB_ADMIN_USER: admin
      INFLUXDB_ADMIN_PASSWORD: admin_password
    ports:
      - "8086:8086"  # Puerto para la API HTTP de InfluxDB
    volumes:
      - ./data/influxdb:/var/lib/influxdb

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: always
    ports:
      - "3000:3000"  # Puerto para la interfaz web de Grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - ./data/grafana:/var/lib/grafana

    depends_on:
      - influxdb

  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: always
    ports:
      - "9000:9000"  # Puerto para acceder al dashboard de Portainer
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock  # Permite la gestión de Docker
      - ./data/portainer:/data  # Para persistir los datos de Portainer

volumes:
  emqx_data:
  emqx_log:
  influxdb_data:
  grafana_data:
  nodered_data:

  # data
  # mkdir emqx grafana influxdb nodered portainer
  -data
  --emqx
  --grafana
  --influxdb
  --nodered
  --portainer

  # permisos a carpetas
  sudo mkdir -p ./data/emqx/data ./data/emqx/log
  sudo chown -R 1000:1000 ./data/emqx

  sudo mkdir -p ./data/grafana
  sudo chown -R 472:472 ./data/grafana



  

