# Registro de cambios de AquaStoich

[English](CHANGELOG.md) · [Русский](CHANGELOG.ru.md) · [Deutsch](CHANGELOG.de.md) · Español

## 1.1a — sin publicar

Esta versión queda reservada para el análisis de mediciones y el registro con calendario. Sigue siendo una compilación local de prueba y aún no se ha subido ni publicado.

- Se añadió un gráfico de barras para la última semana, mes, tres meses, seis meses, año o un intervalo manual. En periodos de hasta tres meses se conserva cada día; los días sin mediciones aparecen como barras interpoladas bajo una envolvente de tendencia.
- Se añadieron el mínimo, el máximo, el cambio absoluto medio entre lecturas consecutivas y el cambio máximo. Al seleccionar ambas lecturas de comparación, las estadísticas abarcan todos los días completos entre ellas; en caso contrario usan el periodo actual del gráfico.
- El gráfico ahora usa una escala de valores adaptativa, una envolvente alineada con el centro de las barras y toda la anchura disponible sin dejar una cola vacía. Las concentraciones pequeñas y casi constantes usan un intervalo local, precisión decimal adaptativa y una altura mínima visible para las barras distintas de cero.
- Se pueden comparar dos lecturas: el clic izquierdo elige la primera y el derecho la segunda. Las tarjetas correspondientes explican estos controles. La primera no puede ser posterior a la segunda, ni la segunda anterior a la primera.
- Los subparámetros relacionados y los demás parámetros registrados aparecen en grupos cerrados inicialmente. Al abrir un grupo se abre a la vez el grupo correspondiente de la primera lectura, la segunda y la diferencia.
- Cada fila de la tarjeta Diferencia incluye columnas rotuladas para cambio, promedio, mínimo, máximo y cambio máximo. Las celdas de mínimo, máximo y cambio máximo resaltan sus mediciones en todos los niveles del calendario; el promedio es únicamente informativo.
- Al seleccionar un día vacío se muestran todos los parámetros que pueden interpolarse linealmente entre las mediciones reales más cercanas, junto con una nota y las horas de origen.
- El estado abierto o cerrado de los grupos de parámetros relacionados y adicionales se conserva al cambiar de periodo y después de reiniciar la aplicación.
- El periodo y el lugar seleccionados se aplican al historial de mediciones y a su exportación a Excel.
- La lista plana se sustituyó por un calendario clásico con cuadrícula de días. Los periodos largos comienzan con celdas mensuales; al elegir un mes se abre su cuadrícula diaria y el botón Atrás, ahora claramente enmarcado, vuelve al periodo completo.
- Las celdas de la vista mensual son compactas y ya no se estiran hasta ocupar todo el ancho del panel.
- El calendario y el gráfico son ahora dos vistas superiores alternativas que se eligen con un interruptor deslizante. Se eliminó el panel lateral anterior; al elegir un grupo con varias mediciones, su lista anidada se abre directamente en la tarjeta Primera lectura o Segunda lectura correspondiente. Los gráficos con desplazamiento horizontal muestran flechas direccionales no interactivas en ambos bordes.
- Cada tarjeta de comparación incluye ahora su propio control Borrar selección centrado en el encabezado. En la tarjeta Diferencia restaura el parámetro que estaba activo antes de seleccionar una fila de la tabla. Después de elegir una medición de un día con varias entradas, la lista se reduce a un botón Volver; las columnas de parámetros y valores quedan alineadas de forma uniforme en las tarjetas primera y segunda.
- Las tres tarjetas de comparación usan ahora la misma cuadrícula de seis columnas. El texto se amplió hasta el máximo que admiten las celdas de Diferencia, se aumentó el contraste en todos los temas y la explicación bajo los filtros del historial se ajusta en varias líneas sin tocar los controles.
- Los detalles se alinean en columnas rotuladas para parámetro, valor, cambio, tipo de cambio, tasa diaria y unidad de tiempo. Se eliminó el filtro anterior por tipo de parámetro.
- La barra superior incluye ahora un selector persistente de tema claro, oscuro o adaptado para daltonismo. Los valores y las acciones de texto que se pueden pulsar en las listas siguen siendo visibles sin pasar el cursor.
- Se añadió un botón para borrar la comparación y el resaltado. El cambio de parámetro solo está disponible en la tarjeta Diferencia de la derecha; los valores de la primera y segunda lectura son informativos. El parámetro elegido a la derecha permanece resaltado en ambas listas completas y su valor principal sigue encima de la lista.
- La fila pulsada permanece en su sección original de la tabla Diferencia al cambiar el parámetro del gráfico. Cambiar de parámetro ya no borra la primera ni la segunda lectura, y seleccionar una medición no centra ni desplaza el gráfico.
- Se corrigieron la carga de recursos y la presentación de la ventana en la versión empaquetada para que la compilación portable autónoma se abra de forma fiable desde el archivo ASAR.

## 1.0a — versión de prueba

La etiqueta `1.0a` queda fijada en la última compilación anterior a los gráficos de mediciones. Incluye perfiles de acuario, volumen calculado por geometría, registros separados, canales de luz, exportación a Excel, objetivos y registro de TDS, preajustes editables y el cálculo de dosificación y remineralización.
