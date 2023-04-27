class ConditionMake {
  constructor(musical, theater, date, releasedDate, endDate, ageRate, reservationRate) {
    this.musical = musical;
    this.theater = theater;
    this.date = date;
    this.releasedDate = releasedDate;
    this.endDate = endDate;
    this.ageRate = ageRate;
    this.rerservationRate = reservationRate;
    this.condition = [];
    this.filter = ``;
  }

  // reservationRate: 'reservationRate DESC',
  // releasedDateASC: 'musicals.released_date',
  // releasedDateDESC: 'musicals.released_date DESC',
  // endDateASC: 'musicals.end_date',
  // endDateDESC: 'musicals.end_date DESC',
  // ageRateASC: 'musicals.age_rated_id',

  musicalCondition() {
    if (this.musical) this.condition.push(`m.id = ${this.musical}`);
  }

  theaterCondition() {
    if (this.theater) {
      this.condition.push(`t.id = ${this.theater}`);
    } else if (this.musical) {
      this.condition.push(`mt.musical_id = ${this.musical}`);
    }
  }

  dateCondition() {
    if (this.date) this.condition.push(`md.date = '${this.date}'`);
  }

  releasedDate() {
    if (this.releasedDate) {
      this.condition.push(`${this.releasedDate}`);
    }
  }

  endDate() {
    if (this.endDate) {
      this.condition.push(`${this.endDate}`);
    }
  }

  ageRate() {
    if (this.ageRate) {
      this.condition.push(`${this.ageRate}`);
    }
  }

  reservationRate() {
    if (this.rerservationRate) {
      this.condition.psuh(`${this.reservationRate}`);
    }
  }

  mixCondition() {
    if (this.condition.length !== 0) this.filter = ` WHERE ${this.condition.join(` AND `)}`;
  }

  mixOrderCondition() {
    if (this.condition.length !== 0) this.filter = ` ORDER BY ${this.condition.join(` , `)}`;
  }

  build() {
    this.musicalCondition();
    this.theaterCondition();
    this.dateCondition();
    this.mixCondition();
    this.mixOrderCondition();
    return this.filter;
  }
}
module.exports = ConditionMake;
