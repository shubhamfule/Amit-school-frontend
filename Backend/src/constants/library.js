// Default circulation policy, matching the values found in the library module's Settings mock.
module.exports = {
  FINE_PER_OVERDUE_DAY: 2,
  DAMAGE_FINE: { "No Damage": 0, "Torn Pages": 30, "Missing Pages": 50, "Water Damage": 40, "Lost Book": 200 },
};
