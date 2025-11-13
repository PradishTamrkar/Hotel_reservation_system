import React from 'react';
import { Input } from '@common/Input';
import { Card } from '@common/Card';
import { Button } from '@common/Button';

export default function GuestInformationForm({ formData, onChange, onSubmit, loading }) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Guest Information</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={onChange}
            required
          />
          <Input
            label="Middle Name"
            name="middle_name"
            value={formData.middle_name}
            onChange={onChange}
          />
          <Input
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={onChange}
            required
          />
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            required
          />
          <Input
            label="Phone Number"
            name="phone_no"
            value={formData.phone_no}
            onChange={onChange}
            required
          />
        </div>

        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={onChange}
              className="input-field"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <Input
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={onChange}
            required
          />
          <Input
            label="Citizenship ID"
            name="citizenship_id"
            value={formData.citizenship_id}
            onChange={onChange}
            required
          />
        </div>

        {/* Address */}
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={onChange}
          required
        />

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Confirm Booking
        </Button>
      </form>
    </Card>
  );
}