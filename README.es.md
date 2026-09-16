# AquaStoich

[![English](https://img.shields.io/badge/English-README-2d7d58)](README.md) [![Русский](https://img.shields.io/badge/Русский-README-2d7d58)](README.ru.md) [![Deutsch](https://img.shields.io/badge/Deutsch-README-2d7d58)](README.de.md) [![Español](https://img.shields.io/badge/Espa%C3%B1ol-README-2d7d58)](README.es.md)

## [⬇ Descargar AquaStoich 1.0 · Windows / macOS / Linux](https://github.com/Fantomiaso/aquastoich/releases/tag/v1.0.0)

**La versión 1.0 está en fase de pruebas.** AquaStoich calcula la remineralización del agua de acuarios de agua dulce, los fertilizantes y las soluciones madre. Compruebe las dosis y el pH con mediciones antes de usar el agua preparada.

## Descarga e instalación

Descargue el paquete correspondiente de la [versión 1.0](https://github.com/Fantomiaso/aquastoich/releases/tag/v1.0.0): instalador o `.exe` portátil para Windows, `.dmg` para macOS, `.deb` para Debian/Ubuntu o `.AppImage` para Linux. El primer inicio utiliza inglés; en la barra superior puede elegir inglés, ruso, alemán o español. Los paquetes de prueba no están firmados con un certificado de desarrollador y el sistema operativo puede pedir confirmación.

La aplicación funciona sin conexión ni cuenta. El cálculo, las sustancias propias, el registro y el idioma se guardan en la carpeta de datos del usuario:

| Sistema | Carpeta de datos |
| --- | --- |
| Windows | `%APPDATA%\AquaStoich` |
| macOS | `~/Library/Application Support/AquaStoich` |
| Linux | `${XDG_CONFIG_HOME:-~/.config}/AquaStoich` |

La versión web guarda sus datos por separado en el navegador. No existe una migración automática a la aplicación de escritorio.

## Funciones

- Calcula dosis a partir de objetivos de GH, KH, Ca, Mg, K, NO₃, PO₄, Fe y otros iones, y actualiza los resultados al cambiar una dosis.
- Calcula dosis secas y concentración de soluciones madre, con formas anhidras e hidratadas, pureza y aviso de solubilidad.
- Intenta primero la proporción iónica exacta y utiliza el rango permitido solo si esa proporción entra en conflicto con otros objetivos. Se pueden combinar preajustes con explicación de conflictos.
- Calcula el cambio de agua mezclando por separado el agua preparada y la que queda en el acuario. Las dosis bloqueadas no cambian.
- Muestra cationes, aniones, la contribución de cada aditivo y un balance de cargas aproximado. El pH estimado se puede calibrar con una medición.
- Registra pruebas de gotas con hora, notas, diferencia absoluta y cambio diario para la misma prueba y origen del agua.
- Gestiona varios acuarios con perfiles y registros separados. Estima el volumen de agua de acuarios rectangulares o cilíndricos a partir de medidas exteriores, espesor del vidrio, profundidad media del sustrato y distancia al borde; también permite introducirlo manualmente.
- Guarda con cada medición la luminaria, potencia, intensidad, hora de inicio, duración, temperatura de color y PAR. Exporta a Excel (`.xlsx`) el registro del acuario elegido, con columnas para notas de pruebas e iluminación.
- Permite añadir sustancias y mezclas propias mediante fórmulas o análisis iónico declarado. No incluye resinas.

## Instrucciones

Antes de calcular un cambio de agua, cree o elija un perfil en **Acuarios**. Para **Según dimensiones**, introduzca las medidas exteriores y los descuentos. La estimación no descuenta el agua desplazada por decoración o equipos. El selector superior determina el acuario activo; su volumen, valores iniciales y registro se guardan por separado. En **Registro de mediciones**, puede anotar la iluminación y usar **Exportar a Excel** para guardar los datos del acuario elegido. Las mediciones nuevas proponen los últimos ajustes de luz guardados para ese acuario. Al actualizar, el registro existente se asigna al primer acuario.

1. Elija **Preparación** o **Cambio de agua**. Introduzca el volumen, GH/KH del agua de origen y los iones conocidos. Para un cambio, añada también volumen y valores iniciales del acuario.
2. Rellene solo los objetivos necesarios. Un campo vacío se ignora; cero es un objetivo válido. Puede establecer una proporción como NO₃:PO₄ = 12:1 y límites mínimo y máximo.
3. Elija sustancias en **Sustancias y dosis**. Busque por nombre, sinónimo o fórmula; filtre efectos `Mg+`, `KH−`, etc. Ordene por nombre, efecto o sustancia/mezcla/solución.
4. Para una sal seca, elija forma y pureza, y dosificación seca o solución madre. Introduzca la masa y el volumen final; también puede calcular la masa para una dosis cómoda en mililitros.
5. Pulse **Calcular dosis**. Las filas automáticas se ajustan a los objetivos. Si edita una dosis, la fila pasa a modo manual. **Bloquear** fija sustancia, forma, solución y dosis.
6. Abra una tarjeta de resultado o una fila de la tabla para ver contribuciones. Tras mezclar y dejar reposar el agua, introduzca el pH medido en la calibración.
7. En el **Registro de mediciones**, anote la hora automática o manualmente y añada notas generales o de cada prueba.

## Límites del cálculo

Las concentraciones están en mg/l y las proporciones son por masa. Para los productos comerciales solo se calculan los componentes cuantitativos publicados; los contraiones desconocidos se muestran como desconocidos. HCO₃/CO₃ indican la adición nominal antes del equilibrio. Los equivalentes ácidos reducen el KH calculado. Los medios filtrantes sin fórmula de dosis fiable no reciben dosis calculada.

El pH se estima a partir de KH, fosfato y CO₂ disuelto supuesto a 25 °C. Los 5 mg/l iniciales de CO₂ se eligieron según un rango de pH comunicado para agua reposada y no son una medición. Otros tampones, intercambio gaseoso, precipitación, biología y temperatura pueden cambiar el pH real. El algoritmo no usa pH como objetivo exacto. Consulte las [fuentes de composición](README.ru.md#исходные-данные-и-ограничения) y la metodología detallada.

## Compilar desde el código

Instale Node.js 24 y ejecute `npm install`, `npm test`, `npm start`. `npm run dist` crea paquetes para el sistema actual. El [flujo de publicación](.github/workflows/release.yml) crea paquetes de Windows, macOS y Linux y los marca **en pruebas**. La versión web de desarrollo se inicia con `node server.mjs` en `http://127.0.0.1:4173`.

## Herramientas relacionadas y licencia

[Seachem Dose Calculators](https://www.seachem.com/calculators.php) es sencillo para productos individuales de esa marca. [AquariumToolbox](https://aquariumtoolbox.com/) también cubre dimensiones y equipos. [AquaJocund](https://aquajocund.com/dry-fertilizer-stock-solution-calculator/) incluye planes semanales. AquaStoich se centra en ajustar conjuntamente varios aditivos a objetivos iónicos y explicar sus contribuciones; por ahora no calcula geometría ni planes semanales.

La [licencia](LICENSE.md) solo permite uso no comercial. Quien use el código fuente debe atribuir **AquaStoich by Fantomiaso** y enlazar al [proyecto original](https://github.com/Fantomiaso/aquastoich). El uso comercial requiere autorización escrita por separado.
