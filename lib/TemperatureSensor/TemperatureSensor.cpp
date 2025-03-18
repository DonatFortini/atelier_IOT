#include "TemperatureSensor.h"

TemperatureSensor::TemperatureSensor() {}

bool TemperatureSensor::init()
{
    if (sensor.init() != 0)
    {
        return false;
    }
    configureAlerts();
    return true;
}

void TemperatureSensor::configureAlerts()
{
    sensor.set_upper_limit(SET_UPPER_LIMIT_ADDR, UPPER_LIMIT);
    sensor.set_critical_limit(SET_CRITICAL_LIMIT_ADDR, CRITICAL_LIMIT);
    sensor.set_config(SET_CONFIG_ADDR, 0x0008);
}

float TemperatureSensor::readTemperature()
{
    float temperature = 0;
    sensor.get_temp(&temperature);
    return temperature;
}