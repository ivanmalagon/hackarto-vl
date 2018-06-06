function minutesToPlainEnglish (duration) {
  if (duration <= 0) {
    return '0m';
  }
  const hours = Math.floor(duration / 60);
  const minutes = Math.floor(duration % 60);
  return `${hours}h ${minutes}m`;
}

module.exports = minutesToPlainEnglish;
