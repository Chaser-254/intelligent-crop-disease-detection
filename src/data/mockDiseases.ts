export interface Disease {
  id: string;
  name: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  crop: string;
  description: string;
  symptoms: string[];
  treatments: Treatment[];
}
export interface Treatment {
  id: string;
  name: string;
  type: 'Organic' | 'Chemical' | 'Traditional';
  effectiveness: 'Low' | 'Medium' | 'High' | 'Very High';
  costPerAcre: number;
  application: string;
  instructions: string;
  frequency: string;
}
export const mockDiseases: Disease[] = [{
  id: 'faw-001',
  name: 'Fall Armyworm',
  confidence: 95,
  severity: 'High',
  crop: 'Maize',
  description: 'Larvae feed on leaves causing large irregular holes. Look for sawdust-like frass in the funnel. Early detection is critical for control.',
  symptoms: ['Ragged holes in leaves', 'Sawdust-like droppings', 'Larvae in leaf whorls'],
  treatments: [{
    id: 'treat-001',
    name: 'Neem Extract',
    type: 'Organic',
    effectiveness: 'High',
    costPerAcre: 600,
    application: 'Apply every 7 days',
    instructions: 'Mix 50ml per 20L water. Spray early morning or late evening.',
    frequency: '7 days'
  }, {
    id: 'treat-002',
    name: 'Emamectin Benzoate',
    type: 'Chemical',
    effectiveness: 'Very High',
    costPerAcre: 1200,
    application: 'Apply every 10 days',
    instructions: 'Mix 10g per 20L water. Spray when larvae are small.',
    frequency: '10 days'
  }, {
    id: 'treat-003',
    name: 'Ash & Sand Mix',
    type: 'Traditional',
    effectiveness: 'Medium',
    costPerAcre: 0,
    application: 'Apply every 3 days',
    instructions: 'Mix wood ash and fine sand. Apply to leaf whorls.',
    frequency: '3 days'
  }]
}, {
  id: 'mln-001',
  name: 'Maize Lethal Necrosis',
  confidence: 88,
  severity: 'High',
  crop: 'Maize',
  description: 'Viral disease causing severe stunting and leaf necrosis. No cure available - focus on prevention and resistant varieties.',
  symptoms: ['Yellow streaking on leaves', 'Severe stunting', 'Dead heart symptoms'],
  treatments: [{
    id: 'treat-004',
    name: 'Remove Infected Plants',
    type: 'Traditional',
    effectiveness: 'Medium',
    costPerAcre: 0,
    application: 'Immediate',
    instructions: 'Uproot and burn infected plants to prevent spread.',
    frequency: 'Once'
  }, {
    id: 'treat-005',
    name: 'Resistant Varieties',
    type: 'Organic',
    effectiveness: 'High',
    costPerAcre: 3500,
    application: 'Next season',
    instructions: 'Plant MLN-resistant maize varieties like DH04.',
    frequency: 'Seasonal'
  }]
}, {
  id: 'blight-001',
  name: 'Tomato Late Blight',
  confidence: 92,
  severity: 'High',
  crop: 'Tomato',
  description: 'Fungal disease causing dark lesions on leaves and fruit. Spreads rapidly in cool, wet conditions.',
  symptoms: ['Dark water-soaked lesions', 'White fungal growth', 'Fruit rot'],
  treatments: [{
    id: 'treat-006',
    name: 'Copper Fungicide',
    type: 'Chemical',
    effectiveness: 'High',
    costPerAcre: 800,
    application: 'Every 7 days',
    instructions: 'Mix 30g per 20L water. Spray entire plant.',
    frequency: '7 days'
  }, {
    id: 'treat-007',
    name: 'Baking Soda Spray',
    type: 'Organic',
    effectiveness: 'Medium',
    costPerAcre: 100,
    application: 'Every 5 days',
    instructions: 'Mix 2 tablespoons baking soda per liter water.',
    frequency: '5 days'
  }]
}];
export function getRandomDisease(): Disease {
  return mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
}