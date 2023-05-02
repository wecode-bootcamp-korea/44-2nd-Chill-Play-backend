const OrderStatusEnum = Object.freeze({
  결제대기: 1,
  결제완료: 2,
  환불중: 3,
  환불완료: 4,
});

module.exports = {
  OrderStatusEnum,
};
