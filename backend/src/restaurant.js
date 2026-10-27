const restaurant = {
  name: "Przy Stole", timezone: "Europe/Warsaw", opensAt: "12:00",
  closesAt: "22:00", lastReservationAt: "20:00", maxGuests: 12,
};
function warsawNow(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: restaurant.timezone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now).map(({ type, value }) => [type, value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}
module.exports = { restaurant, warsawNow };
