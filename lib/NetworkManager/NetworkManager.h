#ifndef ESP32_NETWORK_MANAGER_H
#define ESP32_NETWORK_MANAGER_H

#include <esp_wpa2.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Flashlight.h>

class NetworkManager
{
public:
    NetworkManager(const char *ssid, const char *password, const char *WPA2Username = " ");
    void init();
    bool isConnected();
    void scanNetworks();
    void httpPOST(String url, String data);

private:
    bool Connected;
    const char *ssid;
    const char *password;
    const char *WPA2Username;
    HTTPClient http;
};

#endif