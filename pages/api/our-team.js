import fs from 'fs';
import path from 'path';

// import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    /*
      ============================================================
      FUTURE USE: Database queries
      ============================================================
      const [
        [teamRows],
        [sectionsRows],
        [peopleRows],
        [contactsRows]
      ] = await Promise.all([
        pool.query('SELECT * FROM our_team WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC'),
        pool.query('SELECT * FROM our_team_sections WHERE is_active = 1 ORDER BY display_order ASC, id ASC'),
        pool.query('SELECT * FROM our_team_people WHERE is_active = 1 ORDER BY section_id ASC, display_order ASC, id ASC'),
        pool.query('SELECT * FROM our_team_contacts ORDER BY person_id ASC, display_order ASC, id ASC')
      ]);
    */

    // Fast Load: Read data from local JSON file
    const filePath = path.join(process.cwd(), 'lib', 'ourTeamData.json');
    
    let jsonData = {
      team: [],
      sections: [],
      people: [],
      contacts: []
    };

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath, 'utf8');
      jsonData = JSON.parse(fileBuffer);
    }

    return res.status(200).json(jsonData);
  } catch (error) {
    console.error('Error fetching our-team data from JSON:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}