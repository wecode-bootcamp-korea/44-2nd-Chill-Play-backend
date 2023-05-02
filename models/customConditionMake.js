class CustomConditionMake {
  constructor(input = '') {
    this.input = input;
    this.condition = [];
    this.filter = ``;
  }

  inputCondition() {
    if (this.input) {
      (this.input).map((item) =>   
      this.condition.push(`${item}`)
      );
    }
  }


  mixConditionOrderBy() {
    if (this.condition.length > 1) {
      const conditions = this.condition.join(', ');
      this.filter += ` ORDER BY ${conditions}`;
    } else if (this.condition.length === 1) {
      this.filter += ` ORDER BY ${this.condition[0]}`;
    }
  }

  mixConditionWhere() {
    if (this.condition.length > 1) {
      const conditions = this.condition.join(` AND `);
      this.filter += ` WHERE ${conditions}`;
    } else if (this.condition.length === 1) {
      this.filter += ` WHERE ${this.condition[0]}`;
    }
  }

  buildOrderBy() {
    this.inputCondition();
    this.mixConditionOrderBy();
    return this.filter;
  }
  buildWhere() {
    this.inputCondition();
    this.mixConditionWhere();
    return this.filter;
  }
}
module.exports = CustomConditionMake;
