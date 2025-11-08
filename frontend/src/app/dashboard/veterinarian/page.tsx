'use client';

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

export default function VeterinarianDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Veterinarian Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <p className="text-gray-600"><strong>License Number:</strong> VET-2024-001</p>
            <p className="text-gray-600"><strong>Experience:</strong> 8 years</p>
            <p className="text-gray-600"><strong>Upcoming Appointments:</strong> 5</p>
            <p className="text-gray-600"><strong>Total Patients:</strong> 150</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Specializations</h2>
            <p className="text-gray-600">Small Animal Medicine, Surgery, Emergency Care</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Professional Info</h2>
            <p className="text-gray-600"><strong>Qualifications:</strong> DVM, Board Certified in Small Animal Practice</p>
            <p className="text-gray-600"><strong>Affiliation:</strong> City Animal Hospital</p>
            <p className="text-gray-600"><strong>Online Consultation:</strong> Available</p>
            <p className="text-gray-600"><strong>Home Visits:</strong> Available</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Availability Schedule</h2>
            <p className="text-gray-600">Monday-Friday: 09:00 - 17:00</p>
            <p className="text-gray-600">Saturday: 10:00 - 15:00</p>
            <p className="text-gray-600">Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}