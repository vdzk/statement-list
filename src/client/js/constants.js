export const ontology = {
  decision: {
    label: 'выбор',
    icon: 'fas fa-hand-point-right',
    ordered: true,
  },
  event: {
    label: 'событие',
    icon: 'fas fa-circle fa-xs',
    canBeMain: true,
    ordered: true,
  },
  causation: {
    label: 'причинно-следственная связь',
    icon: 'fas fa-arrow-right',
    canBeMain: true,
    hasConfidences: true,
    relations: {
      cause: {
        label: 'причина',
        listLabel: 'Причины',
        types: ['event', 'decision'],
        icon: 'fas fa-long-arrow-alt-right',
        multiple: true,
      },
      effect: {
        label: 'следствие',
        listLabel: 'Следствие',
        types: ['event', 'citation', 'satisfaction'],
        icon: 'fas fa-long-arrow-alt-left',
      },
    }
  },
  chain: {
    label: 'причинно-следственная цепь',
    icon: 'fas fa-project-diagram',
    canBeMain: true,
    hasConfidences: true,
    canExplain: true,
    relations: {
      cause: {
        label: 'первоначальная причина',
        listLabel: 'Первоначальные причины',
        types: ['event'],
        icon: 'fas fa-long-arrow-alt-down',
        multiple: true,
      },
      explanation: {
        label: null,
        listLabel: 'Объяснение',
        types: ['decision', 'event', 'causation', 'chain', 'citation'],
        icon: null,
        multiple: true,
      },
      effect: {
        label: 'конечное следствие',
        listLabel: 'Конечное следствие(я)',
        types: ['event'],
        icon: 'fas fa-long-arrow-alt-left',
        multiple: true,
      },
    }
  },
  satisfaction: {
    label: 'удовлетворенность',
    textInputLabel: 'Субъект который обладает степенью удовлетворенности',
    icon: 'fas fa-heart',
  },
  evaluation: {
    label: 'оценка выбора',
    icon: 'fas fa-balance-scale-right',
    canBeMain: true,
    hasConfidences: true,
    canExplain: true,
    relations: {
      decision: {
        label: 'выбор',
        listLabel: 'Выбор(ы)',
        types: ['decision'],
        icon: 'fas fa-hand-point-right',
        multiple: true,
      },
      explanation: {
        label: null,
        listLabel: 'Объяснение',
        types: ['decision', 'event', 'causation', 'chain', 'citation'],
        icon: null,
        multiple: true,
      },
      satisfaction: {
        label: 'удовлетворенность',
        listLabel: 'Удовлетворенность субъекта',
        types: ['satisfaction'],
        icon: 'fas fa-heart',
      },
    }
  },
  citation: {
    label: 'цитата',
    icon: 'fas fa-quote-left',
    textInputLabel: 'Название материала и автор/источник',
  },
  def: {
    label: 'определение',
    icon: 'fas fa-language',
    separate: true,
  },
  note: {
    label:'заметка',
    icon: 'fas fa-sticky-note',
    separate: true,
  },
}

export const getDefaultFields = () => ({
  id: null,
  type: 'event',
  text: '',
  relations: null,
  confidences: null,
  modifiers: null,
  url: null,
  fullText: null,
  explanation: null,
})

export const modVar = '\\1'
