export type Background = {
  name: string;
  value: string;
  color: string;
};

export type GifItem = {
  label: string;
  url: string;
};

export type OccasionItem = {
  label: string;
  value: string;
  emoji: string;
};

export const BACKGROUNDS: Background[] = [
  { name: 'Confetti Burst 🎊', value: 'confetti', color: 'bg-gradient-to-r from-yellow-300 via-pink-300 to-pink-400' },
  { name: 'Gradient Glow 🌈', value: 'gradient', color: 'bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300' },
  { name: 'Pattern Play 🟣', value: 'pattern', color: 'bg-white border border-gray-300' },
  { name: 'Birthday Vibes 🎂', value: 'birthday', color: 'bg-gradient-to-tr from-pink-200 via-purple-200 to-blue-200' },
  { name: 'Success Path 💫', value: 'success', color: 'bg-gradient-to-r from-green-200 via-blue-200 to-purple-200' },
  { name: 'Warm Welcome 🌅', value: 'warm', color: 'bg-gradient-to-br from-orange-200 via-yellow-200 to-pink-200' },
];

export const GIFS: Record<string, GifItem[]> = {
  Birthday: [
    { label: 'Birthday Cake', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZThnb2ZrbWgzazlnazRzYXlkYjd3cjZwaDduN2UzdzEwczVrMXpodCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/GvjRy6pUMUjQxiKNlh/giphy.gif' },
    { label: 'Birthday Party', url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bzdob2RzenRkeHI4NGRrN291bW94Z3d2c21tY2xpcnVoZWZkbDlwYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/WRL7YgP42OKns22wRD/giphy.gif' },
    { label: 'Birthday Balloons', url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3djNpcWQxOWNsaDhzbGgwZ3d2OTQ5MGpzY2RranQwZWFzaHBvc2QyeCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0Ex31cSvM0Stv33y/giphy.gif' },
  ],
  'New Job': [
    { label: 'Excited for New Job', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZlY3RqejVqZ2k2MW5rb2w0dnh1MTI2a3ducjR5M2R4OHRmd2YyayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4xpB3eE00FfBm/giphy.gif' },
    { label: 'Congrats on New Job', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZng2bWZieTFkNnVwanFvNDJ0ZXlwM2lhZHUybTZ1YTRobmRxZHptNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/maNB0qAiRVAty/giphy.gif' },
    { label: 'You Got the Job!', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODV4eGZmbXhhM2cwcjVqOWhxMGVwbDNxeHN4MXJsamw2djVhem1wdiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/n9ewEcw0oyHEYEuH1c/giphy.gif' },
  ],
  Housewarming: [
    { label: 'New Home', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGkzd3B5OWU0cWk4dTBzcDVvdm0wMjZjOWk3MjJ1amZsMG95NTV4dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/803T2bGtFmSg8/giphy.gif' },
    { label: 'Housewarming Party', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGkzd3B5OWU0cWk4dTBzcDVvdm0wMjZjOWk3MjJ1amZsMG95NTV4dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tyxovVLbfZdok/giphy.gif' },
    { label: 'Welcome Home', url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZWZtdW1tc2QwMTcwMGRscXMzenljNmhtaTM0eTJudXBzOGcweHBieCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/upeUCSCeNo4qqHlxgW/giphy.gif' },
  ],
  Graduation: [
    { label: 'Graduation Cap Toss', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDlkNG95OHRrZ3AycDNkZjdjbzNncDdzZjFlOGIxYnA3cHl2aTFjbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEduUGL2JaSK7oS76/giphy.gif' },
    { label: 'Graduation Walk', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHRjcHRmdnpkaWJ0amZrbDF5eWlkZmhnMTdrMjBtNWcxZGd1ZzljcyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/o75ajIFH0QnQC3nCeD/giphy.gif' },
    { label: 'Diploma Celebration', url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NnF2OHl6aWZiejhsM3l6ajd3OWwycXl1ZnVxNXF4dG54d2dqdDExMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Bzo2CzPpCfgbe/giphy.gif' },
  ],
  Wedding: [
    { label: 'Wedding Dance', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWYyNmptbzM3MDVxZTF5Z2I2OGE3bWRqN256OTRucnl6OHJzZGN1eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/h85sDYSl23vvoI3SiB/giphy.gif' },
    { label: 'Wedding Kiss', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWYyNmptbzM3MDVxZTF5Z2I2OGE3bWRqN256OTRucnl6OHJzZGN1eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/hrjKrfYYchjo4VJF3v/giphy.gif' },
    { label: 'Wedding Cake', url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZzFubzhxdzQybGs2aTNpcDl1MzJoN2FnM216aHBwbGt0dmFyd3hxcyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/6ijcjAcSkEbKYkhGYB/giphy.gif' },
  ],
  Anniversary: [
    { label: 'Anniversary Love', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGc4emczZ2w2cDF5OHVpc3BtMm9kb24xMmRwN2Rld3dqdmFraWJsOSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/QTfVi01W3PJvmOXwMs/giphy.gif' },
    { label: 'Anniversary Hearts', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGc4emczZ2w2cDF5OHVpc3BtMm9kb24xMmRwN2Rld3dqdmFraWJsOSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1Y5x5Uq22Tlx6/giphy.gif' },
    { label: 'Anniversary Toast', url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cjg1NHQ3OHYzbWZza2JldWcxeXF3dW8wcXBsaGJ6cGxmZ3U3ZmI5NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kyLYXonQYYfwYDIeZl/giphy.gif' },
  ],
  Baby: [
    { label: 'Baby Arrival', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcndyNW9mcXk5aWh1dWpiYWF1czhqNjFhOGl0bWM2bGo4NHMzZDZpeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XweOsBl72PFcc/giphy.gif' },
    { label: 'Baby Shower', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcndyNW9mcXk5aWh1dWpiYWF1czhqNjFhOGl0bWM2bGo4NHMzZDZpeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/11PVuEm7Osdjoc/giphy.gif' },
    { label: 'Welcome Baby', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcndyNW9mcXk5aWh1dWpiYWF1czhqNjFhOGl0bWM2bGo4NHMzZDZpeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEdTYFpiMh1RdwlMs/giphy.gif' },
  ],
  Retirement: [
    { label: 'Happy Retirement', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnhkNmtsMGZzaTU1ZzN6Y29qcmc3MGwxZzM3Y2Q0eHBkazFhenJwdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l1J9CuIY0jSj1q0la/giphy.gif' },
    { label: 'Retirement Cheers', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnhkNmtsMGZzaTU1ZzN6Y29qcmc3MGwxZzM3Y2Q0eHBkazFhenJwdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/5gJGFXX0xRxzmdd0IC/giphy.gif' },
    { label: 'Relax and Enjoy', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnhkNmtsMGZzaTU1ZzN6Y29qcmc3MGwxZzM3Y2Q0eHBkazFhenJwdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8cPGBU2fpxUsxYAwHH/giphy.gif' },
  ],
  'Thank You': [
    { label: 'Thank You', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDV5aTl4ZmhpMGpubzl1dnh1cGVlYnc2MTVtYzMwNTFmNGJ4ejFybSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/i21tixUQEE7TEqwmYa/giphy.gif' },
    { label: 'Appreciation', url: 'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3b3pob21raGhhYnQzZnlvenlwMTVjdzAyZXNpYjV5Zzg4bXA3OWtmdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xdMXeiY2iCfSQ6faTk/giphy.gif' },
    { label: 'Grateful', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGpocHpocGtzOThxcWczMDZ2eGx6bTNhODl4NXZtNHJpY3hud2lzNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/MtIF4jJEolvf3OEOsh/giphy.gif' },
  ],
  Other: [
    { label: 'Celebration', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjE5bDFhYzczNnpta2RkZGJ3djAwbGVpb3FhNzQxbTdrbDhvaWttYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/w7mLEAMcpjrpe/giphy.gif' },
    { label: 'Party Time', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc256dWs4MWdudzA1Mmp0OW40ZWVqMTZnanVvMnh4djRpdzc2aGl4ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0MYt5jPR6QX5pnqM/giphy.gif' },
    { label: 'You Did It!', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXpsNXp2NTR0bmZ3aGh3Y3ZjZzByY2RqcXBjdTZjbm0zbnk3b2E1MCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/y8Mz1yj13s3kI/giphy.gif' },
  ],
};

export const OCCASIONS: OccasionItem[] = [
  { label: 'Birthday', value: 'Birthday', emoji: '🎉' },
  { label: 'New Job', value: 'New Job', emoji: '💼' },
  { label: 'Housewarming', value: 'Housewarming', emoji: '🏡' },
  { label: 'Graduation', value: 'Graduation', emoji: '🎓' },
  { label: 'Wedding', value: 'Wedding', emoji: '💒' },
  { label: 'Anniversary', value: 'Anniversary', emoji: '💕' },
  { label: 'Baby', value: 'Baby', emoji: '👶' },
  { label: 'Retirement', value: 'Retirement', emoji: '🏖️' },
  { label: 'Thank You', value: 'Thank You', emoji: '🙏' },
  { label: 'Other', value: 'Other', emoji: '✍️' },
]; 