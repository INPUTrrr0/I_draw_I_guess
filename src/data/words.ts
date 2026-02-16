import { Difficulty, Word } from '../types/game.types';

export const wordDatabase = {
  easy: [
    'cat', 'dog', 'sun', 'moon', 'tree', 'car', 'book', 'house',
    'star', 'fish', 'bird', 'flower', 'apple', 'ball', 'chair',
    'door', 'window', 'heart', 'smile', 'cloud', 'rain', 'fire',
    'water', 'hand', 'foot', 'eye', 'nose', 'ear', 'mouth', 'hair',
    'lamp', 'desk', 'phone', 'cup', 'bowl', 'fork', 'key', 'lock',
    'shoe', 'hat'
  ],
  medium: [
    'elephant', 'computer', 'bicycle', 'mountain', 'keyboard',
    'umbrella', 'volcano', 'penguin', 'butterfly', 'telescope',
    'lighthouse', 'dinosaur', 'rainbow', 'waterfall', 'compass',
    'helicopter', 'pineapple', 'octopus', 'pyramid', 'sandwich',
    'kangaroo', 'dolphin', 'guitar', 'robot', 'castle',
    'astronaut', 'tornado', 'submarine', 'igloo', 'microscope',
    'flamingo', 'cactus', 'parachute', 'windmill', 'rocket',
    'carousel', 'treasure', 'anchor', 'hammock', 'peacock'
  ],
  hard: [
    'architecture', 'metamorphosis', 'constellation', 'photosynthesis',
    'microscope', 'satellite', 'ecosystem', 'renaissance', 'democracy',
    'fibonacci', 'algorithm', 'combustion', 'chromosome', 'gravity',
    'electricity', 'thermometer', 'excavation', 'judiciary', 'laboratory',
    'magnetism', 'metabolism', 'equilibrium', 'precipitation', 'synthesis',
    'referendum', 'infrastructure', 'biodiversity', 'phenomenon', 'hieroglyphics',
    'parliament', 'expedition', 'archaeology', 'bureaucracy', 'catastrophe',
    'contradiction', 'pharmaceutical', 'revolutionary', 'transparency', 'hypothesis'
  ]
};

export const selectRandomWords = (difficulty: Difficulty): Word[] => {
  const pool = wordDatabase[difficulty];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 20).map((text, index) => ({ text, index }));
};
