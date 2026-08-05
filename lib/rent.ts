const MONTHLY_RENT = 15000;

export function calculateRentStatus(totalInvested: number) {
  const monthsCovered = Math.floor(totalInvested / MONTHLY_RENT);

  const remainingCredit = totalInvested % MONTHLY_RENT;

  const amountLeftForNextMonth = MONTHLY_RENT - remainingCredit;

  return {
    monthsCovered,
    remainingCredit,
    amountLeftForNextMonth,
  };
}