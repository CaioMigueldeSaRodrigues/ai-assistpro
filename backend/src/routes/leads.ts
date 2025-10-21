import { Router } from 'express';
import { BigQueryService } from '../services/bigquery.js';
import { SheetsService } from '../services/sheets.js';
import { captureLeadsJob } from '../services/cron.js';
import { LeadSchema } from '../types/index.js';

export const leadsRouter = Router();

// Get lead by CNPJ
leadsRouter.get('/:cnpj', async (req, res, next) => {
  try {
    const { cnpj } = req.params;
    const lead = await SheetsService.getLeadByCNPJ(cnpj);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    next(error);
  }
});

// Get lead statistics
leadsRouter.get('/stats/:cnae', async (req, res, next) => {
  try {
    const { cnae } = req.params;
    const days = parseInt(req.query.days as string) || 30;
    
    const stats = await BigQueryService.getLeadStats(cnae, days);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Manual trigger for lead capture
leadsRouter.post('/capture/trigger', async (req, res, next) => {
  try {
    // Run in background
    captureLeadsJob().catch(console.error);
    
    res.json({ 
      message: 'Lead capture job triggered',
      status: 'processing'
    });
  } catch (error) {
    next(error);
  }
});
