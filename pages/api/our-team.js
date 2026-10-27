import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Sabhi required tables se data parallel select karein
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

    return res.status(200).json({
      team: teamRows || [],
      sections: sectionsRows || [],
      people: peopleRows || [],
      contacts: contactsRows || []
    });
  } catch (error) {
    console.error('Error fetching our-team data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}