import { ISSUE_IMAGES } from '../assets/placeholders';

export const SAMPLE_USERS = [
  {
    id: 'usr_001',
    name: 'Karthik Subramanian',
    email: 'karthik.s@example.com',
    phone: '9840123456',
    role: 'citizen',
    language: 'en',
    location: 'T. Nagar, Chennai',
    createdAt: '2026-01-15T10:00:00Z',
    avatar: null
  },
  {
    id: 'usr_002',
    name: 'Ananya Raghavan',
    email: 'ananya.r@example.com',
    phone: '9840987654',
    role: 'citizen',
    language: 'ta',
    location: 'Adyar, Chennai',
    createdAt: '2026-02-10T14:30:00Z',
    avatar: null
  },
  {
    id: 'usr_admin',
    name: 'Officer Sundar Rajan (Zonal Officer)',
    email: 'admin.chennai@nammafix.gov.in',
    phone: '9444011223',
    role: 'admin',
    language: 'en',
    location: 'Greater Chennai Corporation HQ, Ripon Building',
    createdAt: '2025-11-01T09:00:00Z',
    avatar: null
  }
];

export const SAMPLE_DEPARTMENTS = [
  {
    id: 'dept_roads',
    name: 'Roads & Bridges Department',
    categories: ['pothole', 'traffic'],
    contactPhone: '044-25384520',
    contactEmail: 'roads.gcc@chennaicorporation.gov.in',
    area: 'Greater Chennai (Zone 1-15)'
  },
  {
    id: 'dept_sanitation',
    name: 'Solid Waste Management & Sanitation',
    categories: ['garbage'],
    contactPhone: '044-25619206',
    contactEmail: 'sanitation.gcc@chennaicorporation.gov.in',
    area: 'Greater Chennai Central'
  },
  {
    id: 'dept_water',
    name: 'Chennai Metro Water & Sewerage Board (CMWSSB)',
    categories: ['water', 'drainage'],
    contactPhone: '044-45674567',
    contactEmail: 'support@chennaimetrowater.tn.gov.in',
    area: 'Metro Chennai Area'
  },
  {
    id: 'dept_electricity',
    name: 'TANGEDCO (Electricity & Street Lighting)',
    categories: ['street_light', 'electricity'],
    contactPhone: '9498794987',
    contactEmail: 'contact@tnebnet.org',
    area: 'South & Central Chennai'
  },
  {
    id: 'dept_traffic',
    name: 'Greater Chennai Traffic Police (GCTP)',
    categories: ['traffic', 'other'],
    contactPhone: '044-23452330',
    contactEmail: 'traffic.police@tn.gov.in',
    area: 'Chennai City'
  }
];

export const SAMPLE_ISSUES = [
  {
    id: 'NMF-2026-00427',
    complaintId: 'NMF-2026-00427',
    reporter: SAMPLE_USERS[0],
    category: 'pothole',
    description: 'Dangerous double pothole right after Usman Road flyover descent. Causes severe vehicle swerving and two-wheeler skids especially during rain.',
    imageUrl: ISSUE_IMAGES.pothole,
    location: {
      type: 'Point',
      coordinates: [80.2337, 13.0418] // T. Nagar, Chennai
    },
    address: '14, South Usman Road, T. Nagar, Chennai - 600017',
    status: 'in_progress',
    affectedCount: 28,
    confirmedByUserIds: ['usr_001', 'usr_002'],
    department: SAMPLE_DEPARTMENTS[0],
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-09-28T08:30:00Z',
    updatedAt: '2026-10-01T15:20:00Z',
    timeline: [
      { status: 'reported', at: '2026-09-28T08:30:00Z', by: 'Karthik Subramanian (Citizen)', note: 'Complaint submitted with photo and GPS location' },
      { status: 'verified', at: '2026-09-29T10:15:00Z', by: 'Sundar Rajan (Zonal Inspector)', note: 'Field verification confirmed hazardous road condition' },
      { status: 'assigned', at: '2026-09-29T11:00:00Z', by: 'System', note: 'Assigned to Roads & Bridges Department (Ward 134)' },
      { status: 'in_progress', at: '2026-10-01T15:20:00Z', by: 'Eng. K. Balaji (Roads Dept)', note: 'Patchwork asphalt mix deployed; leveling underway' }
    ]
  },
  {
    id: 'NMF-2026-00412',
    complaintId: 'NMF-2026-00412',
    reporter: SAMPLE_USERS[1],
    category: 'garbage',
    description: 'Commercial waste overflowing near fish market corner. Stray cattle and dogs spreading plastic into storm drains. Foul smell unbearable.',
    imageUrl: ISSUE_IMAGES.garbage,
    location: {
      type: 'Point',
      coordinates: [80.2585, 13.0067] // Adyar, Chennai
    },
    address: 'Near 2nd Cross Street, Gandhi Nagar, Adyar, Chennai - 600020',
    status: 'assigned',
    affectedCount: 19,
    confirmedByUserIds: ['usr_002'],
    department: SAMPLE_DEPARTMENTS[1],
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-09-29T09:10:00Z',
    updatedAt: '2026-09-30T14:00:00Z',
    timeline: [
      { status: 'reported', at: '2026-09-29T09:10:00Z', by: 'Ananya Raghavan (Citizen)', note: 'Waste overflow reported' },
      { status: 'verified', at: '2026-09-30T10:00:00Z', by: 'Sanitation Officer', note: 'Spot verified; secondary compactor required' },
      { status: 'assigned', at: '2026-09-30T14:00:00Z', by: 'Zonal Officer', note: 'Assigned to Urbaser Sumeet Conservancy Team' }
    ]
  },
  {
    id: 'NMF-2026-00398',
    complaintId: 'NMF-2026-00398',
    reporter: SAMPLE_USERS[0],
    category: 'street_light',
    description: 'Four consecutive LED streetlights completely dead for past 5 days between 4th Main Road and Park entrance. Dark stretch causing safety fear for women at night.',
    imageUrl: ISSUE_IMAGES.street_light,
    location: {
      type: 'Point',
      coordinates: [80.2155, 13.0850] // Anna Nagar, Chennai
    },
    address: '4th Main Road, Shanthi Colony, Anna Nagar, Chennai - 600040',
    status: 'resolved',
    affectedCount: 42,
    confirmedByUserIds: ['usr_001'],
    department: SAMPLE_DEPARTMENTS[3],
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-09-24T18:45:00Z',
    updatedAt: '2026-09-27T11:30:00Z',
    timeline: [
      { status: 'reported', at: '2026-09-24T18:45:00Z', by: 'Karthik Subramanian', note: 'Reported dark street stretch' },
      { status: 'verified', at: '2026-09-25T09:00:00Z', by: 'TNEB Inspector', note: 'Cable underground joint burn identified' },
      { status: 'assigned', at: '2026-09-25T11:20:00Z', by: 'TANGEDCO Dispatcher', note: 'Assigned to Line Gang Crew #4' },
      { status: 'in_progress', at: '2026-09-26T14:00:00Z', by: 'Line Gang Crew', note: 'Underground line spliced and MCB box replaced' },
      { status: 'resolved', at: '2026-09-27T11:30:00Z', by: 'Asst. Engineer TNEB', note: 'All 4 luminaires energized and tested during nighttime run' }
    ]
  },
  {
    id: 'NMF-2026-00385',
    complaintId: 'NMF-2026-00385',
    reporter: SAMPLE_USERS[1],
    category: 'water',
    description: 'Major drinking water supply pipeline cracked. Potable water gushing onto road for 12+ hours with massive wastage and low pressure in residential taps.',
    imageUrl: ISSUE_IMAGES.water,
    location: {
      type: 'Point',
      coordinates: [80.2690, 13.0335] // Mylapore, Chennai
    },
    address: 'Near Kapaleeshwarar Temple North Mada St, Mylapore, Chennai - 600004',
    status: 'in_progress',
    affectedCount: 65,
    confirmedByUserIds: ['usr_001', 'usr_002'],
    department: SAMPLE_DEPARTMENTS[2],
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-09-30T06:15:00Z',
    updatedAt: '2026-10-01T09:00:00Z',
    timeline: [
      { status: 'reported', at: '2026-09-30T06:15:00Z', by: 'Ananya Raghavan', note: 'High volume pipeline burst reported' },
      { status: 'verified', at: '2026-09-30T07:30:00Z', by: 'CMWSSB Duty Officer', note: 'Emergency verified: 200mm distribution pipe ruptured' },
      { status: 'assigned', at: '2026-09-30T08:00:00Z', by: 'Area Engineer Area IX', note: 'Emergency repair gang dispatched' },
      { status: 'in_progress', at: '2026-10-01T09:00:00Z', by: 'CMWSSB Team', note: 'Valve isolated, trench excavated, collar clamp installation in progress' }
    ]
  },
  {
    id: 'NMF-2026-00430',
    complaintId: 'NMF-2026-00430',
    reporter: SAMPLE_USERS[0],
    category: 'drainage',
    description: 'Open storm water drain manhole cover missing. High risk of pedestrian falling during evening hours.',
    imageUrl: ISSUE_IMAGES.drainage,
    location: {
      type: 'Point',
      coordinates: [80.2220, 12.9780] // Velachery, Chennai
    },
    address: '100 Feet Bypass Road, Near Vijayanagar Bus Stand, Velachery, Chennai - 600042',
    status: 'reported',
    affectedCount: 14,
    confirmedByUserIds: ['usr_001'],
    department: null,
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-10-02T07:15:00Z',
    updatedAt: '2026-10-02T07:15:00Z',
    timeline: [
      { status: 'reported', at: '2026-10-02T07:15:00Z', by: 'Karthik Subramanian', note: 'Complaint logged with photo' }
    ]
  },
  {
    id: 'NMF-2026-00431',
    complaintId: 'NMF-2026-00431',
    reporter: SAMPLE_USERS[1],
    category: 'electricity',
    description: 'Pillar junction box open with live wires exposed near children play park.',
    imageUrl: ISSUE_IMAGES.electricity,
    location: {
      type: 'Point',
      coordinates: [80.2110, 13.0090] // Guindy, Chennai
    },
    address: 'Race Course Road, Guindy, Chennai - 600032',
    status: 'verified',
    affectedCount: 31,
    confirmedByUserIds: ['usr_002'],
    department: SAMPLE_DEPARTMENTS[3],
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-10-01T16:00:00Z',
    updatedAt: '2026-10-01T18:00:00Z',
    timeline: [
      { status: 'reported', at: '2026-10-01T16:00:00Z', by: 'Ananya Raghavan', note: 'Safety hazard reported' },
      { status: 'verified', at: '2026-10-01T18:00:00Z', by: 'Safety Officer', note: 'Immediate barricade placed; repair pending' }
    ]
  },
  {
    id: 'NMF-2026-00360',
    complaintId: 'NMF-2026-00360',
    reporter: SAMPLE_USERS[0],
    category: 'traffic',
    description: 'Traffic signal at intersection stuck permanently on amber blinker, creating chaos during peak school hours.',
    imageUrl: ISSUE_IMAGES.traffic,
    location: {
      type: 'Point',
      coordinates: [80.2450, 13.0600] // Nungambakkam
    },
    address: 'Sterling Road Junction, Nungambakkam, Chennai - 600034',
    status: 'resolved',
    affectedCount: 53,
    confirmedByUserIds: ['usr_001'],
    department: SAMPLE_DEPARTMENTS[4],
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-21T16:30:00Z',
    timeline: [
      { status: 'reported', at: '2026-09-20T10:00:00Z', by: 'Karthik Subramanian', note: 'Signal timer failure reported' },
      { status: 'verified', at: '2026-09-20T11:00:00Z', by: 'Traffic Inspector', note: 'PLC board reset required' },
      { status: 'assigned', at: '2026-09-20T11:30:00Z', by: 'GCTP Control Room', note: 'Assigned to Traffic Automation Contractor' },
      { status: 'resolved', at: '2026-09-21T16:30:00Z', by: 'Traffic Automation Engineer', note: 'Logic card replaced and synced with automatic queue sensor' }
    ]
  },
  {
    id: 'NMF-2026-00345',
    complaintId: 'NMF-2026-00345',
    reporter: SAMPLE_USERS[1],
    category: 'other',
    description: 'Large dried banyan tree branch hanging precariously above electrical cables and footpath.',
    imageUrl: ISSUE_IMAGES.other,
    location: {
      type: 'Point',
      coordinates: [80.2600, 13.0380] // Alwarpet
    },
    address: 'TTK Road, Alwarpet, Chennai - 600018',
    status: 'rejected',
    affectedCount: 5,
    confirmedByUserIds: ['usr_002'],
    department: null,
    duplicateOf: null,
    rejectionReason: 'The tree is situated inside private residential compound walls. Notice issued to building owner under Chennai City Municipal Corporation Act.',
    createdAt: '2026-09-18T11:00:00Z',
    updatedAt: '2026-09-19T14:00:00Z',
    timeline: [
      { status: 'reported', at: '2026-09-18T11:00:00Z', by: 'Ananya Raghavan', note: 'Hazardous branch reported' },
      { status: 'rejected', at: '2026-09-19T14:00:00Z', by: 'Parks & Trees Officer', note: 'Private property - notice issued to property management' }
    ]
  },
  {
    id: 'NMF-2026-00320',
    complaintId: 'NMF-2026-00320',
    reporter: SAMPLE_USERS[0],
    category: 'drainage',
    description: 'Severe sewage backflow onto street after light rain. Manhole leaking foul water near residential apartments.',
    imageUrl: ISSUE_IMAGES.drainage,
    location: {
      type: 'Point',
      coordinates: [80.2280, 13.0320] // West Mambalam
    },
    address: 'Arya Gowda Road, West Mambalam, Chennai - 600033',
    status: 'reopened',
    affectedCount: 38,
    confirmedByUserIds: ['usr_001', 'usr_002'],
    department: SAMPLE_DEPARTMENTS[2],
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-09-15T08:00:00Z',
    updatedAt: '2026-09-26T17:00:00Z',
    timeline: [
      { status: 'reported', at: '2026-09-15T08:00:00Z', by: 'Karthik Subramanian', note: 'Sewage overflow reported' },
      { status: 'verified', at: '2026-09-16T10:00:00Z', by: 'Sanitation Officer', note: 'Blockage confirmed' },
      { status: 'assigned', at: '2026-09-16T12:00:00Z', by: 'CMWSSB', note: 'Suction jetting team allocated' },
      { status: 'resolved', at: '2026-09-18T16:00:00Z', by: 'CMWSSB Jetting Team', note: 'Desilting completed' },
      { status: 'reopened', at: '2026-09-26T17:00:00Z', by: 'Citizen Feedback (Karthik S)', note: 'Sewage overflowing again within 5 days; heavy silt remaining in main sewer line' }
    ]
  },
  {
    id: 'NMF-2026-00435',
    complaintId: 'NMF-2026-00435',
    reporter: SAMPLE_USERS[1],
    category: 'garbage',
    description: 'Dumping of construction debris and debris blocks footpath near bus shelter.',
    imageUrl: ISSUE_IMAGES.garbage,
    location: {
      type: 'Point',
      coordinates: [80.2480, 13.0820] // Kilpauk
    },
    address: 'Poonamallee High Road, Kilpauk, Chennai - 600010',
    status: 'reported',
    affectedCount: 8,
    confirmedByUserIds: ['usr_002'],
    department: null,
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-10-02T09:30:00Z',
    updatedAt: '2026-10-02T09:30:00Z',
    timeline: [
      { status: 'reported', at: '2026-10-02T09:30:00Z', by: 'Ananya Raghavan', note: 'Debris dumping reported' }
    ]
  },
  {
    id: 'NMF-2026-00405',
    complaintId: 'NMF-2026-00405',
    reporter: SAMPLE_USERS[0],
    category: 'pothole',
    description: 'Series of 5 consecutive potholes spanning entire road width, slowing traffic to a crawl.',
    imageUrl: ISSUE_IMAGES.pothole,
    location: {
      type: 'Point',
      coordinates: [80.2030, 13.0490] // Vadapalani
    },
    address: 'Arcot Road, Near Vadapalani Metro Station, Chennai - 600026',
    status: 'assigned',
    affectedCount: 47,
    confirmedByUserIds: ['usr_001'],
    department: SAMPLE_DEPARTMENTS[0],
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-09-27T14:15:00Z',
    updatedAt: '2026-09-28T16:00:00Z',
    timeline: [
      { status: 'reported', at: '2026-09-27T14:15:00Z', by: 'Karthik Subramanian', note: 'Pothole cluster reported' },
      { status: 'verified', at: '2026-09-28T10:00:00Z', by: 'Zonal Engineer', note: 'Site verified for cold-mix milling' },
      { status: 'assigned', at: '2026-09-28T16:00:00Z', by: 'Highways Division', note: 'Contractor assigned for night work' }
    ]
  },
  {
    id: 'NMF-2026-00375',
    complaintId: 'NMF-2026-00375',
    reporter: SAMPLE_USERS[1],
    category: 'street_light',
    description: 'High mast light at roundabout flickering continuously causing epileptic hazard and glare.',
    imageUrl: ISSUE_IMAGES.street_light,
    location: {
      type: 'Point',
      coordinates: [80.2520, 13.0030] // Besant Nagar
    },
    address: 'Besant Nagar 6th Avenue, Chennai - 600090',
    status: 'in_progress',
    affectedCount: 22,
    confirmedByUserIds: ['usr_002'],
    department: SAMPLE_DEPARTMENTS[3],
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-09-22T20:00:00Z',
    updatedAt: '2026-09-25T11:00:00Z',
    timeline: [
      { status: 'reported', at: '2026-09-22T20:00:00Z', by: 'Ananya Raghavan', note: 'High mast lamp flicker reported' },
      { status: 'verified', at: '2026-09-23T10:00:00Z', by: 'Electrical Inspector', note: 'Ignitor and ballast failure detected' },
      { status: 'assigned', at: '2026-09-24T09:00:00Z', by: 'TANGEDCO', note: 'Hydraulic lift vehicle scheduled' },
      { status: 'in_progress', at: '2026-09-25T11:00:00Z', by: 'Maintenance Crew', note: 'Replacement ballast being fitted' }
    ]
  },
  {
    id: 'NMF-2026-00310',
    complaintId: 'NMF-2026-00310',
    reporter: SAMPLE_USERS[0],
    category: 'water',
    description: 'Contaminated muddy brown tap water received in 20+ houses on 3rd Main Road.',
    imageUrl: ISSUE_IMAGES.water,
    location: {
      type: 'Point',
      coordinates: [80.2180, 13.0210] // Ashok Nagar
    },
    address: '3rd Main Road, Ashok Nagar, Chennai - 600083',
    status: 'resolved',
    affectedCount: 78,
    confirmedByUserIds: ['usr_001', 'usr_002'],
    department: SAMPLE_DEPARTMENTS[2],
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-09-10T07:30:00Z',
    updatedAt: '2026-09-14T18:00:00Z',
    timeline: [
      { status: 'reported', at: '2026-09-10T07:30:00Z', by: 'Karthik Subramanian', note: 'Water contamination reported' },
      { status: 'verified', at: '2026-09-10T11:00:00Z', by: 'CMWSSB Quality Officer', note: 'Turbidity testing showed storm water seepage' },
      { status: 'assigned', at: '2026-09-11T09:00:00Z', by: 'Area Engineer', note: 'Pipeline leak detection team deployed' },
      { status: 'in_progress', at: '2026-09-12T14:00:00Z', by: 'CMWSSB Team', note: 'Seepage joint excavated and encased in concrete' },
      { status: 'resolved', at: '2026-09-14T18:00:00Z', by: 'Quality Lab', note: 'Water purity re-tested: 0 NTU turbidity and chlorinated' }
    ]
  },
  {
    id: 'NMF-2026-00440',
    complaintId: 'NMF-2026-00440',
    reporter: SAMPLE_USERS[0],
    category: 'pothole',
    description: 'Deep road cave-in around storm water drain grating on Mount Road.',
    imageUrl: ISSUE_IMAGES.pothole,
    location: {
      type: 'Point',
      coordinates: [80.2510, 13.0610] // Anna Salai / Mount Road
    },
    address: 'Anna Salai, Near Thousand Lights, Chennai - 600006',
    status: 'reported',
    affectedCount: 33,
    confirmedByUserIds: ['usr_001'],
    department: null,
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-10-02T10:10:00Z',
    updatedAt: '2026-10-02T10:10:00Z',
    timeline: [
      { status: 'reported', at: '2026-10-02T10:10:00Z', by: 'Karthik Subramanian', note: 'Cave-in hazard reported' }
    ]
  },
  {
    id: 'NMF-2026-00420',
    complaintId: 'NMF-2026-00420',
    reporter: SAMPLE_USERS[1],
    category: 'traffic',
    description: 'Road signs and speed limit boards completely blocked by wild overgrown hedges.',
    imageUrl: ISSUE_IMAGES.traffic,
    location: {
      type: 'Point',
      coordinates: [80.2630, 12.9860] // Thiruvanmiyur
    },
    address: 'East Coast Road (ECR), Thiruvanmiyur, Chennai - 600041',
    status: 'verified',
    affectedCount: 16,
    confirmedByUserIds: ['usr_002'],
    department: SAMPLE_DEPARTMENTS[4],
    duplicateOf: null,
    rejectionReason: null,
    createdAt: '2026-09-28T12:00:00Z',
    updatedAt: '2026-09-29T15:30:00Z',
    timeline: [
      { status: 'reported', at: '2026-09-28T12:00:00Z', by: 'Ananya Raghavan', note: 'Signboard obstruction reported' },
      { status: 'verified', at: '2026-09-29T15:30:00Z', by: 'Traffic Officer', note: 'Pruning request sent to highways horticulture' }
    ]
  }
];

export const SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif_1',
    user: SAMPLE_USERS[0],
    issueId: 'NMF-2026-00427',
    type: 'type_status_update',
    params: { issueId: 'NMF-2026-00427', status: 'In Progress' },
    read: false,
    createdAt: '2026-10-01T15:20:00Z'
  },
  {
    id: 'notif_2',
    user: SAMPLE_USERS[0],
    issueId: 'NMF-2026-00398',
    type: 'type_resolved',
    params: { issueId: 'NMF-2026-00398' },
    read: false,
    createdAt: '2026-09-27T11:30:00Z'
  },
  {
    id: 'notif_3',
    user: SAMPLE_USERS[0],
    issueId: 'NMF-2026-00427',
    type: 'type_confirmation_added',
    params: { count: 28, issueId: 'NMF-2026-00427' },
    read: true,
    createdAt: '2026-09-30T16:00:00Z'
  },
  {
    id: 'notif_4',
    user: SAMPLE_USERS[1],
    issueId: 'NMF-2026-00412',
    type: 'type_assigned',
    params: { issueId: 'NMF-2026-00412', department: 'Solid Waste Management' },
    read: true,
    createdAt: '2026-09-30T14:00:00Z'
  },
  {
    id: 'notif_5',
    user: SAMPLE_USERS[0],
    issueId: 'NMF-2026-00320',
    type: 'type_status_update',
    params: { issueId: 'NMF-2026-00320', status: 'Reopened' },
    read: true,
    createdAt: '2026-09-26T17:00:00Z'
  },
  {
    id: 'notif_6',
    user: SAMPLE_USERS[1],
    issueId: 'NMF-2026-00345',
    type: 'type_rejected',
    params: { issueId: 'NMF-2026-00345', reason: 'Private property - notice served' },
    read: true,
    createdAt: '2026-09-19T14:00:00Z'
  },
  {
    id: 'notif_7',
    user: SAMPLE_USERS[0],
    issueId: 'NMF-2026-00310',
    type: 'type_resolved',
    params: { issueId: 'NMF-2026-00310' },
    read: true,
    createdAt: '2026-09-14T18:00:00Z'
  },
  {
    id: 'notif_8',
    user: SAMPLE_USERS[1],
    issueId: 'NMF-2026-00431',
    type: 'type_verified',
    params: { issueId: 'NMF-2026-00431' },
    read: true,
    createdAt: '2026-10-01T18:00:00Z'
  }
];

export const EMERGENCY_CONTACTS = [
  { id: '112', title: '112 National Emergency', subtitle: 'All-in-one Emergency Response Support', phone: '112', icon: 'ShieldAlert', color: 'red' },
  { id: '100', title: '100 Police Control Room', subtitle: 'City Police Emergency Dispatch', phone: '100', icon: 'Siren', color: 'blue' },
  { id: '101', title: '101 Fire & Rescue', subtitle: 'Fire Emergency & Disaster Response', phone: '101', icon: 'Flame', color: 'orange' },
  { id: '108', title: '108 Medical Ambulance', subtitle: '24/7 Free Ambulance Service', phone: '108', icon: 'HeartPulse', color: 'green' },
  { id: '1098', title: '1098 Child Helpline', subtitle: 'Emergency Child Care & Protection', phone: '1098', icon: 'Users', color: 'amber' },
  { id: '181', title: '181 Women Helpline', subtitle: '24/7 Women Safety & Support', phone: '181', icon: 'HeartHandshake', color: 'purple' }
];
