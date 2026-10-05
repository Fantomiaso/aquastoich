# Registro de cambios de AquaStoich

[English](CHANGELOG.md) · [Русский](CHANGELOG.ru.md) · [Deutsch](CHANGELOG.de.md) · Español

## 0.1.3a — versión de prueba

Esta versión conecta los cálculos de cambio de agua con el registro de mediciones y mejora la entrada numérica localizada.

- El modo de cambio de agua incorpora un selector vertical del origen del registro. La última prueba compatible del acuario se carga únicamente tras pulsar **Cargar valores**; el modo alternativo guarda los campos actuales como lectura real previa al pulsar **Calcular dosis**.
- Se añadió **Añadir cálculo al registro** en la parte superior de Resultado para guardar por separado los parámetros estimados después del cambio.
- Las entradas calculadas tienen un color propio y la etiqueta **Calculado** en el calendario, el gráfico, las listas anidadas, el historial y las tarjetas de comparación.
- Los campos numéricos aceptan tanto el punto como la coma, muestran de inmediato el separador decimal del idioma elegido y tratan la tecla decimal del teclado numérico como separador con independencia de la configuración regional del sistema.
- Se aumentó el contraste del texto en los campos de rango de objetivos y proporciones del tema oscuro.
- La misma calculadora se publicó como [aplicación web estática en GitHub Pages](https://fantomiaso.github.io/aquastoich/). No requiere registro ni inicio de sesión y no tiene backend, base de datos en la nube, analítica, publicidad, telemetría ni carga de datos del usuario.
- Se añadieron copia y restauración completas en JSON para perfiles, registros, sustancias propias, preajustes, ajustes, idioma y tema. La aplicación web también solicita almacenamiento persistente; sigue siendo necesario un archivo para cambiar de navegador o recuperarse tras borrar manualmente los datos del sitio.
- Una Content Security Policy restrictiva bloquea las conexiones de datos salientes iniciadas por el programa. Las fuentes y la documentación externas solo se abren cuando el usuario sigue sus enlaces.
- Se añadieron pruebas de las lecturas del cambio de agua y de la normalización decimal localizada; las 59 pruebas pasan correctamente.

## 0.1.2a — versión de prueba

Esta versión mejora la transparencia de la distribución y la documentación. El comportamiento de la calculadora y del análisis de mediciones no cambia respecto a 0.1.1a.

- Cada README incluye ahora un aviso destacado de que los paquetes de Windows y macOS no están firmados digitalmente ni notarizados. El proyecto es gratuito y no comercial, no tiene presupuesto para firmas ni intención de pagar tarifas de plataforma por firmar software que debe seguir siendo gratuito.
- Los README en inglés, ruso, alemán y español incorporan un historial breve y fechado con enlaces directos a cada versión publicada y al registro de cambios completo del idioma correspondiente.
- Se ampliaron las instrucciones del primer inicio para Windows SmartScreen y macOS Gatekeeper, y se indica que los paquetes deben descargarse únicamente desde las versiones oficiales de `Fantomiaso/aquastoich`.
- La versión mostrada, los nombres de paquetes, el workflow, las notas de la versión y los enlaces de descarga se actualizaron a 0.1.2a.
- Antes de preparar esta versión se comprobó el arranque de Linux AppImage y del contenido DEB, además de las aplicaciones macOS x64 y ARM64, en sistemas limpios alojados por GitHub.

## 0.1.1a — versión de prueba

Esta versión de prueba incorpora el análisis de mediciones, el historial con calendario, estadísticas de comparación y las mejoras asociadas de legibilidad y maquetación.

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
- Cada tarjeta de comparación incluye ahora un botón Borrar selección claramente enmarcado en la primera fila del encabezado. En tarjetas estrechas, las demás acciones pasan a una fila propia para evitar cualquier solapamiento. En la tarjeta Diferencia el botón restaura el parámetro que estaba activo antes de seleccionar una fila de la tabla. Después de elegir una medición de un día con varias entradas, la lista se reduce a un botón Volver; las columnas de parámetros y valores quedan alineadas de forma uniforme en las tarjetas primera y segunda.
- Las tres tarjetas de comparación usan ahora la misma cuadrícula de seis columnas. El texto se amplió hasta el máximo que admiten las celdas de Diferencia y la explicación bajo los filtros del historial se ajusta en varias líneas sin tocar los controles. Una revisión de legibilidad de toda la aplicación elevó las etiquetas compactas a un mínimo de 10,5 px, redujo el exceso de espacio vertical, aplicó un matiz verde a las superficies claras de las tablas y añadió colores de alto contraste para las ayudas de formularios, las tarjetas de resultados y las tablas de iones en todos los temas.
- Los detalles se alinean en columnas rotuladas para parámetro, valor, cambio, tipo de cambio, tasa diaria y unidad de tiempo. Se eliminó el filtro anterior por tipo de parámetro.
- La barra superior incluye ahora un selector persistente de tema claro, oscuro o adaptado para daltonismo. Los valores y las acciones de texto que se pueden pulsar en las listas siguen siendo visibles sin pasar el cursor.
- Se añadió un botón para borrar la comparación y el resaltado. El cambio de parámetro solo está disponible en la tarjeta Diferencia de la derecha; los valores de la primera y segunda lectura son informativos. El parámetro elegido a la derecha permanece resaltado en ambas listas completas y su valor principal sigue encima de la lista.
- La fila pulsada permanece en su sección original de la tabla Diferencia al cambiar el parámetro del gráfico. Cambiar de parámetro ya no borra la primera ni la segunda lectura, y seleccionar una medición no centra ni desplaza el gráfico.
- El botón Volver de la lista anidada se trasladó a la cabecera de la tarjeta, entre Borrar selección y Editar; en tarjetas estrechas los controles se distribuyen sin solaparse.
- Se corrigieron la carga de recursos y la presentación de la ventana en la versión empaquetada para que la compilación portable autónoma se abra de forma fiable desde el archivo ASAR.

## 0.1.0a — versión de prueba

La etiqueta `0.1.0a` queda fijada en la última compilación anterior a los gráficos de mediciones. La misma compilación se publicó antes como `1.0a`; solo se corrigió la etiqueta de versión. Incluye perfiles de acuario, volumen calculado por geometría, registros separados, canales de luz, exportación a Excel, objetivos y registro de TDS, preajustes editables y el cálculo de dosificación y remineralización.
