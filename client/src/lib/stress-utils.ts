export function getStressLevel(score: number): string {
  if (score <= 25) return 'Rendah';
  if (score <= 50) return 'Sedang';
  if (score <= 75) return 'Tinggi';
  return 'Sangat Tinggi';
}

export function getStressDescription(score: number): string {
  if (score <= 25) {
    return 'Tingkat stres Anda tergolong rendah. Pertahankan kondisi positif ini dengan terus menjaga keseimbangan hidup.';
  } else if (score <= 50) {
    return 'Anda mungkin mengalami beberapa tekanan, tetapi masih dalam batas yang dapat dikelola. Cobalah untuk mengambil waktu istirahat sejenak hari ini.';
  } else if (score <= 75) {
    return 'Tingkat stres Anda cukup tinggi. Pertimbangkan untuk berbicara dengan seseorang yang Anda percaya atau profesional.';
  } else {
    return 'Anda mungkin mengalami stres yang signifikan. Sangat disarankan untuk mencari dukungan profesional.';
  }
}

export function getStressColor(score: number): string {
  if (score <= 25) return 'hsl(158, 64%, 52%)'; // Green
  if (score <= 50) return 'hsl(45, 93%, 47%)'; // Yellow  
  return 'hsl(0, 84%, 60%)'; // Red
}

export function calculateStressScore(answers: number[]): number {
  const average = answers.reduce((sum, answer) => sum + answer, 0) / answers.length;
  return Math.round((average - 1) * 25); // Convert 1-5 scale to 0-100 scale
}
