import cron from 'node-cron';
import { BigQueryService } from './bigquery.js';
import { SheetsService } from './sheets.js';
import type { LeadCaptureConfig } from '../types/index.js';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function captureLeadsJob() {
  console.log('🔄 Starting lead capture job...');
  
  const config: LeadCaptureConfig = {
    cnae: process.env.CNAE_DEFAULT || '5611201',
    janela_de_dias: parseInt(process.env.LEAD_CAPTURE_INTERVAL_DAYS || '7'),
    limite_registros: parseInt(process.env.LEAD_CAPTURE_LIMIT || '10000'),
  };

  try {
    const leads = await BigQueryService.captureLeads(config);
    console.log(`📊 Found ${leads.length} leads`);

    if (leads.length === 0) {
      console.log('✅ No new leads to process');
      return;
    }

    // Process in batches
    const batchSize = parseInt(process.env.LEAD_CAPTURE_BATCH_SIZE || '300');
    const delaySeconds = parseInt(process.env.LEAD_CAPTURE_DELAY_SECONDS || '3');

    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);
      console.log(`📝 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(leads.length / batchSize)}`);
      
      await SheetsService.appendLeads(batch);
      
      if (i + batchSize < leads.length) {
        await delay(delaySeconds * 1000);
      }
    }

    console.log('✅ Lead capture job completed successfully');
  } catch (error) {
    console.error('❌ Error in lead capture job:', error);
  }
}

export function setupCronJobs() {
  // Run every day at 6 AM (matching the n8n schedule)
  cron.schedule('0 6 * * *', captureLeadsJob, {
    timezone: 'America/Sao_Paulo'
  });

  console.log('⏰ Cron jobs scheduled');
  console.log('   - Lead capture: Daily at 6:00 AM (America/Sao_Paulo)');
}

// Export for manual trigger
export { captureLeadsJob };
