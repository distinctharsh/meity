import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // For now, return mock data since we don't have an activity log table yet
    // In a real application, you would have an activity_log table
    const activities = [
      {
        type: 'create',
        description: 'Added new hero slide "Digital India Initiative"',
        user: 'admin',
        timestamp: '2 hours ago'
      },
      {
        type: 'update',
        description: 'Updated announcement "Cyber Security Guidelines"',
        user: 'admin',
        timestamp: '4 hours ago'
      },
      {
        type: 'create',
        description: 'Added new offering "Startup India Scheme"',
        user: 'admin',
        timestamp: '6 hours ago'
      },
      {
        type: 'upload',
        description: 'Uploaded document "Annual Report 2024"',
        user: 'admin',
        timestamp: '1 day ago'
      },
      {
        type: 'create',
        description: 'Added new partner "Digital Locker"',
        user: 'admin',
        timestamp: '2 days ago'
      }
    ];

    res.status(200).json(activities);

  } catch (error) {
    console.error('Activities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
