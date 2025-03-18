#ifndef TEMPERATURE_SENSOR_H
#define TEMPERATURE_SENSOR_H

#include "Seeed_MCP9808.h"
#include "config.h"

class TemperatureSensor
{
public:
    TemperatureSensor();
    bool init();
    float readTemperature();

private:
    MCP9808 sensor;
    void configureAlerts();
};

#endif