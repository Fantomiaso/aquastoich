// Formula masses refer to the whole crystalline form. Ions are expressed as
// stoichiometric counts; chemistry.mjs converts them to mg per gram.
const salt = (id, name, aliases, variants) => ({
  id, name, aliases, short: variants[0][1].split('·')[0], type: 'dry', group: 'Соли',
  variants: variants.map(([formId, formula, molarMass, ions, solubilityGPerL, ionCharges, acidMeqPerUnit]) => ({
    id: formId, name: formula, molarMass, formula: ions, solubilityGPerL, ...(ionCharges ? { ionCharges } : {}),
    ...(acidMeqPerUnit ? { acidMeqPerUnit } : {}),
  })),
  note: 'Состав рассчитан по формуле. Растворимость укажите по этикетке конкретной формы перед приготовлением концентрированного маточника.',
});

const liquid = (id, name, composition, source, note = '') => ({
  id, name, short: name.split(' ').at(-1), type: 'liquid', group: 'Готовые растворы', composition,
  unknownCounterions: true, source,
  note: `${note}${note ? ' ' : ''}Учтены опубликованные ионы; нераскрытые противоионы и остальные компоненты не приписываются.`,
});

const reference = (id, name, short, effects, source, note, type = 'media') => ({
  id, name, short, effects, source, note, type, referenceOnly: true,
  group: type === 'media' ? 'Фильтрующие материалы' : 'Буферы и кондиционеры',
});

export const EXTENDED_PRODUCTS = [
  salt('cacl2', 'Хлорид кальция', 'Кальций хлористый', [
    ['anhydrous', 'CaCl2', 110.978, { Ca: 1, Cl: 2 }],
    ['dihydrate', 'CaCl2·2H2O', 147.0086, { Ca: 1, Cl: 2 }],
  ]),
  salt('mgcl2', 'Хлорид магния', 'Магний хлористый; бишофит', [
    ['anhydrous', 'MgCl2', 95.205, { Mg: 1, Cl: 2 }],
    ['hexahydrate', 'MgCl2·6H2O', 203.2967, { Mg: 1, Cl: 2 }],
  ]),
  salt('kcl', 'Хлорид калия', 'Калий хлористый', [['standard', 'KCl', 74.5483, { K: 1, Cl: 1 }]]),
  salt('nacl', 'Хлорид натрия', 'Поваренная соль', [['standard', 'NaCl', 58.4398, { Na: 1, Cl: 1 }]]),
  salt('k2so4', 'Сульфат калия', 'Калий сернокислый', [['standard', 'K2SO4', 174.2592, { K: 2, SO4: 1 }]]),
  salt('na2so4', 'Сульфат натрия', 'Глауберова соль; натрий сернокислый', [
    ['anhydrous', 'Na2SO4', 142.0421, { Na: 2, SO4: 1 }],
    ['decahydrate', 'Na2SO4·10H2O', 322.1949, { Na: 2, SO4: 1 }],
  ]),
  salt('caso4', 'Сульфат кальция', 'Гипс; кальций сернокислый', [
    ['dihydrate', 'CaSO4·2H2O', 172.1712, { Ca: 1, SO4: 1 }, 2],
    ['anhydrous', 'CaSO4', 136.1406, { Ca: 1, SO4: 1 }],
  ]),
  salt('na2co3', 'Карбонат натрия', 'Кальцинированная сода', [
    ['anhydrous', 'Na2CO3', 105.9884, { Na: 2, CO3: 1 }],
    ['decahydrate', 'Na2CO3·10H2O', 286.1412, { Na: 2, CO3: 1 }],
  ]),
  salt('khco3', 'Гидрокарбонат калия', 'Пищевая добавка E501(ii)', [['standard', 'KHCO3', 100.1151, { K: 1, HCO3: 1 }]]),
  salt('k2hpo4', 'Гидрофосфат калия', 'Двузамещённый фосфат калия', [['standard', 'K2HPO4', 174.1759, { K: 2, PO4: 1 }, null, { PO4: -2 }]]),
  salt('nah2po4', 'Дигидрофосфат натрия', 'Монофосфат натрия', [
    ['anhydrous', 'NaH2PO4', 119.977, { Na: 1, PO4: 1 }],
    ['monohydrate', 'NaH2PO4·H2O', 137.9923, { Na: 1, PO4: 1 }],
  ]),
  salt('nano3', 'Нитрат натрия', 'Натриевая селитра', [['standard', 'NaNO3', 84.9947, { Na: 1, NO3: 1 }]]),
  salt('mgno3', 'Нитрат магния', 'Магниевая селитра', [['hexahydrate', 'Mg(NO3)2·6H2O', 256.4065, { Mg: 1, NO3: 2 }]]),
  salt('feso4', 'Сульфат железа(II)', 'Железный купорос', [['heptahydrate', 'FeSO4·7H2O', 278.0146, { Fe: 1, SO4: 1 }, null, { Fe: 2 }]]),
  salt('mnso4', 'Сульфат марганца(II)', 'Марганцевый купорос', [['monohydrate', 'MnSO4·H2O', 169.015, { Mn: 1, SO4: 1 }, null, { Mn: 2 }]]),
  salt('cuso4', 'Сульфат меди(II)', 'Медный купорос', [['pentahydrate', 'CuSO4·5H2O', 249.685, { Cu: 1, SO4: 1 }, null, { Cu: 2 }]]),
  salt('znso4', 'Сульфат цинка', 'Цинковый купорос', [['heptahydrate', 'ZnSO4·7H2O', 287.5496, { Zn: 1, SO4: 1 }, null, { Zn: 2 }]]),

  { ...salt('nahso4', 'Гидросульфат натрия', 'Кислый сульфат натрия', [
    ['anhydrous', 'NaHSO4', 120.0603, { Na: 1, SO4: 1 }, null, { SO4: -2 }, 1000 / 120.0603],
  ]), group: 'Кислоты и буферы', note: 'При растворении высвобождает кислотный эквивалент: расчёт снижает KH на 1 мэкв на моль. Итоговый pH проверьте после отстаивания.' },
  { ...salt('khso4', 'Гидросульфат калия', 'Кислый сульфат калия', [
    ['anhydrous', 'KHSO4', 136.1688, { K: 1, SO4: 1 }, null, { SO4: -2 }, 1000 / 136.1688],
  ]), group: 'Кислоты и буферы', note: 'При растворении высвобождает кислотный эквивалент: расчёт снижает KH на 1 мэкв на моль. Итоговый pH проверьте после отстаивания.' },
  { id: 'seachem-acid-buffer', name: 'Seachem Acid Buffer', short: 'KH−', type: 'dry', group: 'Кислоты и буферы',
    composition: {}, acidMeqPerUnit: 8, unknownCounterions: true,
    note: 'По инструкции 2 г на 80 л снижают щёлочность примерно на 0,2 мэкв/л: принято 8 мэкв/г. Полный ионный состав не раскрыт; pH после газообмена измерьте.',
    source: 'https://www.seachem.com/acid-buffer.php' },
  { id: 'sera-ph-kh-minus', name: 'sera pH/KH-minus', short: 'KH−', type: 'liquid', group: 'Кислоты и буферы',
    composition: {}, acidMeqPerUnit: 0.35663 * 20 / 5, unknownCounterions: true,
    note: 'По инструкции 5 мл на 20 л снижают KH примерно на 1 °dKH: принято 1,427 мэкв/мл. Полный ионный состав не раскрыт; результат проверьте тестом после отстаивания.',
    source: 'https://www.sera.de/fileadmin/user_upload/manuals/sourcefiles/03540_03550_03560_03579_03580_sera_pH_KH_minus_2014-05_INT.pdf' },

  liquid('aquayer-nitrate', 'AQUAYER Нитрат', { NO3: 72, K: 45.3 }, 'https://aquayer.com/ru/product/aquayer-smart-makro'),
  liquid('aquayer-phosphate', 'AQUAYER Фосфат', { PO4: 7.2, K: 3 }, 'https://aquayer.com/ru/product/aquayer-smart-makro'),
  liquid('aquayer-potassium', 'AQUAYER Удо Ермолаева КАЛИЙ', { K: 50 }, 'https://aquayer.com/ru/product/aquayer-udo-yermolayeva-kaliy'),
  liquid('aquayer-macro', 'AQUAYER Удо Ермолаева МАКРО+', { NO3: 28.82, PO4: 3.68, K: 20.43 }, 'https://aquayer.com/ru/product/aquayer-udo-yermolayeva-makro', 'NO₃ и PO₄ пересчитаны из нитратного N и общего P; другие формы азота не показаны.'),
  liquid('aquayer-micro', 'AQUAYER Удо Ермолаева МИКРО+', { K: 6.93, Fe: 1.2, Mg: 0.8, Mn: 0.4, B: 0.072, Mo: 0.03, Cu: 0.045, Zn: 0.015, Co: 0.007 }, 'https://aquayer.com/ru/product/aquayer-udo-yermolayeva-mikro'),
  liquid('aquayer-iron', 'AQUAYER Удо Ермолаева ЖЕЛЕЗО', { Fe: 7, Mn: 1.3 }, 'https://aquayer.com/ru/product/aquayer-udo-yermolayeva-zalizo'),
  liquid('seachem-potassium', 'Seachem Flourish Potassium', { K: 41.5 }, 'https://www.seachem.com/flourish-potassium.php'),
  liquid('seachem-phosphorus', 'Seachem Flourish Phosphorus', { PO4: 4.5 }, 'https://www.seachem.com/flourish-phosphorus.php'),
  liquid('seachem-iron', 'Seachem Flourish Iron', { Fe: 10 }, 'https://www.seachem.com/flourish-iron.php'),
  liquid('dennerle-npk', 'Dennerle Plant Care NPK', { NO3: 50, PO4: 4, K: 25, Mg: 5 }, 'https://dennerle.com/en/products/plant-care-npk', 'Состав пересчитан из опубликованной прибавки при дозе 10 мл/100 л.'),
  liquid('dennerle-n', 'Dennerle Plant Care N', { NO3: 100, K: 20 }, 'https://dennerle.com/en/products/plant-care-n', 'Состав пересчитан из опубликованной дозировки.'),
  liquid('dennerle-p', 'Dennerle Plant Care P', { PO4: 12.5, K: 5 }, 'https://dennerle.com/en/products/plant-care-p', 'Состав пересчитан из опубликованной дозировки.'),
  liquid('dennerle-k', 'Dennerle Plant Care K', { K: 50 }, 'https://dennerle.com/en/products/plant-care-k', 'Состав пересчитан из опубликованной дозировки.'),
  liquid('aqua-rebell-nitrate', 'Aqua Rebell Makro Basic Nitrat', { NO3: 50, K: 30 }, 'https://www.aqua-rebell.de/Aqua-Rebell-Makro-Basic-Nitrat-1000-ml', 'Состав пересчитан из опубликованной дозировки.'),
  liquid('aqua-rebell-phosphate', 'Aqua Rebell Makro Basic Phosphat', { PO4: 5, K: 2 }, 'https://www.aqua-rebell.de/Aqua-Rebell-Makro-Basic-Phosphat', 'Состав пересчитан из опубликованной дозировки.'),
  liquid('aqua-rebell-potassium', 'Aqua Rebell Makro Basic Kalium', { K: 25 }, 'https://www.aqua-rebell.de/Aqua-Rebell-Makro-Basic-Kalium_1', 'Состав пересчитан из опубликованной дозировки.'),
  liquid('aqua-rebell-npk', 'Aqua Rebell Makro Basic NPK', { NO3: 25, PO4: 2.5, K: 32.5, Mg: 2.5 }, 'https://www.aqua-rebell.de/Aqua-Rebell-Makro-Basic-NPK-1000-ml', 'Состав пересчитан из опубликованной дозировки.'),
  { id: 'seachem-equilibrium', name: 'Seachem Equilibrium', short: 'GH', type: 'dry', group: 'Реминерализаторы',
    composition: { Ca: 80.6, Mg: 24.1, K: 195, Fe: 1.1, Mn: 0.6 }, unknownCounterions: true, preferDry: true,
    note: 'Гарантированный элементный анализ в мг/г. Производитель указывает сульфаты, но не раскрывает их точные количества; готовьте как суспензию и проверяйте растворение.',
    source: 'https://www.seachem.com/equilibrium.php' },

  reference('seachem-neutral-regulator', 'Seachem Neutral Regulator', 'GH−', ['GH-', 'Ca-', 'Mg-'],
    'https://www.seachem.com/neutral-regulator.php',
    'Умягчает воду осаждением кальция и магния. Количественный результат зависит от исходного состава; для расчёта дозы GH данных недостаточно.', 'dry-mixture'),
  reference('sera-super-peat', 'sera super peat', 'pH−', ['pH-', 'KH-', 'GH-'],
    'https://www.sera.de/us/product/freshwater-aquarium/sera-super-peat/',
    'Торфяной фильтрующий материал: подкисляет и смягчает воду. Эффект зависит от исходной воды и времени контакта.'),
  reference('seachem-phosguard', 'Seachem PhosGuard', 'PO₄−', ['PO4-'],
    'https://www.seachem.com/phosguard.php',
    'Оксид алюминия связывает фосфат. Указанная производителем ёмкость не равна гарантированному снижению за время фильтрации.'),
  reference('seachem-phosnet', 'Seachem PhosNet', 'PO₄−', ['PO4-'],
    'https://www.seachem.com/phosnet.php',
    'Гранулированный оксид железа связывает фосфат. Снижение зависит от потока, исходного уровня и насыщения.'),
  reference('seachem-zeolite', 'Seachem Zeolite', 'NH₄−', ['NH4-', 'Cu-', 'Zn-'],
    'https://www.seachem.com/zeolite.php',
    'Ионообменный материал связывает аммоний и некоторые металлы. Учитывайте ресурс и проверяйте воду тестами.'),
];
