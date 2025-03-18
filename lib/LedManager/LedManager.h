#ifndef LEDMANAGER_H
#define LEDMANAGER_H

#include <ChainableLED.h>
#include <config.h>

class LedManager
{
public:
    LedManager(int dataPin, int clockPin, int numLeds);
    void init();
    void setLedColor(uint8_t ledIndex, uint8_t red, uint8_t green, uint8_t blue);
    int *computeColor(float temp);
    void alert();

private:
    ChainableLED leds;
    uint8_t R;
    uint8_t G;
    uint8_t B;
};

#endif