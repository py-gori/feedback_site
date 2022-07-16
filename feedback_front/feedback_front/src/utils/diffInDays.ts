const diffInDays = (updated: string) => {
  const today = new Date();
  const updatedAt = new Date(updated);
  const daysCount = Math.floor((today.getTime() - updatedAt.getTime()) / 86400000);

  if (daysCount === 0) {
    return '今日';
  }

  if (daysCount >= 31) {
    return `${Math.floor(daysCount / 31)}ヶ月前`;
  }

  if (daysCount >= 365) {
    return `${Math.floor(daysCount / 365)}年前`;
  }

  return `${daysCount}日前`;
};

export default diffInDays;
