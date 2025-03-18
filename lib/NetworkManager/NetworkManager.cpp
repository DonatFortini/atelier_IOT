#include <NetworkManager.h>

NetworkManager::NetworkManager(const char *ssid, const char *password, const char *WPA2Username)
{
    this->ssid = ssid;
    this->password = password;
    this->WPA2Username = WPA2Username;

    Connected = false;
}

void NetworkManager::init(void)
{

    scanNetworks();

    if (WPA2Username != " ")
    {
        Serial.println("Connecting to WPA2 Enterprise WiFi");
        WiFi.disconnect();
        WiFi.mode(WIFI_STA);

        esp_wifi_sta_wpa2_ent_clear_identity();
        esp_wifi_sta_wpa2_ent_clear_username();
        esp_wifi_sta_wpa2_ent_clear_password();

        esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)WPA2Username, strlen(WPA2Username));
        esp_wifi_sta_wpa2_ent_set_username((uint8_t *)WPA2Username, strlen(WPA2Username));
        esp_wifi_sta_wpa2_ent_set_password((uint8_t *)password, strlen(password));

        esp_wifi_sta_wpa2_ent_enable();
        WiFi.begin(ssid);
    }
    else
    {
        Serial.println("Connecting to WiFi");
        WiFi.begin(ssid, password);
    }

    int connectionAttempts = 0;
    int maxAttempts = 20;

    while (WiFi.status() != WL_CONNECTED && connectionAttempts < maxAttempts)
    {
        connectionAttempts++;
        fade(1000);

        if (connectionAttempts % 3 == 0)
        {
            scanNetworks();
            delay(500);
        }
    }

    if (WiFi.status() == WL_CONNECTED)
    {
        Connected = true;
        Serial.println("Connected to WiFi successfully!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
        blink(1, 300);
    }
    else
    {
        Serial.println("Failed to connect to WiFi after maximum attempts");
        blink(3, 200);
    }
}

bool NetworkManager::isConnected(void)
{
    return WiFi.status() == WL_CONNECTED;
}

void NetworkManager::scanNetworks()
{
    Serial.println("Scanning for networks...");
    WiFi.scanDelete();
    int n = WiFi.scanNetworks(true, true, false, 2000);

    while (n == WIFI_SCAN_RUNNING)
    {
        delay(2000);
        n = WiFi.scanComplete();
    }

    Serial.println("Scan done");

    if (n < 0)
    {
        Serial.print("Scan error: ");
        Serial.println(n);
    }
    else if (n == 0)
    {
        Serial.println("No networks found");
    }
    else
    {
        Serial.print(n);
        Serial.println(" networks found");
        Serial.println("Nr | SSID                             | RSSI | CH | Encryption");
        for (int i = 0; i < n; ++i)
        {
            Serial.printf("%2d", i + 1);
            Serial.print(" | ");
            Serial.printf("%-32.32s", WiFi.SSID(i).c_str());
            Serial.print(" | ");
            Serial.printf("%4d", WiFi.RSSI(i));
            Serial.print(" | ");
            Serial.printf("%2d", WiFi.channel(i));
            Serial.print(" | ");
            switch (WiFi.encryptionType(i))
            {
            case WIFI_AUTH_OPEN:
                Serial.print("open");
                break;
            case WIFI_AUTH_WEP:
                Serial.print("WEP");
                break;
            case WIFI_AUTH_WPA_PSK:
                Serial.print("WPA");
                break;
            case WIFI_AUTH_WPA2_PSK:
                Serial.print("WPA2");
                break;
            case WIFI_AUTH_WPA_WPA2_PSK:
                Serial.print("WPA+WPA2");
                break;
            case WIFI_AUTH_WPA2_ENTERPRISE:
                Serial.print("WPA2-EAP");
                break;
            case WIFI_AUTH_WPA3_PSK:
                Serial.print("WPA3");
                break;
            case WIFI_AUTH_WPA2_WPA3_PSK:
                Serial.print("WPA2+WPA3");
                break;
            case WIFI_AUTH_WAPI_PSK:
                Serial.print("WAPI");
                break;
            default:
                Serial.print("unknown");
            }
            Serial.println();
            delay(10);
        }
    }
    Serial.println("");
}

void NetworkManager::httpPOST(String url, String data)
{
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(data);
    if (httpResponseCode < 0)
    {
        Serial.println("Error on sending POST: " + http.errorToString(httpResponseCode));
    }
    http.end();
}
