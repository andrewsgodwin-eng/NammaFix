import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Issue } from '../models/Issue.js';
import { Notification } from '../models/Notification.js';
import { Confirmation } from '../models/Confirmation.js';

export async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('ℹ️ Database already seeded.');
      return;
    }

    console.log('🌱 Seeding database with initial civic dataset...');

    // 1. Create Users
    const users = await User.create([
      {
        firebaseUid: 'firebase_usr_001',
        name: 'Karthik Subramanian',
        email: 'karthik.s@example.com',
        phone: '9840123456',
        role: 'citizen',
        language: 'en',
        location: 'T. Nagar, Chennai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
      {
        firebaseUid: 'firebase_usr_002',
        name: 'Ananya Raghavan',
        email: 'ananya.r@example.com',
        phone: '9840987654',
        role: 'citizen',
        language: 'ta',
        location: 'Adyar, Chennai',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      },
      {
        firebaseUid: 'firebase_usr_admin',
        name: 'Officer Sundar Rajan',
        email: 'admin.chennai@nammafix.gov.in',
        phone: '9444011223',
        role: 'admin',
        language: 'en',
        location: 'Ripon Building, Greater Chennai Corporation HQ',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
    ]);

    // 2. Create Departments
    const departments = await Department.create([
      {
        name: 'Roads & Bridges Department',
        categories: ['pothole', 'traffic', 'water_stagnation'],
        contactPhone: '044-25384520',
        contactEmail: 'roads.gcc@chennaicorporation.gov.in',
        area: 'Greater Chennai (Zone 1-15)',
      },
      {
        name: 'Solid Waste Management & Sanitation',
        categories: ['garbage'],
        contactPhone: '044-25619206',
        contactEmail: 'sanitation.gcc@chennaicorporation.gov.in',
        area: 'Greater Chennai Central',
      },
      {
        name: 'Chennai Metro Water & Sewerage Board (CMWSSB)',
        categories: ['water', 'drainage', 'water_stagnation'],
        contactPhone: '044-45674567',
        contactEmail: 'support@chennaimetrowater.tn.gov.in',
        area: 'Metro Chennai Area',
      },
      {
        name: 'TANGEDCO (Electricity & Street Lighting)',
        categories: ['street_light', 'electricity'],
        contactPhone: '9498794987',
        contactEmail: 'contact@tnebnet.org',
        area: 'South & Central Chennai',
      },
      {
        name: 'Greater Chennai Traffic Police (GCTP)',
        categories: ['traffic', 'other'],
        contactPhone: '044-23452330',
        contactEmail: 'traffic.police@tn.gov.in',
        area: 'Chennai City',
      },
    ]);

    // 3. Create Issues
    const issue1 = await Issue.create({
      complaintId: 'NMF-2026-00427',
      reporter: users[0]._id,
      category: 'pothole',
      description: 'Dangerous double pothole right after Usman Road flyover descent. Causes severe vehicle swerving.',
      imageUrl: '',
      location: { type: 'Point', coordinates: [80.2337, 13.0418] },
      address: '14, South Usman Road, T. Nagar, Chennai - 600017',
      status: 'in_progress',
      affectedCount: 28,
      department: departments[0]._id,
      timeline: [
        { status: 'reported', at: new Date('2026-09-28T08:30:00Z'), by: 'Karthik Subramanian', note: 'Submitted with photo' },
        { status: 'verified', at: new Date('2026-09-29T10:15:00Z'), by: 'Sundar Rajan (Officer)', note: 'Field verified' },
        { status: 'assigned', at: new Date('2026-09-29T11:00:00Z'), by: 'System', note: 'Assigned to Roads Dept' },
        { status: 'in_progress', at: new Date('2026-10-01T15:20:00Z'), by: 'Balaji (Roads Dept)', note: 'Leveling underway' },
      ],
    });

    const issue2 = await Issue.create({
      complaintId: 'NMF-2026-00412',
      reporter: users[1]._id,
      category: 'garbage',
      description: 'Commercial waste overflowing near fish market corner. Foul smell unbearable.',
      imageUrl: '',
      location: { type: 'Point', coordinates: [80.2585, 13.0067] },
      address: 'Near 2nd Cross Street, Gandhi Nagar, Adyar, Chennai - 600020',
      status: 'assigned',
      affectedCount: 19,
      department: departments[1]._id,
      timeline: [
        { status: 'reported', at: new Date('2026-09-29T09:10:00Z'), by: 'Ananya Raghavan', note: 'Reported waste overflow' },
        { status: 'assigned', at: new Date('2026-09-30T14:00:00Z'), by: 'Zonal Officer', note: 'Assigned to Sanitation Team' },
      ],
    });

    const issue3 = await Issue.create({
      complaintId: 'NMF-2026-00398',
      reporter: users[0]._id,
      category: 'street_light',
      description: 'Four consecutive LED streetlights completely dead for past 5 days between 4th Main Road and Park.',
      imageUrl: '',
      location: { type: 'Point', coordinates: [80.2155, 13.085] },
      address: '4th Main Road, Shanthi Colony, Anna Nagar, Chennai - 600040',
      status: 'resolved',
      affectedCount: 42,
      department: departments[3]._id,
      timeline: [
        { status: 'reported', at: new Date('2026-09-24T18:45:00Z'), by: 'Karthik Subramanian', note: 'Reported dark street' },
        { status: 'resolved', at: new Date('2026-09-27T11:30:00Z'), by: 'Asst. Engineer TNEB', note: 'Underground line spliced and luminaires replaced' },
      ],
    });

    const issue4 = await Issue.create({
      complaintId: 'NMF-2026-00385',
      reporter: users[1]._id,
      category: 'water_stagnation',
      description: 'Severe water logging and stagnant rain water accumulated across 200m stretch. Mosquito breeding risk and two-wheelers skidding.',
      imageUrl: '',
      location: { type: 'Point', coordinates: [80.2210, 13.0380] },
      address: 'Arcot Road near Power House junction, Kodambakkam, Chennai',
      status: 'reported',
      affectedCount: 35,
      department: departments[0]._id,
      timeline: [
        { status: 'reported', at: new Date('2026-10-01T08:00:00Z'), by: 'Ananya Raghavan', note: 'Reported heavy stagnant road water' },
      ],
    });

    // 4. Create Confirmations
    await Confirmation.create([
      { issue: issue1._id, user: users[0]._id },
      { issue: issue1._id, user: users[1]._id },
      { issue: issue2._id, user: users[1]._id },
      { issue: issue3._id, user: users[0]._id },
    ]);

    // 5. Create Initial Notifications
    await Notification.create([
      {
        user: users[0]._id,
        issue: issue1._id,
        type: 'type_status_update',
        params: { issueId: 'NMF-2026-00427', status: 'In Progress' },
        read: false,
      },
      {
        user: users[0]._id,
        issue: issue3._id,
        type: 'type_resolved',
        params: { issueId: 'NMF-2026-00398' },
        read: false,
      },
      {
        user: users[1]._id,
        issue: issue2._id,
        type: 'type_assigned',
        params: { issueId: 'NMF-2026-00412', department: 'Sanitation' },
        read: true,
      },
    ]);

    console.log('✨ Seed database completed successfully!');
  } catch (err) {
    console.warn('⚠️ Seeding error:', err.message);
  }
}
