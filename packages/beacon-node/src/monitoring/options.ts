export type MonitoringOptions = {
  /** Remote endpoint URL where client stats are sent */
  endpoint: string;
  /** Interval in milliseconds between sending client stats */
  interval?: number;
  /** Initial delay in milliseconds before client stats are sent */
  initialDelay?: number;
  /** Timeout in milliseconds for sending client stats */
  requestTimeout?: number;
  /** Enable collecting system stats */
  collectSystemStats?: boolean;
};

export const defaultMonitoringOptions: Required<MonitoringOptions> = {
  endpoint: "",
  // default interval should be once a minute
  // but need to add 2 seconds to avoid rate limit errors
  interval: 62_000,
  initialDelay: 30_000,
  requestTimeout: 10_000,
  collectSystemStats: true,
};