// const diffInDays = (updated: string) => {
//   const today = new Date();
//   const updatedAt = new Date(updated);
//   const daysCount = Math.floor((today.getTime() - updatedAt.getTime()) / 86400000);

//   if (daysCount === 0) {
//     return '今日';
//   }

//   if (daysCount >= 31) {
//     return `${Math.floor(daysCount / 31)}ヶ月前`;
//   }

//   if (daysCount >= 365) {
//     return `${Math.floor(daysCount / 365)}年前`;
//   }

//   return `${daysCount}日前`;
// };

// export default diffInDays;

class PostDate {
  date: string;

  constructor(date: string) {
    this.date = date;
  }

  formatDate(): string {
    const d = new Date(this.date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  }

  diffInDays(): string {
    const today = new Date();
    const updatedAt = new Date(this.date);
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
  }
}

export default PostDate;
