import type { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    day_number: 1,
    name: 'First Hello',
    description: 'Smile & say hello to one stranger',
    tips: 'Start with people in service roles - baristas, cashiers, or someone waiting in line next to you. A simple "hello" or "good morning" is all it takes.',
  },
  {
    id: 2,
    day_number: 2,
    name: 'Weather Chat',
    description: 'Comment on something you\'re both experiencing such as the weather',
    tips: 'Look for shared experiences - "Beautiful day, isn\'t it?" or "Can you believe this rain?" Works great in elevators, bus stops, or parks.',
  },
  {
    id: 3,
    day_number: 3,
    name: 'Helping Hand',
    description: 'Ask a stranger for a small favor, the time, directions, a photo',
    tips: 'People love to help! Ask for directions, the time, a restaurant recommendation, or if they can take your photo. It\'s a natural conversation starter.',
  },
  {
    id: 4,
    day_number: 4,
    name: 'Compliment',
    description: 'Give a stranger a genuine compliment',
    tips: 'Compliment something they chose - their shoes, bag, phone case, or hairstyle. Be genuine and specific: "I love those sneakers!" works better than a generic compliment.',
  },
  {
    id: 5,
    day_number: 5,
    name: 'How Are You?',
    description: 'Ask one stranger how their day is going',
    tips: 'After your initial hello, follow up with "How\'s your day going?" Be ready to actually listen to the answer. People rarely get asked this genuinely.',
  },
  {
    id: 6,
    day_number: 6,
    name: 'Getting Personal',
    description: 'Ask a stranger a personal question to get to know them',
    tips: 'Try "What do you do?" or "Are you from around here?" or "What brings you here today?" Show genuine curiosity about their story.',
  },
  {
    id: 7,
    day_number: 7,
    name: 'Taking Names',
    description: 'Get the name of someone new. Log it here so you don\'t forget',
    tips: 'After a nice conversation, say "I\'m [your name], by the way" - they\'ll almost always share theirs. Then log it in your Hello Book!',
  },
];

export function getChallengeForDay(day: number): Challenge | undefined {
  return CHALLENGES.find((c) => c.day_number === day);
}
