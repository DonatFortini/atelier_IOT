#include <Arduino.h>
#include <Wire.h>
#include <config.h>

// special include for the MCP9808 sensor
// because of the Wire.begin() hardcoded in the library
// we need to initialize the I2C bus before including the library
// this is a workaround for using the library with different I2C pins
void initI2C() { Wire.begin(I2C_SDA, I2C_SCL, 100000); }

#include <LedManager.h>
#include <NetworkManager.h>
#include <TemperatureSensor.h>
auto i2cInitialized = (initI2C(), true);
NetworkManager networkManager(WIFI_SSID, WIFI_PASS);
TemperatureSensor temperatureSensor;
LedManager ledManager(CHAINABLE_LED_DATA_PIN, CHAINABLE_LED_CLK_PIN, 1);

void setup() {
  Serial.begin(115200);

  if (!temperatureSensor.init())
    Serial.println("Temperature sensor initialization failed!");

  networkManager.init();

  Serial.println("Initialization complete!");
}

void loop() {
  float temperature = temperatureSensor.readTemperature();
  int *colors = ledManager.computeColor(temperature);
  ledManager.setLedColor(0, colors[0], colors[1], colors[2]);
  if (temperature > CRITICAL_LIMIT)
    ledManager.alert();
  Serial.printf("Temperature: %.2f°C\n", temperature);
  Serial.printf("RGB: %d, %d, %d\n", colors[0], colors[1], colors[2]);
  const String data = "{\"id\":1,\"temperature\":" + String(temperature) +
                      ",\"upper_limit\":" + String(UPPER_LIMIT) +
                      ",\"critical_limit\":" + String(CRITICAL_LIMIT) +
                      ",\"color\":[" + String(colors[0]) + "," +
                      String(colors[1]) + "," + String(colors[2]) + "]}";
  if (networkManager.isConnected())
    networkManager.httpPOST(
        String(API_HOST) + ":" + String(API_PORT) + String(API_ENDPOINT), data);
  delay(100);
}