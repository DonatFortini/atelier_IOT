#ifndef ESP32_CONFIG_H
#define ESP32_CONFIG_H

// Temperature sensor settings
#define MIN_TEMP 0x014       // 0 degrees
#define UPPER_LIMIT 0x01e    // 30 degrees
#define CRITICAL_LIMIT 0x020 // 32 degrees
#define I2C_SDA 0x0e         // GPIO 14
#define I2C_SCL 0x0f         // GPIO 15

#define ESP32_LED_PIN 4 // Built-in LED pin for AI-Thinker ESP32-CAM (GPIO4)

// Chainable LED settings
#define CHAINABLE_LED_DATA_PIN 0x0c
#define CHAINABLE_LED_CLK_PIN 0x0d

// // WPA2 Enterprise settings
// #define WIFI_SSID ""
// #define WIFI_PASS ""
// #define WPA2_USERNAME ""

// WPA Personal settings
#define WIFI_SSID "dragino-275f7a"
#define WIFI_PASS "dragino+dragino"

// API settings
#define API_HOST "http://10.130.1.102"
#define API_PORT 7541
#define API_ENDPOINT "/api/temperature"

#endif