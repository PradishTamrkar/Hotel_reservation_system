import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card } from '@common/Card';
import { Button } from '@common/Button';
import validationUtils from '@services/utils/validation.js';

export default function BookingConfirmDialog({ 
  show, 
  formData, 
  bookingData, 
  loading, 
  onConfirm, 
  onCancel 
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6">
        <h3 className="text-2xl font-bold mb-4">Confirm Your Booking</h3>
        
        <div className="space-y-2 mb-6 text-sm">
          <p>
            <strong>Guest:</strong> {formData.first_name} {formData.last_name}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Check-in:</strong> {validationUtils.formatDate(bookingData.check_in_date)}
          </p>
          <p>
            <strong>Check-out:</strong> {validationUtils.formatDate(bookingData.check_out_date)}
          </p>
          <p>
            <strong>Total:</strong> {validationUtils.formatCurrency(bookingData.total_amount)}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={loading}
            icon={CheckCircle}
            className="flex-1"
          >
            Confirm
          </Button>
        </div>
      </Card>
    </div>
  );
}