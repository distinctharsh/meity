import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [
      [teamRows],
      [sectionsRows],
      [peopleRows],
      [contactsRows]
    ] = await Promise.all([
      connection.execute('SELECT * FROM our_team WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC'),
      connection.execute('SELECT * FROM our_team_sections WHERE is_active = 1 ORDER BY display_order ASC, id ASC'),
      connection.execute('SELECT * FROM our_team_people WHERE is_active = 1 ORDER BY section_id ASC, display_order ASC, id ASC'),
      connection.execute('SELECT * FROM our_team_contacts ORDER BY person_id ASC, display_order ASC, id ASC')
    ]);

    const ourTeamData = {
      team: teamRows || [],
      sections: sectionsRows || [],
      people: peopleRows || [],
      contacts: contactsRows || []
    };

    const jsonFilePath = path.join(process.cwd(), 'lib', 'ourTeamData.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(ourTeamData, null, 2), 'utf8');

    return res.status(200).json({
      success: true,
      message: "Successfully synced ourTeamData.json!",
      counts: {
        team: teamRows.length,
        sections: sectionsRows.length,
        people: peopleRows.length,
        contacts: contactsRows.length
      }
    });

  } catch (error) {
    console.error("Sync our team error:", error);
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) connection.release();
  }
}