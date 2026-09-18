// The Russian strings are source identifiers for the existing interface. Keep
// the original DOM text so switching languages never translates a translation.
const rows = `Расчёт воды для подмены|Aquarium water calculator|Aquarienwasser-Rechner|Calculadora de agua para acuarios
Версия 1.0 · тестирование|Version 1.0 · testing|Version 1.0 · Testphase|Versión 1.0 · en pruebas
Версия 1.0a · тестирование|Version 1.0a · testing|Version 1.0a · Testphase|Versión 1.0a · en pruebas
Язык приложения|Application language|App-Sprache|Idioma de la aplicación
Язык|Language|Sprache|Idioma
Скопировать расчёт|Copy calculation|Berechnung kopieren|Copiar cálculo
Новый расчёт|New calculation|Neue Berechnung|Nuevo cálculo
Разделы программы|App sections|App-Bereiche|Secciones
Расчёт|Calculator|Rechner|Calculadora
Журнал измерений|Measurement log|Messprotokoll|Registro de mediciones
База веществ|Substance database|Stoffdatenbank|Base de sustancias
Режим расчёта|Calculation mode|Berechnungsmodus|Modo de cálculo
Приготовление|Preparation|Aufbereitung|Preparación
Подмена воды|Water change|Wasserwechsel|Cambio de agua
Исходная вода для подмены|Source water for the change|Ausgangswasser für den Wechsel|Agua de origen para el cambio
Исходная вода|Source water|Ausgangswasser|Agua de origen
Объём приготовляемой воды|Prepared water volume|Aufbereitete Wassermenge|Volumen de agua preparada
Объём подменяемой воды|Water change volume|Wechselwassermenge|Volumen del cambio de agua
Объём аквариума с водой|Aquarium water volume|Wasservolumen im Aquarium|Volumen de agua del acuario
Вода в аквариуме до подмены|Aquarium water before the change|Aquarienwasser vor dem Wechsel|Agua del acuario antes del cambio
Исходный GH|Source GH|Ausgangs-GH|GH de origen
Исходный KH|Source KH|Ausgangs-KH|KH de origen
Исходный TDS|Source TDS|Ausgangs-TDS|TDS de origen
Исходный pH|Source pH|Ausgangs-pH|pH de origen
Нужен замер TDS|TDS reading required|TDS-Messwert erforderlich|Se necesita una medición de TDS
Для подбора TDS укажите TDS исходной воды.|Enter source-water TDS to fit a TDS target.|Für das TDS-Ziel den TDS-Wert des Ausgangswassers eingeben.|Introduzca el TDS del agua de origen para ajustar el objetivo de TDS.
Для подбора после подмены укажите в аквариуме:|To fit targets after a water change, enter the aquarium's starting values:|Für Ziele nach dem Wasserwechsel diese Anfangswerte des Aquariums eingeben:|Para ajustar los objetivos tras un cambio de agua, introduzca los valores iniciales del acuario:
Карточки ниже — результат во всём аквариуме после подмены.|The cards below show the whole aquarium after the water change.|Die Karten unten zeigen das gesamte Aquarium nach dem Wasserwechsel.|Las tarjetas siguientes muestran todo el acuario tras el cambio de agua.
TDS — приблизительная оценка: исходное показание плюс масса известных ионов добавок. Шкала TDS-метра и нераскрытый состав готовых средств могут отличаться; проверьте результат измерением.|TDS is an estimate: the starting reading plus the mass of known added ions. Meter scales and undisclosed product ingredients can differ; check the result with a measurement.|TDS ist eine Schätzung: Anfangsmesswert plus Masse bekannter zugesetzter Ionen. Messgeräteskala und unbekannte Inhaltsstoffe können abweichen; Ergebnis nachmessen.|El TDS es una estimación: lectura inicial más la masa de iones añadidos conocidos. La escala del medidor y los ingredientes no declarados pueden diferir; compruebe el resultado con una medición.
CO₂ после отстаивания|CO₂ after standing|CO₂ nach dem Abstehen|CO₂ tras reposar
Известные ионы исходной воды|Known source-water ions|Bekannte Ionen des Ausgangswassers|Iones conocidos del agua de origen
Ионы в аквариуме|Aquarium ions|Ionen im Aquarium|Iones del acuario
GH и KH задаются отдельно по тестам. Если вводите Ca/Mg или HCO₃, проверьте, что они согласуются с GH/KH.|Enter GH and KH from separate tests. If you enter Ca/Mg or HCO₃, check consistency with GH/KH.|GH und KH aus getrennten Tests eingeben. Ca/Mg und HCO₃ müssen zu GH/KH passen.|Introduzca GH y KH según pruebas separadas. Compruebe que Ca/Mg y HCO₃ concuerdan con GH/KH.
Цели после подмены в аквариуме|Aquarium targets after the change|Zielwerte im Aquarium nach dem Wechsel|Objetivos del acuario tras el cambio
Целевые параметры|Target parameters|Zielwerte|Parámetros objetivo
Пустое поле пропускается · 0 — заданная цель|Blank fields are ignored · 0 is a valid target|Leere Felder werden ignoriert · 0 ist ein gültiger Zielwert|Se ignoran los campos vacíos · 0 es un objetivo válido
Пустое поле пропускается · 0 — заданная цель · точная цель имеет приоритет над диапазоном|Blank fields are ignored · 0 is a valid target · exact targets take priority over ranges|Leere Felder werden ignoriert · 0 ist ein gültiger Zielwert · exakte Ziele haben Vorrang vor Bereichen|Se ignoran los campos vacíos · 0 es un objetivo válido · los objetivos exactos tienen prioridad sobre los rangos
Пресеты пропорций|Ratio presets|Verhältnis-Vorlagen|Preajustes de proporciones
Пресеты параметров и пропорций|Water targets and ratio presets|Vorlagen für Wasserwerte und Verhältnisse|Preajustes de parámetros y proporciones
можно несколько|select several|mehrere möglich|se pueden elegir varios
Стартовые примеры. Подстройте пропорции под виды и измерения.|Starting examples. Adjust ratios for your species and measurements.|Ausgangsbeispiele. Verhältnisse an Arten und Messungen anpassen.|Ejemplos iniciales. Ajuste las proporciones a sus especies y mediciones.
Стартовые примеры. Подстройте цели, диапазоны и пропорции под виды и измерения.|Starting examples. Adjust targets, ranges, and ratios for your species and measurements.|Ausgangsbeispiele. Ziele, Bereiche und Verhältnisse an Arten und Messungen anpassen.|Ejemplos iniciales. Ajuste los objetivos, rangos y proporciones a sus especies y mediciones.
мой|custom|angepasst|propio
+ Свой пресет|+ Custom preset|+ Eigene Vorlage|+ Preajuste propio
Новый пресет|New preset|Neue Vorlage|Nuevo preajuste
Изменить пресет|Edit preset|Vorlage bearbeiten|Editar preajuste
Название пресета|Preset name|Name der Vorlage|Nombre del preajuste
Цель|Target|Ziel|Objetivo
+ Добавить соотношение|+ Add ratio|+ Verhältnis hinzufügen|+ Añadir proporción
Сохранить пресет|Save preset|Vorlage speichern|Guardar preajuste
Отмена|Cancel|Abbrechen|Cancelar
Восстановить исходный|Restore default|Standard wiederherstellen|Restaurar predeterminado
Удалить пресет|Delete preset|Vorlage löschen|Eliminar preajuste
Удалить этот пресет?|Delete this preset?|Diese Vorlage löschen?|¿Eliminar este preajuste?
Недопустимый идентификатор пресета.|Invalid preset identifier.|Ungültige Vorlagenkennung.|Identificador de preajuste no válido.
Введите название пресета (до 80 символов).|Enter a preset name (up to 80 characters).|Einen Vorlagennamen eingeben (bis zu 80 Zeichen).|Introduzca un nombre (hasta 80 caracteres).
Неизвестный параметр воды.|Unknown water parameter.|Unbekannter Wasserwert.|Parámetro de agua desconocido.
Проверьте список пропорций.|Check the ratio list.|Verhältnisliste prüfen.|Compruebe la lista de proporciones.
Введите неотрицательное число.|Enter a nonnegative number.|Eine nichtnegative Zahl eingeben.|Introduzca un número no negativo.
Введите цель или границу диапазона.|Enter a target or range bound.|Zielwert oder Bereichsgrenze eingeben.|Introduzca un objetivo o límite del rango.
Цель должна находиться в диапазоне min–max.|The target must be within the min–max range.|Das Ziel muss im Bereich min–max liegen.|El objetivo debe estar dentro del rango min–max.
Выберите разные ионы без повторения пары.|Choose different ions without repeating a pair.|Verschiedene Ionen ohne doppelte Paare wählen.|Elija iones distintos sin repetir el par.
Добавьте хотя бы один параметр или соотношение.|Add at least one parameter or ratio.|Mindestens einen Wasserwert oder ein Verhältnis hinzufügen.|Añada al menos un parámetro o proporción.
Проверьте данные пресета.|Check the preset values.|Vorlagenwerte prüfen.|Compruebe los valores del preajuste.
Соотношения ионов|Ion ratios|Ionenverhältnisse|Proporciones de iones
Соотношения по массе|Mass ratios|Massenverhältnisse|Proporciones en masa
По массе, мг/л · сначала цель, при конфликте — допуск|By mass, mg/L · exact target first, allowed range if needed|Nach Masse, mg/l · erst Zielwert, dann Toleranz|Por masa, mg/l · primero el objetivo, luego el rango
Целевое соотношение к одному|Target ratio to one|Zielverhältnis zu eins|Proporción objetivo a uno
Программа сначала подбирает точную цель; диапазон используется при конфликте с остальными целями|The exact target is tried first; the range is used if targets conflict|Zuerst wird das exakte Ziel gesucht; bei Konflikten gilt der Bereich|Primero se busca el objetivo exacto; el rango se usa si hay conflictos
Допустимый диапазон|Allowed range|Zulässiger Bereich|Rango permitido
Диапазон|Range|Bereich|Rango
Нижняя граница|Lower bound|Untere Grenze|Límite inferior
Верхняя граница|Upper bound|Obere Grenze|Límite superior
Нижняя граница соотношения к одному|Lower ratio bound|Untere Verhältnisgrenze|Límite inferior de la proporción
Верхняя граница соотношения к одному|Upper ratio bound|Obere Verhältnisgrenze|Límite superior de la proporción
Первый ион|First ion|Erstes Ion|Primer ion
Второй ион|Second ion|Zweites Ion|Segundo ion
Удалить соотношение|Remove ratio|Verhältnis entfernen|Eliminar proporción
Подобрать дозы|Calculate doses|Dosierungen berechnen|Calcular dosis
Методика и источники составов ↗|Method and composition sources ↗|Methode und Quellen ↗|Método y fuentes ↗
Вещества и дозы|Substances and doses|Stoffe und Dosierungen|Sustancias y dosis
Название, синоним или формула|Name, synonym or formula|Name, Synonym oder Formel|Nombre, sinónimo o fórmula
Поиск вещества|Search substances|Stoffe suchen|Buscar sustancias
Поиск в базе|Search database|Datenbank durchsuchen|Buscar en la base
Все эффекты|All effects|Alle Wirkungen|Todos los efectos
Фильтр по эффекту|Filter by effect|Nach Wirkung filtern|Filtrar por efecto
Фильтр базы по эффекту|Database effect filter|Datenbank nach Wirkung filtern|Filtrar base por efecto
Сортировка веществ|Sort substances|Stoffe sortieren|Ordenar sustancias
Сортировка базы|Sort database|Datenbank sortieren|Ordenar base
Выбрать вещество|Choose substance|Stoff auswählen|Elegir sustancia
Добавить в расчёт|Add to calculation|Zur Berechnung hinzufügen|Añadir al cálculo
Добавить|Add|Hinzufügen|Añadir
В расчёте|In calculation|In Berechnung|En el cálculo
+ Своё вещество или смесь|+ Custom substance or mixture|+ Eigener Stoff oder Mischung|+ Sustancia o mezcla propia
Авто — подбор по целям. «Зафиксировать» сохраняет вещество и дозу при пересчёте.|Auto fits the targets. Lock keeps a substance and dose fixed during recalculation.|Auto passt an Zielwerte an. Sperren erhält Stoff und Dosis bei Neuberechnung.|Auto ajusta los objetivos. Bloquear conserva sustancia y dosis al recalcular.
Выберите вещество из базы, чтобы начать расчёт.|Choose a substance from the database to begin.|Wählen Sie zum Start einen Stoff aus der Datenbank.|Elija una sustancia de la base para empezar.
Результат|Result|Ergebnis|Resultado
обновляется сразу|updates instantly|wird sofort aktualisiert|se actualiza al instante
Калибровка pH по замеру|Calibrate pH from a measurement|pH anhand einer Messung kalibrieren|Calibrar pH con una medición
Фактический pH в аквариуме после подмены|Measured aquarium pH after the change|Gemessener Aquarium-pH nach dem Wechsel|pH medido del acuario tras el cambio
Фактический pH после смешивания|Measured pH after mixing|Gemessener pH nach dem Mischen|pH medido tras mezclar
Применить замер|Apply measurement|Messwert übernehmen|Aplicar medición
например 7,6|e.g. 7.6|z. B. 7,6|p. ej. 7,6
Сводная таблица ионов|Ion summary|Ionenübersicht|Resumen de iones
мг/л · нажмите на строку|mg/L · click a row|mg/l · Zeile anklicken|mg/l · pulse una fila
Ион|Ion|Ion|Ion
Было|Initial|Vorher|Inicial
Добавлено|Added|Zugabe|Añadido
Итого|Total|Gesamt|Total
Баланс добавок|Additive balance|Bilanz der Zusätze|Balance de aditivos
Баланс исходной воды требует полного ионного анализа.|Balancing source water requires a full ion analysis.|Die Bilanz des Ausgangswassers erfordert eine vollständige Ionenanalyse.|El balance del agua de origen requiere un análisis iónico completo.
Катионы|Cations|Kationen|Cationes
Кислотные остатки|Anions|Anionen|Aniones
Микроэлементы|Trace elements|Spurenelemente|Oligoelementos
Макроэлементы|Macronutrients|Makronährstoffe|Macronutrientes
Общая жёсткость|General hardness|Gesamthärte|Dureza general
Карбонатная жёсткость|Carbonate hardness|Karbonathärte|Dureza de carbonatos
Кальций|Calcium|Calcium|Calcio
Магний|Magnesium|Magnesium|Magnesio
Калий|Potassium|Kalium|Potasio
Натрий|Sodium|Natrium|Sodio
Нитрат|Nitrate|Nitrat|Nitrato
Нитрит|Nitrite|Nitrit|Nitrito
Фосфат|Phosphate|Phosphat|Fosfato
Сульфат|Sulfate|Sulfat|Sulfato
Хлорид|Chloride|Chlorid|Cloruro
Железо|Iron|Eisen|Hierro
Марганец|Manganese|Mangan|Manganeso
Медь|Copper|Kupfer|Cobre
Цинк|Zinc|Zink|Zinc
Бор|Boron|Bor|Boro
Молибден|Molybdenum|Molybdän|Molibdeno
Кобальт|Cobalt|Kobalt|Cobalto
Аммоний|Ammonium|Ammonium|Amonio
Гидрокарбонат|Bicarbonate|Hydrogencarbonat|Bicarbonato
Карбонат|Carbonate|Carbonat|Carbonato
кальций|calcium|Calcium|calcio
магний|magnesium|Magnesium|magnesio
калий|potassium|Kalium|potasio
натрий|sodium|Natrium|sodio
аммоний|ammonium|Ammonium|amonio
хлорид|chloride|Chlorid|cloruro
сульфат|sulfate|Sulfat|sulfato
нитрит|nitrite|Nitrit|nitrito
нитрат|nitrate|Nitrat|nitrato
фосфат|phosphate|Phosphat|fosfato
гидрокарбонат|bicarbonate|Hydrogencarbonat|bicarbonato
карбонат|carbonate|Carbonat|carbonato
железо|iron|Eisen|hierro
марганец|manganese|Mangan|manganeso
бор|boron|Bor|boro
молибден|molybdenum|Molybdän|molibdeno
медь|copper|Kupfer|cobre
цинк|zinc|Zink|zinc
кобальт|cobalt|Kobalt|cobalto
мг/л|mg/L|mg/l|mg/l
мг/мл|mg/mL|mg/ml|mg/ml
мг/г|mg/g|mg/g|mg/g
мэкв/л|meq/L|mval/l|meq/l
мкСм/см|µS/cm|µS/cm|µS/cm
г/л|g/L|g/l|g/l
г|g|g|g
мл|mL|ml|ml
л|L|l|l
сут|day|Tag|día
Источник ↗|Source ↗|Quelle ↗|Fuente ↗
Источник|Source|Quelle|Fuente
Новая форма добавлена в существующую карточку|New form added to the existing record|Neue Form zum bestehenden Eintrag hinzugefügt|Nueva forma añadida al registro existente
Новое измерение|New measurement|Neue Messung|Nueva medición
Изменить измерение|Edit measurement|Messung bearbeiten|Editar medición
Где измерено|Measured at|Messort|Lugar de medición
Аквариум|Aquarium|Aquarium|Acuario
Приготовленная вода|Prepared water|Aufbereitetes Wasser|Agua preparada
Дата и время|Date and time|Datum und Uhrzeit|Fecha y hora
Время автоматически при сохранении|Use current time when saving|Beim Speichern aktuelle Uhrzeit verwenden|Usar hora actual al guardar
+ Тест|+ Test|+ Test|+ Prueba
Общее примечание|General note|Allgemeine Notiz|Nota general
Примечание к тесту не указано.|No test note.|Keine Testnotiz.|Sin nota de la prueba.
Примечание к тесту|Test note|Testnotiz|Nota de la prueba
Особенности замера…|Measurement details…|Messdetails…|Detalles de la medición…
Подмена, кормление, удобрения, наблюдения…|Water change, feeding, fertilisers, observations…|Wasserwechsel, Fütterung, Dünger, Beobachtungen…|Cambio de agua, alimentación, abonos, observaciones…
Сохранить измерение|Save measurement|Messung speichern|Guardar medición
Отменить правку|Cancel edit|Bearbeitung abbrechen|Cancelar edición
Добавить свой вид теста|Add custom test|Eigenen Test hinzufügen|Añadir prueba propia
Название|Name|Name|Nombre
Единица|Unit|Einheit|Unidad
Например, фторид|For example, fluoride|Zum Beispiel Fluorid|Por ejemplo, fluoruro
Добавить тест|Add test|Test hinzufügen|Añadir prueba
История измерений|Measurement history|Messverlauf|Historial de mediciones
Пока нет измерений. Добавьте первый замер слева.|No measurements yet. Add the first reading on the left.|Noch keine Messungen. Links die erste Messung hinzufügen.|Aún no hay mediciones. Añada la primera a la izquierda.
первый замер|first reading|erste Messung|primera medición
прирост|increase|Anstieg|aumento
потребление|consumption|Verbrauch|consumo
снижение|decrease|Abnahme|descenso
без изменения|unchanged|unverändert|sin cambios
Изменить|Edit|Bearbeiten|Editar
Удалить|Delete|Löschen|Eliminar
Тип|Type|Typ|Tipo
Сухое вещество|Dry substance|Trockener Stoff|Sustancia seca
Сухая смесь|Dry mixture|Trockenmischung|Mezcla seca
Жидкая смесь|Liquid mixture|Flüssigmischung|Mezcla líquida
Добавить вещество или смесь|Add substance or mixture|Stoff oder Mischung hinzufügen|Añadir sustancia o mezcla
Изменить вещество или смесь|Edit substance or mixture|Stoff oder Mischung bearbeiten|Editar sustancia o mezcla
Химическое название / название смеси|Chemical name / mixture name|Chemischer Name / Mischungsname|Nombre químico / nombre de la mezcla
Альтернативные названия|Alternative names|Alternative Namen|Nombres alternativos
Например, сульфат калия|For example, potassium sulfate|Zum Beispiel Kaliumsulfat|Por ejemplo, sulfato de potasio
Через запятую|Comma-separated|Kommagetrennt|Separados por comas
Формула первой формы|Formula of the first form|Formel der ersten Form|Fórmula de la primera forma
Растворимость первой формы при 20 °C|First form solubility at 20 °C|Löslichkeit der ersten Form bei 20 °C|Solubilidad de la primera forma a 20 °C
Растворимость смеси при 20 °C|Mixture solubility at 20 °C|Löslichkeit der Mischung bei 20 °C|Solubilidad de la mezcla a 20 °C
Растворимость, г/л|Solubility, g/L|Löslichkeit, g/l|Solubilidad, g/l
обязательно|required|erforderlich|obligatorio
при 20 °C|at 20 °C|bei 20 °C|a 20 °C
Подставить известное химическое название|Fill known chemical name|Bekannten chemischen Namen einsetzen|Usar nombre químico conocido
+ Другая сухая форма этого вещества|+ Another dry form|+ Weitere Trockenform|+ Otra forma seca
У каждой формы своя растворимость и расчётная доля ионов. Например, MgSO4 и MgSO4·7H2O.|Each form has its own solubility and ion fractions. Example: MgSO4 and MgSO4·7H2O.|Jede Form hat eigene Löslichkeit und Ionenanteile, z. B. MgSO4 und MgSO4·7H2O.|Cada forma tiene su solubilidad y fracciones iónicas, p. ej., MgSO4 y MgSO4·7H2O.
Компоненты смеси|Mixture components|Bestandteile der Mischung|Componentes de la mezcla
массовая доля, %|mass fraction, %|Massenanteil, %|fracción másica, %
г/л готового раствора|g/L of prepared solution|g/l der fertigen Lösung|g/l de solución preparada
г/л жидкости|g/L of liquid|g/l der Flüssigkeit|g/l de líquido
Доля, %|Fraction, %|Anteil, %|Fracción, %
+ Компонент|+ Component|+ Komponente|+ Componente
Ионный состав вручную|Manual ion composition|Ionenzusammensetzung manuell|Composición iónica manual
для сложных формул|for complex formulas|für komplexe Formeln|para fórmulas complejas
Укажите мг иона на 1 г сухого вещества либо на 1 мл жидкости. Формулы компонентов остаются обязательными.|Enter mg of ion per 1 g of dry substance or 1 mL of liquid. Component formulas are still required.|mg Ion pro 1 g Trockenstoff oder 1 ml Flüssigkeit eingeben. Formeln der Bestandteile bleiben erforderlich.|Introduzca mg de ion por 1 g de sustancia seca o 1 ml de líquido. Las fórmulas siguen siendo obligatorias.
Сохранить в базу|Save to database|In Datenbank speichern|Guardar en la base
Каталог включает расчётные добавки и материалы с эффектом, который нужно проверять тестами.|The catalogue includes calculable additives and materials whose effects require testing.|Der Katalog enthält berechenbare Zusätze und Materialien, deren Wirkung durch Tests zu prüfen ist.|El catálogo incluye aditivos calculables y materiales cuyo efecto debe comprobarse con pruebas.
Другие названия:|Other names:|Weitere Namen:|Otros nombres:
Ничего не найдено по заданным фильтрам.|No matches for these filters.|Keine Treffer für diese Filter.|No hay resultados con estos filtros.
По названию|By name|Nach Name|Por nombre
По эффекту|By effect|Nach Wirkung|Por efecto
По типу|By type|Nach Typ|Por tipo
Вещество|Substance|Stoff|Sustancia
Смесь|Mixture|Mischung|Mezcla
Раствор|Solution|Lösung|Solución
Форма и маточник|Form and stock solution|Form und Stammlösung|Forma y solución madre
Форма соли|Salt form|Salzform|Forma de la sal
Формула|Formula|Formel|Fórmula
Внесение|Application|Zugabe|Aplicación
Маточник|Stock solution|Stammlösung|Solución madre
Сухая соль|Dry salt|Trockensalz|Sal seca
сухое внесение|dry dosing|Trockenzugabe|dosificación en seco
Чистота, %|Purity, %|Reinheit, %|Pureza, %
Навеска, г|Mass, g|Einwaage, g|Masa, g
Раствор, мл|Solution, mL|Lösung, ml|Solución, ml
Удобная доза, мл|Convenient dose, mL|Praktische Dosis, ml|Dosis cómoda, ml
Подобрать навеску|Calculate mass|Einwaage berechnen|Calcular masa
О составе|Composition|Zusammensetzung|Composición
Состав ≠ заявленная прибавка|Composition ≠ claimed increase|Zusammensetzung ≠ angegebene Erhöhung|Composición ≠ aumento declarado
Зафиксировать|Lock|Sperren|Bloquear
Режим|Mode|Modus|Modo
Авто|Auto|Auto|Auto
Вручную|Manual|Manuell|Manual
Доза|Dose|Dosis|Dosis
цель|target|Ziel|objetivo
допуск|range|Toleranz|rango
без цели|no target|kein Ziel|sin objetivo
вклад в итог|contribution to result|Beitrag zum Ergebnis|contribución al resultado
влияние каждого вещества|effect of each substance|Wirkung jedes Stoffs|efecto de cada sustancia
без него:|without it:|ohne:|sin él:
После подмены|After water change|Nach Wasserwechsel|Tras el cambio
После смешивания|After mixing|Nach dem Mischen|Tras mezclar
Приготовленная подменная вода|Prepared change water|Aufbereitetes Wechselwasser|Agua preparada para el cambio
Последний замер:|Last reading:|Letzte Messung:|Última medición:
калиброванный CO₂|calibrated CO₂|kalibriertes CO₂|CO₂ calibrado
Известные катионы|Known cations|Bekannte Kationen|Cationes conocidos
Известные анионы|Known anions|Bekannte Anionen|Aniones conocidos
Неизвестные противоионы|Unknown counterions|Unbekannte Gegenionen|Contraiones desconocidos
Невязка известных добавок|Residual imbalance of known additives|Restabweichung bekannter Zusätze|Desequilibrio residual de aditivos conocidos
Вещества не добавлены|No substances added|Keine Stoffe zugegeben|No se añadieron sustancias
Ориентир: расчётной дозы нет.|Reference only: no calculable dose.|Nur Orientierung: keine berechenbare Dosis.|Solo referencia: sin dosis calculable.
Реминерализаторы|Remineralizers|Remineralisierer|Remineralizadores
Удобрения|Fertilisers|Dünger|Fertilizantes
Соли|Salts|Salze|Sales
Мои вещества|My substances|Meine Stoffe|Mis sustancias
Мои смеси|My mixtures|Meine Mischungen|Mis mezclas
Общий пресноводный|Community freshwater|Gesellschaftsbecken|Acuario comunitario
Цихлидник|Cichlid tank|Buntbarschbecken|Acuario de cíclidos
Медленный травник|Low-tech planted tank|Pflanzenbecken ohne CO₂|Acuario plantado sin CO₂
Травник с CO₂|CO₂ planted tank|Pflanzenbecken mit CO₂|Acuario plantado con CO₂
Креветочник|Shrimp tank|Garnelenbecken|Acuario de gambas
Улиточник|Snail tank|Schneckenbecken|Acuario de caracoles
Мягководный биотоп|Soft-water biotope|Weichwasserbiotop|Biotopo de agua blanda
Несовместимо:|Incompatible:|Unvereinbar:|Incompatible:
обезвоженный|anhydrous|wasserfrei|anhidro
безводный|anhydrous|wasserfrei|anhidro
Сульфат магния|Magnesium sulfate|Magnesiumsulfat|Sulfato de magnesio
Нитрат кальция|Calcium nitrate|Calciumnitrat|Nitrato de calcio
Нитрат калия|Potassium nitrate|Kaliumnitrat|Nitrato de potasio
Дигидрофосфат калия|Potassium dihydrogen phosphate|Kaliumdihydrogenphosphat|Dihidrogenofosfato de potasio
Монофосфат калия|Monopotassium phosphate|Kaliumphosphat monobasisch|Fosfato monopotásico
Гидрокарбонат натрия|Sodium bicarbonate|Natriumhydrogencarbonat|Bicarbonato de sodio
Пищевая сода|Baking soda|Natron|Bicarbonato de cocina
Карбонат калия|Potassium carbonate|Kaliumcarbonat|Carbonato de potasio
Поташ|Potash|Pottasche|Potasa
Сульфат калия|Potassium sulfate|Kaliumsulfat|Sulfato de potasio
Хлорид кальция|Calcium chloride|Calciumchlorid|Cloruro de calcio
Хлорид магния|Magnesium chloride|Magnesiumchlorid|Cloruro de magnesio
Карбонат натрия|Sodium carbonate|Natriumcarbonat|Carbonato de sodio
Нитрат натрия|Sodium nitrate|Natriumnitrat|Nitrato de sodio
Хлорид натрия|Sodium chloride|Natriumchlorid|Cloruro de sodio
Сульфат марганца|Manganese sulfate|Mangansulfat|Sulfato de manganeso
Сульфат железа|Iron sulfate|Eisensulfat|Sulfato de hierro
Сульфат меди|Copper sulfate|Kupfersulfat|Sulfato de cobre
Сульфат цинка|Zinc sulfate|Zinksulfat|Sulfato de zinc
Оксид алюминия связывает фосфат.|Aluminium oxide binds phosphate.|Aluminiumoxid bindet Phosphat.|El óxido de aluminio fija fosfato.
Гранулированный оксид железа связывает фосфат.|Granular iron oxide binds phosphate.|Granuliertes Eisenoxid bindet Phosphat.|El óxido de hierro granular fija fosfato.
Растворённый|Dissolved|Gelöst|Disuelto
Температура|Temperature|Temperatur|Temperatura
Электропроводность|Conductivity|Leitfähigkeit|Conductividad
Солёность|Salinity|Salzgehalt|Salinidad
Свободный хлор|Free chlorine|Freies Chlor|Cloro libre
Общий хлор|Total chlorine|Gesamtchlor|Cloro total
Йод|Iodine|Jod|Yodo
силикаты|silicates|Silikate|silicatos
общий|total|gesamt|total
от|from|von|desde
до|to|bis|hasta
из|of|von|de
Сравнение с|Compared with|Vergleich mit|Comparado con
записей|entries|Einträge|registros
аквариума|aquarium|Aquarium|acuario
исходной|source water|Ausgangswasser|agua de origen
приготовленной воды|prepared water|aufbereiteten Wassers|agua preparada
приготовленной|prepared|aufbereitet|preparada
после подмены|after the water change|nach dem Wasserwechsel|tras el cambio de agua
вклад каждого|contribution of each|Beitrag jedes|contribución de cada
Итого, мг/л|Total, mg/L|Gesamt, mg/l|Total, mg/l
Итоговый KH|Final KH|End-KH|KH final
Итоговый pH|Final pH|End-pH|pH final
Принятый CO₂|Assumed CO₂|Angenommenes CO₂|CO₂ supuesto
Аквариум, оставшаяся вода|Aquarium water retained|Verbleibendes Aquarienwasser|Agua restante del acuario
Исходная вода для подмены|Source water for the change|Ausgangswasser für den Wechsel|Agua de origen para el cambio
Выберите два разных иона.|Select two different ions.|Zwei verschiedene Ionen wählen.|Elija dos iones diferentes.
Фильтрующий материал|Filter medium|Filtermedium|Medio filtrante
Фильтрующие материалы|Filter media|Filtermedien|Medios filtrantes
Буферы и кондиционеры|Buffers and conditioners|Puffer und Wasseraufbereiter|Tampones y acondicionadores
Кислоты и буферы|Acids and buffers|Säuren und Puffer|Ácidos y tampones
Готовые растворы|Ready-made solutions|Fertige Lösungen|Soluciones preparadas
Прочее|Other|Sonstiges|Otros
Гидрокарбонат калия|Potassium bicarbonate|Kaliumhydrogencarbonat|Bicarbonato de potasio
Гидрофосфат калия|Dipotassium hydrogen phosphate|Dikaliumhydrogenphosphat|Hidrogenofosfato de dipotasio
Двузамещённый фосфат калия|Dibasic potassium phosphate|Dibasisches Kaliumphosphat|Fosfato potásico dibásico
Дигидрофосфат натрия|Sodium dihydrogen phosphate|Natriumdihydrogenphosphat|Dihidrogenofosfato de sodio
Монофосфат натрия|Monosodium phosphate|Natriumphosphat monobasisch|Fosfato monosódico
Гидросульфат натрия|Sodium bisulfate|Natriumhydrogensulfat|Bisulfato de sodio
Гидросульфат калия|Potassium bisulfate|Kaliumhydrogensulfat|Bisulfato de potasio
Кислый сульфат натрия|Sodium acid sulfate|Saures Natriumsulfat|Sulfato ácido de sodio
Кислый сульфат калия|Potassium acid sulfate|Saures Kaliumsulfat|Sulfato ácido de potasio
Нитрат магния|Magnesium nitrate|Magnesiumnitrat|Nitrato de magnesio
Сульфат кальция|Calcium sulfate|Calciumsulfat|Sulfato de calcio
Сульфат натрия|Sodium sulfate|Natriumsulfat|Sulfato de sodio
Сульфат железа(II)|Iron(II) sulfate|Eisen(II)-sulfat|Sulfato de hierro(II)
Сульфат марганца(II)|Manganese(II) sulfate|Mangan(II)-sulfat|Sulfato de manganeso(II)
Сульфат меди(II)|Copper(II) sulfate|Kupfer(II)-sulfat|Sulfato de cobre(II)
Кальций хлористый|Calcium chloride|Calciumchlorid|Cloruro de calcio
Магний хлористый|Magnesium chloride|Magnesiumchlorid|Cloruro de magnesio
Калий хлористый|Potassium chloride|Kaliumchlorid|Cloruro de potasio
Калий сернокислый|Potassium sulfate|Kaliumsulfat|Sulfato de potasio
Натрий сернокислый|Sodium sulfate|Natriumsulfat|Sulfato de sodio
натрий сернокислый|sodium sulfate|Natriumsulfat|sulfato de sodio
кальций сернокислый|calcium sulfate|Calciumsulfat|sulfato de calcio
Магниевая селитра|Magnesium nitrate|Magnesiumnitrat|Nitrato de magnesio
Натриевая селитра|Sodium nitrate|Natriumnitrat|Nitrato de sodio
Глауберова соль|Glauber's salt|Glaubersalz|Sal de Glauber
Гипс|Gypsum|Gips|Yeso
Кальцинированная сода|Washing soda|Waschsoda|Carbonato de sodio
Поваренная соль|Table salt|Speisesalz|Sal de mesa
Пищевая добавка|Food additive|Lebensmittelzusatzstoff|Aditivo alimentario
бишофит|bischofite|Bischofit|bischofita
Железный купорос|Ferrous sulfate|Eisensulfat|Sulfato ferroso
Марганцевый купорос|Manganese sulfate|Mangansulfat|Sulfato manganoso
Медный купорос|Copper sulfate|Kupfersulfat|Sulfato de cobre
Цинковый купорос|Zinc sulfate|Zinksulfat|Sulfato de zinc
Микро+|Micro+|Mikro+|Micro+
ЖЕЛЕЗО|IRON|EISEN|HIERRO
КАЛИЙ|POTASSIUM|KALIUM|POTASIO
МАКРО+|MACRO+|MAKRO+|MACRO+
МИКРО+|MICRO+|MIKRO+|MICRO+
Удо Ермолаева|Ermolaev Fertilizer|Ermolaev-Dünger|Fertilizante Ermolaev
Умягчает воду осаждением кальция и магния.|Softens water by precipitating calcium and magnesium.|Enthärtet Wasser durch Ausfällung von Calcium und Magnesium.|Ablanda el agua precipitando calcio y magnesio.
Торфяной фильтрующий материал: подкисляет и смягчает воду.|Peat filter medium: acidifies and softens water.|Torf-Filtermedium: säuert an und enthärtet das Wasser.|Medio filtrante de turba: acidifica y ablanda el agua.
При растворении высвобождает кислотный эквивалент: расчёт снижает KH на 1 мэкв на моль.|Dissolution releases one acid equivalent per mole; the calculation reduces KH accordingly.|Beim Lösen wird ein Säureäquivalent je Mol frei; KH wird entsprechend gesenkt.|Al disolverse libera un equivalente ácido por mol; el cálculo reduce el KH.
Итоговый pH проверьте после отстаивания.|Check final pH after standing.|End-pH nach dem Abstehen prüfen.|Compruebe el pH final tras reposar.
По инструкции 2 г на 80 л снижают щёлочность примерно на 0,2 мэкв/л: принято 8 мэкв/г.|The label states 2 g per 80 L reduces alkalinity by about 0.2 meq/L; 8 meq/g is assumed.|Laut Anleitung senken 2 g auf 80 l die Alkalinität um etwa 0,2 mval/l; angenommen werden 8 mval/g.|Según la etiqueta, 2 g por 80 l reducen la alcalinidad unos 0,2 meq/l; se suponen 8 meq/g.
По инструкции 5 мл на 20 л снижают KH примерно на 1 °dKH: принято 1,427 мэкв/мл.|The label states 5 mL per 20 L lowers KH by about 1 °dKH; 1.427 meq/mL is assumed.|Laut Anleitung senken 5 ml auf 20 l die KH um etwa 1 °dKH; angenommen werden 1,427 mval/ml.|Según la etiqueta, 5 ml por 20 l reducen el KH cerca de 1 °dKH; se suponen 1,427 meq/ml.
Полный ионный состав не раскрыт; pH после газообмена измерьте.|Full ion composition is undisclosed; measure pH after gas exchange.|Die vollständige Ionenzusammensetzung ist unbekannt; pH nach dem Gasaustausch messen.|La composición iónica completa no está publicada; mida el pH tras el intercambio gaseoso.
Полный ионный состав не раскрыт; результат проверьте тестом после отстаивания.|Full ion composition is undisclosed; verify with a test after standing.|Die vollständige Ionenzusammensetzung ist unbekannt; Ergebnis nach dem Abstehen testen.|La composición iónica completa no está publicada; compruebe el resultado tras reposar.
Точная цель NO₃:PO₄ недостижима при заданных параметрах. Дозы подобраны в допустимом диапазоне.|The exact NO₃:PO₄ target is unavailable with these settings. Doses were fitted within the allowed range.|Das exakte NO₃:PO₄-Ziel ist mit diesen Werten nicht erreichbar. Die Dosierungen liegen im zulässigen Bereich.|El objetivo exacto NO₃:PO₄ no es alcanzable con estos ajustes. Las dosis se ajustaron dentro del rango permitido.
pH приготовленной воды — оценка по KH, фосфату и CO₂ при 25 °C. Измеренный pH после смешивания можно использовать для калибровки.|Prepared-water pH is estimated from KH, phosphate and CO₂ at 25 °C. Use measured pH after mixing to calibrate.|Der pH des aufbereiteten Wassers wird aus KH, Phosphat und CO₂ bei 25 °C geschätzt. Der gemessene pH nach dem Mischen kann zur Kalibrierung dienen.|El pH del agua preparada se estima con KH, fosfato y CO₂ a 25 °C. Use el pH medido tras mezclar para calibrar.
pH после подмены — оценка по итоговому KH, фосфату и CO₂ при 25 °C. Измеренный pH можно использовать для калибровки.|pH after the water change is estimated from final KH, phosphate and CO₂ at 25 °C. Use measured pH to calibrate.|Der pH nach dem Wasserwechsel wird aus End-KH, Phosphat und CO₂ bei 25 °C geschätzt. Ein Messwert kann zur Kalibrierung dienen.|El pH tras el cambio se estima con KH final, fosfato y CO₂ a 25 °C. Use una medición para calibrar.
pH после отстаивания — оценка по KH, фосфату и заданному CO₂ при 25 °C. Начальные 5 мг/л выбраны по вашему диапазону pH; уточняйте CO₂ по измерениям.|pH after standing is estimated from KH, phosphate and assumed CO₂ at 25 °C. The initial 5 mg/L is based on the reported pH range; calibrate it with measurements.|Der pH nach dem Abstehen wird aus KH, Phosphat und angenommenem CO₂ bei 25 °C geschätzt. Die anfänglichen 5 mg/l beruhen auf dem gemeldeten pH-Bereich; mit Messungen kalibrieren.|El pH tras reposar se estima con KH, fosfato y CO₂ supuesto a 25 °C. Los 5 mg/l iniciales se basan en el rango de pH comunicado; calibre con mediciones.
Показаны ионы с известным составом. HCO₃/CO₃ даны по внесённым формулам; после отстаивания их формы меняются. Неизвестные противоионы готовых препаратов учтены ниже в мэкв/л.|Only ions of known composition are shown. HCO₃/CO₃ are based on added formulas; their forms change after standing. Unknown counterions of premixed products appear below in meq/L.|Nur Ionen mit bekannter Zusammensetzung werden gezeigt. HCO₃/CO₃ stammen aus den Formeln; nach dem Abstehen ändern sich ihre Formen. Unbekannte Gegenionen fertiger Mittel stehen unten in mval/l.|Solo se muestran iones de composición conocida. HCO₃/CO₃ se basan en las fórmulas; sus formas cambian tras reposar. Los contraiones desconocidos aparecen abajo en meq/l.
При внесении кислоты HCO₃/CO₃ перераспределяются и выделяют CO₂: здесь показан номинальный ввод ионов до реакции. Снижение KH учтено в карточке результата.|Acid addition redistributes HCO₃/CO₃ and releases CO₂. The table shows nominal ions before reaction; the KH reduction is included in the result.|Säurezugabe verteilt HCO₃/CO₃ neu und setzt CO₂ frei. Die Tabelle zeigt die nominellen Ionen vor der Reaktion; die KH-Senkung ist im Ergebnis enthalten.|El ácido redistribuye HCO₃/CO₃ y libera CO₂. La tabla muestra los iones nominales antes de la reacción; la reducción de KH figura en el resultado.
Точная|Exact|Exakt|Exacta
недостижима при заданных параметрах.|cannot be reached with the selected settings.|ist mit diesen Werten nicht erreichbar.|no se alcanza con estos ajustes.
Дозы подобраны в допустимом диапазоне.|Doses fit within the allowed range.|Dosierungen liegen im zulässigen Bereich.|Las dosis están dentro del rango permitido.
Итоговый результат|Final result|Endergebnis|Resultado final
в аквариуме|in the aquarium|im Aquarium|en el acuario
после смешивания|after mixing|nach dem Mischen|tras mezclar
Программа сначала подбирает|The app first fits|Die App berechnet zuerst|La aplicación primero ajusta
при конфликте|if targets conflict|bei Zielkonflikten|si hay conflictos
Проверьте растворимость|Check solubility|Löslichkeit prüfen|Compruebe la solubilidad
Объём должен быть больше нуля.|Volume must be greater than zero.|Das Volumen muss größer als null sein.|El volumen debe ser mayor que cero.
Объём подмены превышает объём воды в аквариуме.|The change volume exceeds the aquarium water volume.|Das Wechselvolumen übersteigt das Wasservolumen im Aquarium.|El volumen del cambio supera el volumen de agua del acuario.
Для оценки pH задайте CO₂ больше нуля.|Enter CO₂ greater than zero to estimate pH.|Zur pH-Schätzung CO₂ größer als null eingeben.|Introduzca CO₂ mayor que cero para estimar el pH.
Расчётная кислотность превысила исходную щёлочность: KH ниже нуля. Уменьшите дозу и проверьте воду капельным тестом.|Calculated acidity exceeds starting alkalinity: KH is below zero. Reduce the dose and test the water.|Die berechnete Säure übersteigt die anfängliche Alkalinität: KH liegt unter null. Dosis senken und Wasser testen.|La acidez calculada supera la alcalinidad inicial: KH es negativo. Reduzca la dosis y analice el agua.
Несовместимые пресеты:|Incompatible presets:|Unvereinbare Vorlagen:|Preajustes incompatibles:
У маточного раствора должны быть положительные навеска и объём.|Stock solution mass and volume must be positive.|Einwaage und Volumen der Stammlösung müssen positiv sein.|La masa y el volumen de la solución madre deben ser positivos.
В соотношении выберите два разных иона.|Select two different ions for a ratio.|Für ein Verhältnis zwei verschiedene Ionen wählen.|Elija dos iones distintos para la proporción.
У диапазона соотношения граница «от» должна быть не больше «до», обе границы — неотрицательными.|The lower ratio bound must not exceed the upper bound, and both must be non-negative.|Die untere Verhältnisgrenze darf die obere nicht überschreiten; beide müssen positiv oder null sein.|El límite inferior no puede superar el superior y ambos deben ser no negativos.
Источник|Source|Quelle|Fuente
Хлорид калия|Potassium chloride|Kaliumchlorid|Cloruro de potasio
Анионы не раскрыты. По опубликованным Ca и Mg: 5,35 °dGH на 1 мл/л; в карточке указано 8 °dGH.|Anions are undisclosed. Published Ca and Mg imply 5.35 °dGH per 1 mL/L; the label claims 8 °dGH.|Anionen sind unbekannt. Veröffentlichte Ca- und Mg-Werte ergeben 5,35 °dGH pro 1 ml/l; das Etikett nennt 8 °dGH.|Los aniones no están publicados. Ca y Mg indican 5,35 °dGH por 1 ml/l; la etiqueta afirma 8 °dGH.
По опубликованному HCO₃: 3,20 °dKH на 1 мл/л; в карточке указано 4 °dKH.|Published HCO₃ implies 3.20 °dKH per 1 mL/L; the label claims 4 °dKH.|Veröffentlichtes HCO₃ ergibt 3,20 °dKH pro 1 ml/l; das Etikett nennt 4 °dKH.|El HCO₃ publicado indica 3,20 °dKH por 1 ml/l; la etiqueta afirma 4 °dKH.
O₂ растворённый|Dissolved O₂|Gelöstes O₂|O₂ disuelto
Δ от предыдущего замера того же теста и воды; скорость пересчитана на 24 часа. Это чистое изменение: внесения и подмены не вычитаются.|Δ from the previous reading of the same test and water source; rate is scaled to 24 hours. This is the net change: additions and water changes are not subtracted.|Δ zur vorherigen Messung desselben Tests und Wassers; die Rate ist auf 24 Stunden umgerechnet. Dies ist die Nettoänderung: Zusätze und Wasserwechsel werden nicht abgezogen.|Δ respecto a la medición anterior de la misma prueba y agua; la tasa se calcula para 24 horas. Es el cambio neto: no se descuentan aportes ni cambios de agua.
Укажите название, формулу и растворимость — здесь появится расчёт состава и эффектов.|Enter a name, formula and solubility to preview the composition and effects.|Name, Formel und Löslichkeit eingeben, um Zusammensetzung und Wirkungen zu sehen.|Introduzca nombre, fórmula y solubilidad para ver la composición y los efectos.
Количественный результат зависит от исходного состава; для расчёта дозы GH данных недостаточно.|The quantitative result depends on source water; there are insufficient data to calculate a GH dose.|Das quantitative Ergebnis hängt vom Ausgangswasser ab; für eine GH-Dosis fehlen Daten.|El resultado depende del agua de origen; faltan datos para calcular una dosis de GH.
Указанная производителем ёмкость не равна гарантированному снижению за время фильтрации.|The stated capacity does not guarantee the reduction achieved during filtration.|Die angegebene Kapazität garantiert keine bestimmte Senkung während der Filterung.|La capacidad indicada no garantiza la reducción durante la filtración.
Снижение зависит от потока, исходного уровня и насыщения.|Reduction depends on flow, starting level and saturation.|Die Senkung hängt von Durchfluss, Ausgangswert und Sättigung ab.|La reducción depende del flujo, el nivel inicial y la saturación.
Ионообменный материал связывает аммоний и некоторые металлы. Учитывайте ресурс и проверяйте воду тестами.|The ion-exchange mineral binds ammonium and some metals. Check its capacity and test the water.|Das Ionenaustausch-Mineral bindet Ammonium und einige Metalle. Kapazität beachten und Wasser testen.|El mineral de intercambio iónico fija amonio y algunos metales. Controle su capacidad y analice el agua.
Эффект зависит от исходной воды и времени контакта.|The effect depends on source water and contact time.|Die Wirkung hängt von Ausgangswasser und Kontaktzeit ab.|El efecto depende del agua de origen y del tiempo de contacto.
Аквариумы|Aquariums|Aquarien|Acuarios
Выбрать аквариум|Choose aquarium|Aquarium auswählen|Elegir acuario
+ Новый аквариум|+ New aquarium|+ Neues Aquarium|+ Nuevo acuario
Выберите аквариум для расчёта подмены и отдельного журнала.|Choose an aquarium for water-change calculations and its own log.|Wählen Sie ein Aquarium für Wasserwechselberechnung und eigenes Protokoll.|Elija un acuario para calcular cambios de agua y llevar su registro.
Профиль аквариума|Aquarium profile|Aquariumprofil|Perfil del acuario
Название аквариума|Aquarium name|Aquariumname|Nombre del acuario
Примечание к аквариуму|Aquarium note|Aquariumnotiz|Nota del acuario
Обитатели, грунт, оборудование…|Livestock, substrate, equipment…|Besatz, Bodengrund, Technik…|Habitantes, sustrato, equipo…
Форма аквариума|Aquarium shape|Aquariumform|Forma del acuario
Прямоугольный|Rectangular|Rechteckig|Rectangular
Цилиндрический|Cylindrical|Zylindrisch|Cilíndrico
Способ определения объёма|Volume method|Volumenmethode|Método de volumen
Вручную|Manual|Manuell|Manual
По размерам|From dimensions|Aus Abmessungen|Según dimensiones
Размеры указываются снаружи. Для грунта берётся средняя толщина слоя. Декор и оборудование в расчёт не входят.|Enter external dimensions. Use the average substrate depth. Decor and equipment displacement are excluded.|Außenmaße eingeben. Für den Bodengrund die mittlere Höhe verwenden. Deko und Technik werden nicht abgezogen.|Introduzca las medidas exteriores y el espesor medio del sustrato. No se descuenta el volumen de decoración ni equipos.
Длина, см|Length, cm|Länge, cm|Largo, cm
Ширина, см|Width, cm|Breite, cm|Ancho, cm
Диаметр, см|Diameter, cm|Durchmesser, cm|Diámetro, cm
Высота, см|Height, cm|Höhe, cm|Altura, cm
Толщина стекла, мм|Glass thickness, mm|Glasdicke, mm|Espesor del vidrio, mm
Средний слой грунта, см|Average substrate depth, cm|Mittlere Bodengrundhöhe, cm|Espesor medio del sustrato, cm
Недолив от края, см|Top gap, cm|Abstand zum Rand, cm|Distancia al borde, cm
Расчётный объём воды|Estimated water volume|Geschätztes Wasservolumen|Volumen de agua estimado
Рабочий объём воды, л|Working water volume, L|Tatsächliches Wasservolumen, l|Volumen efectivo de agua, l
Рабочий объём используется в расчёте подмены. При выборе «По размерам» он обновляется автоматически.|The working volume is used for water changes. From dimensions updates it automatically.|Das tatsächliche Volumen wird für Wasserwechsel verwendet. Aus Abmessungen aktualisiert es automatisch.|El volumen efectivo se usa para los cambios de agua. Según dimensiones lo actualiza automáticamente.
Удалить аквариум|Delete aquarium|Aquarium löschen|Eliminar acuario
Удалить аквариум «|Delete aquarium “|Aquarium „|Eliminar acuario «
и все его измерения?|and all its measurements?|und alle Messungen löschen?|y todas sus mediciones?
измерений|measurements|Messungen|mediciones
Настройки света|Lighting settings|Beleuchtungseinstellungen|Ajustes de iluminación
Каналы светильника|Light channels|Lichtkanäle|Canales de luz
Добавьте до 8 каналов и укажите яркость каждого в процентах.|Add up to 8 channels and set each intensity as a percentage.|Bis zu 8 Kanäle hinzufügen und die Helligkeit jedes Kanals in Prozent angeben.|Añada hasta 8 canales e indique la intensidad de cada uno en porcentaje.
Каналы не заданы.|No channels selected.|Keine Kanäle ausgewählt.|No hay canales seleccionados.
Выберите канал светильника|Choose a light channel|Lichtkanal auswählen|Elegir un canal de luz
Выберите канал|Choose a channel|Kanal auswählen|Elegir un canal
Свой канал…|Custom channel…|Eigener Kanal…|Canal personalizado…
Название своего канала|Custom channel name|Name des eigenen Kanals|Nombre del canal personalizado
+ Канал|+ Channel|+ Kanal|+ Canal
Яркость канала, %|Channel intensity, %|Kanalhelligkeit, %|Intensidad del canal, %
Удалить канал|Remove channel|Kanal entfernen|Quitar canal
Каналы|Channels|Kanäle|Canales
Укажите название своего канала|Enter a custom channel name|Namen des eigenen Kanals eingeben|Introduzca el nombre del canal personalizado
Этот канал уже добавлен|This channel is already added|Dieser Kanal wurde bereits hinzugefügt|Este canal ya está añadido
Укажите для каждого канала яркость от 0 до 100%.|Set every channel intensity between 0 and 100%.|Für jeden Kanal eine Helligkeit von 0 bis 100 % angeben.|Indique para cada canal una intensidad entre 0 y 100 %.
Белый|White|Weiß|Blanco
Тёплый белый|Warm white|Warmweiß|Blanco cálido
Холодный белый|Cool white|Kaltweiß|Blanco frío
Красный|Red|Rot|Rojo
Глубокий красный|Deep red|Tiefrot|Rojo profundo
Зелёный|Green|Grün|Verde
Синий|Blue|Blau|Azul
Королевский синий|Royal blue|Königsblau|Azul real
Голубой|Cyan|Cyan|Cian
Фиолетовый|Violet|Violett|Violeta
УФ|UV|UV|UV
Янтарный|Amber|Bernstein|Ámbar
Лунный свет|Moonlight|Mondlicht|Luz lunar
Повышает|Increases|Erhöht|Aumenta
Снижает|Decreases|Senkt|Disminuye
Светильник|Light fixture|Leuchte|Luminaria
Модель или название|Model or name|Modell oder Name|Modelo o nombre
Мощность, Вт|Power, W|Leistung, W|Potencia, W
Яркость, %|Intensity, %|Helligkeit, %|Intensidad, %
Начало освещения|Lights on|Lichtbeginn|Inicio de luz
Длительность, ч|Duration, h|Dauer, h|Duración, h
Цветовая температура, K|Color temperature, K|Farbtemperatur, K|Temperatura de color, K
PAR у грунта, мкмоль/м²/с|PAR at substrate, µmol/m²/s|PAR am Boden, µmol/m²/s|PAR en sustrato, µmol/m²/s
Экспорт в Excel|Export to Excel|Nach Excel exportieren|Exportar a Excel
Размеры и рабочий объём ↗|Dimensions and working volume ↗|Abmessungen und Wasservolumen ↗|Dimensiones y volumen efectivo ↗
Убрать тест|Remove test|Test entfernen|Quitar prueba
Измерение сохранено|Measurement saved|Messung gespeichert|Medición guardada
Укажите корректные дату и время измерения|Enter a valid measurement date and time|Gültiges Datum und Uhrzeit der Messung eingeben|Introduzca una fecha y hora válidas
Укажите название теста|Enter a test name|Testnamen eingeben|Introduzca el nombre de la prueba
Удалить это измерение из журнала?|Delete this measurement from the log?|Diese Messung aus dem Protokoll löschen?|¿Eliminar esta medición del registro?
Вещество сохранено в локальной базе|Substance saved in the local database|Stoff in der lokalen Datenbank gespeichert|Sustancia guardada en la base local
Для этой формулы название в подсказках отсутствует|No suggested name for this formula|Kein Namensvorschlag für diese Formel|No hay nombre sugerido para esta fórmula
Проверьте скобки в формуле.|Check the parentheses in the formula.|Klammern in der Formel prüfen.|Compruebe los paréntesis de la fórmula.
Неизвестный элемент в формуле:|Unknown element in the formula:|Unbekanntes Element in der Formel:|Elemento desconocido en la fórmula:
Неверный индекс в формуле.|Invalid subscript in the formula.|Ungültiger Index in der Formel.|Subíndice inválido en la fórmula.
Проверьте запись формулы.|Check the formula notation.|Schreibweise der Formel prüfen.|Compruebe la notación de la fórmula.
Укажите формулу вещества.|Enter the substance formula.|Stoffformel eingeben.|Introduzca la fórmula de la sustancia.
Гидрат записывается как ·H2O или ·7H2O.|Write hydrates as ·H2O or ·7H2O.|Hydrate als ·H2O oder ·7H2O schreiben.|Escriba los hidratos como ·H2O o ·7H2O.
Эта формула пока не разбирается автоматически. Укажите ионный состав вручную.|This formula cannot be parsed automatically yet. Enter the ion composition manually.|Diese Formel lässt sich noch nicht automatisch zerlegen. Ionenzusammensetzung manuell eingeben.|Esta fórmula aún no puede analizarse automáticamente. Introduzca los iones manualmente.
Неизвестный ион или значение:|Unknown ion or value:|Unbekanntes Ion oder Wert:|Ion o valor desconocido:
Неверная концентрация:|Invalid concentration:|Ungültige Konzentration:|Concentración inválida:
Укажите хотя бы один ион в ручном составе.|Enter at least one ion in the manual composition.|Mindestens ein Ion in der manuellen Zusammensetzung angeben.|Introduzca al menos un ion en la composición manual.
Выберите тип вещества или смеси.|Choose a substance or mixture type.|Stoff- oder Mischungstyp wählen.|Elija el tipo de sustancia o mezcla.
Укажите химическое название или название готовой смеси.|Enter the chemical name or prepared-mixture name.|Chemischen Namen oder Namen der Fertigmischung eingeben.|Introduzca el nombre químico o el de la mezcla preparada.
Ручной ионный состав можно задать только для одной формы. Для других форм создайте отдельные записи.|A manual ion composition applies to one form only. Create separate records for other forms.|Eine manuelle Ionenzusammensetzung gilt nur für eine Form. Für weitere Formen getrennte Einträge erstellen.|La composición iónica manual solo puede aplicarse a una forma. Cree registros separados para otras formas.
Укажите растворимость формы|Enter solubility for form|Löslichkeit für Form eingeben|Introduzca la solubilidad de la forma
при 20 °C.|at 20 °C.|bei 20 °C.|a 20 °C.
Формы одного вещества должны иметь одинаковую основную формулу до знака ·. Для разных солей создайте смесь.|Forms of one substance must share the base formula before ·. Create a mixture for different salts.|Formen eines Stoffs müssen vor · dieselbe Grundformel haben. Für verschiedene Salze eine Mischung anlegen.|Las formas de una sustancia deben compartir la fórmula base anterior a ·. Cree una mezcla para sales distintas.
Одна и та же форма указана дважды.|The same form is listed twice.|Dieselbe Form ist zweimal angegeben.|La misma forma aparece dos veces.
Укажите растворимость при 20 °C в г/л.|Enter solubility at 20 °C in g/L.|Löslichkeit bei 20 °C in g/l eingeben.|Introduzca la solubilidad a 20 °C en g/l.
Укажите формулу каждого компонента.|Enter a formula for each component.|Formel für jede Komponente eingeben.|Introduzca una fórmula para cada componente.
Количество каждого компонента должно быть больше нуля.|Each component amount must be greater than zero.|Die Menge jeder Komponente muss größer als null sein.|La cantidad de cada componente debe ser mayor que cero.
Сумма долей сухой смеси не может превышать 100%.|Dry-mixture fractions cannot exceed 100%.|Die Anteile einer Trockenmischung dürfen 100 % nicht überschreiten.|Las fracciones de una mezcla seca no pueden superar el 100 %.
Формула обязательна даже при ручном ионном составе.|A formula is required even with a manual ion composition.|Auch bei manueller Ionenzusammensetzung ist eine Formel erforderlich.|La fórmula es obligatoria incluso con composición iónica manual.
Формы с ручным ионным составом объединяются только после задания расчётных формул.|Forms with manual ion composition can be merged only after adding calculable formulas.|Formen mit manueller Ionenzusammensetzung können erst nach Eingabe berechenbarer Formeln zusammengeführt werden.|Las formas con composición manual solo se pueden unir tras añadir fórmulas calculables.
Эта химическая форма уже есть в карточке вещества. Откройте карточку через «Изменить».|This chemical form is already in the substance record. Open it with Edit.|Diese chemische Form ist bereits im Stoffeintrag. Über Bearbeiten öffnen.|Esta forma química ya está en la ficha. Ábrala con Editar.
Укажите результат теста или настройки света|Enter a test result or lighting settings|Testergebnis oder Beleuchtungseinstellungen eingeben|Introduzca un resultado de prueba o ajustes de iluminación
Мощность|Power|Leistung|Potencia
Яркость|Intensity|Helligkeit|Intensidad
Начало|Start|Beginn|Inicio
Длительность|Duration|Dauer|Duración
Цветовая температура|Color temperature|Farbtemperatur|Temperatura de color
Вт|W|W|W
ч|h|h|h`;

export const LOCALES = ['en', 'ru', 'de', 'es'];
const bySource = new Map(rows.trim().split('\n').map(line => {
  const [ru, en, de, es] = line.split('|');
  return [ru, { en, ru, de, es }];
}));
const pieces = [...bySource.keys()].filter(piece => piece.length >= 3).sort((a, b) => b.length - a.length);
let locale = LOCALES.includes(localStorage.getItem('aqua-stoich-locale')) ? localStorage.getItem('aqua-stoich-locale') : 'en';
const originals = new WeakMap();
const attributeOriginals = new WeakMap();

export const getLocale = () => locale;
export const intlLocale = () => ({ en: 'en-US', ru: 'ru-RU', de: 'de-DE', es: 'es-ES' })[locale];
export function translate(value) {
  const source = String(value ?? '');
  if (locale === 'ru' || !/[А-Яа-яЁё]/.test(source)) return source;
  if (bySource.has(source)) return bySource.get(source)[locale];
  let result = source;
  for (const piece of pieces) if (result.includes(piece)) result = result.split(piece).join(bySource.get(piece)[locale]);
  for (const piece of [...bySource.keys()].filter(item => item.length < 3)) {
    const escaped = piece.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(`(?<![А-Яа-яЁё])${escaped}(?![А-Яа-яЁё])`, 'g'), bySource.get(piece)[locale]);
  }
  return result;
}

function localizeText(node) {
  const current = node.nodeValue;
  const last = originals.get(node);
  const raw = last && current === last.rendered ? last.raw : current;
  const rendered = translate(raw);
  originals.set(node, { raw, rendered });
  if (current !== rendered) node.nodeValue = rendered;
}

function localizeAttributes(element) {
  const records = attributeOriginals.get(element) ?? {};
  for (const attribute of ['placeholder', 'title', 'aria-label']) {
    if (!element.hasAttribute(attribute)) continue;
    const current = element.getAttribute(attribute);
    const last = records[attribute];
    const raw = last && last.rendered === current ? last.raw : current;
    const rendered = translate(raw);
    records[attribute] = { raw, rendered };
    if (current !== rendered) element.setAttribute(attribute, rendered);
  }
  attributeOriginals.set(element, records);
}

function localizeTree(root) {
  if (root.nodeType === Node.TEXT_NODE) { localizeText(root); return; }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  if (root.closest('script,style')) return;
  localizeAttributes(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeType === Node.TEXT_NODE) localizeText(node);
    else localizeAttributes(node);
  }
}

export function setLocale(next) {
  if (!LOCALES.includes(next)) return;
  locale = next;
  localStorage.setItem('aqua-stoich-locale', next);
  document.documentElement.lang = next;
  document.title = `AquaStoich — ${translate('Расчёт воды для подмены')}`;
  const picker = document.querySelector('#language');
  if (picker) picker.value = next;
  localizeTree(document.body);
  document.dispatchEvent(new Event('aqua-locale-change'));
}

export function startLocalization() {
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') localizeTree(record.target);
      else if (record.type === 'attributes') localizeAttributes(record.target);
      else for (const node of record.addedNodes) localizeTree(node);
    }
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label'] });
  document.querySelector('#language')?.addEventListener('change', event => setLocale(event.target.value));
  setLocale(locale);
}
