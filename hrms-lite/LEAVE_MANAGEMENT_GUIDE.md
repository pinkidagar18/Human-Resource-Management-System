# Leave Management System - Complete Guide

## 🎉 New Feature: Leave Management

A complete leave management system has been added to HRMS Lite with the following capabilities:

---

## ✨ Features

### 1. **Apply for Leave**
- Employees can apply for leaves with start and end dates
- Multiple leave types supported
- Automatic calculation of total days
- Reason/justification required
- Prevents overlapping leave requests

### 2. **Leave Status Tracking**
Three status levels:
- **Pending** - Awaiting admin review
- **Approved** - Leave has been approved
- **Rejected** - Leave has been denied

### 3. **Admin Approval Panel**
- Review all leave requests
- Approve or reject leaves
- Add admin comments
- Track who reviewed and when

### 4. **Leave Types**
- Sick Leave
- Casual Leave
- Annual Leave
- Maternity Leave
- Paternity Leave
- Emergency Leave

### 5. **Statistics Dashboard**
- Total leaves count
- Pending requests count
- Approved requests count
- Rejected requests count
- Monthly statistics

---

## 🚀 How to Use

### For Employees: Applying for Leave

1. **Navigate to Leaves Page**
   - Click "Leaves" in the navigation bar

2. **Apply for Leave**
   - Click "Apply Leave" button
   - Fill in the form:
     - Select your Employee ID
     - Choose Leave Type
     - Select Start Date
     - Select End Date
     - Enter Reason
   - System automatically calculates total days
   - Click "Apply Leave"

3. **View Your Leave Requests**
   - All your requests appear on the Leaves page
   - Color-coded by status:
     - 🟡 Yellow = Pending
     - 🟢 Green = Approved
     - 🔴 Red = Rejected

4. **Cancel Pending Requests**
   - Click the ❌ button on pending leaves
   - Confirm cancellation
   - Only pending requests can be cancelled

### For Admins: Managing Leave Requests

1. **View All Leave Requests**
   - All leave requests from all employees are displayed
   - Filter by status: All, Pending, Approved, Rejected

2. **Review Leave Request**
   - Click the ✓ button on any pending leave
   - Review modal opens showing:
     - Employee details
     - Leave duration
     - Leave type
     - Reason

3. **Approve or Reject**
   - Add admin comments (optional)
   - Enter your name as reviewer
   - Click "Approve" or "Reject"

4. **View Statistics**
   - Dashboard shows overview of all leaves
   - See pending requests that need attention
   - Track approved/rejected counts

---

## 📊 Leave Request Card Information

Each leave card displays:
- **Employee Name** and Department
- **Status Badge** (Pending/Approved/Rejected)
- **Leave Duration** with dates and total days
- **Leave Type** (Sick, Casual, etc.)
- **Reason** for leave
- **Admin Comments** (if any)
- **Applied Date** and **Reviewed Date**
- **Action Buttons** (for pending requests)

---

## 🎨 UI Features

### Status Color Coding:
- **Pending**: Yellow/Orange gradient
- **Approved**: Green/Emerald gradient
- **Rejected**: Red/Pink gradient

### Statistics Cards:
- Animated hover effects
- Gradient backgrounds
- Icon-based visualization
- Real-time counts

### Filter System:
- Quick filter buttons
- Filter by: All, Pending, Approved, Rejected
- Active filter highlighted

---

## 🔒 Business Rules

### Validation Rules:

1. **Date Validation**:
   - End date cannot be before start date
   - Dates must be in valid format

2. **Overlap Prevention**:
   - Cannot apply for leave if you already have a pending/approved leave for overlapping dates
   - System automatically checks and prevents conflicts

3. **Cancellation Rules**:
   - Only **Pending** requests can be cancelled
   - Approved/Rejected requests cannot be cancelled

4. **Status Update Rules**:
   - Only **Pending** requests can be approved/rejected
   - Once approved/rejected, status cannot be changed

### Automatic Calculations:

- **Total Days**: Automatically calculated (includes both start and end date)
- **Applied Date**: Automatically set to current date/time
- **Reviewed Date**: Set when admin approves/rejects

---

## 📡 API Endpoints

### Get All Leaves
```http
GET /api/leaves
GET /api/leaves?status=Pending
GET /api/leaves?employeeId=EMP001
```

### Get Employee Leaves
```http
GET /api/leaves/employee/:employeeId
```

### Apply for Leave
```http
POST /api/leaves
Content-Type: application/json

{
  "employeeId": "EMP001",
  "leaveType": "Casual Leave",
  "startDate": "2024-02-15",
  "endDate": "2024-02-17",
  "reason": "Family function"
}
```

### Approve/Reject Leave
```http
PUT /api/leaves/:id/status
Content-Type: application/json

{
  "status": "Approved",
  "adminComments": "Approved for family event",
  "reviewedBy": "HR Manager"
}
```

### Cancel Leave
```http
DELETE /api/leaves/:id
```

### Get Statistics
```http
GET /api/leaves/stats/summary
```

---

## 💾 Database Schema

### Leave Model:
```javascript
{
  employeeId: String (required, ref: Employee),
  employeeName: String (required),
  department: String (required),
  leaveType: String (enum: sick, casual, annual, etc.),
  startDate: Date (required),
  endDate: Date (required),
  reason: String (required),
  status: String (enum: Pending, Approved, Rejected),
  totalDays: Number (auto-calculated),
  appliedDate: Date (auto-set),
  reviewedBy: String (optional),
  reviewedDate: Date (optional),
  adminComments: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Use Cases

### Use Case 1: Employee Applies for Sick Leave
1. Employee selects their ID
2. Chooses "Sick Leave" type
3. Selects 3 days (Feb 15-17)
4. Enters reason: "Medical appointment"
5. System calculates: 3 days
6. Status: Pending
7. Admin receives notification

### Use Case 2: Admin Approves Leave
1. Admin sees pending request in list
2. Clicks review button
3. Reviews: 3 days sick leave
4. Adds comment: "Get well soon"
5. Clicks "Approve"
6. Status changes to: Approved
7. Employee can see approved status

### Use Case 3: Overlapping Leave Prevention
1. Employee has approved leave Feb 15-17
2. Tries to apply for Feb 16-18
3. System detects overlap
4. Shows error: "You already have a leave request for this period"
5. Application rejected

---

## 📱 Mobile Responsive

All leave management features work on mobile:
- ✅ Touch-friendly buttons
- ✅ Responsive cards
- ✅ Mobile-optimized forms
- ✅ Easy-to-read leave details

---

## 🔍 Filtering & Search

### Available Filters:
- **All**: Show all leave requests
- **Pending**: Show only pending requests
- **Approved**: Show only approved leaves
- **Rejected**: Show only rejected leaves

---

## 📈 Reports & Analytics

### Statistics Provided:
1. **Overall Statistics**:
   - Total leaves
   - Pending count
   - Approved count
   - Rejected count

2. **Monthly Statistics**:
   - This month's total
   - This month's pending
   - This month's approved
   - This month's rejected

3. **Leave Type Breakdown**:
   - Count by leave type
   - Total days by type

---

## 🚦 Status Workflow

```
Employee Applies
       ↓
   PENDING (Yellow)
       ↓
Admin Reviews → APPROVED (Green) or REJECTED (Red)
       ↓
    FINAL
```

---

## 💡 Best Practices

### For Employees:
1. Apply for leave well in advance
2. Provide clear, honest reasons
3. Check for conflicts before applying
4. Contact admin if urgent

### For Admins:
1. Review requests promptly
2. Provide constructive feedback in comments
3. Be consistent with approval criteria
4. Document decision reasons

---

## 🐛 Troubleshooting

### "You already have a leave request for this period"
- **Cause**: Overlapping dates with existing leave
- **Solution**: Check your existing leaves, cancel conflicting one, or choose different dates

### "End date cannot be before start date"
- **Cause**: Invalid date range
- **Solution**: Make sure end date is same or after start date

### "Cannot cancel approved/rejected leave"
- **Cause**: Only pending leaves can be cancelled
- **Solution**: Contact admin to modify approved/rejected leaves

### Leave not appearing
- **Cause**: Filter may be active
- **Solution**: Click "All" filter to see all leaves

---

## 🎓 Tips & Tricks

1. **Quick Approval**: Click directly on review button for fast processing
2. **Filter Pending**: Use "Pending" filter to see only requests needing action
3. **Add Comments**: Always add admin comments for rejected requests
4. **Check Statistics**: Review stats before approving multiple leaves
5. **Plan Ahead**: Check existing approved leaves before applying

---

## 🔜 Future Enhancements (Potential)

Ideas for future versions:
- Email notifications on status change
- Leave balance tracking
- Annual leave quota management
- Holiday calendar integration
- Bulk approval for admins
- Leave carry-forward rules
- Half-day leave support
- Export leave reports to PDF/Excel
- Employee leave history
- Department-wise leave analytics

---

## ✅ Testing Checklist

Test these scenarios:

- [ ] Apply for leave with valid dates
- [ ] Try to apply with end date before start date
- [ ] Try to apply overlapping leave
- [ ] Approve a pending leave
- [ ] Reject a pending leave
- [ ] Cancel a pending leave
- [ ] Try to cancel approved leave
- [ ] Filter by status
- [ ] View statistics
- [ ] Test on mobile device

---

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review API documentation
3. Check browser console for errors
4. Verify backend is running

---

**Enjoy the new Leave Management System!** 🎉

Your HRMS is now more complete with leave tracking and approval workflows.
