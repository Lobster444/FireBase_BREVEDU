# Manual Testing Guide for Tavus Integration

This guide provides step-by-step instructions for manually testing the Tavus AI practice integration to ensure all functionality works correctly in a real environment.

## Prerequisites

Before starting manual testing, ensure:

1. **Tavus Settings Configured**
   - Valid `replica_id` in Firebase settings
   - Valid `persona_id` in Firebase settings  
   - Valid `api_key` in Firebase settings

2. **Test Course Setup**
   - At least one course with `conversationalContext` field populated
   - Course should be published and accessible to test user

3. **Test User Account**
   - Free user account for testing session limits
   - Premium user account for testing unlimited access (optional)

## Test Scenarios

### 1. Basic AI Practice Flow

**Objective**: Verify the complete flow from button click to conversation creation.

**Steps**:
1. Navigate to a course with AI practice enabled
2. Click "Practice with AI" button
3. Verify confirmation modal appears with:
   - Course title and information
   - Session availability (e.g., "1 practice session available today")
   - 2-minute duration notice
   - Practice tips
4. Click "Start Practice Session"
5. Verify loading state shows "Creating Session..."
6. Verify Tavus modal opens with conversation iframe
7. Verify 2-minute countdown timer appears
8. Interact with AI conversation
9. Verify session completes or times out after 2 minutes

**Expected Results**:
- ✅ Confirmation modal shows correct information
- ✅ API calls succeed (check Network tab)
- ✅ Tavus conversation loads in iframe
- ✅ Timer counts down from 2:00 to 0:00
- ✅ Session ends automatically after 2 minutes

### 2. Session Timeout Handling

**Objective**: Verify 2-minute timeout works correctly.

**Steps**:
1. Start an AI practice session
2. Wait for 1:30 (30 seconds remaining)
3. Verify warning notification appears
4. Wait for 1:50 (10 seconds remaining)  
5. Verify final warning appears
6. Wait for full 2:00 timeout
7. Verify conversation ends automatically
8. Verify session marked as "expired" in Firestore

**Expected Results**:
- ✅ Warning at 30 seconds: "⏰ 30 seconds remaining in your AI practice session"
- ✅ Warning at 10 seconds: "⏰ 10 seconds remaining - conversation will end soon"
- ✅ Auto-end at 0 seconds with API call to end conversation
- ✅ Session status updated to "expired" in database
- ✅ Modal shows timeout message and closes

### 3. Error Handling

**Objective**: Test various error scenarios and recovery.

#### 3.1 Configuration Errors

**Steps**:
1. Remove `replica_id` from Tavus settings in Firebase
2. Try to start AI practice session
3. Verify appropriate error message

**Expected Results**:
- ✅ Error: "AI practice is not configured. Please contact support."
- ✅ No retry option shown
- ✅ Session not created in database

#### 3.2 Network Errors

**Steps**:
1. Disconnect internet connection
2. Try to start AI practice session
3. Verify offline handling
4. Reconnect internet
5. Verify queued operation processes

**Expected Results**:
- ✅ Error: "Network connection issue. Please check your internet and try again."
- ✅ Operation queued for retry
- ✅ Success notification when connection restored
- ✅ Queued operation processes automatically

#### 3.3 API Errors

**Steps**:
1. Use invalid API key in Tavus settings
2. Try to start AI practice session
3. Verify error handling

**Expected Results**:
- ✅ Error: "AI service authentication issue. Please contact support."
- ✅ No retry option for auth errors
- ✅ Clear guidance for user

### 4. Session Limits

**Objective**: Verify daily session limits work correctly.

#### 4.1 Free User Limits

**Steps**:
1. Use free user account
2. Complete 1 AI practice session
3. Try to start another session same day
4. Verify limit enforcement

**Expected Results**:
- ✅ First session: "1 practice session available today"
- ✅ After completion: "Daily limit reached. Upgrade for more!"
- ✅ Practice button disabled with appropriate message

#### 4.2 Premium User Limits

**Steps**:
1. Use premium user account  
2. Complete 3 AI practice sessions
3. Try to start 4th session same day
4. Verify limit enforcement

**Expected Results**:
- ✅ Sessions 1-3: "X practice sessions remaining today"
- ✅ After 3rd: "Daily limit reached. More sessions tomorrow!"
- ✅ Practice button disabled

### 5. Offline Support

**Objective**: Test offline queue functionality.

**Steps**:
1. Start AI practice session while online
2. Disconnect internet during session
3. Complete conversation
4. Verify completion queued
5. Reconnect internet
6. Verify completion processes

**Expected Results**:
- ✅ Offline notification: "📡 Completion saved offline. Will sync when connection is restored."
- ✅ Operation added to localStorage queue
- ✅ Success notification when online: "✅ All queued operations processed successfully"
- ✅ Completion status updated in database

### 6. Admin Configuration

**Objective**: Test admin settings management.

**Steps**:
1. Navigate to `/admin/courses`
2. Click "AI Settings" button
3. Verify settings modal opens
4. Update Tavus settings:
   - `replica_id`: test-replica-123
   - `persona_id`: test-persona-456  
   - `api_key`: test-key-789
5. Save settings
6. Verify settings saved in Firebase
7. Test AI practice with new settings

**Expected Results**:
- ✅ Settings modal loads current values
- ✅ Validation prevents saving empty fields
- ✅ Success notification: "✅ Tavus settings saved successfully!"
- ✅ Settings persist in Firebase `settings/tavus` document
- ✅ New settings used in subsequent API calls

### 7. Course Configuration

**Objective**: Test per-course AI context setup.

**Steps**:
1. Navigate to admin courses
2. Edit existing course or create new one
3. Add conversational context:
   ```
   You are a JavaScript tutor. Help students practice variables, functions, and basic concepts. Ask questions to test their understanding and provide helpful explanations.
   ```
4. Save course
5. Test AI practice with this course
6. Verify AI behaves according to context

**Expected Results**:
- ✅ Context field accepts up to 1000 characters
- ✅ Character counter shows remaining characters
- ✅ Context saved in course document
- ✅ AI conversation uses provided context
- ✅ AI behavior matches specified instructions

### 8. User Experience Validation

**Objective**: Ensure smooth user experience across scenarios.

#### 8.1 Loading States

**Steps**:
1. Start AI practice session
2. Observe all loading states
3. Verify appropriate messaging

**Expected Results**:
- ✅ Confirmation modal: Clear session info
- ✅ Creating session: "Creating AI practice session..."
- ✅ Loading conversation: "Connecting to AI..."
- ✅ Ready state: Timer visible, conversation loaded

#### 8.2 Success States

**Steps**:
1. Complete full AI practice session
2. Verify completion handling
3. Check course completion status

**Expected Results**:
- ✅ Completion notification: "🎉 You completed the AI practice session with X% accuracy — course complete!"
- ✅ Course marked as completed
- ✅ "Practice Again" button available
- ✅ Completion badge visible on course card

#### 8.3 Accessibility

**Steps**:
1. Navigate using keyboard only
2. Test with screen reader
3. Verify ARIA labels and roles

**Expected Results**:
- ✅ All buttons keyboard accessible
- ✅ Modal focus management works
- ✅ Screen reader announces state changes
- ✅ Proper ARIA labels on interactive elements

## Performance Testing

### 1. API Response Times

**Objective**: Verify acceptable response times.

**Steps**:
1. Open browser DevTools Network tab
2. Start AI practice session
3. Monitor API call timings

**Expected Results**:
- ✅ Session creation: < 2 seconds
- ✅ Conversation creation: < 5 seconds
- ✅ Conversation end: < 3 seconds

### 2. Memory Usage

**Objective**: Ensure no memory leaks.

**Steps**:
1. Open browser DevTools Memory tab
2. Start and complete multiple AI sessions
3. Monitor memory usage

**Expected Results**:
- ✅ Memory usage returns to baseline after sessions
- ✅ No significant memory leaks detected
- ✅ Iframe properly cleaned up

## Security Testing

### 1. API Key Protection

**Objective**: Verify API keys not exposed.

**Steps**:
1. Open browser DevTools
2. Start AI practice session
3. Check Network requests and Console

**Expected Results**:
- ✅ API key not visible in client-side code
- ✅ API key not logged to console
- ✅ API key only used in server-side calls

### 2. Input Validation

**Objective**: Test input sanitization.

**Steps**:
1. Try to inject malicious content in course context
2. Test with special characters in user data
3. Verify proper escaping

**Expected Results**:
- ✅ HTML/JS injection prevented
- ✅ Special characters handled correctly
- ✅ Input length limits enforced

## Troubleshooting Guide

### Common Issues

1. **"AI practice is not configured"**
   - Check Tavus settings in Firebase
   - Verify all required fields present
   - Confirm API key is valid

2. **"Network connection issue"**
   - Check internet connection
   - Verify Tavus API endpoints accessible
   - Check for firewall/proxy issues

3. **Timer not working**
   - Check browser console for errors
   - Verify JavaScript not blocked
   - Test in different browser

4. **Conversation not loading**
   - Check iframe permissions
   - Verify Tavus URL format
   - Check browser security settings

### Debug Information

To gather debug information:

1. Open browser DevTools Console
2. Look for Tavus-related log messages
3. Check Network tab for failed requests
4. Verify Firebase data in Firestore

### Support Escalation

If issues persist:

1. Gather browser console logs
2. Note exact error messages
3. Document reproduction steps
4. Check Tavus service status
5. Contact technical support with details

## Test Completion Checklist

- [ ] Basic AI practice flow works end-to-end
- [ ] 2-minute timeout enforces correctly
- [ ] Error handling works for all scenarios
- [ ] Session limits enforced properly
- [ ] Offline support functions correctly
- [ ] Admin configuration saves and applies
- [ ] Course context affects AI behavior
- [ ] User experience is smooth and intuitive
- [ ] Performance meets requirements
- [ ] Security measures are effective
- [ ] All edge cases handled gracefully

## Reporting Results

Document test results with:

1. **Test Environment**
   - Browser version
   - Operating system
   - Network conditions

2. **Test Results**
   - Pass/fail for each scenario
   - Screenshots of issues
   - Error messages encountered

3. **Performance Metrics**
   - API response times
   - Memory usage patterns
   - User interaction delays

4. **Recommendations**
   - Issues requiring fixes
   - Suggested improvements
   - Additional testing needed