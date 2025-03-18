#include <Flashlight.h>

void blink(int times, int delay_time)
{
    for (int i = 0; i < 5; i++)
    {
        analogWrite(ESP32_LED_PIN, 7);
        delay(delay_time);
        analogWrite(ESP32_LED_PIN, 0);
        delay(delay_time);
    }
}

void fade(int delay_time)
{
    for (int i = 0; i < 4; i++)
    {
        analogWrite(ESP32_LED_PIN, i);
        delay(delay_time);
    }

    for (int i = 4; i > 0; i--)
    {
        analogWrite(ESP32_LED_PIN, i);
        delay(delay_time);
    }
}