
const Sync = {
  getSyncRules() {
    return {
      syncPeriod: parseInt(process.env.SYNC_PERIOD) || 1,
      syncPeriodType: process.env.SYNC_PERIOD_TYPE || "days",
    }
  }
}

export default Sync