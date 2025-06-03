export const BACKGROUNDS = [
  { name: 'Confetti Burst 🎊', value: 'confetti', color: 'bg-gradient-to-r from-yellow-300 via-pink-300 to-pink-400' },
  { name: 'Gradient Glow 🌈', value: 'gradient', color: 'bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300' },
  { name: 'Pattern Play 🟣', value: 'pattern', color: 'bg-white border border-gray-300' },
] as const;

export const GIFS = {
  Birthday: [
    { label: 'Dancing Cat', url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif' },
    { label: 'Confetti Explosion', url: 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif' },
    { label: 'Birthday Cake', url: 'https://media.giphy.com/media/l0MYOUI5XfRkS0YVW/giphy.gif' },
  ],
  'New Job': [
    { label: 'Office Dance', url: 'https://media.giphy.com/media/l2JJKs3I69qfaQleE/giphy.gif' },
    { label: 'Congrats Banner', url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif' },
    { label: 'Thumbs Up', url: 'https://media.giphy.com/media/OkJat1YNdoD3W/giphy.gif' },
  ],
  Housewarming: [
    { label: 'Welcome Home', url: 'https://media.giphy.com/media/3oKIPvvaugnP88ZxIc/giphy.gif' },
    { label: 'Moving Boxes', url: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif' },
    { label: 'House Party', url: 'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif' },
  ],
  Graduation: [
    { label: 'Graduation Cap', url: 'https://media.giphy.com/media/3o6gDWzmAzrpi5DQU8/giphy.gif' },
    { label: 'Celebration', url: 'https://media.giphy.com/media/l4FGjNNQYCrC7ZvoI/giphy.gif' },
    { label: 'Success', url: 'https://media.giphy.com/media/12BxzBy3K0lsOs/giphy.gif' },
  ],
  'Thank You': [
    { label: 'Thank You Heart', url: 'https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif' },
    { label: 'Grateful', url: 'https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif' },
    { label: 'Appreciation', url: 'https://media.giphy.com/media/3oEjHWXddcCOGZNmFO/giphy.gif' },
  ],
} as const;

export type Occasion = {
    label: string;
    value: string;
    emoji?: string;
  };

  export const OCCASIONS: Occasion[] = [
  { label: 'Birthday', value: 'Birthday', emoji: '🎉' },
  { label: 'New Job', value: 'New Job', emoji: '💼' },
  { label: 'Housewarming', value: 'Housewarming', emoji: '🏡' },
  { label: 'Graduation', value: 'Graduation', emoji: '🎓' },
  { label: 'Thank You', value: 'Thank You', emoji: '🙏' },
  { label: 'Other', value: 'Other', emoji: '✍️' },
] as const; 