#include <LedManager.h>

LedManager::LedManager(int dataPin, int clockPin, int numLeds) : leds(dataPin, clockPin, numLeds)
{
    R = 128;
    G = 0;
    B = 128;
}

void LedManager::init()
{
    leds.setColorRGB(0, this->R, this->G, this->B);
}

void LedManager::setLedColor(uint8_t ledIndex, uint8_t red, uint8_t green, uint8_t blue)
{
    leds.setColorRGB(ledIndex, red, green, blue);
}

int *LedManager::computeColor(float temp)
{
    static int colors[3];

    float minTemp = MIN_TEMP;
    float upperLimit = UPPER_LIMIT;

    int minColor[3] = {0, 255, 0};
    int maxColor[3] = {255, 0, 0};

    float ratio = (temp - minTemp) / (upperLimit - minTemp);
    if (temp > upperLimit)
        ratio = 1.0f;

    int colorflow[3] = {maxColor[0] - minColor[0], maxColor[1] - minColor[1], maxColor[2] - minColor[2]};
    colors[0] = (int)(minColor[0] + (colorflow[0] * ratio));
    colors[1] = (int)(minColor[1] + (colorflow[1] * ratio));
    colors[2] = (int)(minColor[2] + (colorflow[2] * ratio));

    return colors;
}

void LedManager::alert()
{
    leds.setColorRGB(0, 255, 0, 0);
    delay(500);
    leds.setColorRGB(0, 0, 0, 0);
    delay(500);
    leds.setColorRGB(0, 255, 0, 0);
    delay(500);
}