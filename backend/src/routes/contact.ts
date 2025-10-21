import { Router } from 'express';
import { ContactSchema } from '../types/index.js';
import { db } from '../db/index.js';

export const contactRouter = Router();

// Submit contact form
contactRouter.post('/', async (req, res, next) => {
  try {
    const data = ContactSchema.parse(req.body);
    
    const result = await db.query(
      `INSERT INTO contacts (name, email, phone, subject, message, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [data.name, data.email, data.phone, data.subject, data.message]
    );
    
    res.status(201).json({
      message: 'Contact form submitted successfully',
      contact: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Get all contacts (admin)
contactRouter.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;
    
    const result = await db.query(
      'SELECT * FROM contacts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    const countResult = await db.query('SELECT COUNT(*) FROM contacts');
    
    res.json({
      contacts: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit
    });
  } catch (error) {
    next(error);
  }
});
