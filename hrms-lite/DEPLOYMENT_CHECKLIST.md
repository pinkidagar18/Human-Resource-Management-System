# HRMS Lite - Deployment Checklist

Use this checklist to ensure successful deployment of the HRMS Lite application.

## Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code committed to Git repository
- [ ] Repository pushed to GitHub
- [ ] README.md has accurate information
- [ ] .env files are in .gitignore
- [ ] No sensitive data in code

### 2. Database Setup
- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created with password
- [ ] IP whitelist configured (0.0.0.0/0 for testing)
- [ ] Connection string copied and saved

### 3. Local Testing
- [ ] Backend runs successfully locally
- [ ] Frontend runs successfully locally
- [ ] Can create employees
- [ ] Can mark attendance
- [ ] Can delete employees
- [ ] Dashboard shows correct data
- [ ] All filters work
- [ ] No console errors

## Backend Deployment Checklist

### Setup (Render/Railway)
- [ ] Account created on deployment platform
- [ ] Repository connected
- [ ] Build command set: `npm install`
- [ ] Start command set: `npm start`
- [ ] Environment variables added:
  - [ ] MONGODB_URI
  - [ ] NODE_ENV (set to 'production')
  - [ ] PORT (if required)

### Verification
- [ ] Build completed successfully
- [ ] Deployment successful
- [ ] Backend URL noted down
- [ ] Health endpoint accessible: `https://your-backend.com/api/health`
- [ ] Returns correct JSON response
- [ ] No errors in deployment logs

### Testing
- [ ] GET /api/employees returns empty array
- [ ] POST /api/employees creates employee successfully
- [ ] GET /api/dashboard/stats returns data
- [ ] All endpoints respond correctly

## Frontend Deployment Checklist

### Setup (Vercel/Netlify)
- [ ] Account created on deployment platform
- [ ] Repository connected
- [ ] Framework preset: Vite
- [ ] Root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable added:
  - [ ] VITE_API_URL (backend URL + /api)

### Verification
- [ ] Build completed successfully
- [ ] Deployment successful
- [ ] Frontend URL noted down
- [ ] Application loads without errors
- [ ] No console errors in browser
- [ ] No CORS errors

### Testing
- [ ] Dashboard page loads
- [ ] Navigation works
- [ ] Can navigate to Employees page
- [ ] Can navigate to Attendance page
- [ ] UI looks correct (styling applied)
- [ ] Responsive on mobile

## Integration Testing

### Employee Management
- [ ] Can add new employee
  - [ ] Employee ID field works
  - [ ] Full name field works
  - [ ] Email field validates format
  - [ ] Department field works
  - [ ] Form submits successfully
  - [ ] Employee appears in list
- [ ] Can view employees
  - [ ] All employees display
  - [ ] Cards show correct information
  - [ ] Empty state shows when no employees
- [ ] Can delete employee
  - [ ] Confirmation dialog appears
  - [ ] Employee removed from list
  - [ ] Associated attendance deleted

### Attendance Management
- [ ] Can mark attendance
  - [ ] Employee dropdown populated
  - [ ] Date picker works
  - [ ] Status radio buttons work
  - [ ] Form submits successfully
  - [ ] Record appears in table
- [ ] Can view attendance
  - [ ] All records display in table
  - [ ] Empty state shows when no records
- [ ] Filters work
  - [ ] Date filter filters correctly
  - [ ] Employee filter filters correctly
  - [ ] Clear filters works
  - [ ] Combined filters work

### Dashboard
- [ ] Statistics display correctly
  - [ ] Total employees count is accurate
  - [ ] Today's attendance counts are accurate
  - [ ] Department distribution is correct
- [ ] Dashboard updates after data changes

## CORS & Security

- [ ] Frontend can communicate with backend
- [ ] No CORS errors in browser console
- [ ] API accepts requests from frontend domain
- [ ] Environment variables are secure (not in code)

## Performance Testing

- [ ] Application loads quickly
- [ ] No significant lag when adding data
- [ ] Tables render smoothly with data
- [ ] Filters respond quickly
- [ ] No memory leaks observed

## Documentation Checklist

- [ ] README.md updated with:
  - [ ] Live frontend URL
  - [ ] Live backend API URL
  - [ ] GitHub repository URL
  - [ ] Screenshots (if available)
- [ ] All documentation files present:
  - [ ] README.md
  - [ ] QUICKSTART.md
  - [ ] DEPLOYMENT.md
  - [ ] API.md
  - [ ] PROJECT_SUMMARY.md

## Final Verification

### URLs Working
- [ ] Frontend URL: ___________________
- [ ] Backend URL: ___________________
- [ ] Health check: ___________________/api/health
- [ ] GitHub repo: ___________________

### Complete User Flow Test
1. [ ] Open frontend URL
2. [ ] Navigate to Dashboard - loads successfully
3. [ ] Navigate to Employees - loads successfully
4. [ ] Click "Add Employee"
5. [ ] Fill form with test data:
   - Employee ID: TEST001
   - Name: Test Employee
   - Email: test@company.com
   - Department: Testing
6. [ ] Submit form - employee created
7. [ ] Employee appears in list
8. [ ] Navigate to Attendance
9. [ ] Click "Mark Attendance"
10. [ ] Select test employee
11. [ ] Choose today's date
12. [ ] Select "Present"
13. [ ] Submit form - attendance marked
14. [ ] Attendance appears in table
15. [ ] Navigate to Dashboard
16. [ ] Statistics show: 1 employee, 1 present today
17. [ ] Test filters on Attendance page
18. [ ] Test delete employee
19. [ ] Verify all features work

### Mobile Responsiveness
- [ ] Open on mobile device or use browser DevTools
- [ ] Test on phone size (375px)
- [ ] Test on tablet size (768px)
- [ ] Navigation works
- [ ] Forms are usable
- [ ] Tables display correctly
- [ ] All features accessible

## Error Handling Test

- [ ] Try to create employee with duplicate ID - shows error
- [ ] Try to create employee with invalid email - shows error
- [ ] Try to submit empty form - shows validation
- [ ] Test with network disconnected - shows error message
- [ ] Backend error displays user-friendly message

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

## Submission Checklist

- [ ] All code in GitHub repository
- [ ] README.md has all required information
- [ ] Live application URLs are working
- [ ] Both frontend and backend are deployed
- [ ] Application works without errors
- [ ] Documentation is complete
- [ ] Screenshots added (optional but recommended)

## Post-Deployment

- [ ] Test the application one final time
- [ ] Verify all URLs are accessible
- [ ] Check that README has correct URLs
- [ ] Take screenshots for documentation
- [ ] Prepare submission:
  - Live Frontend URL: ___________________
  - Live Backend URL: ___________________
  - GitHub Repository: ___________________

## Known Issues to Watch For

### Backend Issues
- [ ] Render free tier: First request after inactivity takes 30-60 seconds
- [ ] MongoDB Atlas: Check connection limits
- [ ] Environment variables: Double-check they're set correctly

### Frontend Issues
- [ ] CORS errors: Verify VITE_API_URL is correct
- [ ] API not reachable: Check backend is running
- [ ] Styling not applied: Check build completed successfully

### Common Fixes
- If backend slow: Expect 30-60s on first request (Render free tier)
- If CORS error: Verify environment variable set and redeploy
- If 404 on refresh: Check vercel.json is deployed
- If MongoDB error: Check IP whitelist and connection string

## Emergency Rollback Plan

If deployment fails:
1. [ ] Check deployment logs for errors
2. [ ] Verify environment variables
3. [ ] Test locally to ensure code works
4. [ ] Check database connection
5. [ ] Review recent commits
6. [ ] Redeploy from last working commit if needed

## Success Criteria

The deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Backend API responds to requests
- ✅ Can create, view, and delete employees
- ✅ Can mark and view attendance
- ✅ Dashboard shows accurate statistics
- ✅ All filters work correctly
- ✅ No console errors
- ✅ Responsive on mobile
- ✅ All documentation is accurate

---

## Final Sign-Off

- [ ] All checklist items completed
- [ ] Application fully tested
- [ ] Documentation accurate
- [ ] URLs verified and working
- [ ] Ready for submission

**Deployment Date**: ___________________

**Deployed URLs**:
- Frontend: ___________________
- Backend: ___________________
- GitHub: ___________________

**Status**: [ ] Ready for Submission

---

*Use this checklist to ensure nothing is missed during deployment. Check off each item as you complete it.*
