# Registro de cambios de AquaStoich

[English](CHANGELOG.md) · [Русский](CHANGELOG.ru.md) · [Deutsch](CHANGELOG.de.md) · Español

## 1.1a — sin publicar

Esta versión queda reservada para el análisis de mediciones y el registro con calendario. Sigue siendo una compilación local de prueba y aún no se ha subido ni publicado.

- Se añadió un gráfico de barras para la última semana, mes, tres meses, seis meses, año o un intervalo manual.
- Se pueden comparar dos lecturas: el clic izquierdo elige la primera y el derecho la segunda. La primera no puede ser posterior a la segunda, ni la segunda anterior a la primera.
- Los subparámetros relacionados y los demás parámetros registrados aparecen en grupos cerrados inicialmente. Al abrir un grupo se abre a la vez el grupo correspondiente de la primera lectura, la segunda y la diferencia.
- El periodo y el lugar seleccionados se aplican al historial de mediciones y a su exportación a Excel.
- La lista plana se sustituyó por un calendario de ancho completo y una lista de lecturas. Según el intervalo, utiliza celdas de mes, semana o día, muestra el número de mediciones al pasar el cursor y permite ampliar de mes a semana y después a día; se eliminaron las escalas de densidad.
- Si hay varias mediciones en un día, se muestran marcadores horarios individuales. Los marcadores del calendario y las barras del gráfico sincronizan en ambos sentidos el resaltado de la primera y la segunda lectura.
- Los detalles se alinean en columnas rotuladas para parámetro, valor, cambio, tipo de cambio, tasa diaria y unidad de tiempo. Se eliminó el filtro anterior por tipo de parámetro.
- Se corrigieron la carga de recursos y la presentación de la ventana en la versión empaquetada para que la compilación portable autónoma se abra de forma fiable desde el archivo ASAR.

## 1.0a — versión de prueba

La etiqueta `1.0a` queda fijada en la última compilación anterior a los gráficos de mediciones. Incluye perfiles de acuario, volumen calculado por geometría, registros separados, canales de luz, exportación a Excel, objetivos y registro de TDS, preajustes editables y el cálculo de dosificación y remineralización.
