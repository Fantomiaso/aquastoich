# AquaStoich

[![English](https://img.shields.io/badge/English-README-2d7d58)](README.md) [![Русский](https://img.shields.io/badge/Русский-README-2d7d58)](README.ru.md) [![Deutsch](https://img.shields.io/badge/Deutsch-README-2d7d58)](README.de.md) [![Español](https://img.shields.io/badge/Espa%C3%B1ol-README-2d7d58)](README.es.md)

## [⬇ Descargar AquaStoich 1.0a · Windows / macOS / Linux](https://github.com/Fantomiaso/aquastoich/releases/tag/v1.0a)

**La versión 1.0a está en fase de pruebas.** AquaStoich calcula la remineralización del agua de acuarios de agua dulce, los fertilizantes y las soluciones madre. Compruebe las dosis y el pH con mediciones antes de usar el agua preparada.

## Descarga e instalación

Descargue el paquete correspondiente de la [versión 1.0a](https://github.com/Fantomiaso/aquastoich/releases/tag/v1.0a): instalador o `.exe` portátil para Windows, `.dmg` para macOS, `.deb` para Debian/Ubuntu o `.AppImage` para Linux. El primer inicio utiliza inglés; en la barra superior puede elegir inglés, ruso, alemán o español. Los paquetes de prueba no están firmados con un certificado de desarrollador y el sistema operativo puede pedir confirmación.

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
- Busca primero los parámetros de agua y las proporciones iónicas exactos; usa los rangos permitidos si los valores exactos entran en conflicto. Los preajustes rellenan tanto los objetivos de agua como las proporciones y explican los conflictos al combinarse.
- Calcula el cambio de agua mezclando por separado el agua preparada y la que queda en el acuario. Las dosis bloqueadas no cambian.
- Muestra cationes, aniones, la contribución de cada aditivo y un balance de cargas aproximado. El pH estimado se puede calibrar con una medición.
- Registra pruebas de gotas con hora, notas, diferencia absoluta y cambio diario para la misma prueba y origen del agua.
- Gestiona varios acuarios con perfiles y registros separados. Estima el volumen de agua de acuarios rectangulares o cilíndricos a partir de medidas exteriores, espesor del vidrio, profundidad media del sustrato y distancia al borde; también permite introducirlo manualmente.
- Guarda con cada medición la luminaria, potencia, intensidad, hora de inicio, duración, temperatura de color, PAR y hasta ocho canales ajustables. Al principio no hay canales seleccionados; se pueden añadir canales de la lista o propios y fijar cada uno entre 0 y 100 %. Exporta a Excel (`.xlsx`) el registro del acuario elegido, con columnas para notas y valores de los canales.
- Permite añadir sustancias y mezclas propias mediante fórmulas o análisis iónico declarado. No incluye resinas.

## Instrucciones

Antes de calcular un cambio de agua, cree o elija un perfil en **Acuarios**. Para **Según dimensiones**, introduzca las medidas exteriores y los descuentos. La estimación no descuenta el agua desplazada por decoración o equipos. El selector superior determina el acuario activo; su volumen, valores iniciales y registro se guardan por separado. En **Registro de mediciones**, puede anotar la iluminación y usar **Exportar a Excel** para guardar los datos del acuario elegido. Las mediciones nuevas proponen los últimos ajustes de luz guardados para ese acuario. Al actualizar, el registro existente se asigna al primer acuario.

1. Elija **Preparación** o **Cambio de agua**. Introduzca el volumen, GH/KH/TDS del agua de origen y los iones conocidos. Para un cambio, añada también el volumen y la lectura de TDS del acuario. Si no dispone de una medición, deje TDS en blanco.
2. Rellene solo los objetivos necesarios. Un campo vacío se ignora; cero es válido. Abra **Rango permitido** bajo cada parámetro para fijar uno o ambos límites, incluso sin objetivo exacto. Uno o varios preajustes establecen objetivos de agua, sus rangos y proporciones iónicas. Use **Editar** junto a un preajuste para cambiar objetivos, límites y proporciones; **Restaurar original** recupera uno integrado. **+ Preajuste propio** crea uno nuevo, que se puede editar o eliminar. Los preajustes guardados permanecen en este dispositivo. Los rangos que se solapan se intersectan; los incompatibles se explican. Ajuste estos ejemplos a sus especies y mediciones. También puede establecer NO₃:PO₄ = 12:1 con límites opcionales.
3. Elija sustancias en **Sustancias y dosis**. Busque por nombre, sinónimo o fórmula. La etiqueta `+` o `−` indica el sentido del cambio por separado de la carga iónica, por ejemplo `+` con `Mg²⁺` o `−` con `NO₃⁻`. `PO₄ (Σ)` indica fosfato total. Ordene por nombre, efecto o sustancia/mezcla/solución.
4. Para una sal seca, elija forma y pureza, y dosificación seca o solución madre. Introduzca la masa y el volumen final; también puede calcular la masa para una dosis cómoda en mililitros.
5. Pulse **Calcular dosis**. Las filas automáticas se ajustan a los objetivos. Si edita una dosis, la fila pasa a modo manual. **Bloquear** fija sustancia, forma, solución y dosis.
6. Abra una tarjeta de resultado o una fila de la tabla para ver contribuciones. Tras mezclar y dejar reposar el agua, introduzca el pH medido en la calibración.
7. En el **Registro de mediciones**, anote la hora automática o manualmente y añada notas generales o de cada prueba.

## Límites del cálculo

Las concentraciones están en mg/l y las proporciones son por masa. Para los productos comerciales solo se calculan los componentes cuantitativos publicados; los contraiones desconocidos se muestran como desconocidos. HCO₃/CO₃ indican la adición nominal antes del equilibrio. Los equivalentes ácidos reducen el KH calculado. Los medios filtrantes sin fórmula de dosis fiable no reciben dosis calculada.

Puede introducir el TDS del agua de origen y de cada acuario, fijarlo como objetivo con un rango permitido y guardarlo en el registro en ppm. El TDS calculado suma a la lectura inicial la masa de los **iones conocidos** aportados por las dosis (mg/l, aproximadamente ppm en agua dulce). En un cambio de agua, primero se mezclan por volumen las lecturas del acuario y del agua de origen. La aplicación no convierte conductividad a TDS; la escala ppm del medidor puede diferir de esta estimación de masa. Los ingredientes no declarados, la precipitación y las reacciones también pueden alterar la lectura. Sin una medición inicial, el resultado aparece como desconocido y se bloquea el ajuste automático a un objetivo de TDS. Compruebe el resultado con el mismo medidor.

El pH se estima a partir de KH, fosfato y CO₂ disuelto supuesto a 25 °C. Los 5 mg/l iniciales de CO₂ se eligieron según un rango de pH comunicado para agua reposada: no son una medición ni una concentración de equilibrio universal. Otros tampones, intercambio gaseoso, precipitación, biología y temperatura pueden cambiar el pH real. El pH inicial por sí solo no determina el pH tras el intercambio de gases. El algoritmo no usa pH como objetivo exacto. La metodología se apoya en los [equilibrios de carbonato de USGS PHREEQC](https://water.usgs.gov/water-resources/software/PHREEQC/documentation/phreeqc3-html/phreeqc3-77.htm), los [datos de fosfato del NIST](https://www.nist.gov/system/files/documents/srd/jpcrd615.pdf), los [métodos de alcalinidad del USGS](https://or.water.usgs.gov/alk/methods.html) y el [modelo de intercambio gaseoso del USGS](https://water.usgs.gov/water-resources/software/PHREEQC/documentation/phreeqc3-html/phreeqc3-69.htm). Compruebe siempre el pH calculado mediante una medición.

### Sustancias propias y registro de mediciones

En **Base de sustancias** se pueden añadir sustancias secas, mezclas secas o líquidos preparados. Introduzca el nombre químico, la fórmula de cada componente y su solubilidad a 20 °C en g/l. Para varias formas secas de una misma sustancia, añada por separado cada fórmula y solubilidad, por ejemplo MgSO₄ y MgSO₄·7H₂O. La forma elegida modifica las fracciones iónicas y la comprobación de la solución madre. En una mezcla seca indique las fracciones en masa; en un líquido, la masa de cada componente por litro. La aplicación reconoce sales iónicas habituales, incluidos paréntesis e hidratos. Para productos complejos con análisis cuantitativo conocido, introduzca manualmente los iones en mg/g de producto seco o mg/ml de líquido; el nombre comercial por sí solo no demuestra la composición. Los nombres comerciales y comunes van en **Nombres alternativos** y participan en la búsqueda. El aviso de solubilidad es aproximado, sobre todo para mezclas.

En **Registro de mediciones**, elija el acuario y la procedencia del agua, anote las pruebas de gotas y añada una nota general o notas individuales. La hora se inserta al guardar, salvo que se seleccione la entrada manual. Si falta una prueba, añada una prueba personalizada con su unidad. Las diferencias solo comparan la misma prueba, procedencia y acuario. La tasa diaria es el cambio neto de concentración; no descuenta dosis, cambios de agua, dilución ni errores de medida, por lo que no representa por sí sola el consumo biológico. La iluminación y hasta ocho canales se guardan con cada entrada y se exportan a Excel.

## Datos de composición y metodología

Ca, Mg, K, Na, Fe y los oligoelementos se expresan como elementos; NO₃, PO₄, HCO₃, CO₃ y SO₄ como iones, todos en mg/l. GH se calcula a partir de Ca y Mg y KH a partir de la alcalinidad de bicarbonato y carbonato. Los valores GH/KH del agua de origen no revelan sus iones individuales. Las masas molares y las fracciones iónicas se calculan desde las fórmulas registradas. Con KH₂PO₄, el fosfato total se muestra como equivalente de PO₄, mientras que H₂PO₄⁻ se usa en el balance de cargas.

| Producto | Composición cuantitativa utilizada | Fuente |
| --- | --- | --- |
| WaterSci Remineral GH+ | Ca 27,54; Mg 6,48 g/l | [Ficha del producto](https://plantaqua.ru/products/62116684) |
| WaterSci Remineral KH+ | Na 26,21; K 7,65; HCO₃ 69,57; SO₄ 9,40 g/l | [Ficha del producto](https://xn--80aafzh6aw.xn--p1ai/catalog/vse_dlya_akvariuma/sredstva_dlya_vody/sredstva_dlya_vody_v_akvariume/30536/) |
| AQUAERUS IRON | Fe 7,00; Mn 1,30 g/l | [Ficha del producto](https://zaisy.ru/catalog/ryby/sredstva_po_ukhodu_za_akvariumom/udobreniya_dlya_rasteniy/150745/) |
| AQUAERUS MICRO+ | K 7,920; Fe 1,372; Mg 0,915; Mn 0,475; B 0,082; Mo 0,035; Cu 0,052; Zn 0,017; Co 0,008 g/l | [Ficha del producto](https://plantaqua.ru/products/35828202) |

La base integrada contiene 54 entradas, con hidratos habituales y productos de [AQUAYER](https://aquayer.com/ru/product/aquayer-smart-makro), [Seachem](https://www.seachem.com/calculators.php), [Dennerle](https://dennerle.com/en/products/plant-care-npk) y [Aqua Rebell](https://www.aqua-rebell.de/Aqua-Rebell-Makro-Basic-Nitrat-1000-ml). Las indicaciones de dosis del fabricante se convierten a mg/ml cuando hace falta. El sulfato de magnesio usa por defecto MgSO₄·7H₂O y el nitrato de calcio Ca(NO₃)₂·4H₂O; se pueden elegir formas anhidras. Indique la pureza real del envase. Para CaSO₄·2H₂O se toma como referencia una [solubilidad de 2 g/l a 20 °C](https://www.merckmillipore.com/INTL/en/product/Calcium-sulfate-dihydrate%2CMDA_CHEM-102160). Los avisos sobre soluciones concentradas son aproximados: temperatura, forma de la sal y otros solutos alteran la solubilidad. Prepare los concentrados por separado y compruebe que no aparezca precipitado.

**Discrepancia en WaterSci:** los valores publicados de Ca y Mg para GH+ equivalen a unos **5,35 °dGH** y el HCO₃ de KH+ a unos **3,20 °dKH** al añadir 1 ml a 1 l. Las fichas indican 8 °dGH y 4 °dKH, respectivamente. AquaStoich calcula con las concentraciones iónicas publicadas; verifique el resultado con pruebas de agua. No se conocen todos los contraiones de GH+ ni de los fertilizantes complejos, así que la carga faltante se muestra como desconocida y no se atribuye a Cl o SO₄. El Fe y Mn quelados aparecen como masa elemental total, fuera del balance de iones simples. Sin un análisis iónico completo tampoco se puede cerrar el balance del agua de origen.

## Compilar desde el código

Instale Node.js 24 y ejecute `npm install`, `npm test`, `npm start`. `npm run dist` crea paquetes para el sistema actual. El [flujo de publicación](.github/workflows/release.yml) crea paquetes de Windows, macOS y Linux y los marca **en pruebas**. La versión web de desarrollo se inicia con `node server.mjs` en `http://127.0.0.1:4173`.

## Herramientas relacionadas y licencia

[Seachem Dose Calculators](https://www.seachem.com/calculators.php) es sencillo para productos individuales de esa marca. [AquariumToolbox](https://aquariumtoolbox.com/) también cubre otras tareas y equipos del acuario. [AquaJocund](https://aquajocund.com/dry-fertilizer-stock-solution-calculator/) incluye planes semanales. AquaStoich combina el ajuste de varios aditivos a objetivos iónicos con el cálculo de volumen, los perfiles de acuarios y los registros de medición. Por ahora no planifica la fertilización semanal.

La [licencia](LICENSE.md) solo permite uso no comercial. Quien use el código fuente debe atribuir **AquaStoich by Fantomiaso** y enlazar al [proyecto original](https://github.com/Fantomiaso/aquastoich). El uso comercial requiere autorización escrita por separado.
