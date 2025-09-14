import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slides } = req.body;

  if (!slides || !Array.isArray(slides)) {
    return res.status(400).json({ message: 'Invalid slides data' });
  }

  try {
    // Update display_order for each slide
    const updatePromises = slides.map((slide, index) => 
      pool.query(
        'UPDATE hero_slides SET display_order = ? WHERE id = ?',
        [index, slide.id]
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Slides reordered successfully' });
  } catch (error) {
    console.error('Error reordering slides:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
