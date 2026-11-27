const goodPractices = [
  {
    id: 1,
    title: "Digital India Initiative",
    slug: "digital-india-initiative",
    category: "Digital Governance",
    state: "Pan India",
    year: "2025",
    image: "/images/good-practices/digital-governance.jpg",
    description:
      "Promoting digital services and transparent governance through technology.",
  },
  {
    id: 2,
    title: "Community Water Management",
    slug: "community-water-management",
    category: "Rural Development",
    state: "Rajasthan",
    year: "2024",
    image: "/images/good-practices/water-management.jpg",
    description:
      "A community-driven initiative for sustainable water management.",
  },
  {
    id: 3,
    title: "Digital Healthcare Services",
    slug: "digital-healthcare-services",
    category: "Healthcare",
    state: "Uttar Pradesh",
    year: "2025",
    image: "/images/good-practices/healthcare.jpg",
    description:
      "Improving healthcare accessibility through digital platforms.",
  },
  {
    id: 4,
    title: "Smart Education Initiative",
    slug: "smart-education-initiative",
    category: "Education",
    state: "Delhi",
    year: "2023",
    image: "/images/good-practices/education.jpg",
    description: "Using technology to improve the quality of education.",
  },

  {
    id: 5,
    title: "Mission ANKURAN",
    slug: "mission-ankuran",
    category: "Education",
    state: "Andaman & Nicobar Islands",
    year: "2026",
    level: "State/UT",
    beneficiaries: "Children",

    image: "/images/good-practices/ankuran/hero.jpg",

    description:
      "Mission ANKURAN identifies foundational literacy and numeracy gaps through competency-based screening, groups students by learning level, and provides targeted support during Zero Period, with reassessment and digital tracking to guide progression.",

    gallery: [
      "/images/good-practices/ankuran/gallery-main.jpg",
      "/images/good-practices/ankuran/gallery-teacher.jpg",
      "/images/good-practices/ankuran/gallery-group.jpg",
    ],

    galleryCaptions: [
      "Students engaged in foundational learning under Mission ANKURAN",
      "Teacher providing reading support",
      "Group learning activity",
    ],

    impact: {
      numeracy: "84.21%",
      literacy: "69.43%",
      cases: "8,587",
      statesCovered: "Top 10",
      assessment: "Mega Assessment, 2026",
      baseline: "Baseline, 2024–25",
      source: "PARAKH Sarvekshan 2024",
      chartDescription:
        "In Mega Assessment 2026, 84.21% of assessed students improved in Numeracy and 69.43% improved in Literacy.",
    },

    contact: {
      name: "Dr. Rajesh Kumar",
      designation: "Programme Officer, School Education Department",
      department: "Andaman & Nicobar Administration",
      email: "rajesh.kumar@nic.in",
      phone: "+91 94342 56789",
    },

    reportUrl: "/reports/mission-ankuran-report.pdf",

    similarPracticeIds: [],
  },
];

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  return res.status(200).json(goodPractices);
}
