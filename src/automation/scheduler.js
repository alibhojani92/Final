/**
 * scheduler.js
 * --------------------------------
 * Phase-6: Central cron scheduler
 * Called by Cloudflare Workers cron
 */

import { CRON_JOBS } from "../config/cron.js";

import { runMorningJob } from "./morning.job.js";
import { runReminderJob } from "./reminder.job.js";
import { runSummaryJob } from "./summary.job.js";

/**
 * Cloudflare cron entry
 * @param {ScheduledController} controller
 * @param {Object} env
 */
export async function handleCron(controller, env) {
  const jobName = controller.cron;

  try {
    switch (jobName) {
      case CRON_JOBS.MORNING:
        console.log("CRON → Morning Motivation");
        await runMorningJob(env);
        break;

      case CRON_JOBS.REMINDER:
        console.log("CRON → Study Reminder");
        await runReminderJob(env);
        break;

      case CRON_JOBS.SUMMARY:
        console.log("CRON → Night Summary");
        await runSummaryJob(env);
        break;

      default:
        console.log("CRON → Unknown job:", jobName);
    }
  } catch (error) {
    console.error("CRON ERROR:", error);
  }
  }
