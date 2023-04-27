class ConditionMake {
  constructor(musical = '', theater = '', date = '', sortingWay = '', sort = '') {
    this.musical = musical;
    this.theater = theater;
    this.date = date;
    this.condition = [];
    this.sortingWay = sortingWay;
    this.sort = sort;
    this.filter = ``;
  }
  musicalCondition() {
    if (this.musical) {
      if (typeof this.musical === 'string') {
        this.condition.push(`${this.musical}`);
      } else if (typeof this.musical === 'number') {
        this.condition.push(`m.id = ${this.musical}`);
      }
    }
  }

  theaterCondition() {
    if (this.theater) {
      if (typeof this.theater === 'string') {
        this.condition.push(`${this.theater}`);
      } else if (typeof this.theater === 'number') {
        this.condition.push(`t.id = ${this.theater}`);
      }
    }
  }

  dateCondition() {
    if (this.date) {
      if (typeof this.date === 'string' && /\d{4}-\d{2}-\d{2}/.test(this.date)) {
        this.condition.push(`md.date = '${this.date}'`);
      } else {
        this.condition.push(`${this.date}`);
      }
    }
  }

  sortingWayRateCondition() {
    if (this.sortingWay) {
      this.condition.push(`${this.sortingWay}`);
    }
  }
  sort() {
    if (this.sort) {
      this.condition.push(`${this.sort}`);
    }
  }

  mixCondition() {
    if (this.sort === 'order') {
      if (this.condition.length > 1) {
        const conditions = this.condition.join(`,  `);
        this.filter += ` ORDER BY ${conditions}`;
      } else if (this.condition.length === 1) {
        this.filter += ` ORDER BY ${this.condition[0]}`;
      }
    } else if (this.sort === 'where') {
      if (this.condition.length > 1) {
        const conditions = this.condition.join(` AND `);
        this.filter += ` WHERE ${conditions}`;
      } else if (this.condition.length === 1) {
        this.filter += ` WHERE ${this.condition[0]}`;
      }
    }
  }
  build() {
    this.musicalCondition();
    this.theaterCondition();
    this.dateCondition();
    this.sortingWayRateCondition();
    this.mixCondition();
    return this.filter;
  }
}
module.exports = ConditionMake;







