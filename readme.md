# Atelier IoT - Forum des Maths

## Introduction

Bienvenue dans cet atelier IoT présenté lors du Forum des Maths ! L'objectif de cet atelier est d'introduire les plus jeunes au monde de l'Internet des Objets (IoT) en mettant en place un système interactif de monitoring de température et de gestion de LEDs. En explorant ce projet, les participants découvriront également les relations mathématiques sous-jacentes à ces technologies.

## Objectifs de l'atelier

- Comprendre les bases de l'IoT.
- Mettre en place un **dashboard** pour surveiller la température.
- Modifier la couleur d'une LED en fonction de la température mesurée.
- Découvrir les mathématiques appliquées dans ce projet (ex. interpolation des couleurs, conversion d'unités).

## Matériel requis

- **Carte de développement** (ESP32, Arduino, etc.).
- **Capteur de température I2C** (Grove Temperature Sensor).
- **LED RGB chaînable** (Grove Chainable RGB LED).
- **Ordinateur** avec environnement de développement configuré (ex. VS Code, PlatformIO, Bun).

## Fonctionnalités principales

- **Lecture des valeurs de température en temps réel** grâce au capteur Grove I2C.
- **Affichage des valeurs sur un dashboard interactif**.
- **Changement de couleur de la LED** en fonction de la température :
  - **Vert** : Température basse.
  - **Rouge** : Température élevée.

## Explication mathématique

### 1. Interpolation linéaire des couleurs

L'intensité de chaque canal (Rouge, Vert, Bleu) est calculée en fonction de la température :

$$ C*{out} = \dfrac{T - T*{min}}{T*{max} - T*{min}} \times (C*{max} - C*{min}) + C\_{min} $$

où :

$$ \begin{align*} \\\\ - & \ T \text{ est la température actuelle}, \\\\ - & \ T_{min}, T_{max} \text{ sont les valeurs limites}, \\\\ - & \ C_{min}, C_{max} \text{ sont les couleurs associées aux températures min et max}. \end{align*} $$

L'algorithme utilisé est le suivant :

```cpp
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
```
